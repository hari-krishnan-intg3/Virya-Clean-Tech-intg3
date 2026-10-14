import type { JiraConfig } from './config.js';

/**
 * Minimal Jira Cloud REST client (API v3).
 * Uses fetch directly so we add no SDK dependency.
 */

export interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  type: string;
  created: string;
  updated: string;
  assignee: string | null;
  url: string;
}

export interface JiraIssueTypeCount {
  type: string;
  count: number;
}

export interface JiraSnapshot {
  total: number;
  createdInRange: number;
  resolvedInRange: number;
  open: number;
  byType: JiraIssueTypeCount[];
  byStatus: JiraIssueTypeCount[];
  recent: JiraIssue[];
}

export function authHeader(config: JiraConfig): string {
  const raw = `${config.email}:${config.apiToken}`;
  return `Basic ${Buffer.from(raw, 'utf8').toString('base64')}`;
}

function stripMarkup(text: string | undefined): string {
  if (!text) return '';
  // Jira returns Atlassian Document Format for fields; plain summary is a string.
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Runs a JQL search.
 * Uses the modern `/rest/api/3/search/jql` endpoint (POST), falling back to
 * `/rest/api/3/search` (GET) for older tenants.
 */
export async function searchIssues(
  config: JiraConfig,
  jql: string,
  maxResults = 100,
): Promise<{ issues: JiraIssue[]; total: number }> {
  const headers = {
    Authorization: authHeader(config),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  // --- Preferred endpoint ---
  const modern = await fetch(`${config.baseUrl}/rest/api/3/search/jql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jql,
      maxResults,
      fields: ['summary', 'status', 'issuetype', 'created', 'updated', 'assignee'],
    }),
  });

  if (modern.ok) {
    const data = (await modern.json()) as any;
    return {
      issues: (data.issues ?? []).map(mapIssue),
      total: data.total ?? data.issues?.length ?? 0,
    };
  }

  // --- Fallback for older tenants ---
  if (modern.status === 404 || modern.status === 400) {
    const url =
      `${config.baseUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}` +
      `&maxResults=${maxResults}` +
      `&fields=summary,status,issuetype,created,updated,assignee`;
    const legacy = await fetch(url, { headers });

    if (!legacy.ok) {
      const body = await legacy.text();
      throw new Error(`Jira search failed (${legacy.status}): ${body.slice(0, 300)}`);
    }

    const data = (await legacy.json()) as any;
    return {
      issues: (data.issues ?? []).map(mapIssue),
      total: data.total ?? data.issues?.length ?? 0,
    };
  }

  const body = await modern.text();
  throw new Error(`Jira search failed (${modern.status}): ${body.slice(0, 300)}`);
}

function mapIssue(raw: any): JiraIssue {
  const key = raw.key as string;
  return {
    key,
    summary: stripMarkup(raw.fields?.summary),
    status: raw.fields?.status?.name ?? 'Unknown',
    type: raw.fields?.issuetype?.name ?? 'Task',
    created: raw.fields?.created ?? '',
    updated: raw.fields?.updated ?? '',
    assignee: raw.fields?.assignee?.displayName ?? null,
    url: `/browse/${key}`,
  };
}

function countBy(items: JiraIssue[], pick: (i: JiraIssue) => string) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = pick(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

/** Fetch every issue in the project and slice the ranges in memory. */
export async function getSnapshot(
  config: JiraConfig,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<JiraSnapshot> {
  const baseJql = config.jql?.trim() || `project = ${config.projectKey}`;

  // Pull the full project so type/status breakdowns are accurate, not just
  // for issues created in the window.
  const { issues } = await searchIssues(config, baseJql, 200);

  const start = rangeStart.getTime();
  const end = rangeEnd.getTime();

  const createdInRange = issues.filter((issue) => {
    const t = Date.parse(issue.created);
    return Number.isFinite(t) && t >= start && t <= end;
  });

  const resolvedInRange = issues.filter((issue) => {
    const t = Date.parse(issue.updated);
    return Number.isFinite(t) && t >= start && t <= end;
  });

  const open = issues.filter((issue) => !/done|closed|resolved/i.test(issue.status));

  return {
    total: issues.length,
    createdInRange: createdInRange.length,
    resolvedInRange: resolvedInRange.length,
    open: open.length,
    byType: countBy(issues, (i) => i.type),
    byStatus: countBy(issues, (i) => i.status),
    recent: [...createdInRange]
      .sort((a, b) => Date.parse(b.created) - Date.parse(a.created))
      .slice(0, 8),
  };
}