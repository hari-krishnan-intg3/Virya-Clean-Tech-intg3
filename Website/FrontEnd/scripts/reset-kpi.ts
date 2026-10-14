/** Resets the Reports KPI counters and restores the clobbered B8 label. */
import { existsSync, readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';

function loadEnvLocal() {
  if (!existsSync('.env.local')) return;
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    process.env[m[1]] ??= v.replace(/\\n/g, '\n');
  }
}
loadEnvLocal();

const sheetId = process.env.SHEETS_SPREADSHEET_ID!;
const tab = process.env.SHEETS_KPI_TAB!;

const b64 = (i: Buffer | string) =>
  Buffer.from(i).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const now = Math.floor(Date.now() / 1000);
const head = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
const body = b64(JSON.stringify({
  iss: process.env.GOOGLE_CLIENT_EMAIL,
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now, exp: now + 3600,
}));
const s = createSign('RSA-SHA256');
s.update(`${head}.${body}`);
const tok: any = await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: `${head}.${body}.${b64(s.sign(process.env.GOOGLE_PRIVATE_KEY!))}`,
  }),
})).json();

async function put(range: string, values: (string | number)[][]) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/` +
    `${encodeURIComponent(`'${tab}'!${range}`)}?valueInputOption=USER_ENTERED`;
  const r = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ range: `'${tab}'!${range}`, majorDimension: 'ROWS', values }),
  });
  console.log(`${range}: ${r.ok ? 'ok' : r.status + ' ' + (await r.text()).slice(0, 160)}`);
}

// Counters back to zero
await put('B6:J6', [[0, '', 0, '', 0, '', 0, '', '0.0%']]);
// Restore the label clobbered by the earlier buggy write
await put('B8:B8', [['Across 3 cadences']]);
await put('D8:J8', [['Sent: 0', '', 'Sent: 0', '', 'Sent: 0', '', 'Awaiting Data']]);
// Cadence + status tables
await put('B11:F14', [
  ['Daily', 0, 0, 0, '0.0%'],
  ['Weekly', 0, 0, 0, '0.0%'],
  ['Monthly', 0, 0, 0, '0.0%'],
  ['Total Overall', 0, 0, 0, '0.0%'],
]);
await put('K11:M13', [
  ['Sent / Delivered', 0, '0.0%'],
  ['Pending / Queue', 0, '0.0%'],
  ['Total Tracked', 0, '0.0%'],
]);

console.log('\nKPI sheet reset to zero.');