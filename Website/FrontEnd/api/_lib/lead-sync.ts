import type { GoogleAuthConfig, JiraConfig, SheetsConfig } from './config.js';
import { authHeader } from './jira.js';
import { appendRows, readTab, writeTab, type CellValue } from './sheets.js';
import { ensureTab } from './tabs.js';

export const LEAD_HEADERS = [
  'Created',
  'Name',
  'Email',
  'Phone',
  'Company',
  'Service',
  'Consumption',
  'Capacity',
  'Location',
  'Details',
  'Jira Key',
  'Intent Score',
  'Source',
  'Session ID',
  'Landing Page',
  'Referrer',
  'Device',
  'Timezone',
  'IP',
  'City',
  'Assistant Messages',
] as const;

type JiraLead = {
  key: string;
  fields: {
    summary?: string;
    description?: unknown;
    created?: string;
    labels?: string[];
  };
};

function adfLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(adfLines);
  if (!value || typeof value !== 'object') return [];

  const node = value as { type?: string; text?: string; content?: unknown[] };
  if (node.type === 'text') return [node.text ?? ''];
  const children = (node.content ?? []).flatMap(adfLines);
  return node.type === 'paragraph' || node.type === 'heading' ? [children.join('')] : children;
}

function extractField(text: string, field: string): string {
  const labels = ['Name', 'Email', 'Phone', 'Company', 'Service', 'Consumption', 'Capacity', 'Location'];
  const nextLabels = labels.filter((label) => label !== field).join('|');
  const match = new RegExp(
    `(?:^|\\s)${field}\\s+([\\s\\S]*?)(?=\\s+(?:${nextLabels})\\s+|$)`,
    'i',
  ).exec(text);
  return match?.[1]?.trim() ?? '';
}

function rowForIssue(issue: JiraLead): CellValue[] {
  const lines = adfLines(issue.fields.description);
  const description = lines.join('\n');
  const detailStart = lines.indexOf('What they said');
  const details = detailStart >= 0 ? lines[detailStart + 1] ?? '' : '';
  const score = /Intent score\s+(\d+)\/100/i.exec(description)?.[1] ?? '';
  const source = /from\s+([^.]+)\./i.exec(description)?.[1]?.trim() ?? 'jira';
  const contextValue = (label: string) => {
    const line = lines.find((value) => value.startsWith(`${label}: `));
    return line?.slice(label.length + 2) ?? '';
  };
  const plainDescription = description.replace(/\s+/g, ' ');

  return [
    issue.fields.created ?? '',
    extractField(plainDescription, 'Name') || issue.fields.summary || issue.key,
    extractField(plainDescription, 'Email'),
    extractField(plainDescription, 'Phone'),
    extractField(plainDescription, 'Company'),
    extractField(plainDescription, 'Service'),
    extractField(plainDescription, 'Consumption'),
    extractField(plainDescription, 'Capacity'),
    extractField(plainDescription, 'Location'),
    details,
    issue.key,
    score ? Number(score) : '',
    source,
    contextValue('Session ID'),
    contextValue('Landing page'),
    contextValue('Referrer'),
    contextValue('Device'),
    contextValue('Visitor clock'),
    '',
    '',
    '',
  ];
}

export async function upsertLeadRows(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  rowsToWrite: CellValue[][],
): Promise<number> {
  await ensureTab(sheets, google, tab);
  const rows = await readTab(sheets, google, tab, 'A:U');
  if (rows[0]?.[0] !== LEAD_HEADERS[0]) {
    await writeTab(sheets, google, tab, 'A1:U1', [[...LEAD_HEADERS]]);
  }

  const knownKeys = new Set(rows.slice(1).map((row) => (row[10] ?? '').trim()).filter(Boolean));
  const newRows = rowsToWrite.filter((row) => {
    const jiraKey = String(row[10] ?? '').trim();
    if (!jiraKey || knownKeys.has(jiraKey)) return false;
    knownKeys.add(jiraKey);
    return true;
  });

  await appendRows(sheets, google, tab, 'A:U', newRows);
  return newRows.length;
}

export async function syncJiraLeadsToSheet(
  jira: JiraConfig,
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
): Promise<{ jiraLeads: number; rowsAdded: number }> {
  const issues: JiraLead[] = [];
  let nextPageToken: string | undefined;

  for (let page = 0; page < 100; page += 1) {
    const response = await fetch(`${jira.baseUrl}/rest/api/3/search/jql`, {
      method: 'POST',
      headers: {
        Authorization: authHeader(jira),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql:
          `project = ${jira.projectKey} AND issuetype = Task AND labels = lead ` +
          'AND labels != test-lead ORDER BY created ASC',
        maxResults: 100,
        fields: ['summary', 'description', 'created', 'labels'],
        ...(nextPageToken ? { nextPageToken } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(`Jira lead sync failed (${response.status})`);
    }

    const data = (await response.json()) as {
      issues?: JiraLead[];
      nextPageToken?: string;
    };
    const pageIssues = data.issues ?? [];
    issues.push(...pageIssues);
    nextPageToken = data.nextPageToken;
    if (!nextPageToken || pageIssues.length === 0) break;
  }

  const realLeads = issues.filter(
    (issue) =>
      !issue.fields.labels?.includes('test-lead') &&
      !issue.fields.summary?.startsWith('[TEST]'),
  );
  const rowsAdded = await upsertLeadRows(
    sheets,
    google,
    tab,
    realLeads.map(rowForIssue),
  );

  return { jiraLeads: realLeads.length, rowsAdded };
}