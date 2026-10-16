import type { JiraConfig } from '../api/_lib/config.js';
import {
  createLeadIssue,
  ensureLeadsProject,
  resolveAssignee,
  type CreatedLead,
  type LeadInput,
} from '../api/_lib/leads.js';
import { authorizeJiraOperation } from './security.js';

export const AUTOMATION_CONTROLLER_CODE = 'CON';

export interface LeadAutomationResult {
  projectReady: boolean;
  issue?: CreatedLead;
  hint?: string;
}

export async function runLeadAutomation(
  config: JiraConfig,
  projectKey: string,
  lead: LeadInput,
  assigneeId?: string,
): Promise<LeadAutomationResult> {
  if (process.env.JIRA_AUTOMATION_CONTROLLER?.trim() !== AUTOMATION_CONTROLLER_CODE) {
    throw new Error('Automation controller is not configured');
  }
  if (!authorizeJiraOperation('create', projectKey, config.leadsProjectKey)) {
    throw new Error('Security controller rejected the Jira operation');
  }

  const project = await ensureLeadsProject(config, projectKey, 'Virya Leads');
  if (!project.exists) return { projectReady: false, hint: project.hint };

  const resolvedAssignee = await resolveAssignee(config, assigneeId);
  const issue = await createLeadIssue(config, projectKey, lead, {
    assigneeId: resolvedAssignee ?? undefined,
  });

  return { projectReady: true, issue };
}