import { sendEmail } from '../Website/FrontEnd/api/_lib/mailer.js';
import type { MailConfig } from '../Website/FrontEnd/api/_lib/config.js';
import { featuredInsights } from '../Website/FrontEnd/src/data/insights.js';
import { services, type Service } from '../Website/FrontEnd/src/data/services.js';
import { generateViryaEmailHTML, generateViryaEmailText } from './emailTemplate.js';

interface TestProfile {
  recipientName: string;
  recipientRole: string;
  subject: string;
  headline: string;
  personalizedMessage: string;
  serviceSlug: Service['slug'];
}

const TEST_PROFILES: TestProfile[] = [
  {
    recipientName: 'Priya',
    recipientRole: 'Facility / Plant Head',
    subject: 'Solar planning around facility operations',
    headline: 'Explore solar without losing sight of site operations.',
    personalizedMessage:
      'A solar review can start with your operating hours, access rules, roof conditions and the equipment that cannot be interrupted. These details help shape a practical assessment and identify work windows before a design is discussed.',
    serviceSlug: 'solar',
  },
  {
    recipientName: 'Arjun',
    recipientRole: 'CFO / Finance Director',
    subject: 'Compare energy project assumptions with confidence',
    headline: 'Make project comparisons easier to evaluate.',
    personalizedMessage:
      'When proposals use different assumptions, compare the included scope, energy baseline, cost components and exclusions before weighing projected returns. A project-specific review can distinguish measured inputs from estimates without treating a forecast as a guarantee.',
    serviceSlug: 'consulting',
  },
  {
    recipientName: 'Meera',
    recipientRole: 'Sustainability / ESG Lead',
    subject: 'Build a clearer energy-data picture for reporting',
    headline: 'Start with data you can explain and review.',
    personalizedMessage:
      'For sustainability reporting, define the reporting boundary, source systems, calculation method and review requirements first. Monitoring options depend on available meters, data quality, access rights and the evidence your team needs to retain.',
    serviceSlug: 'software-iot',
  },
  {
    recipientName: 'Nikhil',
    recipientRole: 'Real Estate Head',
    subject: 'Assess energy options across your property portfolio',
    headline: 'Account for tenants, assets and building operations.',
    personalizedMessage:
      'A property review can map roof and electrical capacity alongside lease terms, tenant responsibilities, building operations and maintenance ownership. That context helps identify who can approve work and which sites merit a closer technical assessment.',
    serviceSlug: 'solar',
  },
  {
    recipientName: 'Kavya',
    recipientRole: 'Fleet / Mobility Manager',
    subject: 'Plan EV charging around routes and depot demand',
    headline: 'Shape charging around how your fleet actually runs.',
    personalizedMessage:
      'Vehicle types, routes, dwell time, charging windows and site electrical capacity are useful starting points for depot planning. Reviewing these together helps frame charger quantities and power needs before equipment is specified.',
    serviceSlug: 'ev-charging',
  },
];

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

  const timestamp = formatNow();
  const previews = TEST_PROFILES.map((profile) => {
    const featuredService = services.find((service) => service.slug === profile.serviceSlug);
    if (!featuredService) throw new Error(`No service found for ${profile.serviceSlug}`);

    const data = {
      ...timestamp,
      recipientName: profile.recipientName,
      recipientRole: profile.recipientRole,
      headline: profile.headline,
      personalizedMessage: profile.personalizedMessage,
      featuredService,
      updates: services.filter((service) => service.slug !== featuredService.slug),
      insight: featuredInsights[0],
    };

    return { profile, data };
  });

  if (testCount === 0) {
    console.log('Five personalized role previews ready. No email was sent.');
    for (const [index, { profile, data }] of previews.entries()) {
      const html = generateViryaEmailHTML(data);
      const text = generateViryaEmailText(data);
      console.log(`${index + 1}. ${profile.recipientRole} — ${profile.subject}`);
      console.log(`   HTML: ${html.length} characters; text: ${text.length} characters.`);
    }
    console.log('Use --send-test 5 to send all five versions to MAIL_TO.');
    return;
  }

  const mail = getMailConfig();
  for (let index = 1; index <= testCount; index += 1) {
    const { profile, data } = previews[index - 1];
    const result = await sendEmail(mail, {
      subject: `[TEST ${index}/${testCount}] ${profile.subject} | ${data.date}`,
      html: generateViryaEmailHTML(data),
      text: generateViryaEmailText(data),
    });
    console.log(`${profile.recipientRole} test ${index}/${testCount} sent. Resend ID: ${result.id}`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});