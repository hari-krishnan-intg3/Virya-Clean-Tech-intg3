# Reports Automation — Virya Clean Tech

Automated **daily / weekly / monthly** email reports built from Jira, logged to
Google Sheets, and delivered by Resend. Runs on Vercel serverless functions.

```
Website/FrontEnd/
├── api/                          ← SERVER ONLY — never bundled into the browser
│   ├── reports.ts                # main handler
│   ├── preview.ts                # dry run — same data, no email, no writes
│   ├── leads.ts                  # lead intake → Jira + Sheets
│   ├── health.ts                 # config check
│   └── _lib/
│       ├── config.ts             # env loading + validation
│       ├── jira.ts               # Jira Cloud REST client (API v3)
│       ├── sheets.ts             # Sheets client, Service Account JWT
│       ├── tabs.ts               # auto-creates the Leads tab
│       ├── kpi.ts                # Reports KPI tab reader/writer
│       ├── kpi-email.ts          # executive dashboard panel
│       ├── leads.ts              # Jira lead task creation
│       ├── periods.ts            # daily/weekly/monthly window maths
│       ├── email.ts              # GitHub-style HTML template
│       └── mailer.ts             # Resend sender
├── scripts/                      # local runners & diagnostics
└── vercel.json                   # cron schedule
```

Full documentation: [`../../Reports/README.md`](../../Reports/README.md).

---

## ⚠️ Read this before deploying

You pasted live credentials into chat. **Rotate all three before going public:**

| Secret | Where to rotate |
| --- | --- |
| Jira API token | id.atlassian.com → Security → API tokens → Revoke, create new |
| Resend API key | resend.com/api-keys → delete, create new |
| Google service account key | GCP → IAM → Service Accounts → Keys → Delete, create new |

Then update `.env.local` and the Vercel environment variables.

---

## 1. Verified working

Everything below was tested live against your accounts, not assumed:

- ✅ Service account reads the workbook (titled **"The Reports"**)
- ✅ Tabs found: `Calander`, `LinkedIn`, `Youtube`, `Reports` (gid 2032005398), `Reports KPI` (gid 1229568148)
- ✅ Jira token authenticates as **Hari Krishnan C**; project **VCT** readable
- ✅ All three report emails delivered to harikrishnan.int2027g3@gmail.com
- ✅ `Reports` tab stamped with time + `Success` for all three cadences
- ✅ `Reports KPI` counters increment correctly (verified 1/1/1, total 3, 100% dispatch)

---

## 2. ⚠️ One manual step: the Jira leads project

Creating Jira projects over REST **is not permitted on your tenant** — the API
reports `CREATE_PROJECTS` as an unrecognised permission. The code attempts it
automatically and falls back with instructions, but you'll need to do it once by
hand:

> Jira → **Projects → Create** → key `LEADS`, name `Virya Leads`

Then set `JIRA_LEADS_PROJECT_KEY=LEADS` (already in `.env.local`).

The code is otherwise complete: every lead becomes a Task carrying
*"Lead created by {name} on {timestamp} (IST) from website"*.

---

## 3. Running it

```bash
npm run reports:verify   # test Jira + Sheets access
npm run reports:test     # send all 3 emails, NO sheet writes
npm run reports:live     # send all 3 emails AND update both tabs
```

Single report:

```bash
npx tsx scripts/run-reports.ts --type weekly --live
```

Diagnostics:

```bash
npx tsx scripts/dump-tab.ts "Reports KPI" "A1:M14"
npx tsx scripts/reset-kpi.ts
npm run reports:preview-html     # writes preview.html to eyeball the design
```

---

## 4. Deploying to Vercel

```bash
npm i -g vercel
vercel link
```

Add every variable from `.env.example` under **Settings → Environment
Variables**, then:

```bash
vercel --prod
```

Check it:

```bash
curl https://<your-domain>/api/health
```

**One-time deployment test** — fires all three, updates both tabs:

```bash
curl -X POST https://<your-domain>/api/reports \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"types":["daily","weekly","monthly"]}'
```

Add `"test": true` to send the emails *without* touching the sheets.

---

## 5. Schedule

`vercel.json` (08:00 UTC = 13:30 IST):

| Report | Cron |
| --- | --- |
| Daily | `0 8 * * *` |
| Weekly | `0 8 * * 1` (Mondays) |
| Monthly | `0 8 1 * *` |

Vercel Hobby allows once-daily cron, so this fits. With `CRON_SECRET` set,
Vercel sends `Authorization: Bearer <secret>` automatically and the handler
enforces it — strangers cannot trigger reports.

---

## 6. Email design

GitHub-markdown inspired, table-based and inline-styled so it survives every
mail client:

- Dark gradient banner — company, report label, date range
- Four KPI tiles: **Leads · Jira Created · Open Issues · Total Issues**
- Issues by Status / by Type with bar meters
- Recently created issues, each linking into Jira
- **📊 Executive Report Dispatch & KPI Dashboard** — mirrors the `Reports KPI`
  tab in the same colour language
- Automated generation timestamp in IST

Subject carries the headline numbers:

```
[Virya Reports] Daily Report · 11 Oct 2026 · 6 leads · 3 new issues
```

---

## 7. Wiring the website form to Jira

Set `VITE_LEADS_ENDPOINT=/api/leads` and `VITE_LEADS_KEY=<LEADS_INGEST_KEY>`
before building. Every consultation-form submission then:

1. creates a Task in the LEADS project with who/when,
2. appends a row to the `Leads` sheet tab (auto-created on first use),
3. flows into the Leads KPI on the next report.

Leave them blank and the form behaves as a local simulation.

---

## 8. Security notes

- All secrets are **un-prefixed** env vars → server-only. Never prefix them
  with `VITE_` (those get inlined into the public bundle).
- Verified: no credential strings appear in `dist/`.
- `/api/reports` requires the cron bearer token.
- `/api/health` reveals only *whether* a variable is set, never its value.
- The service-account key in `Reports/` is a full read/write credential —
  rotate it after go-live.