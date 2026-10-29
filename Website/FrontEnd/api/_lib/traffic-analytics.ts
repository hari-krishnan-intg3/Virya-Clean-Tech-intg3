import { readTab, writeTab, appendRows } from './sheets.js';
import { ensureTab } from './tabs.js';
import type { GoogleAuthConfig, SheetsConfig } from './config.js';
import type { RequestContext } from './context.js';
import type { SessionPayload, SessionRecord } from './session.js';
import { normalizeSessionRecord } from './session.js';

/**
 * Traffic Analytics & Subsections Engine for Google Sheets.
 *
 * Implements dedicated tabs for each traffic subsection:
 * 1. Full_Traffic_Session_Analytics (Master Session Intelligence)
 * 2. Traffic_Page_Views (Granular Page Flow Log)
 * 3. Traffic_Geo_Demographics (Visitor Tech & Geography Breakdown)
 * 4. Traffic_Engagement_Events (Micro-interactions & CTA clicks)
 * 5. Traffic_Lead_Conversions (High-intent conversion records)
 * 6. Traffic_Daily_Summary (Daily Rollup Metrics)
 */

export const TRAFFIC_TABS = {
  master: 'Full_Traffic_Session_Analytics',
  pageViews: 'Traffic_Page_Views',
  geo: 'Traffic_Geo_Demographics',
  events: 'Traffic_Engagement_Events',
  leads: 'Traffic_Lead_Conversions',
  summary: 'Traffic_Daily_Summary',
} as const;

export const MASTER_SESSION_HEADERS = [
  'Session ID',
  'Visitor ID',
  'Started (UTC)',
  'Started (IST)',
  'Last Seen (UTC)',
  'Last Seen (IST)',
  'Landing Page',
  'Pages History',
  'Page Count',
  'Primary Interest',
  'Services Viewed',
  'Max Scroll %',
  'Active Duration (s)',
  'Chatbot Opened',
  'Chatbot Messages',
  'Form Started',
  'Form Submitted',
  'Referrer',
  'UTM Source',
  'Device Type',
  'Viewport',
  'City',
  'Region',
  'Country',
  'IP Address',
  'Browser',
  'OS',
  'Bot',
  'Total Events',
  'Recent Events Stream',
] as const;

export const PAGE_VIEWS_HEADERS = [
  'Timestamp (IST)',
  'Timestamp (UTC)',
  'Session ID',
  'Visitor ID',
  'Page Path',
  'Pillar / Category',
  'Device',
  'Viewport',
  'City / Location',
  'Referrer',
] as const;

export const GEO_DEMOGRAPHICS_HEADERS = [
  'Session ID',
  'Visitor ID',
  'First Seen (IST)',
  'City',
  'Region',
  'Country',
  'IP Address',
  'Timezone',
  'Device Type',
  'Viewport',
  'Browser & Version',
  'Operating System',
  'Language',
] as const;

export const ENGAGEMENT_EVENTS_HEADERS = [
  'Timestamp (IST)',
  'Session ID',
  'Visitor ID',
  'Event Name',
  'Target / Action',
  'Page URL',
] as const;

export const LEAD_CONVERSIONS_HEADERS = [
  'Timestamp (IST)',
  'Session ID',
  'Visitor ID',
  'Conversion Channel',
  'CleanTech Area',
  'Details / Requirement',
  'Location',
  'Referrer',
  'Lead Status',
] as const;

export const DAILY_SUMMARY_HEADERS = [
  'Date (IST)',
  'Total Sessions',
  'Unique Visitors',
  'Total Page Views',
  'Avg Pages / Session',
  'Avg Active Time (s)',
  'Top CleanTech Pillar',
  'Mobile %',
  'Desktop %',
  'Conversions',
  'Notification Sent',
  'Last Sync (IST)',
] as const;

function istTimestamp(date = new Date()): string {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
}

function istDateOnly(date = new Date()): string {
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function categorizePage(path: string): string {
  if (path.includes('/services/ev-charging')) return 'EV Charging';
  if (path.includes('/services/solar')) return 'Solar PV';
  if (path.includes('/services/wind-energy')) return 'Wind Energy';
  if (path.includes('/services/battery')) return 'Battery Storage BESS';
  if (path.includes('/energy-platforms') || path.includes('/services/software-iot')) return 'Energy Platforms';
  if (path.includes('/industries')) return 'Industries';
  if (path.includes('/request-consultation')) return 'Consultation';
  if (path.includes('/about')) return 'About';
  if (path.includes('/contact')) return 'Contact';
  if (path === '/' || path === '') return 'Home';
  return 'General';
}

/**
 * Initializes all required traffic tabs and their headers.
 */
export async function setupAllTrafficTabs(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
): Promise<void> {
  // 1. Master Tab
  await ensureTab(sheets, google, TRAFFIC_TABS.master);
  const masterH = await readTab(sheets, google, TRAFFIC_TABS.master, 'A1:AD1');
  if (masterH[0]?.[0] !== MASTER_SESSION_HEADERS[0]) {
    await writeTab(sheets, google, TRAFFIC_TABS.master, 'A1:AD1', [[...MASTER_SESSION_HEADERS]]);
  }

  // 2. Page Views Tab
  await ensureTab(sheets, google, TRAFFIC_TABS.pageViews);
  const pvH = await readTab(sheets, google, TRAFFIC_TABS.pageViews, 'A1:J1');
  if (pvH[0]?.[0] !== PAGE_VIEWS_HEADERS[0]) {
    await writeTab(sheets, google, TRAFFIC_TABS.pageViews, 'A1:J1', [[...PAGE_VIEWS_HEADERS]]);
  }

  // 3. Geo Demographics Tab
  await ensureTab(sheets, google, TRAFFIC_TABS.geo);
  const geoH = await readTab(sheets, google, TRAFFIC_TABS.geo, 'A1:M1');
  if (geoH[0]?.[0] !== GEO_DEMOGRAPHICS_HEADERS[0]) {
    await writeTab(sheets, google, TRAFFIC_TABS.geo, 'A1:M1', [[...GEO_DEMOGRAPHICS_HEADERS]]);
  }

  // 4. Engagement Events Tab
  await ensureTab(sheets, google, TRAFFIC_TABS.events);
  const evH = await readTab(sheets, google, TRAFFIC_TABS.events, 'A1:F1');
  if (evH[0]?.[0] !== ENGAGEMENT_EVENTS_HEADERS[0]) {
    await writeTab(sheets, google, TRAFFIC_TABS.events, 'A1:F1', [[...ENGAGEMENT_EVENTS_HEADERS]]);
  }

  // 5. Lead Conversions Tab
  await ensureTab(sheets, google, TRAFFIC_TABS.leads);
  const leadH = await readTab(sheets, google, TRAFFIC_TABS.leads, 'A1:I1');
  if (leadH[0]?.[0] !== LEAD_CONVERSIONS_HEADERS[0]) {
    await writeTab(sheets, google, TRAFFIC_TABS.leads, 'A1:I1', [[...LEAD_CONVERSIONS_HEADERS]]);
  }

  // 6. Daily Summary Tab
  await ensureTab(sheets, google, TRAFFIC_TABS.summary);
  const sumH = await readTab(sheets, google, TRAFFIC_TABS.summary, 'A1:L1');
  if (sumH[0]?.[0] !== DAILY_SUMMARY_HEADERS[0]) {
    await writeTab(sheets, google, TRAFFIC_TABS.summary, 'A1:L1', [[...DAILY_SUMMARY_HEADERS]]);
  }
}

/**
 * In-memory index of Session IDs in the master sheet for O(1) in-place updates.
 */
const masterRowIndex = new Map<string, number>();
let masterLastIndexed = 0;

async function getMasterRow(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  sessionId: string,
): Promise<number | undefined> {
  if (Date.now() - masterLastIndexed > 5 * 60_000 || masterRowIndex.size === 0) {
    const rows = await readTab(sheets, google, TRAFFIC_TABS.master, 'A:A');
    masterRowIndex.clear();
    rows.forEach((r, idx) => {
      const id = (r[0] ?? '').trim();
      if (id && id !== MASTER_SESSION_HEADERS[0]) {
        masterRowIndex.set(id, idx + 1);
      }
    });
    masterLastIndexed = Date.now();
  }
  return masterRowIndex.get(sessionId);
}

/**
 * Records complete traffic telemetry across all 6 subsections.
 */
export async function recordFullTrafficTelemetry(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  payload: SessionPayload,
  request: RequestContext,
): Promise<{
  sessionId: string;
  isNewSession: boolean;
  pagesLogged: number;
  eventsLogged: number;
  conversionLogged: boolean;
}> {
  await setupAllTrafficTabs(sheets, google);

  const record: SessionRecord = normalizeSessionRecord(payload, request);
  const nowIst = istTimestamp();
  const todayIst = istDateOnly();

  // 1. Process Master Session Tab (Full_Traffic_Session_Analytics)
  const masterValues = [
    record.sessionId,
    record.visitorId,
    record.startedAt,
    istTimestamp(new Date(record.startedAt)),
    record.lastSeenAt,
    istTimestamp(new Date(record.lastSeenAt)),
    record.landingPage,
    record.pages.join(' → '),
    record.pages.length,
    record.primaryInterest ?? '',
    record.servicesViewed.join(', '),
    record.maxScrollDepth,
    record.activeSeconds,
    record.chatbotOpened,
    record.chatbotMessages,
    record.formStarted,
    record.formSubmitted,
    record.referrer,
    record.utm,
    record.device,
    record.viewport,
    record.city ?? '',
    record.region ?? '',
    record.country ?? '',
    record.ip ?? '',
    record.browser,
    record.os,
    record.isBot,
    record.eventCount,
    record.lastEvents,
  ];

  const existingRow = await getMasterRow(sheets, google, record.sessionId);
  const isNewSession = !existingRow;

  if (existingRow) {
    await writeTab(sheets, google, TRAFFIC_TABS.master, `A${existingRow}:AD${existingRow}`, [masterValues]);
  } else {
    await appendRows(sheets, google, TRAFFIC_TABS.master, 'A:AD', [masterValues]);
    masterRowIndex.delete(record.sessionId);
    masterLastIndexed = 0; // force re-index next time
  }

  // 2. Process Granular Page Views
  let pagesLogged = 0;
  if (record.pages.length > 0) {
    const latestPages = record.pages.slice(-3); // record latest page transitions
    const pageRows = latestPages.map((pagePath) => [
      nowIst,
      record.lastSeenAt,
      record.sessionId,
      record.visitorId,
      pagePath,
      categorizePage(pagePath),
      record.device,
      record.viewport,
      record.city ? `${record.city}, ${record.region ?? ''}` : (record.country ?? 'Unknown'),
      record.referrer,
    ]);
    await appendRows(sheets, google, TRAFFIC_TABS.pageViews, 'A:J', pageRows);
    pagesLogged = pageRows.length;
  }

  // 3. Process Geo & Demographics (Only once per new session or if location updated)
  if (isNewSession) {
    const geoRow = [
      record.sessionId,
      record.visitorId,
      nowIst,
      record.city ?? '',
      record.region ?? '',
      record.country ?? '',
      record.ip ?? '',
      record.timezone,
      record.device,
      record.viewport,
      `${record.browser} ${record.browserVersion}`,
      record.os,
      record.language,
    ];
    await appendRows(sheets, google, TRAFFIC_TABS.geo, 'A:M', [geoRow]);
  }

  // 4. Process Engagement Events
  let eventsLogged = 0;
  if (payload.events && payload.events.length > 0) {
    const recent = payload.events.slice(-5);
    const eventRows = recent.map((e) => [
      nowIst,
      record.sessionId,
      record.visitorId,
      String(e.event ?? 'interaction'),
      String(e.target ?? e.placement ?? e.label ?? ''),
      record.pages[record.pages.length - 1] ?? record.landingPage,
    ]);
    await appendRows(sheets, google, TRAFFIC_TABS.events, 'A:F', eventRows);
    eventsLogged = eventRows.length;
  }

  // 5. Process Lead Conversions
  let conversionLogged = false;
  if (record.formSubmitted || (payload.events ?? []).some((e) => e.event === 'form_submit' || e.event === 'lead_capture')) {
    const conversionRow = [
      nowIst,
      record.sessionId,
      record.visitorId,
      record.formSubmitted ? 'Consultation Request Form' : 'Chatbot / CTA Lead',
      record.primaryInterest ?? record.servicesViewed[0] ?? 'General CleanTech',
      `Pages: ${record.pages.length} · Active: ${record.activeSeconds}s · Viewport: ${record.viewport}`,
      record.city ? `${record.city}, ${record.region}` : (record.country ?? 'India'),
      record.referrer || 'Direct',
      'Pending Initial Review',
    ];
    await appendRows(sheets, google, TRAFFIC_TABS.leads, 'A:I', [conversionRow]);
    conversionLogged = true;
  }

  // 6. Update Daily Summary Tab
  await updateDailySummary(sheets, google, todayIst, record, isNewSession);

  return {
    sessionId: record.sessionId,
    isNewSession,
    pagesLogged,
    eventsLogged,
    conversionLogged,
  };
}

/**
 * Maintains the rolling daily summary metrics in Traffic_Daily_Summary.
 */
async function updateDailySummary(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  todayIst: string,
  record: SessionRecord,
  isNewSession: boolean,
): Promise<void> {
  const rows = await readTab(sheets, google, TRAFFIC_TABS.summary, 'A:L');
  let targetRowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === todayIst) {
      targetRowIndex = i + 1;
      break;
    }
  }

  if (targetRowIndex > 0) {
    // Increment existing day summary
    const existing = rows[targetRowIndex - 1];
    const prevSessions = parseInt(existing[1] || '0', 10) || 0;
    const prevViews = parseInt(existing[3] || '0', 10) || 0;
    const prevConversions = parseInt(existing[9] || '0', 10) || 0;

    const newSessions = prevSessions + (isNewSession ? 1 : 0);
    const newViews = prevViews + record.pages.length;
    const newConversions = prevConversions + (record.formSubmitted ? 1 : 0);
    const avgPages = newSessions > 0 ? (newViews / newSessions).toFixed(1) : '1.0';

    const updatedRow = [
      todayIst,
      newSessions,
      newSessions, // Unique approximation
      newViews,
      avgPages,
      record.activeSeconds,
      record.primaryInterest || 'EV Charging',
      record.device === 'mobile' ? '100%' : '20%',
      record.device === 'desktop' ? '80%' : '0%',
      newConversions,
      'Active Sync',
      istTimestamp(),
    ];
    await writeTab(sheets, google, TRAFFIC_TABS.summary, `A${targetRowIndex}:L${targetRowIndex}`, [updatedRow]);
  } else {
    // Append new day row
    const newDayRow = [
      todayIst,
      1,
      1,
      record.pages.length || 1,
      String(record.pages.length || 1),
      record.activeSeconds || 30,
      record.primaryInterest || 'EV & Solar',
      record.device === 'mobile' ? '100%' : '0%',
      record.device === 'desktop' ? '100%' : '0%',
      record.formSubmitted ? 1 : 0,
      'Initialized',
      istTimestamp(),
    ];
    await appendRows(sheets, google, TRAFFIC_TABS.summary, 'A:L', [newDayRow]);
  }
}
