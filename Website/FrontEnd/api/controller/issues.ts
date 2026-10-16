import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireControllerUser } from '../../controller/auth.js';
import { runLeadAutomation } from '../../controller/automation.js';
import { authorizeJiraOperation, isSameOriginRequest, validateLeadPayload } from '../../controller/security.js';
import { loadLeadIntakeConfig } from '../_lib/config.js';
import type { LeadInput } from '../_lib/leads.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isSameOriginRequest(req.headers.origin, req.headers.host)) {
    return res.status(403).json({ error: 'Requests must come from this site' });
  }

  const user = await requireControllerUser(req, res);
  if (!user) return;

  const body = (req.body ?? {}) as {
    operation?: unknown;
    projectKey?: unknown;
    lead?: Record<string, unknown>;
  };
  const config = loadLeadIntakeConfig();
  const projectKey =
    typeof body.projectKey === 'string' ? body.projectKey : config.jira.leadsProjectKey;
  const operation = body.operation;

  if (
    (operation !== 'create' && operation !== 'update' && operation !== 'delete') ||
    !projectKey ||
    !authorizeJiraOperation(operation, projectKey, config.jira.leadsProjectKey, user.role)
  ) {
    return res.status(403).json({ error: 'Security controller rejected the Jira operation' });
  }
  if (operation !== 'create') {
    return res.status(501).json({ error: 'This Jira operation is not implemented' });
  }

  const validationErrors = validateLeadPayload(body.lead ?? {});
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: 'Invalid lead details', details: validationErrors });
  }

  const lead = body.lead as unknown as LeadInput;
  try {
    const result = await runLeadAutomation(config.jira, projectKey, lead, config.leadsAssigneeId);
    if (!result.issue) return res.status(422).json({ error: result.hint ?? 'Jira project unavailable' });
    return res.status(201).json({ issue: result.issue });
  } catch {
    return res.status(502).json({ error: 'Jira automation failed' });
  }
}