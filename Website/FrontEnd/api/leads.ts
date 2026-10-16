import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runLeadAutomation } from '../controller/automation.js';
import { isSameOriginRequest, validateLeadPayload } from '../controller/security.js';
import { loadLeadIntakeConfig } from './_lib/config.js';
import { buildRequestContext } from './_lib/context.js';
import type { LeadInput } from './_lib/leads.js';
import { upsertLeadRows } from './_lib/lead-sync.js';
import { subscribeAndSendWelcome, type NewsletterStatus } from './_lib/newsletter.js';

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

  if (!isSameOriginRequest(req.headers.origin, req.headers.host)) {
    return res.status(403).json({ error: 'Requests must come from this site' });
  }

  const config = loadLeadIntakeConfig();

  const body = (req.body ?? {}) as Partial<LeadInput> & {
    context?: Record<string, unknown>;
  };

  const validationErrors = validateLeadPayload(body as Record<string, unknown>);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: 'Invalid lead details', details: validationErrors });
  }

  const fullName = String(body.fullName ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();

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
    newsletterConsent: body.newsletterConsent === true,
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
  let newsletterStatus: NewsletterStatus = 'not-requested';
  const errors: string[] = [];

  // 1) Jira — the lead of record
  if (config.jira.leadsProjectKey) {
    try {
      const automation = await runLeadAutomation(
        config.jira,
        config.jira.leadsProjectKey,
        lead,
        config.leadsAssigneeId,
      );

      if (automation.projectReady && automation.issue) {
        leadsProjectReady = automation.projectReady;
        const created = automation.issue;
        jira = { key: created.key, url: created.url, summary: created.summary };
        subtasks = created.subtasks.map((s) => ({ summary: s.summary }));
      } else {
        errors.push(automation.hint ?? 'Leads project missing');
      }
    } catch (error) {
      errors.push(`jira: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 2) Sheets — the Leads tab that feeds the KPI counters
  if (lead.source !== 'test' && config.sheets?.leadsTab && config.google) {
    try {
      const tab = config.sheets.leadsTab;
      await upsertLeadRows(config.sheets, config.google, tab, [
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

  if (jira && lead.newsletterConsent) {
    if (config.sheets && config.google) {
      try {
        newsletterStatus = await subscribeAndSendWelcome(config.sheets, config.google, {
          email: lead.email,
          name: lead.fullName,
          service: lead.service ? lead.service : 'Clean energy solutions',
        });
      } catch (error) {
        console.error('[leads] newsletter subscription failed', error);
        newsletterStatus = 'pending';
      }
    } else {
      newsletterStatus = 'pending';
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
    newsletterStatus,
    errors: errors.length ? errors : undefined,
    note: jira ? undefined : 'The lead could not be recorded in Jira. Please retry.',
  });
}