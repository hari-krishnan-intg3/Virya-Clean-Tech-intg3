import { createSign } from 'node:crypto';
import type { GoogleAuthConfig, SheetsConfig } from './config';

/**
 * Google Sheets access via a Service Account + JWT (RS256).
 *
 * Implemented with Node's `crypto` so we don't pull in `googleapis` (~15MB).
 *
 * IMPORTANT: the service-account email must have Editor access to the
 * spreadsheet. Sharing it only with a personal Gmail is NOT sufficient,
 * because serverless jobs have no browser session to reuse.
 */

interface TokenCache {
  token: string;
  expiresAt: number;
}

let cached: TokenCache | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function getAccessToken(config: GoogleAuthConfig): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: config.clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );

  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(config.privateKey));
  const assertion = `${header}.${claims}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google auth failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cached.token;
}

function escapeSheetName(name: string): string {
  return name.replace(/'/g, "''");
}

function valuesUrl(spreadsheetId: string, tab: string, range: string, query = ''): string {
  return (
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `/values/${encodeURIComponent(`'${escapeSheetName(tab)}'!${range}`)}` +
    query
  );
}

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

export async function readTab(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  range: string,
): Promise<string[][]> {
  const token = await getAccessToken(google);

  const response = await fetch(valuesUrl(config.spreadsheetId, tab, range), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sheets read failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as { values?: string[][] };
  return data.values ?? [];
}

/** Reads from the Reports tab (the default). */
export async function readRange(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  range: string,
): Promise<string[][]> {
  return readTab(config, google, config.reportsTab, range);
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

/** Overwrites a range on a specific tab. */
export async function writeTab(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  range: string,
  values: (string | number)[][],
): Promise<void> {
  if (values.length === 0) return;

  const token = await getAccessToken(google);

  const response = await fetch(
    valuesUrl(config.spreadsheetId, tab, range, '?valueInputOption=USER_ENTERED'),
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ range: `'${escapeSheetName(tab)}'!${range}`, majorDimension: 'ROWS', values }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sheets write failed (${response.status}): ${body.slice(0, 300)}`);
  }
}

/** Writes to the Reports tab (the default). */
export async function writeRange(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  range: string,
  values: (string | number)[][],
): Promise<void> {
  return writeTab(config, google, config.reportsTab, range, values);
}

/** Appends rows to the end of a tab. */
export async function appendRows(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  range: string,
  values: (string | number)[][],
): Promise<void> {
  if (values.length === 0) return;

  const token = await getAccessToken(google);

  const response = await fetch(
    valuesUrl(
      config.spreadsheetId,
      tab,
      range,
      '?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS',
    ),
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ majorDimension: 'ROWS', values }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sheets append failed (${response.status}): ${body.slice(0, 300)}`);
  }
}

/* ------------------------------------------------------------------ */
/* Lead counting                                                       */
/* ------------------------------------------------------------------ */

/**
 * Counts rows in the leads tab whose first column parses as a date inside
 * [start, end]. Falls back to a total row count when no date column is
 * detectable, so the KPI is never blank.
 */
export async function countLeadsInRange(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
  start: Date,
  end: Date,
): Promise<{ count: number; total: number; mode: 'dated' | 'total' }> {
  const rows = await readTab(config, google, tab, 'A:Z');

  const body = rows.filter((row, index) => {
    const first = (row[0] ?? '').trim();
    if (index === 0 && first && !Number.isFinite(Date.parse(first))) return false;
    return first.length > 0;
  });

  const total = body.length;
  const from = start.getTime();
  const to = end.getTime();

  const inRange = body.filter((row) => {
    const t = Date.parse((row[0] ?? '').trim());
    return Number.isFinite(t) && t >= from && t <= to;
  });

  const anyDated = body.some((row) => Number.isFinite(Date.parse((row[0] ?? '').trim())));

  return {
    count: anyDated ? inRange.length : total,
    total,
    mode: anyDated ? 'dated' : 'total',
  };
}

/* ------------------------------------------------------------------ */
/* Report log                                                          */
/* ------------------------------------------------------------------ */

/** Columns matching:
 *  A Daily | B Time | C Sent Status | D Weekly | E Time | F Sent Status
 *  G Monthly | H Time | I Sent Status
 */
const COLUMN_MAP: Record<string, { start: string; time: string; status: string }> = {
  daily: { start: 'A', time: 'B', status: 'C' },
  weekly: { start: 'D', time: 'E', status: 'F' },
  monthly: { start: 'G', time: 'H', status: 'I' },
};

/**
 * Finds the row for `reportType` by matching its label, then stamps the run
 * time and outcome. Appends a new labelled row if none is found.
 */
export async function logReportRun(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  reportType: string,
  status: 'Success' | 'Failed',
  note = '',
): Promise<{ row: number; appended: boolean }> {
  const columns = COLUMN_MAP[reportType];
  if (!columns) throw new Error(`Unknown report type: ${reportType}`);

  const stamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const statusText = note ? `${status} — ${note}` : status;

  const rows = await readTab(config, google, config.reportsTab, `${columns.start}1:${columns.start}100`);

  let targetRow = -1;
  rows.forEach((row, index) => {
    if (targetRow === -1 && (row[0] ?? '').trim().toLowerCase() === reportType) {
      targetRow = index + 1;
    }
  });

  if (targetRow === -1) {
    await appendRows(config, google, config.reportsTab, 'A:I', [
      [reportType, stamp, statusText],
    ]);
    return { row: -1, appended: true };
  }

  await writeTab(config, google, config.reportsTab, `${columns.time}${targetRow}:${columns.status}${targetRow}`, [
    [stamp, statusText],
  ]);

  return { row: targetRow, appended: false };
}