import type { GoogleAuthConfig, MailConfig, SheetsConfig } from './config.js';
import { sendEmail } from './mailer.js';
import { appendRows, readTab, writeTab, type CellValue } from './sheets.js';
import { ensureTab } from './tabs.js';

const NEWSLETTER_TAB = 'Newsletter Subscribers';
const NEWSLETTER_HEADERS = [
  'Email',
  'Name',
  'Subscribed At (UTC)',
  'Consent Source',
  'Service Interest',
  'Welcome Email Status',
] as const;

export type NewsletterStatus = 'not-requested' | 'sent' | 'already-subscribed' | 'pending';

interface SubscriberInput {
  email: string;
  name: string;
  service: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function welcomeHtml(name: string, service: string): string {
  const safeName = escapeHtml(name.split(/\s+/)[0] || 'there');
  const safeService = escapeHtml(service || 'clean energy');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to Virya CleanTech</title></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:#1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F1F5F9;"><tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
      <tr><td height="6" style="background:#10B981;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:24px 28px;border-bottom:1px solid #F1F5F9;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
          <td style="padding-right:10px;"><a href="https://virya-clean-tech-intg3.vercel.app/"><img src="https://virya-clean-tech-intg3.vercel.app/favicon.svg" alt="Virya CleanTech" width="38" height="38" style="display:block;border:0;"></a></td>
          <td><a href="https://virya-clean-tech-intg3.vercel.app/" style="text-decoration:none;"><span style="display:block;font-size:16px;font-weight:800;color:#0F172A;">VIRYA CLEANTECH</span><span style="display:block;margin-top:3px;font-size:10px;font-weight:700;letter-spacing:1px;color:#059669;">CLEAN TECHNOLOGY</span></a></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:30px 28px 18px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.7px;color:#047857;text-transform:uppercase;">Welcome, subscriber</p>
        <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0F172A;">Thanks for joining us, ${safeName}.</h1>
        <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#475569;">You&apos;re subscribed to Virya CleanTech product and energy updates. We&apos;ll share useful perspectives on solar, EV charging, storage and connected-energy technology.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;"><tr><td style="padding:18px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.7px;color:#15803D;text-transform:uppercase;">Your area of interest</p>
          <p style="margin:0;font-size:16px;font-weight:700;line-height:1.5;color:#0F172A;">${safeService}</p>
        </td></tr></table>
        <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#475569;">Every facility is different. Project suitability depends on site conditions, operating needs and an agreed technical scope.</p>
        <p style="margin:22px 0 8px;"><a href="https://virya-clean-tech-intg3.vercel.app/services" style="display:inline-block;padding:12px 20px;background:#10B981;border-radius:5px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;">Explore our services &rarr;</a></p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">Have a project in mind? <a href="https://virya-clean-tech-intg3.vercel.app/request-consultation" style="color:#047857;font-weight:700;">Request a consultation</a>.</p>
      </td></tr>
      <tr><td style="padding:24px 28px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center;">
        <p style="margin:0 0 7px;font-size:14px;font-weight:800;color:#0F172A;">VIRYA CLEANTECH</p>
        <p style="margin:0 0 12px;font-size:12px;line-height:1.7;color:#64748B;">No 2, 1st Floor, No 113 Yogjam Sai Charan Layout, Bengaluru, Karnataka 560036, India<br><a href="tel:+918317494969" style="color:#047857;text-decoration:none;">+91 8317494969</a> &nbsp;|&nbsp; <a href="mailto:connect@viryacleantech.com" style="color:#047857;text-decoration:none;">connect@viryacleantech.com</a></p>
        <p style="margin:0 0 12px;font-size:12px;"><a href="https://virya-clean-tech-intg3.vercel.app/" style="color:#047857;text-decoration:none;">Website</a> &nbsp;|&nbsp; <a href="https://virya-clean-tech-intg3.vercel.app/services" style="color:#047857;text-decoration:none;">Services</a> &nbsp;|&nbsp; <a href="mailto:connect@viryacleantech.com?subject=Unsubscribe" style="color:#64748B;text-decoration:underline;">Unsubscribe</a></p>
        <p style="margin:0;font-size:11px;color:#94A3B8;">Copyright &copy; 2026 VIRYA CLEANTECH. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

function welcomeText(name: string, service: string): string {
  const firstName = name.split(/\s+/)[0] || 'there';
  return [
    `Thanks for joining us, ${firstName}.`,
    '',
    'You are subscribed to Virya CleanTech product and energy updates on solar, EV charging, storage and connected-energy technology.',
    `Your area of interest: ${service || 'clean energy'}.`,
    '',
    'Explore our services: https://virya-clean-tech-intg3.vercel.app/services',
    'Request a consultation: https://virya-clean-tech-intg3.vercel.app/request-consultation',
    '',
    'Virya CleanTech | connect@viryacleantech.com | +91 8317494969',
    'Unsubscribe: email connect@viryacleantech.com with subject Unsubscribe.',
  ].join('\n');
}

export async function subscribeAndSendWelcome(
  sheets: SheetsConfig,
  google: GoogleAuthConfig,
  subscriber: SubscriberInput,
): Promise<NewsletterStatus> {
  await ensureTab(sheets, google, NEWSLETTER_TAB);
  const rows = await readTab(sheets, google, NEWSLETTER_TAB, 'A:F');
  if (rows[0]?.[0] !== NEWSLETTER_HEADERS[0]) {
    await writeTab(sheets, google, NEWSLETTER_TAB, 'A1:F1', [[...NEWSLETTER_HEADERS]]);
  }

  const email = subscriber.email.trim().toLowerCase();
  const existingIndex = rows.findIndex(
    (row, index) => index > 0 && row[0]?.trim().toLowerCase() === email,
  );

  if (existingIndex >= 0 && rows[existingIndex][5] === 'Sent') {
    return 'already-subscribed';
  }

  const rowNumber = existingIndex >= 0 ? existingIndex + 1 : rows.length + 1;
  if (existingIndex < 0) {
    const record: CellValue[] = [
      email,
      subscriber.name,
      new Date().toISOString(),
      'request-consultation checkbox',
      subscriber.service,
      'Pending',
    ];
    await appendRows(sheets, google, NEWSLETTER_TAB, 'A:F', [record]);
  }

  const mail: MailConfig = {
    apiKey: process.env.RESEND_API_KEY ?? '',
    from: process.env.MAIL_FROM || 'Virya CleanTech <onboarding@resend.dev>',
    to: email,
  };
  if (!mail.apiKey) return 'pending';

  try {
    await sendEmail(mail, {
      subject: 'Welcome to Virya CleanTech updates',
      html: welcomeHtml(subscriber.name, subscriber.service),
      text: welcomeText(subscriber.name, subscriber.service),
    });
    await writeTab(sheets, google, NEWSLETTER_TAB, `F${rowNumber}`, [['Sent']]);
    return 'sent';
  } catch (error) {
    console.error('[newsletter] welcome email failed', error);
    return 'pending';
  }
}