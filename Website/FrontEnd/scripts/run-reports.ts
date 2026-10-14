/**
 * End-to-end runner — executes the real handler locally against live Jira,
 * Sheets and Resend, without needing `vercel dev`.
 *
 *   npx tsx scripts/run-reports.ts                # test mode (no sheet writes)
 *   npx tsx scripts/run-reports.ts --live         # also writes to Sheets
 */
import { existsSync, readFileSync } from 'node:fs';

function loadEnvLocal() {
  if (!existsSync('.env.local')) return;
  for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    process.env[m[1]] ??= v.replace(/\\n/g, '\n');
  }
}
loadEnvLocal();

const live = process.argv.includes('--live');
if (live) process.env.DRY_RUN = 'false';

const typesArgumentIndex = process.argv.indexOf('--types');
const typesArgument = typesArgumentIndex >= 0 ? process.argv[typesArgumentIndex + 1] : undefined;
const types = typesArgument?.split(',').map((type) => type.trim()).filter(Boolean) ?? [
  'daily',
  'weekly',
  'monthly',
];

const { default: handler } = await import('../api/reports');

function mockRes() {
  const res: any = {
    statusCode: 0,
    body: null as any,
    headers: {} as Record<string, string>,
    setHeader(k: string, v: string) {
      this.headers[k] = v;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: any) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

const req: any = {
  method: 'POST',
  headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  query: {},
  body: { types, test: !live },
};

const res = mockRes();
await handler(req, res);

console.log(`\nHTTP ${res.statusCode}  mode=${live ? 'LIVE' : 'TEST (no sheet writes)'}`);
console.log(JSON.stringify(res.body, null, 2));