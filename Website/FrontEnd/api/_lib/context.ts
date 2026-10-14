import type { IncomingMessage } from 'node:http';

/**
 * Request context.
 *
 * Everything here is derived server-side. Nothing the client sends about its
 * own address or user agent is trusted — the client is only trusted for
 * things it alone can know (timezone, screen size, language).
 *
 * On the India DPDP Act 2023: an IP address is personal data. `maskIp` is the
 * default because a truncated address is still enough to spot repeat traffic
 * and abuse patterns, and does not identify a household on its own. Set
 * `STORE_RAW_IP=true` only if you have a lawful basis and a retention policy.
 */

export interface RequestContext {
  /** Full client address, when available and permitted. */
  ip: string | null;
  /** Always present. Truncated unless `STORE_RAW_IP=true`. */
  ipForStorage: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  /** Vercel network/ASN context, useful for telling corporate NAT from ISPs. */
  network: string | null;
  userAgent: string | null;
  browser: string;
  browserVersion: string;
  os: string;
  device: 'mobile' | 'tablet' | 'desktop' | 'bot';
  isBot: boolean;
  /** Country the request reached Vercel from, if the header is present. */
  edgeRegion: string | null;
}

function firstHeader(req: IncomingMessage, name: string): string | null {
  const value = req.headers[name];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/**
 * Extracts the client address.
 *
 * Vercel sets `x-real-ip` and `x-forwarded-for`; the left-most entry in
 * `x-forwarded-for` is the original client.
 */
export function clientIp(req: IncomingMessage): string | null {
  const forwarded = firstHeader(req, 'x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return firstHeader(req, 'x-real-ip') ?? firstHeader(req, 'x-vercel-forwarded-for');
}

/**
 * Truncates an IPv4 address to its first two octets (`203.0.x.x`) and an
 * IPv6 address to its first two groups. Enough for frequency analysis, not
 * enough to identify a person.
 */
export function maskIp(ip: string | null): string | null {
  if (!ip) return null;

  if (ip.includes(':')) {
    const groups = ip.split(':').filter(Boolean);
    return `${groups.slice(0, 2).join(':')}::/64`;
  }

  const octets = ip.split('.');
  if (octets.length !== 4) return ip.slice(0, 12);
  return `${octets[0]}.${octets[1]}.x.x`;
}

const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|mediapartners|facebookexternalhit|embedly|quora link preview|whatsapp|telegrambot|lighthouse|headlesschrome|axios\/|node-fetch|postmanruntime|insomnia|curl\/|wget\/|python-requests|scrapy|semrush|ahrefs|dataprovider|google-inspectiontool/i;

const BROWSERS: { name: string; re: RegExp; version: number }[] = [
  { name: 'Edge', re: /Edg(?:e|A|iOS)?\/([\d.]+)/, version: 1 },
  { name: 'Chrome', re: /(?:Chrome|CriOS)\/([\d.]+)/, version: 1 },
  { name: 'Firefox', re: /(?:Firefox|FxiOS)\/([\d.]+)/, version: 1 },
  { name: 'Safari', re: /Version\/([\d.]+).*Safari/, version: 1 },
  { name: 'Samsung Internet', re: /SamsungBrowser\/([\d.]+)/, version: 1 },
  { name: 'Opera', re: /(?:OPR|Opera)\/([\d.]+)/, version: 1 },
];

const OPERATING_SYSTEMS: { name: string; re: RegExp }[] = [
  { name: 'Windows', re: /Windows NT/ },
  { name: 'iOS', re: /(iPhone|iPad|iPod)/ },
  { name: 'Android', re: /Android/ },
  { name: 'macOS', re: /(Macintosh|Mac OS X)/ },
  { name: 'ChromeOS', re: /CrOS/ },
  { name: 'Linux', re: /(Linux|X11)/ },
];

export function detectBrowser(userAgent: string): { browser: string; browserVersion: string } {
  // Edge and Opera both claim to be Chrome, so they are matched first.
  for (const candidate of BROWSERS) {
    const match = candidate.re.exec(userAgent);
    if (match) return { browser: candidate.name, browserVersion: match[1] ?? '' };
  }
  return { browser: 'Other', browserVersion: '' };
}

export function detectOs(userAgent: string): string {
  for (const candidate of OPERATING_SYSTEMS) {
    if (candidate.re.test(userAgent)) return candidate.name;
  }
  return 'Other';
}

export function isBot(userAgent: string): boolean {
  return BOT_PATTERN.test(userAgent);
}

export function detectDevice(
  userAgent: string,
  bot: boolean,
): RequestContext['device'] {
  if (bot) return 'bot';
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(userAgent)) return 'tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

/** Builds the full server-side context for a request. */
export function buildRequestContext(
  req: IncomingMessage,
  options: { storeRawIp: boolean },
): RequestContext {
  const userAgent = firstHeader(req, 'user-agent');
  const ip = clientIp(req);
  const ua = userAgent ?? '';
  const bot = userAgent ? isBot(ua) : false;
  const { browser, browserVersion } = detectBrowser(ua);

  return {
    ip,
    ipForStorage: options.storeRawIp ? ip : maskIp(ip),
    country: firstHeader(req, 'x-vercel-ip-country'),
    region: firstHeader(req, 'x-vercel-ip-country-region'),
    city: firstHeader(req, 'x-vercel-ip-city'),
    network: firstHeader(req, 'x-vercel-ip-network') ?? firstHeader(req, 'x-vercel-asn'),
    userAgent,
    browser,
    browserVersion,
    os: detectOs(ua),
    device: detectDevice(ua, bot),
    isBot: bot,
    edgeRegion: firstHeader(req, 'x-vercel-id'),
  };
}

/** True when the caller's address is Vercel's own infrastructure. */
export function isVercelInternal(req: IncomingMessage): boolean {
  return firstHeader(req, 'x-vercel-id') !== null && clientIp(req) === null;
}