import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionConfig } from './_lib/config.js';
import { buildRequestContext, isVercelInternal } from './_lib/context.js';
import { findReturningSession, normalizeSessionRecord, upsertSession, type SessionPayload } from './_lib/session.js';
import { findReturningRedisSession, pingRedisSessionStore, upsertRedisSession } from './_lib/redis-session.js';

/**
 * Visitor session endpoint.
 *
 * Called by the browser on a timer and on page hide. One row per session,
 * updated in place — the sheet grows with *sessions*, not with page views.
 *
 * The endpoint never fails the page. If the sheet is unreachable the visitor
 * gets a 204 and the client keeps its batch for the next attempt, because a
 * failed analytics write is not worth showing anyone an error.
 */

const MAX_BODY_BYTES = 24_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET' && req.query?.health === '1') {
    res.setHeader('Cache-Control', 'no-store');
    try {
      const config = sessionConfig();
      if (!config.redisUrl) return res.status(200).json({ ok: true, storage: 'sheets' });
      await pingRedisSessionStore(config.redisUrl);
      return res.status(200).json({ ok: true, storage: 'redis' });
    } catch {
      return res.status(503).json({ ok: false, storage: 'unavailable' });
    }
  }

  if (req.method === 'GET' && req.query?.returning === '1') {
    res.setHeader('Cache-Control', 'no-store');
    const visitorId = typeof req.query.visitorId === 'string' ? req.query.visitorId : '';
    if (!/^vis_[a-f0-9]{24}$/.test(visitorId)) {
      return res.status(400).json({ returning: false });
    }

    try {
      const config = sessionConfig();
      let summary = config.redisUrl
        ? await findReturningRedisSession(config.redisUrl, visitorId)
        : null;
      if (!summary && config.sheets && config.google) {
        summary = await findReturningSession(
          config.sheets,
          config.google,
          config.sessionsTab,
          visitorId,
        );
      }
      return res.status(200).json(summary ? { returning: true, ...summary } : { returning: false });
    } catch {
      return res.status(503).json({ returning: false });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Liveness probe. Deliberately does not touch Sheets or Google.
  if (req.query?.health === '1') {
    return res.status(200).json({ ok: true, at: new Date().toISOString() });
  }

  // Vercel's own prefetch and health probes must not create sessions.
  if (isVercelInternal(req)) {
    return res.status(204).end();
  }

  let config;
  try {
    config = sessionConfig();
  } catch (error) {
    // Session tracking is a nice-to-have; never surface it as a page error.
    console.warn('[session] not configured:', (error as Error).message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
  }

  const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  if (raw.length > MAX_BODY_BYTES) {
    return res.status(413).json({ error: 'payload too large' });
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(raw) as SessionPayload;
  } catch {
    return res.status(400).json({ error: 'invalid JSON' });
  }

  const request = buildRequestContext(req, { storeRawIp: config.storeRawIp });

  // Bots are recorded so they can be filtered out of the analysis, but they
  // do not pollute the funnel — they are still stored, with isBot set.
  if (request.isBot && !payload.sessionId) {
    return res.status(204).end();
  }

  try {
    let result: { mode: 'created' | 'updated'; row?: number };
    let storage: 'redis' | 'sheets';

    if (config.redisUrl) {
      try {
        result = await upsertRedisSession(
          config.redisUrl,
          normalizeSessionRecord(payload, request),
        );
        storage = 'redis';
      } catch (error) {
        if (!config.sheets || !config.google) throw error;
        console.warn('[session] Redis write failed; using Sheets fallback');
        result = await upsertSession(config.sheets, config.google, config.sessionsTab, payload, request);
        storage = 'sheets';
      }
    } else if (config.sheets && config.google) {
      result = await upsertSession(config.sheets, config.google, config.sessionsTab, payload, request);
      storage = 'sheets';
    } else {
      return res.status(204).end();
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      mode: result.mode,
      storage,
      session: payload.sessionId ?? null,
      at: new Date().toISOString(),
    });
  } catch (error) {
    // Log the detail, return nothing. The client retries with the same batch.
    console.error('[session] upsert failed:', (error as Error).message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
  }
}