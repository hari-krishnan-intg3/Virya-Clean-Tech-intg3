import type { VercelRequest, VercelResponse } from '@vercel/node';
import { assertControllerSessionConfigured, createControllerUser, isDuplicateUsernameError, passwordIsValid, setControllerSession, usernameIsValid, type ControllerRole } from '../../controller/auth.js';
import { isSameOriginRequest, matchesSecret } from '../../controller/security.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isSameOriginRequest(req.headers.origin, req.headers.host)) {
    return res.status(403).json({ error: 'Requests must come from this site' });
  }

  const registrationKey = req.headers['x-controller-registration-key'];
  const candidate = Array.isArray(registrationKey) ? registrationKey[0] : registrationKey;
  const adminKey = process.env.CONTROLLER_ADMIN_REGISTRATION_SECRET;
  const operatorKey = process.env.CONTROLLER_REGISTRATION_SECRET;
  const isAdmin = matchesSecret(candidate, adminKey);
  if (!isAdmin && !matchesSecret(candidate, operatorKey)) {
    return res.status(403).json({ error: 'A valid registration key is required' });
  }

  const body = (req.body ?? {}) as { username?: unknown; password?: unknown };
  if (typeof body.username !== 'string' || typeof body.password !== 'string') {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const username = body.username.trim().toLowerCase();
  if (!usernameIsValid(username) || !passwordIsValid(body.password)) {
    return res.status(400).json({
      error: 'Use a 3-32 character username and a 12-72 byte password',
    });
  }

  try {
    assertControllerSessionConfigured();
    const role: ControllerRole = isAdmin ? 'admin' : 'operator';
    const user = await createControllerUser(username, body.password, role);
    setControllerSession(res, user);
    return res.status(201).json({ user });
  } catch (error) {
    if (isDuplicateUsernameError(error)) {
      return res.status(409).json({ error: 'Username is already registered' });
    }
    console.error('[controller-auth] registration failed');
    return res.status(503).json({ error: 'Registration is unavailable' });
  }
}