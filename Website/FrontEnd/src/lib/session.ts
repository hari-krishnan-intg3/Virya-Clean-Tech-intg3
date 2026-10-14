/**
 * Session intelligence.
 *
 * Builds a single, continuously-updated picture of who is on the site and
 * what they are doing, and ships it to `/api/session` in throttled batches.
 *
 * Design rules, deliberately:
 *
 *  1. **One row per session, updated in place.** The server upserts against a
 *     stable session id. Navigating the site 20 times does not create 20
 *     rows, so the sheet stays small and the data stays readable.
 *  2. **Batch, never fire per event.** Events accumulate in memory and flush
 *     on a timer, on a meaningful threshold, or on page hide. A visitor
 *     clicking through 12 pages produces ~3 network calls, not 12.
 *  3. **Client-side and server-side facts are separated.** Anything derivable
 *     from JavaScript (timezone, screen, language) is collected here. Anything
 *     only the server can know (real client IP, geolocation) is derived in
 *     `api/session.ts` and never trusted from the client.
 *  4. **Privacy first.** Honours Do Not Track, never stores free-text PII the
 *     visitor did not type, and masks the IP unless explicitly told not to.
 */

const VISITOR_KEY = 'virya.visitor';
const SESSION_KEY = 'virya.session';
const CONSENT_KEY = 'virya.tracking';

export const FLUSH_INTERVAL_MS = 30_000;
export const FLUSH_EVENT_THRESHOLD = 6;

/** Fired on the window so the chatbot, forms and pages can all report into this. */
export const TRACK_EVENT = 'virya:track';

export interface TrackedEvent {
  event: string;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/* Consent                                                             */
/* ------------------------------------------------------------------ */

/**
 * Tracking is opt-out by default only when the browser sends Do Not Track.
 * We do not gate on a cookie banner for a site that records no cookies and
 * stores one row per anonymous session.
 */
export function trackingAllowed(): boolean {
  if (typeof window === 'undefined') return false;

  const dnt =
    navigator.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack ??
    null;
  if (dnt === '1' || dnt === 'yes' || dnt === 'on') return false;

  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'off') return false;

  return true;
}

export function setTrackingPreference(enabled: boolean): void {
  localStorage.setItem(CONSENT_KEY, enabled ? 'on' : 'off');
  if (!enabled) {
    sessionStorage.removeItem(SESSION_KEY);
    events.length = 0;
  }
}

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

function randomId(prefix: string): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${hex}`;
}

function getOrCreate(key: string, prefix: string, store: Storage): string {
  const existing = store.getItem(key);
  if (existing) return existing;
  const created = randomId(prefix);
  store.setItem(key, created);
  return created;
}

export function getVisitorId(): string {
  try {
    return getOrCreate(VISITOR_KEY, 'vis', localStorage);
  } catch {
    return randomId('vis');
  }
}

export function getSessionId(): string {
  try {
    return getOrCreate(SESSION_KEY, 'ses', sessionStorage);
  } catch {
    return randomId('ses');
  }
}

/* ------------------------------------------------------------------ */
/* Client context                                                      */
/* ------------------------------------------------------------------ */

export interface ClientContext {
  timezone: string;
  /** Offset from UTC in minutes, e.g. -330 for IST. */
  utcOffset: number;
  /** Local hour 0–23 in the visitor's own timezone. */
  localHour: number;
  language: string;
  languages: string[];
  screen: string;
  viewport: string;
  device: 'mobile' | 'tablet' | 'desktop';
  touch: boolean;
  online: boolean;
  prefersReducedMotion: boolean;
}

function classifyDevice(): ClientContext['device'] {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = Math.min(window.innerWidth, window.innerHeight) < 768;
  const small = Math.min(window.innerWidth, window.innerHeight) < 1024;
  if (narrow) return 'mobile';
  if (small || coarse) return 'tablet';
  return 'desktop';
}

export function getClientContext(): ClientContext {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
    utcOffset: new Date().getTimezoneOffset(),
    localHour: new Date().getHours(),
    language: navigator.language || 'unknown',
    languages: Array.from(navigator.languages ?? []),
    screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    device: classifyDevice(),
    touch: navigator.maxTouchPoints > 0,
    online: navigator.onLine,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

/* ------------------------------------------------------------------ */
/* Session state                                                       */
/* ------------------------------------------------------------------ */

export interface SessionState {
  visitorId: string;
  sessionId: string;
  startedAt: string;
  lastSeenAt: string;
  /** Ordered, de-duplicated list of paths visited. */
  pages: string[];
  /** Highest scroll depth seen, 0–100. */
  maxScrollDepth: number;
  /** Which service pages were opened, by slug. */
  servicesViewed: string[];
  events: TrackedEvent[];
  chatbotOpened: boolean;
  chatbotMessages: number;
  /** Service slug the visitor expressed interest in via chat or form. */
  primaryInterest: string | null;
  formStarted: boolean;
  formSubmitted: boolean;
  /** Cumulative active time on the page, in seconds. */
  activeSeconds: number;
  referrer: string;
  landingPage: string;
  utm: Record<string, string>;
  context: ClientContext;
}

/** How many entries we keep in the rolling page list before collapsing. */
const MAX_PAGES = 24;
const MAX_EVENTS = 120;

function readUtm(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 120);
  }
  return out;
}

function createState(): SessionState {
  const now = new Date().toISOString();
  const landing = `${window.location.pathname}${window.location.search}`;
  return {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    startedAt: now,
    lastSeenAt: now,
    pages: [],
    maxScrollDepth: 0,
    servicesViewed: [],
    events: [],
    chatbotOpened: false,
    chatbotMessages: 0,
    primaryInterest: null,
    formStarted: false,
    formSubmitted: false,
    activeSeconds: 0,
    referrer: document.referrer || 'direct',
    landingPage: landing,
    utm: readUtm(),
    context: getClientContext(),
  };
}

let state: SessionState | null = null;

export function getSession(): SessionState {
  if (!state) state = createState();
  return state;
}

/* ------------------------------------------------------------------ */
/* Recording                                                           */
/* ------------------------------------------------------------------ */

/** Records a page view. Called by the router on every navigation. */
export function recordPageView(path: string): void {
  if (!trackingAllowed()) return;
  const session = getSession();

  if (!session.pages.includes(path)) {
    session.pages.push(path);
    if (session.pages.length > MAX_PAGES) session.pages = session.pages.slice(-MAX_PAGES);
  }

  session.lastSeenAt = new Date().toISOString();
  session.context = getClientContext();
  queue({ event: 'page_view', path });
}

/** Records a scroll-depth milestone. Only fires at 25/50/75/100. */
const depthReported = new Set<number>();

export function recordScrollDepth(percent: number): void {
  if (!trackingAllowed()) return;
  const session = getSession();
  const rounded = Math.round(percent);

  if (rounded > session.maxScrollDepth) session.maxScrollDepth = rounded;

  for (const milestone of [25, 50, 75, 100]) {
    if (rounded >= milestone && !depthReported.has(milestone)) {
      depthReported.add(milestone);
      queue({ event: 'scroll_depth', depth: milestone, path: window.location.pathname });
      break;
    }
  }
}

/** Notes that a service page was opened, so intent can be inferred later. */
export function recordServiceView(slug: string): void {
  if (!trackingAllowed()) return;
  const session = getSession();
  if (!session.servicesViewed.includes(slug)) session.servicesViewed.push(slug);
  if (!session.primaryInterest) session.primaryInterest = slug;
}

/** Generic event funnel. Replaces the old fire-and-forget CustomEvent. */
export function track(event: string, payload: Record<string, unknown> = {}): void {
  if (!trackingAllowed()) return;
  queue({ event, ...payload });
}

let events: TrackedEvent[] = [];

function queue(event: TrackedEvent): void {
  events.push(event);
  if (events.length > MAX_EVENTS) events = events.slice(-MAX_EVENTS);
  if (events.length >= FLUSH_EVENT_THRESHOLD) void flush('threshold');
}

/* ------------------------------------------------------------------ */
/* Transport                                                           */
/* ------------------------------------------------------------------ */

export type FlushReason = 'interval' | 'threshold' | 'pagehide' | 'submit' | 'manual';

function endpoint(): string | null {
  const configured = (import.meta.env.VITE_SESSION_ENDPOINT as string | undefined) ?? '';
  return configured || '/api/session';
}

let inFlight = false;

export async function flush(reason: FlushReason = 'manual'): Promise<void> {
  if (inFlight || !trackingAllowed()) return;

  const url = endpoint();
  if (!url) return;

  // Nothing worth sending yet.
  if (events.length === 0 && reason !== 'manual') return;

  inFlight = true;
  const session = getSession();
  session.lastSeenAt = new Date().toISOString();
  const batch = events;
  events = [];

  const payload = JSON.stringify({ ...session, events: batch, flushReason: reason });

  try {
    if (reason === 'pagehide' && navigator.sendBeacon) {
      // sendBeacon survives the page being torn down, which fetch does not.
      const ok = navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      if (!ok) throw new Error('sendBeacon rejected');
    } else {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: reason === 'pagehide',
      });
      if (!response.ok) throw new Error(`session flush failed (${response.status})`);
    }
  } catch {
    // Never surface an analytics failure to the visitor, but do not lose the
    // batch either — put it back so the next flush carries it.
    events = [...batch, ...events].slice(-MAX_EVENTS);
  } finally {
    inFlight = false;
  }
}

let installed = false;

/**
 * Starts the timer and the page-hide listener. Safe to call from anywhere;
 * only the first call does anything.
 */
export function installSessionTracking(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  if (!trackingAllowed()) return;

  window.setInterval(() => void flush('interval'), FLUSH_INTERVAL_MS);
  window.addEventListener('pagehide', () => void flush('pagehide'));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush('pagehide');
  });
}

/* ------------------------------------------------------------------ */
/* Form / chatbot helpers                                              */
/* ------------------------------------------------------------------ */

export function markFormStarted(): void {
  getSession().formStarted = true;
}

export function markFormSubmitted(service: string): void {
  const session = getSession();
  session.formSubmitted = true;
  session.primaryInterest = service;
  void flush('submit');
}

export function recordChatbotOpened(): void {
  getSession().chatbotOpened = true;
}

export function recordChatbotMessage(service: string | null): void {
  const session = getSession();
  session.chatbotMessages += 1;
  if (service && !session.primaryInterest) session.primaryInterest = service;
}

/** Accumulated active time, driven by the page view hook. */
export function addActiveTime(seconds: number): void {
  getSession().activeSeconds += seconds;
}

/**
 * The client-side snapshot the booking form attaches to a submission, so the
 * server can file the lead in Jira with the full context of the visit that
 * produced it.
 */
export function buildLeadContext(): Record<string, unknown> {
  const session = getSession();
  return {
    visitorId: session.visitorId,
    sessionId: session.sessionId,
    startedAt: session.startedAt,
    activeSeconds: session.activeSeconds,
    maxScrollDepth: session.maxScrollDepth,
    pages: session.pages.slice(-12),
    servicesViewed: session.servicesViewed,
    chatbotOpened: session.chatbotOpened,
    chatbotMessages: session.chatbotMessages,
    referrer: session.referrer,
    landingPage: session.landingPage,
    timezone: session.context.timezone,
    localHour: session.context.localHour,
    device: session.context.device,
    viewport: session.context.viewport,
    language: session.context.language,
    utm: session.utm,
  };
}