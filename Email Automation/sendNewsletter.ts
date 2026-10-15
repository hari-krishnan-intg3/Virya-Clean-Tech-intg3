import { readTab } from '../Website/FrontEnd/api/_lib/sheets.js';
import { sendEmail } from '../Website/FrontEnd/api/_lib/mailer.js';
import type { GoogleAuthConfig, MailConfig, SheetsConfig } from '../Website/FrontEnd/api/_lib/config.js';
import { featuredInsights } from '../Website/FrontEnd/src/data/insights.js';
import { services, type Service } from '../Website/FrontEnd/src/data/services.js';
import { generateViryaEmailHTML, generateViryaEmailText } from './emailTemplate.js';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing existing environment variable: ${name}`);
  return value;
}

function getMailConfig(): MailConfig {
  return {
    apiKey: required('RESEND_API_KEY'),
    from: process.env.MAIL_FROM || 'Virya CleanTech <onboarding@resend.dev>',
    to: required('MAIL_TO'),
  };
}

function getSheetConfig(): { google: GoogleAuthConfig; sheets: SheetsConfig; leadsTab: string } {
  const leadsTab = process.env.SHEETS_LEADS_TAB || 'Leads';
  return {
    google: {
      clientEmail: required('GOOGLE_CLIENT_EMAIL'),
      privateKey: required('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    },
    sheets: {
      spreadsheetId: required('SHEETS_SPREADSHEET_ID'),
      reportsTab: process.env.SHEETS_REPORTS_TAB || 'Reports',
      kpiTab: process.env.SHEETS_KPI_TAB || 'Reports KPI',
      leadsTab,
    },
    leadsTab,
  };
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

async function getFeaturedService(): Promise<Service> {
  const { google, sheets, leadsTab } = getSheetConfig();
  const serviceRows = await readTab(sheets, google, leadsTab, 'F2:F');
  const counts = new Map<string, number>();

  for (const [cell] of serviceRows) {
    if (!cell?.trim()) continue;
    const value = normalize(cell);
    const service = services.find(
      (candidate) =>
        value === normalize(candidate.slug) ||
        value === normalize(candidate.label) ||
        value === normalize(candidate.title),
    );
    if (service) counts.set(service.slug, (counts.get(service.slug) ?? 0) + 1);
  }

  return [...services].sort(
    (left, right) => (counts.get(right.slug) ?? 0) - (counts.get(left.slug) ?? 0),
  )[0];
}

function formatNow(): { date: string; time: string } {
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: `${now.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })} IST`,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const sendIndex = args.indexOf('--send-test');
  const testCount = sendIndex < 0 ? 0 : Number(args[sendIndex + 1]);
  if (sendIndex < 0 && args.length > 0 && !(args.length === 1 && args[0] === '--preview')) {
    throw new Error('Supported usage: --preview or --send-test 1..5');
  }
  if (sendIndex >= 0 && args.length !== 2) {
    throw new Error('Supported usage: --preview or --send-test 1..5');
  }
  if (sendIndex >= 0 && (!Number.isInteger(testCount) || testCount < 1 || testCount > 5)) {
    throw new Error('Use --send-test with a count from 1 to 5.');
  }

  const featuredService = await getFeaturedService();
  const data = {
    ...formatNow(),
    recipientName: 'Valued Partner',
    featuredService,
    updates: services.filter((service) => service.slug !== featuredService.slug),
    insight: featuredInsights[0],
  };
  const html = generateViryaEmailHTML(data);
  const text = generateViryaEmailText(data);

  if (testCount === 0) {
    console.log(`Preview ready: ${data.featuredService.title}`);
    console.log(`HTML: ${html.length} characters; text: ${text.length} characters.`);
    console.log('No email was sent. Use --send-test 5 to send five test messages to MAIL_TO.');
    return;
  }

  const mail = getMailConfig();
  for (let index = 1; index <= testCount; index += 1) {
    const result = await sendEmail(mail, {
      subject: `[TEST ${index}/${testCount}] Smarter Energy Update | ${data.date}`,
      html,
      text,
    });
    console.log(`Test ${index}/${testCount} sent. Resend ID: ${result.id}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});