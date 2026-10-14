import type { JiraConfig } from './config';

/**
 * Lead intake → Jira.
 *
 * Every enquiry from the website becomes a **Task** in a dedicated leads
 * project, carrying who it came from, what they asked about, and the full
 * session context of the visit that produced it.
 *
 * The Task carries **subtasks** — the actual next actions — rather than a
 * paragraph of instructions that nobody ticks off. That matters: a lead with
 * three open subtasks reads as an open lead in every Jira board view and in
 * the daily report digest, whereas a lead that is one Task with a long
 * description reads as nothing at all.
 */

export interface LeadInput {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  consumption?: string;
  capacity?: string;
  location?: string;
  details?: string;
  source?: string;
  /** The visitor-session snapshot attached by the browser. */
  context?: Record<string, unknown>;
}

export interface CreatedLead {
  key: string;
  url: string;
  summary: string;
  subtasks: { key: string; summary: string }[];
  assignee: string | null;
}

/** How the leads project owner is addressed in Jira. */
export interface LeadProjectMeta {
  assigneeId?: string;
}

function authHeader(config: JiraConfig): string {
  return `Basic ${Buffer.from(`${config.email}:${config.apiToken}`, 'utf8').toString('base64')}`;
}

/** "2026-10-11T14:32:05+05:30" */
function isoNow(): string {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  const tz = `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;

  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${tz}`
  );
}

export function serviceLabel(service: string): string {
  const map: Record<string, string> = {
    solar: 'Solar Power',
    'ev-charging': 'EV Charging',
    battery: 'Battery & Storage',
    'software-iot': 'Smart Energy Software',
    consulting: 'Consulting & Audits',
    other: 'Other',
  };
  return map[service] ?? service;
}

/** Human line used in the issue summary and description. */
export function describeLead(lead: LeadInput): { summary: string; createdLine: string } {
  const created = isoNow();
  const who = lead.company ? `${lead.fullName} (${lead.company})` : lead.fullName;

  return {
    summary: `New lead — ${who}${lead.service ? ` · ${serviceLabel(lead.service)}` : ''}`,
    createdLine: `Lead created by ${lead.fullName} on ${created} (IST) from ${lead.source ?? 'website'}.`,
  };
}

/* ------------------------------------------------------------------ */
/* Session context                                                     */
/* ------------------------------------------------------------------ */

interface LeadSignal {
  label: string;
  value: string;
}

function asString(value: unknown, max = 120): string {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, max);
}

/**
 * Turns the raw session snapshot into lines worth putting on the ticket.
 * Intention score is a crude but useful proxy for how sales-ready the lead
 * is, and it is what the daily digest sorts by.
 */
function leadSignals(lead: LeadInput): LeadSignal[] {
  const context = (lead.context ?? {}) as Record<string, unknown>;
  const signals: LeadSignal[] = [];

  const services = Array.isArray(context.servicesViewed)
    ? (context.servicesViewed as unknown[]).map((s) => asString(s, 40)).filter(Boolean)
    : [];

  const pages = Array.isArray(context.pages) ? (context.pages as unknown[]) : [];

  const chatbotMessages = Number(context.chatbotMessages ?? 0);
  const scroll = Number(context.maxScrollDepth ?? 0);
  const active = Number(context.activeSeconds ?? 0);
  const submitted = Boolean(context.formSubmitted);

  signals.push({
    label: 'Landing page',
    value: asString(context.landingPage, 160) || '—',
  });

  if (pages.length) {
    signals.push({
      label: 'Pages viewed',
      value: `${pages.length} — ${(pages as unknown[]).slice(-8).map((p) => asString(p, 120)).join(' → ')}`,
    });
  }
  if (services.length) signals.push({ label: 'Service pages', value: services.join(', ') });

  if (scroll > 0) signals.push({ label: 'Deepest scroll', value: `${Math.round(scroll)}%` });
  if (active > 0) signals.push({ label: 'Active time', value: `${Math.round(active)}s` });
  if (Number(context.chatbotOpened ?? 0) > 0) {
    signals.push({ label: 'Assistant', value: `${chatbotMessages} messages` });
  }

  // 0–100. Weighted toward the actions that actually precede a purchase.
  let score = 0;
  if (submitted) score += 45;
  score += Math.min(20, chatbotMessages * 4);
  score += Math.round(Math.min(scroll, 100) / 10);
  score += Math.min(15, Math.round(active / 30));
  if (lead.phone) score += 5;
  if (lead.company) score += 5;
  if (lead.consumption) score += 5;
  score = Math.min(100, score);

  signals.push({ label: 'Intent score', value: `${score}/100` });

  if (context.referrer && context.referrer !== 'direct') {
    signals.push({ label: 'Referrer', value: asString(context.referrer, 200) });
  }
  if (context.timezone) {
    signals.push({
      label: 'Visitor clock',
      value: `${asString(context.timezone, 60)} · ${asString(context.localHour, 4)}:00 local`,
    });
  }
  if (context.device) {
    signals.push({
      label: 'Device',
      value: `${asString(context.device, 20)} ${asString(context.viewport, 24)}`.trim(),
    });
  }

  const utm = context.utm as Record<string, string> | undefined;
  if (utm && Object.keys(utm).length) {
    signals.push({
      label: 'Campaign',
      value: Object.entries(utm)
        .map(([k, v]) => `${k}=${asString(v, 80)}`)
        .join(' '),
    });
  }

  return signals;
}

/* ------------------------------------------------------------------ */
/* Subtasks                                                            */
/* ------------------------------------------------------------------ */

 /**
 * The next actions, chosen from what the lead actually told us.
 *
 * Kept to four at most — a lead with nine subtasks gets none of them closed.
 */
function buildSubtasks(lead: LeadInput): { summary: string; detail: string }[] {
  const subtasks: { summary: string; detail: string }[] = [];
  const scope = lead.service ? serviceLabel(lead.service) : 'the enquiry';
  const place = lead.location ?? 'their site';

  subtasks.push({
    summary: `Acknowledge within 1 business hour`,
    detail:
      `Reply to ${lead.email} acknowledging receipt and confirming when we will call. ` +
      `Required by the consent they ticked on the form.`,
  });

  if (lead.phone) {
    subtasks.push({
      summary: `Call ${lead.phone} to qualify`,
      detail: `Nine questions: monthly consumption, sanctioned load, roof area, peak hours, current tariff, ` +
        `outage cost, timeline, budget range, decision maker. Log answers on this issue.`,
    });
  } else {
    subtasks.push({
      summary: `Qualify by email — no phone number given`,
      detail: `Ask for consumption, sanctioned load, roof area and timeline by reply. Do not close until answered.`,
    });
  }

  if (lead.service && lead.service !== 'consulting') {
    subtasks.push({
      summary: `Send a scope outline and indicative range`,
      detail:
        `Service requested: ${serviceLabel(lead.service)}. Send the capability summary for ${scope} ` +
        `and an indicative band with the assumptions stated. Not a firm quote.`,
    });
  }

  subtasks.push({
    summary: `Book the technical call`,
    detail:
      `30 minutes with the technical lead. Confirm the agenda and ask for 12 months of half-hourly ` +
      `meter data plus electricity bills before the call, not during it.`,
  });

  if (lead.consumption || lead.capacity) {
    subtasks.push({
      summary: `Request interval data for ${place}`,
      detail: `Twelve months of half-hourly consumption and the full bill set. Without it the audit cannot ` +
        `be scoped properly and every downstream number is a guess.`,
    });
  }

  subtasks.push({
    summary: `Close the loop — quote, decline, or nurture`,
    detail: `Update this issue with the outcome and move it to the correct status. Un-quoted leads age badly.`,
  });

  return subtasks.slice(0, 5);
}

/* ------------------------------------------------------------------ */
/* Jira document helpers                                               */
/* ------------------------------------------------------------------ */

type AdfNode = Record<string, unknown>;

function paragraph(...lines: (string | null | undefined)[]): AdfNode {
  const text = lines.filter(Boolean).join(' ');
  return {
    type: 'paragraph',
    content: [{ type: 'text', text }],
  };
}

function heading(text: string): AdfNode {
  return {
    type: 'heading',
    attrs: { level: 4 },
    content: [{ type: 'text', text }],
  };
}

function bullets(items: string[]): AdfNode {
  return {
    type: 'bulletList',
    content: items.map((item) => ({
      type: 'listItem',
      content: [paragraph(item)],
    })),
  };
}

function buildDescription(lead: LeadInput, createdLine: string): AdfNode {
  const signals = leadSignals(lead);
  const intentScore = signals.find((s) => s.label === 'Intent score')?.value ?? '0/100';

  const contact: (string | undefined)[] = [
    `Name     ${lead.fullName}`,
    `Email    ${lead.email}`,
    lead.phone ? `Phone    ${lead.phone}` : undefined,
    lead.company ? `Company  ${lead.company}` : undefined,
    lead.service ? `Service  ${serviceLabel(lead.service)}` : undefined,
    lead.consumption ? `Consumption  ${lead.consumption}` : undefined,
    lead.capacity ? `Capacity  ${lead.capacity}` : undefined,
    lead.location ? `Location ${lead.location}` : undefined,
  ].filter(Boolean) as string[];

  const nonScoreSignals = signals.filter((s) => s.label !== 'Intent score');

  const content: AdfNode[] = [
    paragraph(`Intent score ${intentScore}. ${createdLine}`),
    heading('Contact'),
    paragraph(contact.join('   ')),
  ];

  if (lead.details) {
    content.push(heading('What they said'));
    content.push(paragraph(lead.details));
  }

  if (nonScoreSignals.length) {
    content.push(heading('Session context'));
    content.push(
      bullets(nonScoreSignals.map((signal) => `${signal.label}: ${signal.value || '—'}`)),
    );
  }

  content.push(
    paragraph(
      'Filed automatically from the website enquiry form. Assignee and subtasks were set by the ' +
        'lead pipeline — reassign freely.',
    ),
  );

  return {
    type: 'doc',
    version: 1,
    content,
  } as AdfNode;
}

/* ------------------------------------------------------------------ */
/* Project                                                             */
/* ------------------------------------------------------------------ */

/**
 * Checks that the leads project exists and is usable.
 *
 * Project creation over the REST API is disabled on many Jira tenants — on
 * yours `CREATE_PROJECTS` is not even a recognised permission, so this can
 * only verify. When the project is missing we return instructions instead of
 * failing silently: create it once in the Jira UI and this becomes a no-op.
 */
export async function ensureLeadsProject(
  config: JiraConfig,
  projectKey: string,
  projectName = 'Virya Leads',
): Promise<{ exists: boolean; key: string; hint?: string }> {
  const headers = {
    Authorization: authHeader(config),
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const existing = await fetch(`${config.baseUrl}/rest/api/3/project/${projectKey}`, { headers });
  if (existing.ok) return { exists: true, key: projectKey };

  // Best-effort auto-provision (works on tenants that allow it).
  const created = await fetch(`${config.baseUrl}/rest/api/3/project`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      key: projectKey,
      name: projectName,
      projectTypeKey: 'business',
      projectLead: config.email,
      assigneeType: 'PROJECT_LEAD',
    }),
  });

  if (created.ok) return { exists: true, key: projectKey };

  return {
    exists: false,
    key: projectKey,
    hint:
      `Jira project "${projectKey}" does not exist and could not be created automatically ` +
      `(HTTP ${created.status}). Create it once in Jira → Projects → Create, with key ` +
      `"${projectKey}" and name "${projectName}".`,
  };
}

/**
 * Resolves the account id to assign leads to.
 *
 * `JIRA_LEADS_ASSIGNEE_ID` is preferred because it is explicit. Failing that we
 * look the configured service account up via `/myself`, so the lead lands on a
 * real, assignable user rather than silently staying in the queue.
 */
export async function resolveAssignee(
  config: JiraConfig,
  configuredId: string | undefined,
): Promise<string | null> {
  if (configuredId) return configuredId;

  try {
    const response = await fetch(`${config.baseUrl}/rest/api/3/myself`, {
      headers: { Authorization: authHeader(config), Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { accountId?: string };
    return data.accountId ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Creation                                                            */
/* ------------------------------------------------------------------ */

function labelsFor(lead: LeadInput): string[] {
  const labels = ['lead', 'website'];
  if (lead.service) labels.push(`service-${lead.service}`.slice(0, 40));
  if (lead.company) labels.push('business');
  if (!lead.phone) labels.push('needs-phone');

  const context = (lead.context ?? {}) as Record<string, unknown>;
  if (Number(context.chatbotMessages ?? 0) > 2) labels.push('chat-engaged');
  if (Number(context.maxScrollDepth ?? 0) > 80) labels.push('deep-read');

  return [...new Set(labels)];
}

/**
 * Creates the parent Task with its subtasks and assignee.
 *
 * Subtasks are created inline in the same request where the tenant supports
 * it, and fall back to individual creations otherwise — older Jira Cloud
 * deployments reject `subtasks` in the create payload.
 */
export async function createLeadIssue(
  config: JiraConfig,
  projectKey: string,
  lead: LeadInput,
  meta: LeadProjectMeta = {},
): Promise<CreatedLead> {
  const { summary, createdLine } = describeLead(lead);
  const assigneeId = meta.assigneeId ?? null;
  const planned = buildSubtasks(lead);

  const fields: Record<string, unknown> = {
    project: { key: projectKey },
    summary,
    issuetype: { name: 'Task' },
    labels: labelsFor(lead),
    description: buildDescription(lead, createdLine),
  };

  if (assigneeId) fields.assignee = { accountId: assigneeId };

  // Inline subtasks: one round trip instead of six.
  fields.subtasks = planned.map((task) => ({
    issuetype: { name: 'Subtask' },
    summary: task.summary,
    description: {
      type: 'doc',
      version: 1,
      content: [paragraph(task.detail)],
    },
  }));

  const response = await fetch(`${config.baseUrl}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(config),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (response.ok) {
    const data = (await response.json()) as { key: string };
    return {
      key: data.key,
      url: `/browse/${data.key}`,
      summary,
      subtasks: planned.map((task) => ({ key: `${data.key}·sub`, summary: task.summary })),
      assignee: assigneeId,
    };
  }

  const body = await response.text();
  const rejectedSubtasks =
    response.status === 400 && /subtask|subtasks/i.test(body);

  if (!rejectedSubtasks) {
    throw new Error(`Lead issue creation failed (${response.status}): ${body.slice(0, 240)}`);
  }

  // Fallback: create the parent without subtasks, then add them one by one.
  delete fields.subtasks;
  const parentResponse = await fetch(`${config.baseUrl}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(config),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!parentResponse.ok) {
    const parentBody = await parentResponse.text();
    throw new Error(
      `Lead issue creation failed (${parentResponse.status}): ${parentBody.slice(0, 240)}`,
    );
  }

  const parent = (await parentResponse.json()) as { key: string };
  const created: { key: string; summary: string }[] = [];

  for (const task of planned) {
    try {
      const subResponse = await fetch(`${config.baseUrl}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          Authorization: authHeader(config),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            project: { key: projectKey },
            parent: { key: parent.key },
            issuetype: { name: 'Subtask' },
            summary: task.summary,
            ...(assigneeId ? { assignee: { accountId: assigneeId } } : {}),
            description: {
              type: 'doc',
              version: 1,
              content: [paragraph(task.detail)],
            },
          },
        }),
      });

      if (subResponse.ok) {
        const sub = (await subResponse.json()) as { key: string };
        created.push({ key: sub.key, summary: task.summary });
      }
    } catch {
      // A missing subtask must not lose the lead itself.
    }
  }

  return {
    key: parent.key,
    url: `/browse/${parent.key}`,
    summary,
    subtasks: created,
    assignee: assigneeId,
  };
}