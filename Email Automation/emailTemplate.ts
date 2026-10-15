import type { Insight } from '../Website/FrontEnd/src/data/insights.js';
import type { Service } from '../Website/FrontEnd/src/data/services.js';

export interface NewsletterData {
  date: string;
  time: string;
  recipientName: string;
  featuredService: Service;
  updates: Service[];
  insight: Insight;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function serviceCard(service: Service): string {
  const serviceUrl = `https://virya-clean-tech-intg3.vercel.app/services/${service.slug}`;

  return `
    <tr>
      <td style="padding:16px;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#15803D;text-transform:uppercase;">${escapeHtml(service.label)}</p>
        <h3 style="margin:0 0 6px;font-size:16px;line-height:1.4;color:#0F172A;">${escapeHtml(service.title)}</h3>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">${escapeHtml(service.cardSummary)}</p>
        <p style="margin:12px 0 0;"><a href="${escapeHtml(serviceUrl)}" style="font-size:13px;font-weight:700;color:#047857;text-decoration:none;">Explore this service &rarr;</a></p>
      </td>
    </tr>
    <tr><td height="12" style="font-size:0;line-height:0;">&nbsp;</td></tr>`;
}

export function generateViryaEmailHTML(data: NewsletterData): string {
  const insightUrl = data.insight.href ? escapeHtml(data.insight.href) : '';
  const insightLabel = `${data.insight.value}${data.insight.unit ? ` ${data.insight.unit}` : ''}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Virya CleanTech | Smarter Energy Update</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:#1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F1F5F9;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
        <tr><td height="6" style="background-color:#10B981;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:24px 28px;border-bottom:1px solid #F1F5F9;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td valign="middle">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
                <td valign="middle" style="padding-right:10px;">
                  <a href="https://virya-clean-tech-intg3.vercel.app/" style="text-decoration:none;">
                    <img src="https://virya-clean-tech-intg3.vercel.app/favicon.svg" alt="Virya CleanTech" width="38" height="38" style="display:block;border:0;">
                  </a>
                </td>
                <td valign="middle">
                  <a href="https://virya-clean-tech-intg3.vercel.app/" style="text-decoration:none;">
                    <span style="display:block;font-size:16px;font-weight:800;color:#0F172A;">VIRYA CLEANTECH</span>
                    <span style="display:block;margin-top:3px;font-size:10px;font-weight:700;letter-spacing:1px;color:#059669;">CLEAN TECHNOLOGY</span>
                  </a>
                </td>
              </tr></table>
            </td>
            <td align="right" valign="middle" style="font-size:12px;line-height:1.6;color:#64748B;">${escapeHtml(data.date)}<br>${escapeHtml(data.time)}</td>
          </tr></table>
        </td></tr>

        <tr><td style="padding:28px 28px 12px;">
          <p style="display:inline-block;margin:0 0 12px;padding:5px 10px;background-color:#ECFDF5;border-radius:20px;font-size:11px;font-weight:700;color:#047857;">ENERGY &amp; PRODUCT UPDATE</p>
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0F172A;">Explore a smarter energy future for your facility.</h1>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#475569;">Hello ${escapeHtml(data.recipientName)},</p>
          <p style="margin:10px 0 0;font-size:15px;line-height:1.7;color:#475569;">Energy decisions start with how a site operates. We help businesses explore solar, EV charging, storage, connected-energy technology and assessments against facility needs, available information and project goals.</p>
        </td></tr>

        <tr><td style="padding:16px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;">
            <tr><td style="padding:20px;">
              <p style="margin:0 0 7px;font-size:11px;font-weight:700;letter-spacing:.7px;color:#15803D;text-transform:uppercase;">Featured focus</p>
              <h2 style="margin:0 0 8px;font-size:19px;line-height:1.4;color:#0F172A;">${escapeHtml(data.featuredService.title)}</h2>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#334155;">${escapeHtml(data.featuredService.cardSummary)}</p>
              <a href="https://virya-clean-tech-intg3.vercel.app/services/${escapeHtml(data.featuredService.slug)}" style="display:inline-block;padding:11px 18px;background-color:#059669;border-radius:5px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;">Explore the service &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:12px 28px 8px;">
          <h2 style="margin:0 0 14px;font-size:14px;letter-spacing:.5px;color:#475569;text-transform:uppercase;">Solutions shaped around your site</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${data.updates.map(serviceCard).join('')}</table>
        </td></tr>

        <tr><td style="padding:12px 28px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;">
            <tr><td style="padding:18px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.7px;color:#64748B;text-transform:uppercase;">India energy context</p>
              <p style="margin:0 0 6px;font-size:18px;font-weight:800;color:#047857;">${escapeHtml(insightLabel)}</p>
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0F172A;">${escapeHtml(data.insight.label)}</p>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#475569;">${escapeHtml(data.insight.note)}</p>
              <p style="margin:0;font-size:11px;line-height:1.5;color:#64748B;">${escapeHtml(data.insight.source)}${data.insight.asOf ? ` · ${escapeHtml(data.insight.asOf)}` : ''}${insightUrl ? ` · <a href="${insightUrl}" style="color:#047857;">Source</a>` : ''}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 28px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;">
            <tr><td style="padding:16px;font-size:12px;line-height:1.8;color:#475569;">
              <strong style="color:#0F172A;">A clear path forward</strong><br>
              01. Discovery &amp; consultation &nbsp;|&nbsp; 02. Custom design &amp; planning<br>
              03. Installation &amp; integration &nbsp;|&nbsp; 04. Monitoring &amp; support
            </td></tr>
          </table>
          <p style="margin:18px 0 0;text-align:center;"><a href="https://virya-clean-tech-intg3.vercel.app/request-consultation" style="display:inline-block;padding:12px 20px;background-color:#10B981;border-radius:5px;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;">Request a consultation &rarr;</a></p>
        </td></tr>

        <tr><td style="padding:24px 28px;background-color:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center;">
          <p style="margin:0 0 7px;font-size:14px;font-weight:800;color:#0F172A;">VIRYA CLEANTECH</p>
          <p style="margin:0 0 12px;font-size:12px;line-height:1.7;color:#64748B;">Explore solar, EV charging, storage, connected-energy technology and assessments for business and facility requirements.<br>No 2, 1st Floor, No 113 Yogjam Sai Charan Layout, Bengaluru, Karnataka 560036, India<br>
            <a href="tel:+918317494969" style="color:#047857;text-decoration:none;">+91 8317494969</a> &nbsp;|&nbsp;
            <a href="mailto:connect@viryacleantech.com" style="color:#047857;text-decoration:none;">connect@viryacleantech.com</a>
          </p>
          <p style="margin:0 0 12px;font-size:12px;">
            <a href="https://virya-clean-tech-intg3.vercel.app/" style="color:#047857;text-decoration:none;">Website</a> &nbsp;|&nbsp;
            <a href="https://virya-clean-tech-intg3.vercel.app/services" style="color:#047857;text-decoration:none;">Services</a> &nbsp;|&nbsp;
            <a href="mailto:connect@viryacleantech.com?subject=Unsubscribe" style="color:#64748B;text-decoration:underline;">Unsubscribe</a>
          </p>
          <p style="margin:0;font-size:11px;color:#94A3B8;">Copyright &copy; 2026 VIRYA CLEANTECH. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function generateViryaEmailText(data: NewsletterData): string {
  const servicesText = data.updates
    .map((service) => `${service.title}\n${service.cardSummary}`)
    .join('\n\n');

  return [
    `Hello ${data.recipientName},`,
    '',
    'Explore a smarter energy future for your facility.',
    'Virya helps businesses explore solar, EV charging, storage, connected-energy technology and assessments against facility needs and project goals.',
    '',
    `Featured focus: ${data.featuredService.title}`,
    data.featuredService.cardSummary,
    '',
    'SOLUTIONS SHAPED AROUND YOUR SITE',
    servicesText,
    '',
    `India energy context: ${data.insight.value} ${data.insight.unit} — ${data.insight.label}`,
    data.insight.note,
    `${data.insight.source}${data.insight.asOf ? ` · ${data.insight.asOf}` : ''}`,
    '',
    'Request a consultation: https://virya-clean-tech-intg3.vercel.app/request-consultation',
    'Virya CleanTech | connect@viryacleantech.com | +91 8317494969',
    'Unsubscribe: email connect@viryacleantech.com with subject Unsubscribe.',
  ].join('\n');
}