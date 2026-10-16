import { randomInt } from 'node:crypto';

interface CareerApplicationEmailData {
  siteUrl: string;
  fullName: string;
  role: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function chooseBanners(): [number, number] {
  const header = randomInt(1, 7);
  const footer = randomInt(1, 6);
  return [header, footer >= header ? footer + 1 : footer];
}

export function generateCareerApplicationEmail(data: CareerApplicationEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const [headerBanner, footerBanner] = chooseBanners();
  const firstName = escapeHtml(data.fullName.split(/\s+/)[0] || 'there');
  const role = escapeHtml(data.role);
  const message = escapeHtml(data.message);
  const subjectRole = data.role.replace(/[\r\n]+/g, ' ').trim();
  const bannerUrl = (number: number) =>
    `${data.siteUrl}/email-banners/banner-${number}.png`;

  return {
    subject: `Application received: ${subjectRole} | Virya CleanTech`,
    html: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Application received | Virya CleanTech</title></head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:#1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F1F5F9;"><tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid #E2E8F0;overflow:hidden;">
      <tr><td><img src="${bannerUrl(headerBanner)}" alt="Virya CleanTech" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>
      <tr><td style="padding:28px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.7px;color:#047857;text-transform:uppercase;">Application received</p>
        <h1 style="margin:0 0 14px;font-size:23px;line-height:1.35;color:#0F172A;">Thank you, ${firstName}.</h1>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#475569;">We received your application for the <strong style="color:#0F172A;">${role}</strong> role. Our careers team will review your details and follow up within two working days.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F8FAFC;border:1px solid #E2E8F0;"><tr><td style="padding:16px;">
          <p style="margin:0 0 7px;font-size:11px;font-weight:700;letter-spacing:.6px;color:#64748B;text-transform:uppercase;">Your note</p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;white-space:pre-line;">${message}</p>
        </td></tr></table>
        <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#475569;">If you need to add anything, reply to this email or contact <a href="mailto:careers@viryacleantech.com" style="color:#047857;">careers@viryacleantech.com</a>.</p>
      </td></tr>
      <tr><td><img src="${bannerUrl(footerBanner)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></td></tr>
      <tr><td style="padding:18px 24px;background-color:#F8FAFC;text-align:center;font-size:12px;line-height:1.7;color:#64748B;">Virya CleanTech | Bengaluru, India<br><a href="${escapeHtml(data.siteUrl)}" style="color:#047857;text-decoration:none;">viryacleantech.com</a></td></tr>
    </table>
  </td></tr></table>
</body></html>`,
    text: [
      `Thank you, ${data.fullName.split(/\s+/)[0] || 'there'}.`,
      '',
      `We received your application for the ${data.role} role. Our careers team will review your details and follow up within two working days.`,
      '',
      'Your note:',
      data.message,
      '',
      'If you need to add anything, reply to this email or contact careers@viryacleantech.com.',
      `Virya CleanTech | ${data.siteUrl}`,
    ].join('\n'),
  };
}