import { readTab, writeTab } from './sheets.js';
import { ensureTab } from './tabs.js';
import type { GoogleAuthConfig, SheetsConfig } from './config.js';
import type { RequestContext } from './context.js';

/**
 * Session persistence.
 *
 * The design constraint that matters here is **do not let storage grow with
 * traffic**. So:
 *
 *  - exactly one row per session, keyed on the session id in column A;
 *  - a repeat visit updates that row in place rather than appending;
 *  - the client batches its events, so a 20-page session is a handful of
 *    writes, not 20;
 *  - a row-id cache on the module means a warm lambda does not re-read
 *    column A on every flush.
 *
 * Columns are positional and fixed. Adding a column means extending
 * `SESSION_HEADERS` and `toRow()` together — keep them the same length.
 */

export interface SessionRecord {
  sessionId: string;
  visitorId: string;
  startedAt: string;
  lastSeenAt: string;
  /** IST stamp, which is what the Leads and Reports tabs use. */
  lastSeenLocal: string;
  pages: string[];
  servicesViewed: string[];
  primaryInterest: string | null;
  maxScrollDepth: number;
  activeSeconds: number;
  chatbotOpened: boolean;
  chatbotMessages: number;
  formStarted: boolean;
  formSubmitted: boolean;
  referrer: string;
  landingPage: string;
  utm: string;
  /** Client-derived, trusted: only the browser can know these accurately. */
  timezone: string;
  utcOffset: number;
  localHour: number;
  device: string;
  viewport: string;
  language: string;
  /** Server-derived. */
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  network: string | null;
  browser: string;
  browserVersion: string;
  os: string;
  botDevice: string;
  isBot: boolean;
  eventCount: number;
  lastEvents: string;
}

export const SESSION_HEADERS = [
  'Session ID',
  'Visitor ID',
  'Started',
  'Last Seen (UTC)',
  'Last Seen (IST)',
  'Pages Viewed',
  'Page Count',
  'Services Viewed',
  'Primary Interest',
  'Max Scroll %',
  'Active Seconds',
  'Chatbot Opened',
  'Chatbot Messages',
  'Form Started',
  'Form Submitted',
  'Referrer',
  'Landing Page',
  'UTM',
  'Timezone',
  'UTC Offset Minutes',
  'Local Hour',
  'Device (client)',
  'Viewport',
  'Language',
  'IP',
  'Country',
  'Region',
  'City',
  'Network',
  'Browser',
  'Browser Version',
  'OS',
  'Server Device',
  'Bot',
  'Events',
  'Recent Events',
] as const;

const COLUMN_COUNT = SESSION_HEADERS.length;

export function sheetColumnName(index: number): string {
  let name = '';
  while (index > 0) {
    index -= 1;
    name = String.fromCharCode(65 + (index % 26)) + name;
    index = Math.floor(index / 26);
  }
  return name;
}

const LAST_COLUMN = sheetColumnName(COLUMN_COUNT);

/**
 * Rows are expensive to find, so remember where we put them. A warm lambda
 * resolves a session id without touching the API at all.
 */
const rowIndex = new Map<string, number>();
const INDEX_TTL_MS = 10 * 60_000;
let lastIndexedAt = 0;

function istStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function toRow(record: SessionRecord): (string | number | boolean)[] {
  const row: (string | number | boolean)[] = [
    record.sessionId,
    record.visitorId,
    record.startedAt,
    record.lastSeenAt,
    istStamp(record.lastSeenAt),
    record.pages.slice(-12).join(' → '),
    record.pages.length,
    record.servicesViewed.join(', '),
    record.primaryInterest ?? '',
    record.maxScrollDepth,
    record.activeSeconds,
    record.chatbotOpened,
    record.chatbotMessages,
    record.formStarted,
    record.formSubmitted,
    record.referrer,
    record.landingPage,
    record.utm,
    record.timezone,
    record.utcOffset,
    record.localHour,
    record.device,
    record.viewport,
    record.language,
    record.ip ?? '',
    record.country ?? '',
    record.region ?? '',
    record.city ?? '',
    record.network ?? '',
    record.browser,
    record.browserVersion,
    record.os,
    record.botDevice,
    record.isBot,
    record.eventCount,
    record.lastEvents,
  ];

  if (row.length !== COLUMN_COUNT) {
    throw new Error(
      `Session row has ${row.length} values but the header has ${COLUMN_COUNT}. They must match.`,
    );
  }
  return row;
}

export interface ReturningSessionSummary {
  lastSeenAt: string;
  lastPath: string;
  primaryInterest: string | null;
  servicesViewed: string[];
}

function safeSessionPath(value: string): string | null {
  const path = value.split(/[?#]/, 1)[0];
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return /^\/(?:[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*)?$/.test(path) ? path : null;
}

/** Returns only the minimal prior-session context needed for a consented welcome-back prompt. */
export async function findReturningSession(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  visitorId: string,
): Promise<ReturningSessionSummary | null> {
  const rows = await readTab(sheets, google, tab, 'A:I');
  const matching = rows
    .slice(1)
    .filter((row) => (row[1] ?? '').trim() === visitorId)
    .map((row) => ({ row, seenAt: Date.parse(row[3] ?? '') }))
    .filter(({ seenAt }) => Number.isFinite(seenAt))
    .sort((left, right) => right.seenAt - left.seenAt);

  const latest = matching[0];
  if (!latest) return null;

  const pages = (latest.row[5] ?? '').split(' → ').reverse();
  const lastPath = pages.map(safeSessionPath).find((path) => path !== null) ?? '/';
  const servicesViewed = (latest.row[7] ?? '')
    .split(',')
    .map((service) => service.trim())
    .filter((service) => /^[a-z-]{1,40}$/.test(service))
    .slice(0, 10);
  const rawInterest = (latest.row[8] ?? '').trim();

  return {
    lastSeenAt: new Date(latest.seenAt).toISOString(),
    lastPath,
    primaryInterest: /^[a-z-]{1,40}$/.test(rawInterest) ? rawInterest : null,
    servicesViewed,
  };
}

/** Builds column A index for the tab. Returns id → row number (1-based). */
async function indexSessions(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
): Promise<Map<string, number>> {
  if (Date.now() - lastIndexedAt < INDEX_TTL_MS && rowIndex.size > 0) return rowIndex;

  const rows = await readTab(sheets, google, tab, 'A:A');
  rowIndex.clear();

  rows.forEach((row, index) => {
    const id = (row[0] ?? '').trim();
    if (!id) return;
    // Row 1 is the header; anything without an id prefix is not a session.
    if (id === SESSION_HEADERS[0]) return;
    rowIndex.set(id, index + 1);
  });

  lastIndexedAt = Date.now();
  return rowIndex;
}

export interface SessionPayload {
  visitorId?: string;
  sessionId?: string;
  startedAt?: string;
  lastSeenAt?: string;
  pages?: string[];
  servicesViewed?: string[];
  primaryInterest?: string | null;
  maxScrollDepth?: number;
  activeSeconds?: number;
  chatbotOpened?: boolean;
  chatbotMessages?: number;
  formStarted?: boolean;
  formSubmitted?: boolean;
  referrer?: string;
  landingPage?: string;
  utm?: Record<string, string>;
  timezone?: string;
  utcOffset?: number;
  localHour?: number;
  device?: string;
  viewport?: string;
  language?: string;
  events?: { event: string; [key: string]: unknown }[];
}

const MAX_ID = 80;

function text(value: unknown, max = 400): string {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, max);
}

/**
 * Upserts one session. Returns which mode was used, so the caller can log or
 * assert on it.
 */
export async function upsertSession(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  payload: SessionPayload,
  request: RequestContext,
): Promise<{ mode: 'created' | 'updated'; row: number }> {
  const sessionId = text(payload.sessionId, MAX_ID);
  if (!sessionId) throw new Error('sessionId is required');

  await ensureTab(sheets, google, tab);
  await ensureSessionHeaders(sheets, google, tab);

  const record: SessionRecord = {
    sessionId,
    visitorId: text(payload.visitorId, MAX_ID),
    startedAt: text(payload.startedAt) || new Date().toISOString(),
    lastSeenAt: text(payload.lastSeenAt) || new Date().toISOString(),
    lastSeenLocal: '',
    pages: (payload.pages ?? []).slice(0, 40).map((p) => text(p, 160)),
    servicesViewed: (payload.servicesViewed ?? []).slice(0, 10).map((s) => text(s, 40)),
    primaryInterest: payload.primaryInterest ? text(payload.primaryInterest, 40) : null,
    maxScrollDepth: Math.max(0, Math.min(100, Math.round(payload.maxScrollDepth ?? 0))),
    activeSeconds: Math.max(0, Math.round(payload.activeSeconds ?? 0)),
    chatbotOpened: Boolean(payload.chatbotOpened),
    chatbotMessages: Math.max(0, Math.round(payload.chatbotMessages ?? 0)),
    formStarted: Boolean(payload.formStarted),
    formSubmitted: Boolean(payload.formSubmitted),
    referrer: text(payload.referrer, 240),
    landingPage: text(payload.landingPage, 240),
    utm: Object.entries(payload.utm ?? {})
      .map(([k, v]) => `${k}=${v}`)
      .join(' ')
      .slice(0, 240),
    timezone: text(payload.timezone, 60),
    utcOffset: Math.min(840, Math.max(-840, Math.round(payload.utcOffset ?? 0))),
    localHour: Math.max(0, Math.min(23, Math.round(payload.localHour ?? 0))),
    device: text(payload.device, 20),
    viewport: text(payload.viewport, 24),
    language: text(payload.language, 40),
    ip: request.ipForStorage,
    country: request.country,
    region: request.region,
    city: request.city,
    network: request.network,
    browser: request.browser,
    browserVersion: text(request.browserVersion, 20),
    os: request.os,
    botDevice: request.device,
    isBot: request.isBot,
    eventCount: (payload.events ?? []).length,
    lastEvents: (payload.events ?? [])
      .slice(-12)
      .map((event) => text(event.event, 40))
      .join(' → ')
      .slice(0, 400),
  };

  const values = toRow(record);
  const index = await indexSessions(sheets, google, tab);
  const existingRow = index.get(sessionId);

  if (existingRow) {
    await writeTab(sheets, google, tab, `A${existingRow}:${LAST_COLUMN}${existingRow}`, [values]);
    return { mode: 'updated', row: existingRow };
  }

  // appendRows writes to the next free row; find it after the write.
  const { appendRows } = await import('./sheets.js');
  await appendRows(sheets, google, tab, `A:${LAST_COLUMN}`, [values]);

  const nextRow = await countRowsAfter(sheets, google, tab, sessionId, existingRow);
  return { mode: 'created', row: nextRow };
}

async function countRowsAfter(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  sessionId: string,
  previousRow: number | undefined,
): Promise<number> {
  // The cache is cold for a brand-new session, so the row number is not
  // known yet. Callers only use it for logging, so a re-read is acceptable.
  rowIndex.delete(sessionId);
  lastIndexedAt = 0;
  const index = await indexSessions(sheets, google, tab);
  return index.get(sessionId) ?? previousRow ?? 0;
}

let headersWritten = false;

export async function ensureSessionHeaders(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
): Promise<void> {
  if (headersWritten) return;

  const existing = await readTab(sheets, google, tab, `A1:${LAST_COLUMN}1`);
  const headers = existing[0] ?? [];

  if (
    headers.length !== COLUMN_COUNT ||
    SESSION_HEADERS.some((header, index) => headers[index] !== header)
  ) {
    await writeTab(sheets, google, tab, `A1:${LAST_COLUMN}1`, [[...SESSION_HEADERS]]);
  }

  headersWritten = true;
  lastIndexedAt = 0;
}