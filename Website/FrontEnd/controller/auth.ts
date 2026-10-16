import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export type ControllerRole = 'operator' | 'admin';

export interface ControllerUser {
  id: string;
  username: string;
  role: ControllerRole;
}

const SESSION_COOKIE = 'virya_controller_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const BCRYPT_ROUNDS = 12;
let schemaReady: Promise<void> | undefined;

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Controller database is not configured');

  const sql = neon(databaseUrl);
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS controller_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(32) NOT NULL UNIQUE,
        password_hash VARCHAR(100) NOT NULL,
        role VARCHAR(16) NOT NULL CHECK (role IN ('operator', 'admin')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
      .then(() => undefined)
      .catch((error) => {
        schemaReady = undefined;
        throw error;
      });
  }

  return schemaReady.then(() => sql);
}

function sessionSecret(): string {
  const secret = process.env.CONTROLLER_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('Controller session secret must be at least 32 bytes');
  }
  return secret;
}

export function assertControllerSessionConfigured(): void {
  sessionSecret();
}

function sign(payload: string): string {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}

export async function createControllerUser(
  username: string,
  password: string,
  role: ControllerRole,
): Promise<ControllerUser> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const sql = await getDatabase();
  const rows = await sql`
    INSERT INTO controller_users (username, password_hash, role)
    VALUES (${username}, ${passwordHash}, ${role})
    RETURNING id, username, role
  `;
  return rows[0] as ControllerUser;
}

export async function verifyControllerCredentials(
  username: string,
  password: string,
): Promise<ControllerUser | null> {
  const sql = await getDatabase();
  const rows = await sql`
    SELECT id, username, password_hash, role
    FROM controller_users
    WHERE username = ${username}
    LIMIT 1
  `;
  const user = rows[0] as (ControllerUser & { password_hash: string }) | undefined;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;

  return { id: user.id, username: user.username, role: user.role };
}

async function findControllerUser(id: string): Promise<ControllerUser | null> {
  const sql = await getDatabase();
  const rows = await sql`
    SELECT id, username, role
    FROM controller_users
    WHERE id = ${id}::uuid
    LIMIT 1
  `;
  return (rows[0] as ControllerUser | undefined) ?? null;
}

function sessionToken(user: ControllerUser): string {
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function sessionUserId(token: string): string | null {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;

  try {
    const expected = Buffer.from(sign(payload), 'base64url');
    const actual = Buffer.from(signature, 'base64url');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: unknown;
      exp?: unknown;
    };
    if (
      typeof claims.sub !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(claims.sub) ||
      typeof claims.exp !== 'number' ||
      claims.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return claims.sub;
  } catch {
    return null;
  }
}

function readSessionCookie(request: VercelRequest): string | null {
  const cookie = request.headers.cookie;
  if (typeof cookie !== 'string') return null;
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  try {
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function setControllerSession(response: VercelResponse, user: ControllerUser): void {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  response.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${sessionToken(user)}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure ? '; Secure' : ''}`,
  );
}

export function clearControllerSession(response: VercelResponse): void {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  response.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/api; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`,
  );
}

export async function requireControllerUser(
  request: VercelRequest,
  response: VercelResponse,
  minimumRole: ControllerRole = 'operator',
): Promise<ControllerUser | null> {
  const token = readSessionCookie(request);
  const id = token ? sessionUserId(token) : null;

  try {
    const user = id ? await findControllerUser(id) : null;
    if (!user || (minimumRole === 'admin' && user.role !== 'admin')) {
      response.status(401).json({ error: 'Authentication required' });
      return null;
    }
    return user;
  } catch {
    response.status(503).json({ error: 'Controller authentication is unavailable' });
    return null;
  }
}

export function isDuplicateUsernameError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

export function usernameIsValid(username: string): boolean {
  return /^[a-zA-Z0-9_.-]{3,32}$/.test(username);
}

export function passwordIsValid(password: string): boolean {
  return password.length >= 12 && Buffer.byteLength(password, 'utf8') <= 72;
}