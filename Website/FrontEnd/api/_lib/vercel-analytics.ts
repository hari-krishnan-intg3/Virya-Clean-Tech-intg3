import type { GoogleAuthConfig, SheetsConfig, VercelAnalyticsConfig } from './config.js';
import { appendRows, readTab, writeTab } from './sheets.js';
import { ensureTab } from './tabs.js';

export interface VercelAnalyticsSnapshot {
  pageViews: number;
  uniqueVisitors: number;
  topPages: { path: string; pageViews: number; visitors: number }[];
  since: string;
  until: string;
}

export const VERCEL_ANALYTICS_HEADERS = [
  'Report Key',
  'Report Type',
  'Period Start (UTC)',
  'Period End (UTC)',
  'Page Views',
  'Unique Visitors',
  'Top Pages',
  'Fetched At (UTC)',
] as const;

function analyticsUrl(
  path: string,
  config: VercelAnalyticsConfig,
  since: string,
  until: string,
): URL {
  const url = new URL(`https://api.vercel.com/v1/query/web-analytics/${path}`);
  url.searchParams.set('projectId', config.projectId);
  url.searchParams.set('since', since);
  url.searchParams.set('until', until);
  if (config.teamId) url.searchParams.set('teamId', config.teamId);
  if (config.teamSlug) url.searchParams.set('slug', config.teamSlug);
  return url;
}

async function queryVercel<T>(url: URL, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Vercel Web Analytics request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function getVercelAnalytics(
  config: VercelAnalyticsConfig,
  start: Date,
  end: Date,
): Promise<VercelAnalyticsSnapshot> {
  const since = start.toISOString();
  const until = end.toISOString();
  const countUrl = analyticsUrl('visits/count', config, since, until);
  const pageUrl = analyticsUrl('visits/aggregate', config, since, until);
  pageUrl.searchParams.set('by', JSON.stringify(['requestPath']));
  pageUrl.searchParams.set('limit', '10');

  const [countResult, pageResult] = await Promise.all([
    queryVercel<{ data?: { pageviews?: number; visitors?: number } }>(
      countUrl,
      config.accessToken,
    ),
    queryVercel<{
      data?: { requestPath?: string; pageviews?: number; visitors?: number }[];
    }>(pageUrl, config.accessToken),
  ]);

  return {
    pageViews: Number(countResult.data?.pageviews ?? 0),
    uniqueVisitors: Number(countResult.data?.visitors ?? 0),
    topPages: (pageResult.data ?? []).map((page) => ({
      path: page.requestPath ?? '/',
      pageViews: Number(page.pageviews ?? 0),
      visitors: Number(page.visitors ?? 0),
    })),
    since,
    until,
  };
}

export async function ensureVercelAnalyticsTab(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
): Promise<void> {
  await ensureTab(sheets, google, tab);
  const headerRow = await readTab(sheets, google, tab, 'A1:H1');
  if (headerRow[0]?.[0] !== VERCEL_ANALYTICS_HEADERS[0]) {
    await writeTab(sheets, google, tab, 'A1:H1', [[...VERCEL_ANALYTICS_HEADERS]]);
  }
}

export async function logVercelAnalytics(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  reportType: string,
  snapshot: VercelAnalyticsSnapshot,
): Promise<void> {
  await ensureVercelAnalyticsTab(sheets, google, tab);
  const rows = await readTab(sheets, google, tab, 'A:H');
  const reportKey = `${reportType}:${snapshot.since.slice(0, 10)}`;
  const targetIndex = rows.findIndex((row, index) => index > 0 && row[0] === reportKey);
  const values = [[
    reportKey,
    reportType,
    snapshot.since,
    snapshot.until,
    snapshot.pageViews,
    snapshot.uniqueVisitors,
    JSON.stringify(snapshot.topPages),
    new Date().toISOString(),
  ]];

  if (targetIndex >= 0) {
    const rowNumber = targetIndex + 1;
    await writeTab(sheets, google, tab, `A${rowNumber}:H${rowNumber}`, values);
  } else {
    await appendRows(sheets, google, tab, 'A:H', values);
  }
}