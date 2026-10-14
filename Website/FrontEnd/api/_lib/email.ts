import type { JiraSnapshot } from './jira.js';
import type { KpiSnapshot } from './kpi.js';
import type { VercelAnalyticsSnapshot } from './vercel-analytics.js';
import { kpiPanel, kpiText } from './kpi-email.js';
import { formatDateTime, type Period } from './periods.js';

/**
 * Report email template.
 *
 * Deliberately styled after the GitHub Markdown email look: a dark banner
 * header, bordered "markdown" panels, and monospace values. Everything is
 * table-based and inline-styled because email clients strip <style> blocks.
 */

const C = {
  brand: '#10B981',
  brandDark: '#064E3B',
  tech: '#0EA5E9',
  text: '#1F2328',
  muted: '#57606A',
  subtle: '#8B949E',
  border: '#D0D7DE',
  surface: '#F6F8FA',
  surfaceAlt: '#EEF2F5',
  white: '#FFFFFF',
} as const;

export interface ReportData {
  period: Period;
  jira: JiraSnapshot;
  leads: number;
  leadsNote?: string;
  siteUrl: string;
  projectName: string;
  /** Executive dispatch counters read from the "Reports KPI" tab. */
  kpi?: KpiSnapshot;
  vercelAnalytics?: VercelAnalyticsSnapshot;
  analyticsNote?: string;
  /** Sheet URLs so the reader can jump straight to the data. */
  links?: { reports: string; kpi: string };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** One KPI tile in the dashboard grid. */
function statCard(label: string, value: number | string, accent: string, note = ''): string {
  return `
  <td width="25%" style="padding:0 4px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid ${C.border};border-radius:8px;background:${C.white};">
      <tr>
        <td style="padding:14px 12px;">
          <div style="font:600 11px/1.4 -apple-system,'Segoe UI',Roboto,sans-serif;
                      color:${C.subtle};text-transform:uppercase;letter-spacing:.6px;">
            ${escapeHtml(label)}
          </div>
          <div style="font:700 26px/1.2 -apple-system,'Segoe UI',Roboto,sans-serif;
                      color:${accent};margin-top:6px;">
            ${escapeHtml(String(value))}
          </div>
          ${
            note
              ? `<div style="font:400 11px/1.4 -apple-system,'Segoe UI',Roboto,sans-serif;
                        color:${C.muted};margin-top:4px;">${escapeHtml(note)}</div>`
              : ''
          }
        </td>
      </tr>
    </table>
  </td>`;
}

/** Bordered panel with a small caps heading — the "markdown block" look. */
function panel(title: string, body: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="border:1px solid ${C.border};border-radius:8px;background:${C.white};
                margin-top:16px;overflow:hidden;">
    <tr>
      <td style="background:${C.surface};border-bottom:1px solid ${C.border};
                 padding:8px 14px;font:600 12px/1.4 -apple-system,'Segoe UI',Roboto,sans-serif;
                 color:${C.text};">
        ${escapeHtml(title)}
      </td>
    </tr>
    <tr><td style="padding:12px 14px;">${body}</td></tr>
  </table>`;
}

/** Simple two-column breakdown list. */
function breakdown(rows: { type: string; count: number }[]): string {
  if (rows.length === 0) {
    return `<p style="margin:0;font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.muted};">
      No issues in this range.</p>`;
  }

  const max = Math.max(...rows.map((r) => r.count));

  return rows
    .map(
      (row) => `
    <tr>
      <td style="padding:4px 0;font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.text};">
        ${escapeHtml(row.type)}
      </td>
      <td width="120" align="right" style="padding:4px 0;font:700 13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:${C.text};">
        ${row.count}
      </td>
      <td width="45%" style="padding:4px 0 4px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="background:${C.surfaceAlt};border-radius:3px;">
          <tr>
            <td width="${Math.round((row.count / max) * 100)}%"
                style="background:${C.brand};border-radius:3px;font-size:0;line-height:0;">&nbsp;</td>
            <td style="font-size:0;line-height:0;">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>`,
    )
    .join('');
}

/** Table of recently created issues. */
function issueTable(issues: JiraSnapshot['recent'], siteUrl: string): string {
  if (issues.length === 0) {
    return `<p style="margin:0;font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.muted};">
      No issues were created in this period.</p>`;
  }

  const rows = issues
    .map(
      (issue) => `
    <tr>
      <td style="padding:7px 8px;border-bottom:1px solid ${C.surfaceAlt};white-space:nowrap;">
        <a href="${siteUrl}${issue.url}" target="_blank"
           style="font:700 12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;
                  color:${C.brandDark};text-decoration:none;">${escapeHtml(issue.key)}</a>
      </td>
      <td style="padding:7px 8px;border-bottom:1px solid ${C.surfaceAlt};
                 font:400 13px/1.5 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.text};">
        ${escapeHtml(issue.summary)}
      </td>
      <td style="padding:7px 8px;border-bottom:1px solid ${C.surfaceAlt};white-space:nowrap;
                 font:400 12px/1.5 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.muted};">
        ${escapeHtml(issue.status)}
      </td>
      <td style="padding:7px 8px;border-bottom:1px solid ${C.surfaceAlt};white-space:nowrap;
                 font:400 12px/1.5 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.muted};">
        ${escapeHtml(issue.assignee ?? 'Unassigned')}
      </td>
    </tr>`,
    )
    .join('');

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr style="background:${C.surface};">
      <th align="left"  style="padding:6px 8px;font:600 11px/1.4 -apple-system,sans-serif;color:${C.muted};">Key</th>
      <th align="left"  style="padding:6px 8px;font:600 11px/1.4 -apple-system,sans-serif;color:${C.muted};">Summary</th>
      <th align="left"  style="padding:6px 8px;font:600 11px/1.4 -apple-system,sans-serif;color:${C.muted};">Status</th>
      <th align="left"  style="padding:6px 8px;font:600 11px/1.4 -apple-system,sans-serif;color:${C.muted};">Assignee</th>
    </tr>
    ${rows}
  </table>`;
}

function webAnalyticsPanel(snapshot: VercelAnalyticsSnapshot): string {
  const pages = snapshot.topPages.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${snapshot.topPages
          .map(
            (page) => `<tr>
              <td style="padding:4px 0;font:400 12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:${C.text};">${escapeHtml(page.path)}</td>
              <td align="right" style="padding:4px 0;font:600 12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:${C.muted};">${page.pageViews} views · ${page.visitors} visitors</td>
            </tr>`,
          )
          .join('')}
      </table>`
    : `<p style="margin:0;font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.muted};">No page breakdown for this period.</p>`;

  return panel(
    'Vercel Web Analytics',
    `<p style="margin:0 0 10px;font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.text};">
      <strong>${snapshot.pageViews}</strong> page views · <strong>${snapshot.uniqueVisitors}</strong> unique visitors
    </p>${pages}`,
  );
}

export function renderReportEmail(data: ReportData): string {
  const { period, jira, leads, siteUrl, projectName } = data;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(period.label)} — ${escapeHtml(projectName)}</title>
</head>
<body style="margin:0;padding:0;background:${C.surfaceAlt};
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.surfaceAlt};">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <!-- ══ Banner ══ -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:680px;background:${C.brandDark};border-radius:10px 10px 0 0;overflow:hidden;">
          <tr>
            <td style="padding:22px 24px;
                       background:linear-gradient(135deg,${C.brandDark} 0%,${C.brand} 55%,${C.tech} 100%);">
              <div style="font:700 11px/1.4 -apple-system,sans-serif;color:rgba(255,255,255,.72);
                          text-transform:uppercase;letter-spacing:1.6px;">
                ${escapeHtml(projectName)} &nbsp;·&nbsp; Reports
              </div>
              <h1 style="margin:8px 0 0;font:800 26px/1.2 -apple-system,sans-serif;color:#FFFFFF;">
                ${escapeHtml(period.label)}
              </h1>
              <div style="margin-top:6px;font:400 13px/1.5 -apple-system,sans-serif;color:rgba(255,255,255,.82);">
                ${escapeHtml(period.rangeLabel)}
              </div>
            </td>
          </tr>
        </table>

        <!-- ══ Body ══ -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:680px;background:${C.white};border:1px solid ${C.border};
                      border-top:none;border-radius:0 0 10px 10px;">
          <tr>
            <td style="padding:20px 24px 24px;">

              <!-- Dashboard -->
              <div style="font:600 12px/1.4 -apple-system,sans-serif;color:${C.muted};
                          text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">
                Dashboard
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${statCard('Leads', leads, C.brand, 'new enquiries')}
                  ${statCard('Jira Created', jira.createdInRange, C.tech, 'in period')}
                  ${statCard('Open Issues', jira.open, '#D97706', 'awaiting work')}
                  ${statCard('Total Issues', jira.total, C.text, 'all time')}
                </tr>
              </table>

              ${panel('Issues by Status', `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${breakdown(jira.byStatus)}</table>`)}
              ${panel('Issues by Type', `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${breakdown(jira.byType)}</table>`)}
              ${panel(`Recently Created (${Math.min(jira.recent.length, 8)})`, issueTable(jira.recent, siteUrl))}
              ${data.vercelAnalytics ? webAnalyticsPanel(data.vercelAnalytics) : ''}
              ${!data.vercelAnalytics && data.analyticsNote ? panel('Vercel Web Analytics', `<p style="margin:0;font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,sans-serif;color:${C.muted};">${escapeHtml(data.analyticsNote)}</p>`) : ''}

              ${data.kpi ? kpiPanel(data.kpi, data.links?.kpi) : ''}

              <!-- Footer note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                     style="margin-top:18px;border:1px dashed ${C.border};border-radius:8px;">
                <tr>
                  <td style="padding:10px 14px;font:400 12px/1.6 -apple-system,sans-serif;color:${C.muted};">
                    Generated automatically on <strong>${escapeHtml(formatDateTime(new Date()))}</strong>
                    (IST) from Jira project
                    <code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
                                 background:${C.surfaceAlt};padding:1px 5px;border-radius:4px;">${escapeHtml(projectName)}</code>
                    ${data.leadsNote ? ` · ${escapeHtml(data.leadsNote)}` : ''}
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- ══ Footer ══ -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:680px;">
          <tr>
            <td align="center" style="padding:14px 0 0;font:400 11px/1.6 -apple-system,sans-serif;color:${C.subtle};">
              VIRYA CLEANTECH · Automated reporting ·
              <a href="${siteUrl}" target="_blank" style="color:${C.brandDark};text-decoration:none;">${escapeHtml(siteUrl)}</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text fallback (also used for the previews in the subject line). */
export function renderReportText(data: ReportData): string {
  const { period, jira, leads } = data;

  const lines = [
    `${data.projectName} — ${period.label}`,
    '='.repeat(46),
    `Period   : ${period.rangeLabel}`,
    `Generated: ${formatDateTime(new Date())}`,
    '',
    'DASHBOARD',
    `  Leads          : ${leads}`,
    `  Jira created   : ${jira.createdInRange}`,
    `  Open issues    : ${jira.open}`,
    `  Total issues   : ${jira.total}`,
    '',
    'BY STATUS',
    ...jira.byStatus.map((r) => `  ${r.type.padEnd(22)} ${r.count}`),
    '',
    'BY TYPE',
    ...jira.byType.map((r) => `  ${r.type.padEnd(22)} ${r.count}`),
    ...(data.vercelAnalytics
      ? [
          '',
          'VERCEL WEB ANALYTICS',
          `  Page views     : ${data.vercelAnalytics.pageViews}`,
          `  Unique visitors: ${data.vercelAnalytics.uniqueVisitors}`,
          ...data.vercelAnalytics.topPages.map(
            (page) => `  ${page.path} — ${page.pageViews} views, ${page.visitors} visitors`,
          ),
        ]
      : data.analyticsNote
        ? ['', 'VERCEL WEB ANALYTICS', `  ${data.analyticsNote}`]
        : []),
    ...(data.kpi ? ['', kpiText(data.kpi)] : []),
    '',
    'RECENTLY CREATED',
    ...jira.recent.map(
      (i) => `  ${i.key.padEnd(10)} ${i.summary.slice(0, 52).padEnd(54)} ${i.status}`,
    ),
  ];

  return lines.join('\n');
}

/** Subject line — label, date and headline numbers. */
export function buildSubject(period: Period, leads: number, jiraCreated: number): string {
  const date = period.to.toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `[Virya Reports] ${period.label} · ${date} · ${leads} leads · ${jiraCreated} new issues`;
}