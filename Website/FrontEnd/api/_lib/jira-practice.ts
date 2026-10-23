import type { JiraConfig } from './config.js';
import { authHeader } from './jira.js';

export const PRACTICE_LABEL = 'jira-sla-practice';
export const TEST_LEAD_LABEL = 'test-lead';
const ESCALATION_THRESHOLD_HOURS = 4;
const FIELD_DEFINITIONS = [
  { name: 'Countdown', description: 'Hours remaining before the Jira SLA is breached.' },
  { name: 'Time to Review', description: 'Hours remaining for the first human review.' },
  { name: 'SLA State', description: 'Automation state for the Jira SLA practice workflow.' },
] as const;

export interface PracticeField {
  id?: string;
  name: string;
  configured: boolean;
}

export interface PracticeLead {
  key: string;
  summary: string;
  status: string;
  dueDate: string | null;
  countdownHours: number;
  slaState: 'On track' | 'Warning' | 'Breached' | 'Escalated';
  url: string;
  isTest: boolean;
}

export interface PracticeSnapshot {
  projectKey: string;
  fields: PracticeField[];
  leads: PracticeLead[];
  lastRunAt: string | null;
}

export interface PracticeRunResult {
  checked: number;
  updated: number;
  warnings: number;
  escalated: number;
  errors: string[];
  ranAt: string;
}

type PracticeFieldIds = {
  countdown?: string;
  timeToReview?: string;
  slaState?: string;
};

type JiraIssue = {
  key: string;
  fields?: Record<string, any>;
};

function headers(config: JiraConfig) {
  return {
    Authorization: authHeader(config),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

async function jiraRequest(config: JiraConfig, path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${config.baseUrl}${path}`, { ...init, headers: { ...headers(config), ...(init?.headers ?? {}) } });
}

function hoursUntil(dueDate: string | null): number {
  if (!dueDate) return 0;
  return Math.max(0, Math.round(((Date.parse(`${dueDate}T23:59:59Z`) - Date.now()) / 3600000) * 10) / 10);
}

function stateFor(hours: number, status: string): PracticeLead['slaState'] {
  if (/escalated/i.test(status)) return 'Escalated';
  if (hours <= 0) return 'Breached';
  if (hours <= ESCALATION_THRESHOLD_HOURS) return 'Warning';
  return 'On track';
}

function labelCountdown(labels: unknown): number | null {
  if (!Array.isArray(labels)) return null;
  const match = labels.find((label): label is string => typeof label === 'string' && /^sla-countdown-\d+h$/.test(label));
  if (!match) return null;
  return Number(match.match(/(\d+)h$/)?.[1] ?? 0);
}

async function getFieldIds(config: JiraConfig): Promise<PracticeFieldIds> {
  const response = await jiraRequest(config, '/rest/api/3/field');
  if (!response.ok) throw new Error(`Could not read Jira fields (${response.status})`);
  const fields = (await response.json()) as { id: string; name: string }[];
  const byName = new Map(fields.map((field) => [field.name.toLowerCase(), field.id]));
  return {
    countdown: byName.get('countdown'),
    timeToReview: byName.get('time to review'),
    slaState: byName.get('sla state'),
  };
}

export async function ensurePracticeFields(config: JiraConfig): Promise<{ fields: PracticeField[]; ids: PracticeFieldIds; errors: string[] }> {
  const errors: string[] = [];
  let ids = await getFieldIds(config);
  const keys: (keyof PracticeFieldIds)[] = ['countdown', 'timeToReview', 'slaState'];
  for (const [index, definition] of FIELD_DEFINITIONS.entries()) {
    const key = keys[index];
    if (ids[key]) continue;
    const response = await jiraRequest(config, '/rest/api/3/field', {
      method: 'POST',
      body: JSON.stringify({
        name: definition.name,
        description: definition.description,
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:textfield',
        searcherKey: 'com.atlassian.jira.plugin.system.customfieldtypes:textsearcher',
      }),
    });
    if (!response.ok) {
      errors.push(`${definition.name}: Jira returned ${response.status}`);
      continue;
    }
    const created = (await response.json()) as { id?: string };
    ids = { ...ids, [key]: created.id };
  }

  return {
    ids,
    errors,
    fields: FIELD_DEFINITIONS.map((definition, index) => ({
      name: definition.name,
      id: ids[keys[index]],
      configured: Boolean(ids[keys[index]]),
    })),
  };
}

async function readPracticeFields(config: JiraConfig): Promise<{ fields: PracticeField[]; ids: PracticeFieldIds }> {
  const ids = await getFieldIds(config);
  const keys: (keyof PracticeFieldIds)[] = ['countdown', 'timeToReview', 'slaState'];
  return {
    ids,
    fields: FIELD_DEFINITIONS.map((definition, index) => ({
      name: definition.name,
      id: ids[keys[index]],
      configured: Boolean(ids[keys[index]]),
    })),
  };
}

async function searchPracticeIssues(config: JiraConfig, projectKey: string, ids: PracticeFieldIds = {}): Promise<JiraIssue[]> {
  const jql = `project = ${projectKey} AND labels = ${PRACTICE_LABEL} ORDER BY duedate ASC`;
  const response = await jiraRequest(config, `/rest/api/3/search/jql`, {
    method: 'POST',
    body: JSON.stringify({
      jql,
      maxResults: 100,
      fields: ['summary', 'status', 'duedate', 'labels', 'priority', ...Object.values(ids).filter(Boolean)],
    }),
  });
  if (!response.ok) throw new Error(`Could not read practice issues (${response.status})`);
  return ((await response.json()) as { issues?: JiraIssue[] }).issues ?? [];
}

function toPracticeLead(issue: JiraIssue, ids: PracticeFieldIds): PracticeLead {
  const fields = issue.fields ?? {};
  const dueDate = typeof fields.duedate === 'string' ? fields.duedate : null;
  const countdown = ids.countdown
    ? Number(fields[ids.countdown] ?? labelCountdown(fields.labels) ?? hoursUntil(dueDate))
    : labelCountdown(fields.labels) ?? hoursUntil(dueDate);
  const status = String(fields.status?.name ?? 'Unknown');
  return {
    key: issue.key,
    summary: String(fields.summary ?? issue.key),
    status,
    dueDate,
    countdownHours: Math.max(0, Math.round(countdown * 10) / 10),
    slaState: stateFor(countdown, status),
    url: `/browse/${issue.key}`,
    isTest: Array.isArray(fields.labels) && fields.labels.includes(TEST_LEAD_LABEL),
  };
}

export async function getPracticeSnapshot(config: JiraConfig, projectKey: string): Promise<PracticeSnapshot> {
  const setup = await readPracticeFields(config);
  const issues = await searchPracticeIssues(config, projectKey, setup.ids);
  return {
    projectKey,
    fields: setup.fields,
    leads: issues.map((issue) => toPracticeLead(issue, setup.ids)),
    lastRunAt: null,
  };
}

function dateInHours(hours: number): string {
  const date = new Date(Date.now() + hours * 3600000);
  return date.toISOString().slice(0, 10);
}

async function createPracticeLead(config: JiraConfig, projectKey: string, lead: { name: string; company: string; hours: number }, ids: PracticeFieldIds) {
  const fields: Record<string, unknown> = {
    project: { key: projectKey },
    summary: `[TEST] SLA lead — ${lead.name} · ${lead.company}`,
    issuetype: { name: 'Task' },
    labels: [PRACTICE_LABEL, TEST_LEAD_LABEL, 'lead'],
    duedate: dateInHours(lead.hours),
    description: {
      type: 'doc',
      version: 1,
      content: [{ type: 'paragraph', content: [{ type: 'text', text: `SLA practice lead for ${lead.name} at ${lead.company}. Created as a safe test record.` }] }],
    },
  };
  const response = await jiraRequest(config, '/rest/api/3/issue', { method: 'POST', body: JSON.stringify({ fields }) });
  if (!response.ok) throw new Error(`Could not create ${lead.name} (${response.status})`);
  const created = (await response.json()) as { key: string };
  const customFields: Record<string, unknown> = {};
  if (ids.countdown) customFields[ids.countdown] = String(lead.hours);
  if (ids.timeToReview) customFields[ids.timeToReview] = String(lead.hours);
  if (ids.slaState) customFields[ids.slaState] = lead.hours <= 0 ? 'Breached' : lead.hours <= ESCALATION_THRESHOLD_HOURS ? 'Warning' : 'On track';
  if (Object.keys(customFields).length) {
    await jiraRequest(config, `/rest/api/3/issue/${created.key}`, { method: 'PUT', body: JSON.stringify({ fields: customFields }) });
  }
  return created;
}

export async function seedPracticeLeads(config: JiraConfig, projectKey: string): Promise<{ created: string[]; existing: number; errors: string[] }> {
  const setup = await ensurePracticeFields(config);
  const existing = await searchPracticeIssues(config, projectKey, setup.ids);
  const names = ['Asha Menon', 'Rohan Iyer', 'Maya Shah', 'Kabir Rao', 'Leena Thomas'];
  const hours = [1, 4, 10, -2, 24];
  const created: string[] = [];
  const errors = [...setup.errors];
  for (const [index, name] of names.entries()) {
    const summary = `[TEST] SLA lead — ${name} ·`;
    if (existing.some((issue) => String(issue.fields?.summary ?? '').startsWith(summary))) continue;
    try {
      const result = await createPracticeLead(config, projectKey, { name, company: `Test Energy ${index + 1}`, hours: hours[index] }, setup.ids);
      created.push(result.key);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return { created, existing: existing.length, errors };
}

async function transitionToEscalated(config: JiraConfig, issueKey: string): Promise<boolean> {
  const response = await jiraRequest(config, `/rest/api/3/issue/${issueKey}/transitions`);
  if (!response.ok) return false;
  const transitions = ((await response.json()) as { transitions?: { id: string; name: string }[] }).transitions ?? [];
  const transition = transitions.find((item) => /escalated/i.test(item.name));
  if (!transition) return false;
  const result = await jiraRequest(config, `/rest/api/3/issue/${issueKey}/transitions`, { method: 'POST', body: JSON.stringify({ transition: { id: transition.id } }) });
  return result.ok;
}

export async function runPracticeTick(config: JiraConfig, projectKey: string): Promise<PracticeRunResult> {
  const setup = await ensurePracticeFields(config);
  const issues = await searchPracticeIssues(config, projectKey, setup.ids);
  const ranAt = new Date().toISOString();
  let updated = 0;
  let warnings = 0;
  let escalated = 0;
  const errors = [...setup.errors];

  for (const issue of issues) {
    const dueDate = typeof issue.fields?.duedate === 'string' ? issue.fields.duedate : null;
    const countdown = labelCountdown(issue.fields?.labels) ?? hoursUntil(dueDate);
    const state = stateFor(countdown, String(issue.fields?.status?.name ?? ''));
    if (countdown <= ESCALATION_THRESHOLD_HOURS && countdown > 0) warnings += 1;
    const labels = new Set<string>(Array.isArray(issue.fields?.labels) ? issue.fields.labels : []);
    labels.delete('sla-warning');
    labels.delete('sla-breached');
    for (const label of labels) {
      if (label.startsWith('sla-countdown-')) labels.delete(label);
    }
    labels.add(`sla-countdown-${Math.floor(countdown)}h`);
    if (state === 'Warning') labels.add('sla-warning');
    if (state === 'Breached') labels.add('sla-breached');
    const response = await jiraRequest(config, `/rest/api/3/issue/${issue.key}`, { method: 'PUT', body: JSON.stringify({ fields: { labels: [...labels] } }) });
    if (!response.ok) {
      errors.push(`${issue.key}: update returned ${response.status}`);
      continue;
    }
    updated += 1;
    const customFields: Record<string, unknown> = {};
    if (setup.ids.countdown) customFields[setup.ids.countdown] = String(countdown);
    if (setup.ids.timeToReview) customFields[setup.ids.timeToReview] = String(countdown);
    if (setup.ids.slaState) customFields[setup.ids.slaState] = state;
    if (Object.keys(customFields).length) {
      await jiraRequest(config, `/rest/api/3/issue/${issue.key}`, { method: 'PUT', body: JSON.stringify({ fields: customFields }) });
    }
    if (state === 'Breached') {
      try {
        if (await transitionToEscalated(config, issue.key)) escalated += 1;
      } catch {
        errors.push(`${issue.key}: transition failed`);
      }
    }
  }

  return { checked: issues.length, updated, warnings, escalated, errors, ranAt };
}
