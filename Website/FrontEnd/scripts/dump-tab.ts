/** Dumps a sheet tab so its structure can be inspected. */
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';

const sa = JSON.parse(readFileSync(process.env.GOOGLE_KEY_FILE!, 'utf8'));
const sheetId = '13hYacqrTMuR9QabZbLFukyhb5K6GNMZSdQZOa8ri3N4';
const tab = process.argv[2] ?? 'Reports KPI';
const range = process.argv[3] ?? 'A1:M20';

const b64url = (i: Buffer | string) =>
  Buffer.from(i).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const now = Math.floor(Date.now() / 1000);
const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
const body = b64url(JSON.stringify({
  iss: sa.client_email,
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now, exp: now + 3600,
}));
const s = createSign('RSA-SHA256');
s.update(`${head}.${body}`);
const authRes: any = await (
  await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${head}.${body}.${b64url(s.sign(sa.private_key))}`,
    }),
  })
).json();

const url =
  `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}` +
  `/values/${encodeURIComponent(`'${tab}'!${range}`)}`;
const data: any = await (
  await fetch(url, { headers: { Authorization: `Bearer ${authRes.access_token}` } })
).json();

(data.values ?? []).forEach((row: string[], i: number) => {
  console.log(`${String(i + 1).padStart(3)} | ${row.map(c => (c ?? '').slice(0, 42)).join(' | ')}`);
});