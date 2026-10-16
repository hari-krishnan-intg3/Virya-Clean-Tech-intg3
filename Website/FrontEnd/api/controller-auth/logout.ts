import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearControllerSession } from '../../controller/auth.js';
import { isSameOriginRequest } from '../../controller/security.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isSameOriginRequest(req.headers.origin, req.headers.host)) {
    return res.status(403).json({ error: 'Requests must come from this site' });
  }
  clearControllerSession(res);
  return res.status(200).json({ ok: true });
}