import { getSession, getSessionId, getVisitorId, trackingAllowed } from './session';

export const VISITOR_MEMORY_KEY = 'virya.visitor.memory';
export const CHAT_HISTORY_KEY = 'virya.chat.history';

const MEMORY_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_CHAT_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 400;

export interface VisitorMemory {
  visitorId: string;
  sessionId: string;
  lastPath: string;
  lastSeenAt: string;
  primaryInterest: string | null;
  servicesViewed: string[];
}

export interface SavedChatMessage {
  role: 'visitor' | 'assistant';
  text: string;
}

interface ChatSnapshot {
  visitorId: string;
  savedAt: string;
  messages: SavedChatMessage[];
}

function safePath(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null;
  if (value.includes('\\') || value.length > 160) return null;
  const hashIndex = value.indexOf('#');
  const route = (hashIndex >= 0 ? value.slice(0, hashIndex) : value).split('?', 1)[0] || '/';
  const fragment = hashIndex >= 0 ? value.slice(hashIndex + 1) : '';
  return /^[A-Za-z0-9_-]{1,80}$/.test(fragment) ? `${route}#${fragment}` : route;
}

export function parseVisitorMemory(raw: string | null, now = Date.now()): VisitorMemory | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<VisitorMemory>;
    const lastSeen = Date.parse(value.lastSeenAt ?? '');
    const lastPath = safePath(value.lastPath);
    if (
      !value.visitorId ||
      !value.sessionId ||
      !lastPath ||
      !Number.isFinite(lastSeen) ||
      now - lastSeen > MEMORY_TTL_MS ||
      lastSeen > now + 5 * 60_000
    ) {
      return null;
    }

    return {
      visitorId: value.visitorId,
      sessionId: value.sessionId,
      lastPath,
      lastSeenAt: new Date(lastSeen).toISOString(),
      primaryInterest: typeof value.primaryInterest === 'string' ? value.primaryInterest : null,
      servicesViewed: Array.isArray(value.servicesViewed)
        ? value.servicesViewed.filter((service): service is string => typeof service === 'string').slice(0, 10)
        : [],
    };
  } catch {
    return null;
  }
}

export function readVisitorMemory(): VisitorMemory | null {
  if (!trackingAllowed()) return null;

  try {
    const memory = parseVisitorMemory(localStorage.getItem(VISITOR_MEMORY_KEY));
    if (!memory || memory.visitorId !== getVisitorId() || memory.sessionId === getSessionId()) {
      return null;
    }
    return memory;
  } catch {
    return null;
  }
}

/** Confirms a prior visit against the consented server-side Sessions sheet. */
export async function readReturningVisitorFromSheet(
  memory: VisitorMemory | null = readVisitorMemory(),
): Promise<VisitorMemory | null> {
  if (!trackingAllowed()) return null;
  if (!memory) return null;

  const configuredEndpoint = (import.meta.env.VITE_SESSION_ENDPOINT as string | undefined) ?? '';
  const endpoint = new URL(configuredEndpoint || '/api/session', window.location.origin);
  endpoint.searchParams.set('returning', '1');
  endpoint.searchParams.set('visitorId', memory.visitorId);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
      signal: controller.signal,
    });
    if (!response.ok) return null;

    const result = (await response.json()) as {
      returning?: unknown;
      lastSeenAt?: unknown;
      lastPath?: unknown;
      primaryInterest?: unknown;
      servicesViewed?: unknown;
    };
    const lastSeen = Date.parse(typeof result.lastSeenAt === 'string' ? result.lastSeenAt : '');
    if (
      result.returning !== true ||
      !Number.isFinite(lastSeen) ||
      Date.now() - lastSeen > MEMORY_TTL_MS ||
      lastSeen > Date.now() + 5 * 60_000
    ) {
      return null;
    }

    return {
      ...memory,
      lastPath: safePath(result.lastPath) ?? memory.lastPath,
      lastSeenAt: new Date(lastSeen).toISOString(),
      primaryInterest:
        typeof result.primaryInterest === 'string' ? result.primaryInterest : null,
      servicesViewed: Array.isArray(result.servicesViewed)
        ? result.servicesViewed
            .filter((service): service is string => typeof service === 'string')
            .slice(0, 10)
        : [],
    };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function saveVisitorProgress(path: string, primaryInterest: string | null): void {
  if (!trackingAllowed()) return;
  const lastPath = safePath(path);
  if (!lastPath) return;

  try {
    const session = getSession();
    const memory: VisitorMemory = {
      visitorId: session.visitorId,
      sessionId: session.sessionId,
      lastPath,
      lastSeenAt: new Date().toISOString(),
      primaryInterest: primaryInterest ?? session.primaryInterest,
      servicesViewed: session.servicesViewed.slice(-10),
    };
    localStorage.setItem(VISITOR_MEMORY_KEY, JSON.stringify(memory));
  } catch {
    // Storage can be unavailable in private browsing; the site still works.
  }
}

export function parseChatSnapshot(raw: string | null, now = Date.now()): SavedChatMessage[] {
  if (!raw) return [];

  try {
    const snapshot = JSON.parse(raw) as Partial<ChatSnapshot>;
    const savedAt = Date.parse(snapshot.savedAt ?? '');
    if (
      !snapshot.visitorId ||
      !Number.isFinite(savedAt) ||
      now - savedAt > MEMORY_TTL_MS ||
      savedAt > now + 5 * 60_000 ||
      !Array.isArray(snapshot.messages)
    ) {
      return [];
    }

    return snapshot.messages
      .filter(
        (message): message is SavedChatMessage =>
          Boolean(message) &&
          (message.role === 'visitor' || message.role === 'assistant') &&
          typeof message.text === 'string',
      )
      .slice(-MAX_CHAT_MESSAGES)
      .map((message) => ({ role: message.role, text: message.text.slice(0, MAX_MESSAGE_LENGTH) }));
  } catch {
    return [];
  }
}

export function readChatHistory(): SavedChatMessage[] {
  if (!trackingAllowed()) return [];

  try {
    const snapshot = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) ?? 'null') as ChatSnapshot | null;
    if (!snapshot || snapshot.visitorId !== getVisitorId()) return [];
    return parseChatSnapshot(JSON.stringify(snapshot));
  } catch {
    return [];
  }
}

export function saveChatHistory(messages: SavedChatMessage[]): void {
  if (!trackingAllowed()) return;

  try {
    const snapshot: ChatSnapshot = {
      visitorId: getVisitorId(),
      savedAt: new Date().toISOString(),
      messages: messages
        .slice(-MAX_CHAT_MESSAGES)
        .map(({ role, text }) => ({ role, text: text.slice(0, MAX_MESSAGE_LENGTH) })),
    };
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage can be unavailable in private browsing; the site still works.
  }
}