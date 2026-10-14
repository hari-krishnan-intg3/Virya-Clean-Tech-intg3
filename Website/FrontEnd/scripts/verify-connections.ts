/**
 * One-off connectivity check for the reporting stack.
 * Proves, before deploying, whether the service account can read the
 * spreadsheet and whether the Jira token can query the VCT project.
 *
 *   node --experimental-strip-types scripts/verify-connections.ts
 */
import { readFileSync } from 'node:fs';

const keyFile = process.env.GOOGLE_KEY_FILE ?? '../../Reports/sage-now-511315-n5-ae3b62590bbd.json';
const sheetId = process.env.SHEETS_SPREADSHEET_ID ?? '13hYacqrTMuR9QabZbLFukyhb5K6GNMZSdQZOa8ri3N4';

/* ----------------------------- Google auth ----------------------------- */
function b64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function token(sa: any) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const { createSign } = await import('node:crypto');
  const s = createSign('RSA-SHA256');
  s.update(`${head}.${body}`);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${head}.${body}.${b64url(s.sign(sa.private_key))}`,
    }),
  });
  const j: any = await res.json();
  if (!res.ok) throw new Error(`auth ${res.status}: ${JSON.stringify(j).slice(0, 200)}`);
  return j.access_token as string;
}

/* --------------------------------- run --------------------------------- */
const out: string[] = [];
const log = (s: string) => { out.push(s); console.log(s); };

try {
  const sa = JSON.parse(readFileSync(keyFile, 'utf8'));
  log(`Service account : ${sa.client_email}`);

  const t = await token(sa);
  log('Google auth     : OK (token issued)');

  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=properties.title,sheets.properties`,
    { headers: { Authorization: `Bearer ${t}` } },
  );
  if (!metaRes.ok) {
    const e = await metaRes.text();
    log(`Sheets metadata : FAIL ${metaRes.status} — ${e.slice(0, 220)}`);
    log('  → Share the sheet with the service account email as EDITOR.');
  } else {
    const meta: any = await metaRes.json();
    log(`Sheets metadata : OK — workbook "${meta.properties.title}"`);
    log('  Tabs:');
    for (const s of meta.sheets ?? []) {
      log(`   - "${s.properties.title}"  (gid ${s.properties.sheetId})`);
    }
  }

  for (const tab of process.env.VERIFY_TABS?.split(',') ?? []) {
    const r = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`'${tab}'!A1:J15`)}`,
      { headers: { Authorization: `Bearer ${t}` } },
    );
    if (!r.ok) { log(`Tab "${tab}"     : FAIL ${r.status}`); continue; }
    const v: any = await r.json();
    log(`Tab "${tab}"     : OK (${v.values?.length ?? 0} rows)`);
    (v.values ?? []).slice(0, 6).forEach((row: string[], i: number) =>
      log(`    ${i + 1}: ${JSON.stringify(row)}`),
    );
  }
} catch (e) {
  log(`Google          : FAIL — ${(e as Error).message}`);
}

try {
  const base = process.env.JIRA_BASE_URL ?? 'https://harikrishnanint2027g3.atlassian.net';
  const email = process.env.JIRA_EMAIL ?? 'harikrishnan.int2027g3@gmail.com';
  const token = process.env.JIRA_API_TOKEN ?? '';
  const auth = `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;

  const r = await fetch(`${base}/rest/api/3/myself`, { headers: { Authorization: auth } });
  if (!r.ok) {
    log(`Jira /myself    : FAIL ${r.status} — ${(await r.text()).slice(0, 200)}`);
  } else {
    const me: any = await r.json();
    log(`Jira /myself    : OK — ${me.displayName} (${me.emailAddress})`);
  }

  const key = process.env.JIRA_PROJECT_KEY ?? 'VCT';
  const s = await fetch(`${base}/rest/api/3/project/${key}`, { headers: { Authorization: auth } });
  log(s.ok ? `Jira project ${key}: OK — ${(await s.json() as any).name}` : `Jira project ${key}: FAIL ${s.status}`);

  const leadProj = process.env.JIRA_LEADS_PROJECT_KEY ?? '';
  if (leadProj) {
    const l = await fetch(`${base}/rest/api/3/project/${leadProj}`, { headers: { Authorization: auth } });
    log(l.ok ? `Jira leads project ${leadProj}: OK` : `Jira leads project ${leadProj}: MISSING (run provision script)`);
  }
} catch (e) {
  log(`Jira            : FAIL — ${(e as Error).message}`);
}

console.log('\n' + '='.repeat(60));
console.log(out.join('\n'));