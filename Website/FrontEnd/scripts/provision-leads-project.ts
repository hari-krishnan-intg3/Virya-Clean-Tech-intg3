/**
 * One-time provisioning: creates the dedicated Jira leads project if it does
 * not already exist, and optionally seeds it with the screen types the
 * dashboard reports on.
 *
 *   npx tsx scripts/provision-leads-project.ts
 *
 * Requires the same env vars as the API (reads .env.local automatically).
 */
import { readFileSync, existsSync } from 'node:fs';

/* --------------------------- tiny .env loader -------------------------- */
function loadEnvLocal() {
  if (!existsSync('.env.local')) return;
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[m[1]] ??= value.replace(/\\n/g, '\n');
  }
}
loadEnvLocal();

const base = (process.env.JIRA_BASE_URL ?? '').replace(/\/+$/, '');
const email = process.env.JIRA_EMAIL ?? '';
const token = process.env.JIRA_API_TOKEN ?? '';
const key = process.env.JIRA_LEADS_PROJECT_KEY ?? 'LEADS';

if (!base || !email || !token) {
  console.error('Missing JIRA_BASE_URL / JIRA_EMAIL / JIRA_API_TOKEN');
  process.exit(1);
}

const auth = `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;
const headers = { Authorization: auth, Accept: 'application/json', 'Content-Type': 'application/json' };

/* ------------------------------- create -------------------------------- */
const existing = await fetch(`${base}/rest/api/3/project/${key}`, { headers });

if (existing.ok) {
  const p: any = await existing.json();
  console.log(`✓ Project "${key}" already exists — ${p.name}`);
} else {
  console.log(`Creating Jira project "${key}" (Virya Leads)…`);

  const created = await fetch(`${base}/rest/api/3/project`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      key,
      name: 'Virya Leads',
      projectTypeKey: 'business',
      leadAccountType: 'atlassian',
      assigneeType: 'PROJECT_LEAD',
      description:
        'Inbound website leads captured automatically for the executive reporting dashboard.',
      avatarIds: 10200,
    }),
  });

  if (!created.ok) {
    console.error(`✗ Failed (${created.status}):`, (await created.text()).slice(0, 400));
    process.exit(1);
  }

  const data: any = await created.json();
  console.log(`✓ Created project ${data.key} (id ${data.id})`);
}

/* ---------------------------- sample lead ------------------------------ */
if (process.argv.includes('--with-sample')) {
  console.log('Creating a sample lead task…');

  const now = new Date();
  const stamp = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const res = await fetch(`${base}/rest/api/3/issue`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      fields: {
        project: { key },
        summary: 'New lead — Sample Contact (Sample Co) · Solar Power',
        issuetype: { name: 'Task' },
        labels: ['lead', 'sample'],
        description: {
          type: 'doc',
          version: 1,
          content: [
            `Lead created on ${stamp} (IST) from provisioning script.`,
            '',
            '**Name** Sample Contact',
            '**Email** sample@example.com',
            '**Service** Solar Power',
          ].map((t) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] })),
        },
      },
    }),
  });

  if (res.ok) {
    const issue: any = await res.json();
    console.log(`✓ Sample lead created: ${issue.key}`);
  } else {
    console.error(`✗ Sample failed (${res.status}):`, (await res.text()).slice(0, 300));
  }
}

console.log('\nDone. Set JIRA_LEADS_PROJECT_KEY in your Vercel env to activate.');