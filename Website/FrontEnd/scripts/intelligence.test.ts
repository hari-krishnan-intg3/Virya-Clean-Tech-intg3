import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SESSION_HEADERS, sheetColumnName } from '../api/_lib/session.js';
import { getVercelAnalytics } from '../api/_lib/vercel-analytics.js';
import { sessionHasExpired, SESSION_IDLE_MS } from '../src/lib/session';
import { parseChatSnapshot, parseVisitorMemory } from '../src/lib/visitorMemory';

const now = Date.parse('2026-10-14T00:00:00.000Z');

function visitorRaw(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    visitorId: 'vis_test',
    sessionId: 'ses_test',
    lastPath: '/services/solar',
    lastSeenAt: new Date(now - 60_000).toISOString(),
    primaryInterest: 'solar',
    servicesViewed: ['solar'],
    ...overrides,
  });
}

function chatRaw(messages: unknown[], savedAt = new Date(now - 60_000).toISOString()): string {
  return JSON.stringify({ visitorId: 'vis_test', savedAt, messages });
}

test('column 1 maps to A', () => assert.equal(sheetColumnName(1), 'A'));
test('column 26 maps to Z', () => assert.equal(sheetColumnName(26), 'Z'));
test('column 27 maps to AA', () => assert.equal(sheetColumnName(27), 'AA'));
test('session header column 35 maps to AI', () => assert.equal(sheetColumnName(35), 'AI'));
test('column 36 maps to AJ', () => assert.equal(sheetColumnName(36), 'AJ'));
test('session headers end at AJ after adding UTC offset', () => assert.equal(sheetColumnName(SESSION_HEADERS.length), 'AJ'));
test('active session does not expire before the idle limit', () => assert.equal(sessionHasExpired(now - SESSION_IDLE_MS + 1, now), false));
test('session expires after thirty minutes idle', () => assert.equal(sessionHasExpired(now - SESSION_IDLE_MS - 1, now), true));
test('session expires when its activity timestamp is invalid', () => assert.equal(sessionHasExpired(Number.NaN, now), true));
test('valid visitor memory is restored', () => assert.equal(parseVisitorMemory(visitorRaw(), now)?.lastPath, '/services/solar'));
test('null visitor memory is ignored', () => assert.equal(parseVisitorMemory(null, now), null));
test('malformed visitor memory is ignored', () => assert.equal(parseVisitorMemory('{', now), null));
test('external visitor paths are rejected', () => assert.equal(parseVisitorMemory(visitorRaw({ lastPath: 'https://evil.invalid' }), now), null));
test('protocol-relative visitor paths are rejected', () => assert.equal(parseVisitorMemory(visitorRaw({ lastPath: '//evil.invalid' }), now), null));
test('backslash visitor paths are rejected', () => assert.equal(parseVisitorMemory(visitorRaw({ lastPath: '/\\evil' }), now), null));
test('visitor path query strings are removed', () => assert.equal(parseVisitorMemory(visitorRaw({ lastPath: '/services/solar?email=private' }), now)?.lastPath, '/services/solar'));
test('expired visitor memory is ignored', () => assert.equal(parseVisitorMemory(visitorRaw({ lastSeenAt: new Date(now - 31 * 86400_000).toISOString() }), now), null));
test('future visitor memory is ignored', () => assert.equal(parseVisitorMemory(visitorRaw({ lastSeenAt: new Date(now + 10 * 60_000).toISOString() }), now), null));
test('visitor memory without an ID is ignored', () => assert.equal(parseVisitorMemory(visitorRaw({ visitorId: '' }), now), null));
test('visitor memory without a session is ignored', () => assert.equal(parseVisitorMemory(visitorRaw({ sessionId: '' }), now), null));
test('remembered service list is capped', () => assert.equal(parseVisitorMemory(visitorRaw({ servicesViewed: Array.from({ length: 12 }, (_, index) => `service-${index}`) }), now)?.servicesViewed.length, 10));
test('chat visitor and assistant messages are retained', () => assert.deepEqual(parseChatSnapshot(chatRaw([{ role: 'visitor', text: 'solar' }, { role: 'assistant', text: 'Tell me about your site.' }]), now).map((item) => item.role), ['visitor', 'assistant']));
test('chat history is capped at twenty messages', () => assert.equal(parseChatSnapshot(chatRaw(Array.from({ length: 24 }, () => ({ role: 'visitor', text: 'hello' }))), now).length, 20));
test('chat message text is capped at four hundred characters', () => assert.equal(parseChatSnapshot(chatRaw([{ role: 'visitor', text: 'x'.repeat(450) }]), now)[0]?.text.length, 400));
test('unknown chat roles are discarded', () => assert.deepEqual(parseChatSnapshot(chatRaw([{ role: 'system', text: 'hidden' }]), now), []));
test('chat messages without text are discarded', () => assert.deepEqual(parseChatSnapshot(chatRaw([{ role: 'visitor', text: 7 }]), now), []));
test('malformed chat snapshots are ignored', () => assert.deepEqual(parseChatSnapshot('{', now), []));
test('expired chat history is ignored', () => assert.deepEqual(parseChatSnapshot(chatRaw([{ role: 'visitor', text: 'old' }], new Date(now - 31 * 86400_000).toISOString()), now), []));
test('future chat history is ignored', () => assert.deepEqual(parseChatSnapshot(chatRaw([{ role: 'visitor', text: 'future' }], new Date(now + 10 * 60_000).toISOString()), now), []));
test('empty chat history remains empty', () => assert.deepEqual(parseChatSnapshot(chatRaw([], new Date(now).toISOString()), now), []));

test('Vercel totals and top pages are parsed from API responses', async () => {
  const originalFetch = globalThis.fetch;
  const urls: URL[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    urls.push(url);
    const data = url.pathname.endsWith('/visits/count')
      ? { pageviews: 91, visitors: 27 }
      : [{ requestPath: '/services/solar', pageviews: 40, visitors: 19 }];
    return new Response(JSON.stringify({ data }), { status: 200 });
  }) as typeof fetch;

  try {
    const result = await getVercelAnalytics(
      { accessToken: 'test-token', projectId: 'test-project' },
      new Date('2026-10-01T00:00:00.000Z'),
      new Date('2026-10-02T00:00:00.000Z'),
    );
    assert.equal(result.pageViews, 91);
    assert.equal(result.uniqueVisitors, 27);
    assert.equal(result.topPages[0]?.path, '/services/solar');
    assert.equal(urls.length, 2);
    assert.ok(urls.every((url) => url.searchParams.get('projectId') === 'test-project'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Vercel query uses bearer auth and a request-path breakdown', async () => {
  const originalFetch = globalThis.fetch;
  const requests: { url: URL; authorization: string | null }[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input));
    requests.push({
      url,
      authorization: new Headers(init?.headers).get('Authorization'),
    });
    const data = url.pathname.endsWith('/visits/count')
      ? { pageviews: 1, visitors: 1 }
      : [];
    return new Response(JSON.stringify({ data }), { status: 200 });
  }) as typeof fetch;

  try {
    await getVercelAnalytics(
      { accessToken: 'test-token', projectId: 'test-project', teamSlug: 'test-team' },
      new Date('2026-10-01T00:00:00.000Z'),
      new Date('2026-10-02T00:00:00.000Z'),
    );
    assert.ok(requests.every((request) => request.authorization === 'Bearer test-token'));
    assert.ok(requests.every((request) => request.url.searchParams.get('slug') === 'test-team'));
    assert.equal(requests[1]?.url.searchParams.get('by'), '["requestPath"]');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Vercel API failures surface status without response body', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response('private response body', { status: 403 })) as typeof fetch;

  try {
    await assert.rejects(
      getVercelAnalytics(
        { accessToken: 'test-token', projectId: 'test-project' },
        new Date('2026-10-01T00:00:00.000Z'),
        new Date('2026-10-02T00:00:00.000Z'),
      ),
      /Vercel Web Analytics request failed \(403\)/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});