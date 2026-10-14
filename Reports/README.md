# Virya Cleantech — Reports & Automation

This folder holds the **outputs and configuration** for the automated
reporting system. The executable code lives in `Website/FrontEnd/api/`.

```
Reports/
├── README.md            ← you are here
├── .need                ← original brief (raw notes)
├── sage-now-…json       ← Google Service Account key (SECRET — gitignored)
├── Daily/               ← generated daily report emails (.html)
├── Weekly/              ← generated weekly report emails (.html)
└── Monthly/             ← generated monthly report emails (.html)
```

## Service account key

`sage-now-511315-n5-ae3b62590bbd.json` is a **Google Service Account private
key**. Anyone holding it can read and write every sheet that account can reach.

It is currently stored in plain text here and in `.env.local`. Before this
project goes live:

1. Rotate the key in GCP → IAM → Service Accounts → Keys → **Delete + Create**.
2. Add the **new** key to `.env.local` and the Vercel environment.
3. Add `Reports/*.json` and `Website/FrontEnd/.env.local` to `.gitignore`.

## Where the code is

| Concern | Location |
| --- | --- |
| Endpoints | `Website/FrontEnd/api/` |
| Cron schedule | `Website/FrontEnd/vercel.json` |
| Local runner | `Website/FrontEnd/scripts/run-reports.ts` |
| Template preview | `Website/FrontEnd/scripts/render-preview.ts` |

## Run the reports locally

```bash
cd Website/FrontEnd

npx tsx scripts/run-reports.ts          # TEST  — emails only, no sheet writes
npx tsx scripts/run-reports.ts --live   # LIVE  — emails + writes to both tabs
npx tsx scripts/run-reports.ts --type weekly --live   # single report
```

Useful one-off utilities:

```bash
npx tsx scripts/verify-connections.ts   # test Jira + Sheets access
npx tsx scripts/dump-tab.ts "Reports KPI" "A1:M14"   # inspect a sheet tab
npx tsx scripts/reset-kpi.ts            # zero the KPI counters
npx tsx scripts/write-env-local.ts <path-to-sa.json>   # rebuild .env.local
```

## What each report contains

**Subject:** `[Virya Reports] <Daily|Weekly|Monthly> Report · <date> · <n> leads · <n> new issues`

**Body:**
1. Dark gradient banner — company, report label, date range
2. Four KPI tiles — Leads, Jira Created, Open Issues, Total Issues
3. Issues by Status (with bar meters)
4. Issues by Type
5. Recently created issues (links into Jira)
6. **Executive Report Dispatch & KPI Dashboard** — mirrors the `Reports KPI` tab
7. Generation timestamp

## Google Sheets it touches

Workbook: *The Reports*

| Tab | Direction | Purpose |
| --- | --- | --- |
| `Reports` | write | `Daily\|Time\|Sent Status\|Weekly\|…\|Monthly\|Time\|Sent Status` — stamped after each send |
| `Reports KPI` | read + write | Executive dispatch dashboard; counters increment per send |
| `Leads` | read + write | Created automatically on the first lead; source for the Leads KPI |