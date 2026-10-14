/** Regenerates .env.local with the private key correctly escaped onto one line. */
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

const saPath =
  process.argv[2] ?? '../Reports/sage-now-511315-n5-ae3b62590bbd.json';
const sa = JSON.parse(readFileSync(saPath, 'utf8'));

// Secrets are never stored in this file. Load them from your shell / a
// gitignored .env.secrets file instead:
//   $env:JIRA_API_TOKEN = "..."   (PowerShell)  |  export JIRA_API_TOKEN=... (bash)
const secretsPath = '.env.secrets';
let fileSecrets: Record<string, string> = {};
try {
  for (const line of readFileSync(secretsPath, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (match) fileSecrets[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
} catch {
  // no .env.secrets — rely on process.env only
}

const read = (key: string): string => {
  const value = process.env[key] ?? fileSecrets[key];
  if (!value) {
    throw new Error(
      `Missing ${key}. Set it in your shell or in ${secretsPath} (gitignored).`,
    );
  }
  return value;
};

const optional = (key: string, fallback = ''): string =>
  process.env[key] ?? fileSecrets[key] ?? fallback;

// Collapse the PEM to a single line with literal \n sequences.
const privateKeyOneLine = sa.private_key
  .replace(/\r\n/g, '\n')
  .replace(/\n/g, '\\n');
const cronSecret = randomBytes(32).toString('hex');

const env = `# ── LOCAL ENV (gitignored) ─────────────────────────────────────────
# Real credentials. Rotate before any public deployment.
#
# NOTE: GOOGLE_PRIVATE_KEY must stay on ONE line with literal \\n escapes.

JIRA_BASE_URL=${optional('JIRA_BASE_URL', 'https://harikrishnanint2027g3.atlassian.net')}
JIRA_PROJECT_KEY=${optional('JIRA_PROJECT_KEY', 'VCT')}
JIRA_LEADS_PROJECT_KEY=${optional('JIRA_LEADS_PROJECT_KEY', 'VCT')}
JIRA_EMAIL=${optional('JIRA_EMAIL')}
JIRA_API_TOKEN=${read('JIRA_API_TOKEN')}

GOOGLE_CLIENT_EMAIL=${sa.client_email}
GOOGLE_PRIVATE_KEY="${privateKeyOneLine}"

SHEETS_SPREADSHEET_ID=${optional('SHEETS_SPREADSHEET_ID', '13hYacqrTMuR9QabZbLFukyhb5K6GNMZSdQZOa8ri3N4')}
SHEETS_REPORTS_TAB=${optional('SHEETS_REPORTS_TAB', 'Reports')}
SHEETS_KPI_TAB=${optional('SHEETS_KPI_TAB', 'Reports KPI')}
SHEETS_LEADS_TAB=${optional('SHEETS_LEADS_TAB', 'Leads')}
SHEETS_ANALYTICS_TAB=${optional('SHEETS_ANALYTICS_TAB', 'Vercel Analytics')}

VERCEL_ACCESS_TOKEN=${optional('VERCEL_ACCESS_TOKEN')}
VERCEL_ANALYTICS_PROJECT_ID=${optional('VERCEL_ANALYTICS_PROJECT_ID')}
VERCEL_TEAM_ID=${optional('VERCEL_TEAM_ID')}
VERCEL_TEAM_SLUG=${optional('VERCEL_TEAM_SLUG')}

RESEND_API_KEY=${read('RESEND_API_KEY')}
MAIL_FROM=${optional('MAIL_FROM', 'Virya Reports <onboarding@resend.dev>')}
MAIL_TO=${optional('MAIL_TO')}

CRON_SECRET=${cronSecret}
SITE_URL=${optional('SITE_URL', 'https://viryacleantech.com')}

`;

writeFileSync('.env.local', env, 'utf8');
console.log('.env.local regenerated.');
console.log('CRON_SECRET written to .env.local');
console.log('private key lines in file:', env.split('\n').length);