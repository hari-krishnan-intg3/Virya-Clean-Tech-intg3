import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isReportType, loadConfig, missingEnv } from './_lib/config.js';
import { getSnapshot } from './_lib/jira.js';
import { countLeadsInRange } from './_lib/sheets.js';
import { getPeriod } from './_lib/periods.js';
import { buildSubject, renderReportText } from './_lib/email.js';

/**
 * Dry-run preview. Builds the report exactly as `reports.ts` would and returns
 * the subject + plain-text body WITHOUT sending email or writing to Sheets.
 *
 * Useful for checking the numbers, and for confirming credentials work, before
 * switching the cron on.
 *
 * GET /api/preview?type=daily|weekly|monthly
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missing = missingEnv();
  if (missing.length > 0) {
    return res.status(500).json({ error: 'Server is not fully configured', missing });
  }

  const config = loadConfig();

  const auth = req.headers.authorization;
  const token = typeof auth === 'string' ? auth.replace(/^Bearer\s+/i, '').trim() : '';
  if (token !== config.cronSecret) {
    return res.status(401).json({ error: 'Unauthorized. Send Authorization: Bearer <CRON_SECRET>.' });
  }

  const requested = String(req.query.type ?? 'daily').toLowerCase();
  const type = isReportType(requested) ? requested : 'daily';
  const period = getPeriod(type);

  try {
    const jira = await getSnapshot(config.jira, period.from, period.to);

    let leads = 0;
    let leadsNote = 'leads source not configured';

    if (config.sheets.leadsTab) {
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
          : `${result.total} rows (no date column detected)`;
    }

    const subject = buildSubject(period, leads, jira.createdInRange);
    const text = renderReportText({
      period,
      jira,
      leads,
      leadsNote,
      siteUrl: config.siteUrl,
      projectName: 'Virya Clean Tech',
    });

    return res.status(200).json({
      note: 'Preview only — no email sent, no Sheets write.',
      type,
      period: { from: period.from, to: period.to, label: period.rangeLabel },
      subject,
      body: text,
      raw: { leads, leadsNote, jira },
    });
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}