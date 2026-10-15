const VERCEL_API_ORIGIN = 'https://api.vercel.com';
const ANALYTICS_QUERY_PATH = '/v1/query/web-analytics/';

export async function queryVercel<T>(url: URL, accessToken: string): Promise<T> {
  if (url.origin !== VERCEL_API_ORIGIN || !url.pathname.startsWith(ANALYTICS_QUERY_PATH)) {
    throw new Error('Vercel controller only permits Web Analytics queries');
  }
  if (!accessToken.trim()) throw new Error('Vercel controller token is not configured');

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Vercel Web Analytics request failed (${response.status})`);
  }

  return (await response.json()) as T;
}