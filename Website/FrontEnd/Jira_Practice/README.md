# Jira Practice: Countdown Timers and SLA Tracking

Open `/jira-practice` on the deployed site to visualize the workflow.

The module uses the existing server-only Jira environment variables:

- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_PROJECT_KEY` (defaults to `VCT`)
- `JIRA_PRACTICE_PROJECT_KEY` (optional override)
- `CRON_SECRET` (used by the Vercel hourly trigger)

## Workflow

1. **Set up custom fields** creates or reuses `Countdown`, `Time to Review`,
   and `SLA State` in Jira.
2. **Seed five test leads** creates idempotent `[TEST]` issues in the selected
   project with the `jira-sla-practice` label.
3. **Run hourly check** recalculates the countdown values, adds warning or
   breach labels, and transitions a breached issue to `Escalated` when that
   transition exists in the project workflow.

The same check runs from Vercel Cron once daily on the Hobby plan at `0 8 * * *` with:

```text
POST /api/jira-practice?operation=tick
Authorization: Bearer $CRON_SECRET
```

All Jira and Vercel credentials stay in server environment variables. The
browser receives issue status and countdown values only.

Vercel Hobby does not allow hourly cron jobs. After upgrading the project to
Vercel Pro, change the schedule in `vercel.json` back to `0 * * * *` for the
requested hourly automation; the dashboard button can run the same check at
any time on the current plan.