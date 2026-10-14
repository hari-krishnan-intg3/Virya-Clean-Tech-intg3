import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadLeadIntakeConfig } from './_lib/config';
import { buildRequestContext } from './_lib/context';
import {
  createLeadIssue,
  ensureLeadsProject,
  resolveAssignee,
  type LeadInput,
} from './_lib/leads';
import { appendRows, readTab, writeTab } from './_lib/sheets';
import { ensureTab } from './_lib/tabs';

/**
 * Lead intake.
 *
 * POST /api/leads
 *   { "fullName":"…", "email":"…", "phone":"…", "company":"…",
 *     "service":"solar", "consumption":"450000", "capacity":"12000 sq ft",
 *     "location":"…", "details":"…", "context": { …session snapshot… } }
 *
 * Writes to three places, each idempotent and each allowed to fail without
 * losing the others:
 *
 *   1. **Jira** — a Task in the VCT project, assigned, with the next
 *      actions as subtasks and the session context in the description.
 *   2. **Sheets / Leads** — one row per enquiry, for the KPI counters.
 *   3. **Sheets / Sessions** — the visit itself, upserted by `/api/session`.
 *
 * The intent is that a lead is never lost because one integration is down,
 * and the response always says which parts succeeded.
 */

function sameOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin !== 'string' || typeof host !== 'string') return false;

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

const LEAD_HEADERS = [
  'Created',
  'Name',
  'Email',
  'Phone',
  'Company',
  'Service',
  'Consumption',
  'Capacity',
  'Location',
  'Details',
  'Jira Key',
  'Intent Score',
  'Source',
  'Session ID',
  'Landing Page',
  'Referrer',
  'Device',
  'Timezone',
  'IP',
  'City',
  'Assistant Messages',
];

/** Mirrors the client-side score so both systems agree on lead quality. */
function intentScore(lead: LeadInput): number {
  const context = (lead.context ?? {}) as Record<string, unknown>;

  let score = 45; // a submitted, consented form
  score += Math.min(20, Number(context.chatbotMessages ?? 0) * 4);
  score += Math.round(Math.min(Number(context.maxScrollDepth ?? 0), 100) / 10);
  score += Math.min(15, Math.round(Number(context.activeSeconds ?? 0) / 30));
  if (lead.phone) score += 5;
  if (lead.company) score += 5;
  if (lead.consumption) score += 5;

  return Math.min(100, score);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missing = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN'].filter(
    (key) => !process.env[key],
  );
  if (missing.length > 0) {
    return res.status(500).json({ error: 'Jira lead intake is not configured', missing });
  }

  if (!sameOrigin(req)) {
    return res.status(403).json({ error: 'Requests must come from this site' });
  }

  const config = loadLeadIntakeConfig();

  const body = (req.body ?? {}) as Partial<LeadInput> & {
    context?: Record<string, unknown>;
  };

  const fullName = String(body.fullName ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();

  if (!fullName || !email) {
    return res.status(400).json({ error: 'fullName and email are required' });
  }

  const lead: LeadInput = {
    fullName,
    email,
    phone: body.phone?.trim() || undefined,
    company: body.company?.trim() || undefined,
    service: body.service,
    consumption: body.consumption?.trim() || undefined,
    capacity: body.capacity?.trim() || undefined,
    location: body.location?.trim() || undefined,
    details: body.details?.trim() || undefined,
    source: body.source ?? 'website',
    context: body.context ?? {},
  };

  const request = buildRequestContext(req, { storeRawIp: config.storeRawIp });
  const timestamp = new Date().toISOString();
  const context = lead.context ?? {};
  const score = intentScore(lead);

  let jira: { key: string; url: string; summary: string } | null = null;
  let subtasks: { summary: string }[] = [];
  let leadsProjectReady = false;
  let sheetWritten = false;
  const errors: string[] = [];

  // 1) Jira — the lead of record
  if (config.jira.leadsProjectKey) {
    try {
      const ensured = await ensureLeadsProject(
        config.jira,
        config.jira.leadsProjectKey,
        'Virya Leads',
      );

      if (ensured.exists) {
        leadsProjectReady = true;
        const assigneeId = await resolveAssignee(config.jira, config.leadsAssigneeId);
        const created = await createLeadIssue(config.jira, config.jira.leadsProjectKey, lead, {
          assigneeId: assigneeId ?? undefined,
        });
        jira = { key: created.key, url: created.url, summary: created.summary };
        subtasks = created.subtasks.map((s) => ({ summary: s.summary }));
      } else {
        errors.push(ensured.hint ?? 'Leads project missing');
      }
    } catch (error) {
      errors.push(`jira: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 2) Sheets — the Leads tab that feeds the KPI counters
  if (config.sheets?.leadsTab && config.google) {
    try {
      const tab = config.sheets.leadsTab;
      await ensureTab(config.sheets, config.google, tab);

      const existing = await readTab(config.sheets, config.google, tab, 'A1:A2');
      if (existing.length === 0) {
        await writeTab(config.sheets, config.google, tab, 'A1:U1', [LEAD_HEADERS]);
      }

      await appendRows(config.sheets, config.google, tab, 'A:U', [
        [
          timestamp,
          fullName,
          email,
          lead.phone ?? '',
          lead.company ?? '',
          lead.service ?? '',
          lead.consumption ?? '',
          lead.capacity ?? '',
          lead.location ?? '',
          lead.details ?? '',
          jira?.key ?? '',
          score,
          lead.source ?? 'website',
          String(context.sessionId ?? ''),
          String(context.landingPage ?? ''),
          String(context.referrer ?? ''),
          String(context.device ?? ''),
          String(context.timezone ?? ''),
          request.ipForStorage ?? '',
          request.city ?? '',
          Number(context.chatbotMessages ?? 0),
        ],
      ]);

      sheetWritten = true;
    } catch (error) {
      errors.push(`sheets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return res.status(jira ? 200 : 502).json({
    ok: Boolean(jira),
    receivedAt: timestamp,
    jira,
    subtasks: subtasks.length,
    intentScore: score,
    leadsProjectReady,
    sheetWritten,
    errors: errors.length ? errors : undefined,
    note: jira ? undefined : 'The lead could not be recorded in Jira. Please retry.',
  });
}