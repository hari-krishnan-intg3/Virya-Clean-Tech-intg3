import type { VercelRequest, VercelResponse } from '@vercel/node';
import { missingEnv, REPORT_TYPES } from './_lib/config';

/** Liveness / configuration check. Safe to call without the cron secret —
 * it never reveals a secret value, only whether the variable is present. */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const missing = missingEnv();

  return res.status(missing.length === 0 ? 200 : 503).json({
    status: missing.length === 0 ? 'ready' : 'missing_env',
    configured: missing.length === 0,
    missing,
    supportedReports: REPORT_TYPES,
    timestamp: new Date().toISOString(),
  });
}