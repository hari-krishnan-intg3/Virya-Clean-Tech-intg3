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

## 2. Jira lead destination

Website enquiries are created as Tasks in the existing `VCT` project. No
separate leads project or project-creation permission is needed. Each issue
includes the contact details, request, session context, intent score, and
follow-up subtasks.

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

Website analytics and lead-sheet utilities:

```bash
npm run analytics:setup   # create the Vercel Analytics sheet tab
npm run sessions:setup    # migrate the Sessions tab headers
npm run leads:sync        # idempotently backfill non-test Jira leads
npm run test:intelligence # 30 synthetic behavior tests; no production writes
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

For Redis-backed session tracking, set `REDIS_URL` to the full connection URL
from Redis Cloud in Vercel as a server-only variable. Do not use a `VITE_`
prefix or commit the URL. Session records expire after 90 days; the existing
consent and Do Not Track checks remain in effect. Verify the deployed connection
with `GET /api/session?health=1` (it reports the storage type, never credentials).

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

Add `"test": true` to send emails without touching the sheets. Test dispatch
requires the separate `VERCEL_SECURITY_CONTROLLER` header and configured Vercel
analytics; it fails closed instead of sending a report without metrics. Normal
report dispatch continues to require the `CRON_SECRET` bearer token.
For five analytics-bearing test emails, use this request body:

```json
{"types":["daily","daily","daily","daily","daily"],"test":true,"recordAnalytics":true}
```

Send it with `x-vercel-security-controller: <VERCEL_SECURITY_CONTROLLER>`.
`recordAnalytics` writes only the Vercel Analytics snapshot; it does not update
the report log or KPI counters.

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

The consultation form posts to `/api/leads` by default; no Vite variable or
browser API key is required. Configure `JIRA_BASE_URL`, `JIRA_EMAIL`, and
`JIRA_API_TOKEN` as server-side environment variables in Vercel. Every
consultation-form submission then:

1. creates a Task in the `VCT` project with who/when,
2. appends a row to the `Leads` sheet when its Google and Sheets settings are configured.

The API checks the browser request's origin. If Jira rejects issue creation,
the API returns an error and the form does not show a false success state.

## Controller accounts

Controller users are stored in PostgreSQL in `controller_users`; the table is
created on first use and its migration is in `db/migrations/001_controller_users.sql`.
Configure `DATABASE_URL`, a random `CONTROLLER_SESSION_SECRET` of at least 32
bytes, and separate random `CONTROLLER_REGISTRATION_SECRET` and optional
`CONTROLLER_ADMIN_REGISTRATION_SECRET` values in local env and Vercel. Keep all
of them server-side. `JIRA_AUTOMATION_CONTROLLER=CON` and
`JIRA_SECURITY_CONTROLLER=SEQ` are controller identifiers, not credentials.

Registration accepts an invite key in `x-controller-registration-key`; the
operator key creates an `operator`, while the separate admin key creates an
`admin`. The client cannot choose its role. Passwords are bcrypt-hashed before
insertion. Login sets an eight-hour, signed, HttpOnly, SameSite=Strict cookie;
logout clears it. `POST /api/controller/issues` requires that session and
allows scoped lead creation. Update and delete requests are denied to operators
and remain unimplemented for admins until dedicated Jira workflows exist.

Website lead and careers forms remain public endpoints so visitors can submit
them; they only create issues in their configured projects using the separate
server-side `JIRA_API_TOKEN`. They do not accept Jira credentials or arbitrary
project/operation requests from the browser.

Example registration request (replace values locally; never commit them):

```bash
curl -i -c controller.cookies -X POST https://<your-domain>/api/controller-auth/register \
  -H 'Origin: https://<your-domain>' \
  -H 'x-controller-registration-key: <invite-key>' \
  -H 'Content-Type: application/json' \
  -d '{"username":"operator1","password":"use-a-unique-12-character-or-longer-password"}'
```

Daily, weekly, and monthly report crons are defined in `vercel.json`. Reports
backfill Jira leads before counting the Leads tab and write Vercel pageview /
unique-visitor totals to `Vercel Analytics`. Configure `VERCEL_CONTROLLER`
server-side to enable API metrics (`VERCEL_ACCESS_TOKEN` remains a legacy
alias). Test email dispatch also requires a separate `VERCEL_SECURITY_CONTROLLER`
secret; never reuse `CRON_SECRET`.

---

## 8. Security notes

- All secrets are **un-prefixed** env vars → server-only. Never prefix them
  with `VITE_` (those get inlined into the public bundle).
- Verified: no credential strings appear in `dist/`.
- Normal `/api/reports` dispatch requires the cron bearer token. Test dispatch
  uses the separate `VERCEL_SECURITY_CONTROLLER` header and refuses to send
  unless Vercel analytics can be fetched.
- `/api/health` reveals only *whether* a variable is set, never its value.
- The service-account key in `Reports/` is a full read/write credential —
  rotate it after go-live.