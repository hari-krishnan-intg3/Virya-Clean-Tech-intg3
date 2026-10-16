import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setControllerSession, verifyControllerCredentials } from '../../controller/auth.js';
import { isSameOriginRequest } from '../../controller/security.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isSameOriginRequest(req.headers.origin, req.headers.host)) {
    return res.status(403).json({ error: 'Requests must come from this site' });
  }

  const body = (req.body ?? {}) as { username?: unknown; password?: unknown };
  if (typeof body.username !== 'string' || typeof body.password !== 'string') {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const user = await verifyControllerCredentials(body.username.trim().toLowerCase(), body.password);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });
    setControllerSession(res, user);
    return res.status(200).json({ user });
  } catch {
    return res.status(503).json({ error: 'Login is unavailable' });
  }
}