import type { VercelRequest, VercelResponse } from '@vercel/node';
import { missingEnv, REPORT_TYPES } from './_lib/config.js';

/**
 * Liveness / configuration check.
 *
 * Safe to call without the cron secret — it reports only whether a variable
 * is *present*, never its value. Handy right after the first deploy to see
 * exactly which entries still need adding.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const missing = missingEnv();
  const ready = missing.length === 0;

  res.setHeader('Cache-Control', 'no-store');

  return res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'missing_env',
    configured: ready,
    missing,
    supportedReports: REPORT_TYPES,
    features: {
      sessionTracking: Boolean(process.env.SHEETS_SESSIONS_TAB ?? 'Sessions'),
      leadsAssigned: Boolean(process.env.JIRA_LEADS_ASSIGNEE_ID),
      rawIpStorage: process.env.STORE_RAW_IP === 'true',
      dryRun: process.env.DRY_RUN === 'true',
    },
    timestamp: new Date().toISOString(),
  });
}