/**
 * Reports automation — central configuration.
 *
 * Everything sensitive is read from environment variables. NOTHING here is
 * hard-coded, because `api/` runs on Vercel's server but the values must never
 * leak into the public bundle in `src/`.
 */

/** Reports this system knows how to produce. Add more here to extend it. */
export const REPORT_TYPES = ['daily', 'weekly', 'monthly'] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export function isReportType(value: string): value is ReportType {
  return (REPORT_TYPES as readonly string[]).includes(value);
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example for setup.`,
    );
  }
  return value;
}

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
  /** Optional second project that holds inbound lead tasks. */
  leadsProjectKey?: string;
  jql?: string;
}

export interface GoogleAuthConfig {
  clientEmail: string;
  privateKey: string;
}

export interface SheetsConfig {
  spreadsheetId: string;
  /** Tab name that holds the log columns (Daily/Weekly/Monthly). */
  reportsTab: string;
  kpiTab: string;
  /** Optional tab that holds raw leads. */
  leadsTab?: string;
}

export interface MailConfig {
  /** Resend API key. */
  apiKey: string;
  from: string;
  to: string;
}

export interface AppConfig {
  jira: JiraConfig;
  google: GoogleAuthConfig;
  sheets: SheetsConfig;
  mail: MailConfig;
  /** Shared secret Vercel Cron sends as `Authorization: Bearer <CRON_SECRET>`. */
  cronSecret: string;
  /** Site used for absolute links in the email. */
  siteUrl: string;
  /** When true, sends email but skips all Sheets writes. */
  dryRun: boolean;
}

/** Whether the app has enough configuration to run. Used by /api/health. */
export function missingEnv(): string[] {
  const required = [
    'JIRA_BASE_URL',
    'JIRA_EMAIL',
    'JIRA_API_TOKEN',
    'JIRA_PROJECT_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'SHEETS_SPREADSHEET_ID',
    'RESEND_API_KEY',
    'MAIL_TO',
    'CRON_SECRET',
  ];

  return required.filter((key) => !process.env[key]);
}

export function loadConfig(): AppConfig {
  return {
    jira: {
      baseUrl: required('JIRA_BASE_URL').replace(/\/+$/, ''),
      email: required('JIRA_EMAIL'),
      apiToken: required('JIRA_API_TOKEN'),
      projectKey: required('JIRA_PROJECT_KEY'),
      leadsProjectKey: process.env.JIRA_LEADS_PROJECT_KEY || undefined,
      jql: process.env.JIRA_JQL,
    },
    google: {
      clientEmail: required('GOOGLE_CLIENT_EMAIL'),
      // Vercel stores multi-line keys with literal \n sequences.
      privateKey: required('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    },
    sheets: {
      spreadsheetId: required('SHEETS_SPREADSHEET_ID'),
      reportsTab: process.env.SHEETS_REPORTS_TAB || 'Reports',
      kpiTab: process.env.SHEETS_KPI_TAB || 'Reports KPI',
      leadsTab: process.env.SHEETS_LEADS_TAB || undefined,
    },
    mail: {
      apiKey: required('RESEND_API_KEY'),
      from: process.env.MAIL_FROM || 'Virya Reports <onboarding@resend.dev>',
      to: required('MAIL_TO'),
    },
    cronSecret: required('CRON_SECRET'),
    siteUrl: (process.env.SITE_URL || 'https://viryacleantech.com').replace(/\/+$/, ''),
    dryRun: process.env.DRY_RUN === 'true',
  };
}