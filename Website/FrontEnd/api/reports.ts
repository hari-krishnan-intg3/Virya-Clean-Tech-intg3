import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  isReportType,
  loadConfig,
  missingEnv,
  REPORT_TYPES,
  type ReportType,
} from './_lib/config';
import { getSnapshot } from './_lib/jira';
import { countLeadsInRange, logReportRun, readTab, writeTab } from './_lib/sheets';
import { KpiStore } from './_lib/kpi';
import { getPeriod } from './_lib/periods';
import { sendEmail } from './_lib/mailer';
import { buildSubject, renderReportEmail, renderReportText } from './_lib/email';

/**
 * Reports endpoint — daily / weekly / monthly.
 *
 * GET  /api/reports?type=daily|weekly|monthly[&test=true]
 * POST /api/reports   { "types": ["daily","weekly","monthly"], "test": false }
 *
 * Auth: `Authorization: Bearer <CRON_SECRET>` (Vercel Cron sends this
 * automatically when CRON_SECRET is set on the project).
 *
 * Posting all three types fires the one-time deployment test. Add
 * `"test": true` to send the emails without writing to Sheets, so the
 * counters stay clean while you check the design.
 */

interface RunResult {
  type: ReportType;
  ok: boolean;
  subject?: string;
  messageId?: string;
  leads: number;
  error?: string;
  sheetLogged: boolean;
  kpiUpdated: boolean;
}

function authorized(req: VercelRequest, secret: string): boolean {
  const header = req.headers.authorization;
  if (typeof header !== 'string') return false;
  return header.replace(/^Bearer\s+/i, '').trim() === secret;
}

function parseTypes(req: VercelRequest): ReportType[] {
  const raw =
    req.method === 'POST' ? req.body?.types ?? req.body?.type : req.query.type ?? req.query.types;

  const list = Array.isArray(raw) ? raw : [raw];
  const cleaned = list
    .filter((v): v is string => typeof v === 'string')
    .flatMap((v) => v.split(','))
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  if (cleaned.length === 0 || cleaned.includes('all')) return [...REPORT_TYPES];

  const valid = cleaned.filter(isReportType);
  if (valid.length === 0) {
    throw new Error(`Invalid type. Expected: ${REPORT_TYPES.join(', ')}, all`);
  }
  return valid;
}

async function runReport(type: ReportType, testMode: boolean): Promise<RunResult> {
  const config = loadConfig();
  const period = getPeriod(type);

  let leads = 0;
  let leadsNote = 'leads source not configured';

  try {
    const jira = await getSnapshot(config.jira, period.from, period.to);

    if (config.sheets.leadsTab) {
      // A missing or empty Leads tab must never break the whole report.
      try {
        const result = await countLeadsInRange(
          config.sheets,
          config.google,
          config.sheets.leadsTab,
          period.from,
          period.to,
        );
        leads = result.count;
        leadsNote =
          result.mode === 'dated'
            ? `${result.count} of ${result.total} rows dated in period`
            : `${result.total} rows (no date column)`;
      } catch {
        leadsNote = 'leads tab not created yet';
      }
    }

    // Read the dispatch counters BEFORE sending, so the email reflects the
    // state at the moment of send.
    const kpi = new KpiStore(
      (range) => readTab(config.sheets, config.google, config.sheets.kpiTab, range),
      (range, values) =>
        writeTab(config.sheets, config.google, config.sheets.kpiTab, range, values),
    );
    const kpiBefore = await kpi.snapshot();

    const sheetBase =
      `https://docs.google.com/spreadsheets/d/${config.sheets.spreadsheetId}/edit`;

    const payload = {
      period,
      jira,
      leads,
      leadsNote,
      siteUrl: config.siteUrl,
      projectName: 'Virya Clean Tech',
      kpi: kpiBefore,
      links: { reports: sheetBase, kpi: sheetBase },
    };

    const subject = buildSubject(period, leads, jira.createdInRange);
    const sent = await sendEmail(config.mail, {
      subject: testMode ? `[TEST] ${subject}` : subject,
      html: renderReportEmail(payload),
      text: renderReportText(payload),
    });

    let sheetLogged = false;
    let kpiUpdated = false;

    if (!config.dryRun && !testMode) {
      // Stamp the Reports tab.
      try {
        await logReportRun(config.sheets, config.google, type, 'Success');
        sheetLogged = true;
      } catch (error) {
        console.error('[reports] sheet log failed', error);
      }

      // Bump the KPI dashboard counters.
      try {
        await kpi.increment(type, true);
        kpiUpdated = true;
      } catch (error) {
        console.error('[reports] kpi update failed', error);
      }
    }

    return {
      type,
      ok: true,
      subject,
      messageId: sent.id,
      leads,
      sheetLogged,
      kpiUpdated,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!config.dryRun && !testMode) {
      try {
        await logReportRun(config.sheets, config.google, type, 'Failed', message.slice(0, 120));
      } catch (sheetError) {
        console.error('[reports] failure log failed', sheetError);
      }
    }

    return {
      type,
      ok: false,
      leads,
      error: message,
      sheetLogged: false,
      kpiUpdated: false,
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missing = missingEnv();
  if (missing.length > 0) {
    return res.status(500).json({ error: 'Server is not fully configured', missing });
  }

  const { cronSecret } = loadConfig();
  if (!authorized(req, cronSecret)) {
    return res.status(401).json({
      error: 'Unauthorized. Send Authorization: Bearer <CRON_SECRET>.',
    });
  }

  let types: ReportType[];
  try {
    types = parseTypes(req);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }

  const testMode = req.query.test === 'true' || req.body?.test === true;

  const results: RunResult[] = [];
  for (const type of types) {
    results.push(await runReport(type, testMode));
  }

  const failed = results.filter((r) => !r.ok);

  return res.status(failed.length === results.length ? 500 : 200).json({
    ranAt: new Date().toISOString(),
    mode: testMode ? 'test (no sheet writes)' : 'live',
    requested: types,
    sent: results.filter((r) => r.ok).length,
    failed: failed.length,
    results,
  });
}