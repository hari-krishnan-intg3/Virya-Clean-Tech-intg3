import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireControllerUser } from '../controller/auth.js';
import { isSameOriginRequest } from '../controller/security.js';
import { loadLeadIntakeConfig } from './_lib/config.js';
import { getPracticeSnapshot, runPracticeTick, seedPracticeLeads, ensurePracticeFields } from './_lib/jira-practice.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const cronAuthorized = Boolean(
    process.env.CRON_SECRET && req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`,
  );
  const requestHost = req.headers['x-forwarded-host'] ?? req.headers.host;
  if (!cronAuthorized && req.method !== 'GET' && !isSameOriginRequest(req.headers.origin, requestHost)) {
    return res.status(403).json({ error: 'Requests must come from this site' });
  }

  const config = loadLeadIntakeConfig();
  const projectKey = process.env.JIRA_PRACTICE_PROJECT_KEY || config.jira.leadsProjectKey || config.jira.projectKey;

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, snapshot: await getPracticeSnapshot(config.jira, projectKey), vercelProject: process.env.VERCEL_PROJECT_ID || 'virya-clean-tech-intg3' });
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const operation =
      (req.body as { operation?: unknown } | undefined)?.operation ?? req.query.operation;
    if (!cronAuthorized) {
      const user = await requireControllerUser(req, res);
      if (!user) return;
    }
    if (operation === 'setup') {
      return res.status(200).json({ ok: true, ...(await ensurePracticeFields(config.jira)) });
    }
    if (operation === 'seed') {
      return res.status(200).json({ ok: true, ...(await seedPracticeLeads(config.jira, projectKey)) });
    }
    if (operation === 'tick') {
      return res.status(200).json({ ok: true, result: await runPracticeTick(config.jira, projectKey) });
    }
    return res.status(400).json({ error: 'Unknown practice operation' });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Jira practice request failed' });
  }
}
