import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadConfig, missingEnv } from './_lib/config.js';
import { sendTrafficAnalyticsNotification, getTrafficReportSnapshot } from './_lib/traffic-notification.js';

/**
 * Traffic Analytics Notification Endpoint.
 *
 * GET /api/traffic-notify?preview=1 -> returns snapshot JSON without sending email
 * POST /api/traffic-notify -> sends email notification and updates sheet status
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    const missing = missingEnv();
    if (missing.length > 0) {
      return res.status(500).json({
        ok: false,
        error: `Missing required environment variables: ${missing.join(', ')}`,
      });
    }

    const config = loadConfig();

    if (req.method === 'GET') {
      const snapshot = await getTrafficReportSnapshot(config.sheets, config.google);
      return res.status(200).json({ ok: true, preview: true, data: snapshot });
    }

    if (req.method === 'POST') {
      const result = await sendTrafficAnalyticsNotification(config.mail, config.sheets, config.google);
      return res.status(200).json({ ok: true, sent: true, emailId: result.id, data: result.summary });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[traffic-notify] error:', error);
    return res.status(500).json({ ok: false, error: (error as Error).message });
  }
}

