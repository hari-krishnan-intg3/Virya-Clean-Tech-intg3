import { createClient } from 'redis';
import type { ReturningSessionSummary, SessionRecord } from './session.js';

const SESSION_TTL_SECONDS = 90 * 24 * 60 * 60;
const MAX_VISITOR_SESSIONS = 100;
const SESSION_ID_PATTERN = /^ses_[a-f0-9]{24}$/;
const VISITOR_ID_PATTERN = /^vis_[a-f0-9]{24}$/;

type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;
let clientUrl: string | null = null;
let connection: Promise<RedisClient> | null = null;

function getClient(url: string): RedisClient {
  if (!client || clientUrl !== url) {
    client = createClient({
      url,
      socket: { connectTimeout: 5000, reconnectStrategy: false },
    });
    client.on('error', () => console.error('[session] Redis connection error'));
    clientUrl = url;
    connection = null;
  }
  return client;
}

async function connect(url: string): Promise<RedisClient> {
  const activeClient = getClient(url);
  if (activeClient.isOpen) return activeClient;
  if (!connection) {
    connection = activeClient.connect().then(() => activeClient).finally(() => {
      connection = null;
    });
  }
  return connection;
}

function sessionKey(sessionId: string): string {
  return `virya:session:${sessionId}`;
}

function visitorKey(visitorId: string): string {
  return `virya:visitor-sessions:${visitorId}`;
}

export async function pingRedisSessionStore(url: string): Promise<void> {
  const activeClient = await connect(url);
  await activeClient.ping();
}

export async function upsertRedisSession(
  url: string,
  record: SessionRecord,
): Promise<{ mode: 'created' | 'updated' }> {
  if (!SESSION_ID_PATTERN.test(record.sessionId)) throw new Error('Invalid session id');
  const activeClient = await connect(url);
  const key = sessionKey(record.sessionId);
  const exists = await activeClient.exists(key);
  const visitorId = VISITOR_ID_PATTERN.test(record.visitorId) ? record.visitorId : '';
  const transaction = activeClient.multi().set(key, JSON.stringify(record), {
    EX: SESSION_TTL_SECONDS,
  });

  if (visitorId) {
    const index = visitorKey(visitorId);
    const parsedLastSeen = Date.parse(record.lastSeenAt);
    transaction
      .zAdd(index, {
        score: Number.isFinite(parsedLastSeen) ? parsedLastSeen : Date.now(),
        value: record.sessionId,
      })
      .expire(index, SESSION_TTL_SECONDS)
      .zRemRangeByRank(index, 0, -MAX_VISITOR_SESSIONS - 1);
  }

  await transaction.exec();
  return { mode: exists ? 'updated' : 'created' };
}

function safeSessionPath(value: string): string | null {
  const path = value.split(/[?#]/, 1)[0];
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return /^\/(?:[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*)?$/.test(path) ? path : null;
}

export async function findReturningRedisSession(
  url: string,
  visitorId: string,
): Promise<ReturningSessionSummary | null> {
  if (!VISITOR_ID_PATTERN.test(visitorId)) return null;
  const activeClient = await connect(url);
  const index = visitorKey(visitorId);
  const ids = await activeClient.zRange(index, 0, -1, { REV: true });

  for (const id of ids) {
    if (!SESSION_ID_PATTERN.test(id)) continue;
    const raw = await activeClient.get(sessionKey(id));
    if (!raw) {
      await activeClient.zRem(index, id);
      continue;
    }

    try {
      const record = JSON.parse(raw) as SessionRecord;
      const seenAt = Date.parse(record.lastSeenAt);
      if (!Number.isFinite(seenAt)) continue;
      const pages = Array.isArray(record.pages) ? record.pages : [];
      const lastPath = pages.slice().reverse().map(safeSessionPath).find(Boolean) ?? '/';
      const servicesViewed = Array.isArray(record.servicesViewed)
        ? record.servicesViewed.filter((service) => /^[a-z-]{1,40}$/.test(service)).slice(0, 10)
        : [];

      return {
        lastSeenAt: new Date(seenAt).toISOString(),
        lastPath,
        primaryInterest: /^[a-z-]{1,40}$/.test(record.primaryInterest ?? '')
          ? record.primaryInterest
          : null,
        servicesViewed,
      };
    } catch {
      continue;
    }
  }

  return null;
}