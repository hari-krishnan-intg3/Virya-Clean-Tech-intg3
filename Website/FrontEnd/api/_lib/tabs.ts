import { getAccessToken } from './sheets.js';
import type { GoogleAuthConfig, SheetsConfig } from './config.js';

/**
 * Tab lifecycle helpers — creates sheets on demand so the workbook doesn't
 * need manual preparation.
 */

/** Lists the tabs present in the workbook. */
export async function listTabs(
  config: SheetsConfig,
  google: GoogleAuthConfig,
): Promise<{ title: string; sheetId: number }[]> {
  const token = await getAccessToken(google);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}` +
      `?fields=sheets.properties`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sheets metadata failed (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as { sheets?: { properties: unknown }[] };
  return (data.sheets ?? []).map((s) => {
    const props = s.properties as { title: string; sheetId: number };
    return { title: props.title, sheetId: props.sheetId };
  });
}

/**
 * Creates a tab if it does not already exist. Idempotent — so the Leads tab
 * appears automatically the first time a lead arrives.
 */
export async function ensureTab(
  config: SheetsConfig,
  google: GoogleAuthConfig,
  tab: string,
): Promise<{ created: boolean; title: string }> {
  const tabs = await listTabs(config, google);

  if (tabs.some((t) => t.title.toLowerCase() === tab.toLowerCase())) {
    return { created: false, title: tab };
  }

  const token = await getAccessToken(google);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: tab } } }],
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Could not create tab "${tab}" (${response.status}): ${body.slice(0, 300)}`);
  }

  return { created: true, title: tab };
}