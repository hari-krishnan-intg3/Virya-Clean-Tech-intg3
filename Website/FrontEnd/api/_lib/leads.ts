import type { JiraConfig } from './config';

/**
 * Lead intake → Jira.
 *
 * Every enquiry submitted through the website (or added manually) becomes a
 * task in a dedicated leads project, carrying who it came from and exactly
 * when it arrived.
 */

export interface LeadInput {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  location?: string;
  details?: string;
  source?: string;
}

export interface CreatedLead {
  key: string;
  url: string;
  summary: string;
}

function authHeader(config: JiraConfig): string {
  return `Basic ${Buffer.from(`${config.email}:${config.apiToken}`, 'utf8').toString('base64')}`;
}

/** "2026-10-11T14:32:05+05:30" */
function isoNow(): string {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  const tz = `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;

  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${tz}`
  );
}

export function serviceLabel(service: string): string {
  const map: Record<string, string> = {
    solar: 'Solar Power',
    'ev-charging': 'EV Charging',
    battery: 'Battery Technology',
    iot: 'IoT Integration',
    consulting: 'Energy Audit',
    other: 'Other',
  };
  return map[service] ?? service;
}

/** Human line used in the issue summary and description. */
export function describeLead(lead: LeadInput): { summary: string; createdLine: string } {
  const created = isoNow();
  const who = lead.company ? `${lead.fullName} (${lead.company})` : lead.fullName;

  return {
    summary: `New lead — ${who}${lead.service ? ` · ${serviceLabel(lead.service)}` : ''}`,
    createdLine: `Lead created by ${lead.fullName} on ${created} (IST) from ${lead.source ?? 'website'}.`,
  };
}

/**
 * Checks that the leads project exists and is usable.
 *
 * Project creation over the REST API is disabled on many Jira tenants — on
 * yours `CREATE_PROJECTS` is not even a recognised permission, so this can
 * only verify. When the project is missing we return instructions instead of
 * failing silently: create it once in the Jira UI and this becomes a no-op.
 */
export async function ensureLeadsProject(
  config: JiraConfig,
  projectKey: string,
  projectName = 'Virya Leads',
): Promise<{ exists: boolean; key: string; hint?: string }> {
  const headers = {
    Authorization: authHeader(config),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const existing = await fetch(`${config.baseUrl}/rest/api/3/project/${projectKey}`, { headers });
  if (existing.ok) return { exists: true, key: projectKey };

  // Best-effort auto-provision (works on tenants that allow it).
  const created = await fetch(`${config.baseUrl}/rest/api/3/project`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      key: projectKey,
      name: projectName,
      projectTypeKey: 'business',
      projectLead: config.email,
      assigneeType: 'PROJECT_LEAD',
    }),
  });

  if (created.ok) return { exists: true, key: projectKey };

  return {
    exists: false,
    key: projectKey,
    hint:
      `Jira project "${projectKey}" does not exist and could not be created automatically ` +
      `(HTTP ${created.status}). Create it once in Jira → Projects → Create, with key ` +
      `"${projectKey}" and name "${projectName}".`,
  };
}

/** Creates a Task in the leads project for one enquiry. */
export async function createLeadIssue(
  config: JiraConfig,
  projectKey: string,
  lead: LeadInput,
): Promise<CreatedLead> {
  const { summary, createdLine } = describeLead(lead);

  const descriptionLines = [
    createdLine,
    '',
    `Name     ${lead.fullName}`,
    `Email    ${lead.email}`,
    lead.phone ? `Phone    ${lead.phone}` : '',
    lead.company ? `Company  ${lead.company}` : '',
    lead.service ? `Service  ${serviceLabel(lead.service)}` : '',
    lead.location ? `Location ${lead.location}` : '',
    lead.details ? `\n${lead.details}` : '',
  ].filter(Boolean);

  const fields: Record<string, unknown> = {
    project: { key: projectKey },
    summary,
    issuetype: { name: 'Task' },
    labels: ['lead', 'website'],
    description: {
      type: 'doc',
      version: 1,
      content: descriptionLines.map((line) => ({
        type: 'paragraph',
        content: [{ type: 'text', text: line }],
      })),
    },
  };

  const response = await fetch(`${config.baseUrl}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(config),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Lead issue creation failed (${response.status}): ${body.slice(0, 240)}`);
  }

  const data = (await response.json()) as { key: string };
  return { key: data.key, url: `/browse/${data.key}`, summary };
}