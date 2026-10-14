import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadConfig } from './_lib/config';
import { appendRows, readTab, writeTab } from './_lib/sheets';
import { ensureTab } from './_lib/tabs';
import { authHeader } from './_lib/jira';

/**
 * Careers applications.
 *
 * Deliberately a separate endpoint from `/api/leads`.
 *
 * A job application is not a sales lead, and letting it into the same funnel
 * would corrupt the numbers that drive every commercial decision made on
 * this site. So applications get their own Jira label, their own sheet tab,
 * and never touch the lead pipeline or the daily report.
 *
 * Failures are per-destination: if Jira is down, the application still
 * reaches the sheet, and the response says so.
 */

interface Application {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  roleLabel?: string;
  experience?: string;
  portfolio?: string;
  message?: string;
  consent?: boolean;
  source?: string;
}

const HEADERS = [
  'Received',
  'Name',
  'Email',
  'Phone',
  'Role',
  'Experience (yrs)',
  'Portfolio / Resume',
  'Message',
  'Jira Key',
  'Source',
];

function text(value: unknown, max = 500): string {
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, max);
}

/** Jira Cloud field names reject spaces and some punctuation. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = (req.body ?? {}) as Application;

  const fullName = text(body.fullName, 120);
  const email = text(body.email, 200).toLowerCase();
  const message = text(body.message, 3000);
  const roleLabel = text(body.roleLabel, 120) || 'Open application';

  if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A name and a valid email address are required.' });
  }
  if (message.length < 20) {
    return res.status(400).json({
      error: 'Please include at least a couple of sentences about why you are applying.',
    });
  }
  if (body.consent !== true) {
    return res.status(400).json({ error: 'Consent is required to process an application.' });
  }

  const received = new Date().toISOString();
  const phone = text(body.phone, 40);
  const portfolio = text(body.portfolio, 400);
  const experience = text(body.experience, 40);
  const projectKey = process.env.JIRA_CAREERS_PROJECT_KEY ?? process.env.JIRA_LEADS_PROJECT_KEY;

  let config;
  try {
    config = loadConfig();
  } catch (error) {
    // Without Sheets/Jira configured, tell the visitor to email instead of
    // silently dropping their application on the floor.
    console.error('[careers] not configured:', (error as Error).message);
    return res.status(503).json({
      error: 'Applications are not available online right now.',
      fallback: 'careers@viryacleantech.com',
    });
  }

  const errors: string[] = [];
  let jiraKey = '';
  let sheetWritten = false;

  // ── Jira ──────────────────────────────────────────────────────────
  if (projectKey) {
    try {
      const response = await fetch(`${config.jira.baseUrl}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          Authorization: authHeader(config.jira),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            project: { key: projectKey },
            issuetype: { name: 'Task' },
            // `careers`, never `lead` — keeps applications out of the funnel.
            labels: ['careers', 'application', `role-${slugify(roleLabel)}`],
            summary: `Application — ${roleLabel} — ${fullName}`,
            description: {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: `Applied ${received} via the careers page. Consent given: yes.`,
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: [
                        `Name       ${fullName}`,
                        `Email      ${email}`,
                        phone ? `Phone      ${phone}` : '',
                        `Role       ${roleLabel}`,
                        experience ? `Experience ${experience}` : '',
                        portfolio ? `Portfolio  ${portfolio}` : '',
                      ]
                        .filter(Boolean)
                        .join('   '),
                    },
                  ],
                },
                { type: 'heading', attrs: { level: 4 }, content: [{ type: 'text', text: 'Message' }] },
                { type: 'paragraph', content: [{ type: 'text', text: message }] },
              ],
            },
            ...(config.leadsAssigneeId ? { assignee: { accountId: config.leadsAssigneeId } } : {}),
            subtasks: [
              {
                issuetype: { name: 'Subtask' },
                summary: 'Acknowledge within 2 working days',
                description: {
                  type: 'doc',
                  version: 1,
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Reply either way — including when the role is filled. Silence is the one outcome we never want.',
                        },
                      ],
                    },
                  ],
                },
              },
              {
                issuetype: { name: 'Subtask' },
                summary: 'Read properly and log a verdict',
                description: {
                  type: 'doc',
                  version: 1,
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Shortlist, hold, or decline — with one line of reasoning. The reasoning is what makes the decision reviewable.',
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        }),
      });

      if (response.ok) {
        jiraKey = ((await response.json()) as { key: string }).key;
      } else {
        const detail = await response.text();
        errors.push(`jira: ${response.status} ${detail.slice(0, 160)}`);
      }
    } catch (error) {
      errors.push(`jira: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ── Sheets ────────────────────────────────────────────────────────
  const tab = process.env.SHEETS_CAREERS_TAB ?? 'Careers';
  try {
    await ensureTab(config.sheets, config.google, tab);

    const current = await readTab(config.sheets, config.google, tab, 'A1:A2');
    if (current.length === 0) {
      await writeTab(config.sheets, config.google, tab, 'A1:J1', [HEADERS]);
    }

    await appendRows(config.sheets, config.google, tab, 'A:J', [
      [
        received,
        fullName,
        email,
        phone,
        roleLabel,
        experience,
        portfolio,
        message,
        jiraKey,
        text(body.source, 60) || 'careers-page',
      ],
    ]);

    sheetWritten = true;
  } catch (error) {
    errors.push(`sheets: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Both destinations failed — that is a real failure, so say so.
  if (!jiraKey && !sheetWritten) {
    return res.status(502).json({
      error: 'Your application could not be stored. Please email careers@viryacleantech.com.',
      errors,
    });
  }

  return res.status(200).json({
    ok: true,
    receivedAt: received,
    role: roleLabel,
    jiraKey: jiraKey || null,
    sheetWritten,
    errors: errors.length ? errors : undefined,
  });
}