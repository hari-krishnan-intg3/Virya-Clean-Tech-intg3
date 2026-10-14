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
  /** Tab that stores Vercel Web Analytics snapshots. */
  analyticsTab?: string;
}

export interface MailConfig {
  /** Resend API key. */
  apiKey: string;
  from: string;
  to: string;
}

export interface VercelAnalyticsConfig {
  accessToken: string;
  projectId: string;
  teamId?: string;
  teamSlug?: string;
}

export interface AppConfig {
  jira: JiraConfig;
  google: GoogleAuthConfig;
  sheets: SheetsConfig;
  mail: MailConfig;
  vercelAnalytics?: VercelAnalyticsConfig;
  /** Shared secret Vercel Cron sends as `Authorization: Bearer <CRON_SECRET>`. */
  cronSecret: string;
  /** Site used for absolute links in the email. */
  siteUrl: string;
  /** When true, sends email but skips all Sheets writes. */
  dryRun: boolean;
  /**
   * Tab holding one row per web session, upserted in place. Set to an empty
   * string to disable session tracking entirely.
   */
  sessionsTab: string;
  /**
   * Jira account id that every new lead is assigned to. Leave blank to
   * create unassigned.
   */
  leadsAssigneeId?: string;
  /**
   * India DPDP Act 2023 treats an IP address as personal data. When false
   * (the default) only the truncated form is persisted.
   */
  storeRawIp: boolean;
}

export interface LeadIntakeConfig {
  jira: JiraConfig;
  google?: GoogleAuthConfig;
  sheets?: SheetsConfig;
  leadsAssigneeId?: string;
  storeRawIp: boolean;
}

/** Loads only the integrations required by website lead intake. */
export function loadLeadIntakeConfig(): LeadIntakeConfig {
  const projectKey = 'VCT';
  const jira: JiraConfig = {
    baseUrl: required('JIRA_BASE_URL').replace(/\/+$/, ''),
    email: required('JIRA_EMAIL'),
    apiToken: required('JIRA_API_TOKEN'),
    projectKey,
    leadsProjectKey: projectKey,
  };

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
  const leadsTab = process.env.SHEETS_LEADS_TAB;
  const sheetsReady = Boolean(clientEmail && privateKey && spreadsheetId && leadsTab);

  return {
    jira,
    ...(sheetsReady
      ? {
          google: {
            clientEmail: clientEmail as string,
            privateKey: (privateKey as string).replace(/\\n/g, '\n'),
          },
          sheets: {
            spreadsheetId: spreadsheetId as string,
            reportsTab: process.env.SHEETS_REPORTS_TAB || 'Reports',
            kpiTab: process.env.SHEETS_KPI_TAB || 'Reports KPI',
            leadsTab,
            analyticsTab: process.env.SHEETS_ANALYTICS_TAB || 'Vercel Analytics',
          },
        }
      : {}),
    leadsAssigneeId: process.env.JIRA_LEADS_ASSIGNEE_ID || undefined,
    storeRawIp: process.env.STORE_RAW_IP === 'true',
  };
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
      analyticsTab: process.env.SHEETS_ANALYTICS_TAB || 'Vercel Analytics',
    },
    mail: {
      apiKey: required('RESEND_API_KEY'),
      from: process.env.MAIL_FROM || 'Virya Reports <onboarding@resend.dev>',
      to: required('MAIL_TO'),
    },
    ...(process.env.VERCEL_ACCESS_TOKEN &&
    (process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID)
      ? {
          vercelAnalytics: {
            accessToken: process.env.VERCEL_ACCESS_TOKEN,
            projectId:
              process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID!,
            teamId: process.env.VERCEL_TEAM_ID || undefined,
            teamSlug: process.env.VERCEL_TEAM_SLUG || undefined,
          },
        }
      : {}),
cronSecret: required('CRON_SECRET'),
    siteUrl: (process.env.SITE_URL || 'https://viryacleantech.com').replace(/\/+$/, ''),
    dryRun: process.env.DRY_RUN === 'true',
    sessionsTab: process.env.SHEETS_SESSIONS_TAB ?? 'Sessions',
    leadsAssigneeId: process.env.JIRA_LEADS_ASSIGNEE_ID || undefined,
    storeRawIp: process.env.STORE_RAW_IP === 'true',
  };
}

/**
 * Configuration needed only by the session endpoint, so session tracking can
 * be validated independently of the report stack. Keeps /api/session from
 * 503-ing just because a Jira token is missing.
 */
export function sessionConfig(): Pick<AppConfig, 'sheets' | 'google' | 'sessionsTab' | 'storeRawIp'> {
  return {
    sheets: {
      spreadsheetId: required('SHEETS_SPREADSHEET_ID'),
      reportsTab: process.env.SHEETS_REPORTS_TAB || 'Reports',
      kpiTab: process.env.SHEETS_KPI_TAB || 'Reports KPI',
      leadsTab: process.env.SHEETS_LEADS_TAB || undefined,
      analyticsTab: process.env.SHEETS_ANALYTICS_TAB || 'Vercel Analytics',
    },
    google: {
      clientEmail: required('GOOGLE_CLIENT_EMAIL'),
      privateKey: required('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    },
    sessionsTab: process.env.SHEETS_SESSIONS_TAB ?? 'Sessions',
    storeRawIp: process.env.STORE_RAW_IP === 'true',
  };
}