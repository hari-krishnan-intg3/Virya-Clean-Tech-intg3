import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadConfig, missingEnv } from './_lib/config';
import { createLeadIssue, ensureLeadsProject, type LeadInput } from './_lib/leads';
import { appendRows, readTab, writeTab } from './_lib/sheets';
import { ensureTab } from './_lib/tabs';

/**
 * Lead intake.
 *
 * POST /api/leads
 *   { "fullName":"…", "email":"…", "phone":"…", "company":"…",
 *     "service":"solar", "location":"…", "details":"…" }
 *
 * Creates a Task in the dedicated Jira leads project carrying who and when,
 * and appends the same row to the Leads sheet tab so the KPI counters have a
 * real source.
 *
 * Auth accepts CRON_SECRET (server-side) or LEADS_INGEST_KEY (sent by the
 * browser form as the `x-leads-key` header).
 */

function authorized(req: VercelRequest, cronSecret: string): boolean {
  const header = req.headers.authorization;
  if (typeof header === 'string' && header.replace(/^Bearer\s+/i, '').trim() === cronSecret) {
    return true;
  }
  const browserKey = process.env.LEADS_INGEST_KEY;
  if (browserKey && req.headers['x-leads-key'] === browserKey) return true;
  return false;
}

const LEAD_HEADERS = [
  'Created',
  'Name',
  'Email',
  'Phone',
  'Company',
  'Service',
  'Location',
  'Details',
  'Jira Key',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missing = missingEnv();
  if (missing.length > 0) {
    return res.status(500).json({ error: 'Server is not fully configured', missing });
  }

  const config = loadConfig();
  if (!authorized(req, config.cronSecret)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = (req.body ?? {}) as Partial<LeadInput>;
  const fullName = String(body.fullName ?? '').trim();
  const email = String(body.email ?? '').trim();

  if (!fullName || !email) {
    return res.status(400).json({ error: 'fullName and email are required' });
  }

  const lead: LeadInput = {
    fullName,
    email,
    phone: body.phone?.trim() || undefined,
    company: body.company?.trim() || undefined,
    service: body.service,
    location: body.location?.trim() || undefined,
    details: body.details?.trim() || undefined,
    source: body.source ?? 'website',
  };

  const timestamp = new Date().toISOString();

  let jira: { key: string; url: string; summary: string } | null = null;
  let leadsProjectReady = false;
  let sheetWritten = false;
  const errors: string[] = [];

  // 1) Jira — file the lead as a Task
  if (config.jira.leadsProjectKey) {
    try {
      const ensured = await ensureLeadsProject(
        config.jira,
        config.jira.leadsProjectKey,
        'Virya Leads',
      );

      if (ensured.exists) {
        leadsProjectReady = true;
        jira = await createLeadIssue(config.jira, config.jira.leadsProjectKey!, lead);
      } else {
        errors.push(ensured.hint ?? 'Leads project missing');
      }
    } catch (error) {
      errors.push(`jira: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 2) Sheets — append the row so KPI counters have a source
  if (config.sheets.leadsTab && !config.dryRun) {
    try {
      const tab = config.sheets.leadsTab;

      // Create the tab on first use so no manual setup is needed.
      await ensureTab(config.sheets, config.google, tab);

      const existing = await readTab(config.sheets, config.google, tab, 'A1:A2');
      if (existing.length === 0) {
        await writeTab(config.sheets, config.google, tab, 'A1:I1', [LEAD_HEADERS]);
      }

      await appendRows(config.sheets, config.google, tab, 'A:I', [
        [
          timestamp,
          lead.fullName,
          lead.email,
          lead.phone ?? '',
          lead.company ?? '',
          lead.service ?? '',
          lead.location ?? '',
          lead.details ?? '',
          jira?.key ?? '',
        ],
      ]);

      sheetWritten = true;
    } catch (error) {
      errors.push(`sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return res.status(200).json({
    ok: true,
    receivedAt: timestamp,
    jira,
    leadsProjectReady,
    sheetWritten,
    errors: errors.length ? errors : undefined,
    note: config.jira.leadsProjectKey
      ? undefined
      : 'Set JIRA_LEADS_PROJECT_KEY to file leads into Jira.',
  });
}