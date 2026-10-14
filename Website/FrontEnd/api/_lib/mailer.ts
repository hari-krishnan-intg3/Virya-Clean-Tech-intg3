import type { MailConfig } from './config';

/**
 * Email delivery via Resend (plain fetch — no SDK).
 *
 * Swap `sendEmail` for another provider (Postmark, SendGrid, nodemailer) by
 * replacing this one function; nothing else depends on the vendor.
 */
export async function sendEmail(
  config: MailConfig,
  options: { subject: string; html: string; text: string },
): Promise<{ id: string }> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
    }),
  });

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(`Email send failed (${response.status}): ${JSON.stringify(data).slice(0, 300)}`);
  }

  return { id: data.id ?? 'unknown' };
}