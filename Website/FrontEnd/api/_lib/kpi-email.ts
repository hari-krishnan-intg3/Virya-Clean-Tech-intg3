import type { KpiSnapshot } from './kpi';

/**
 * Executive dispatch panel for the report email.
 *
 * Mirrors the "Reports KPI" sheet tab using the same colour language as the
 * rest of the report, so the email and the sheet read as one system.
 */

const C = {
  brand: '#10B981',
  brandDark: '#064E3B',
  tech: '#0EA5E9',
  violet: '#8B5CF6',
  text: '#1F2328',
  muted: '#57606A',
  subtle: '#8B949E',
  border: '#D0D7DE',
  surface: '#F6F8FA',
  surfaceAlt: '#EEF2F5',
} as const;

function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** A single labelled counter tile. */
export function kpiStat(
  label: string,
  value: string | number,
  accent: string,
  note = '',
): string {
  return `
    <td style="padding:0 4px;width:25%;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid ${C.border};border-radius:8px;background:#FFFFFF;">
        <tr><td style="padding:12px 10px;">
          <div style="font:600 10px/1.4 -apple-system,'Segoe UI',Roboto,sans-serif;
                      color:${C.subtle};text-transform:uppercase;letter-spacing:.5px;">
            ${esc(label)}
          </div>
          <div style="font:700 22px/1.2 -apple-system,'Segoe UI',Roboto,sans-serif;
                      color:${accent};margin-top:5px;">
            ${esc(String(value))}
          </div>
          ${note ? `<div style="font:400 10px/1.4 -apple-system,sans-serif;color:${C.muted};margin-top:3px;">${esc(note)}</div>` : ''}
        </td></tr>
      </table>
    </td>`;
}

function cadenceRows(kpi: KpiSnapshot): string {
  return kpi.cadence
    .filter((r) => r.cadence)
    .map(
      (r) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:600 13px/1.5 -apple-system,sans-serif;color:${C.text};">${esc(r.cadence)}</td>
        <td align="right" style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:700 13px/1.5 ui-monospace,Menlo,monospace;color:${C.text};">${r.total}</td>
        <td align="right" style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:700 13px/1.5 ui-monospace,Menlo,monospace;color:${C.brand};">${r.sent}</td>
        <td align="right" style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:700 13px/1.5 ui-monospace,Menlo,monospace;color:${C.muted};">${r.pending}</td>
        <td align="right" style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:700 13px/1.5 ui-monospace,Menlo,monospace;color:${C.tech};">${esc(r.rate)}</td>
      </tr>`,
    )
    .join('');
}

function statusRows(kpi: KpiSnapshot): string {
  return kpi.status
    .filter((r) => r.category)
    .map(
      (r) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:600 13px/1.5 -apple-system,sans-serif;color:${C.text};">${esc(r.category)}</td>
        <td align="right" style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:700 13px/1.5 ui-monospace,Menlo,monospace;color:${C.text};">${r.count}</td>
        <td align="right" style="padding:6px 8px;border-bottom:1px solid ${C.surfaceAlt};
                   font:700 13px/1.5 ui-monospace,Menlo,monospace;color:${C.muted};">${esc(r.share)}</td>
      </tr>`,
    )
    .join('');
}

/** Full dispatch/KPI block for the email body. */
export function kpiPanel(kpi: KpiSnapshot, kpiSheetUrl?: string): string {
  const link = kpiSheetUrl
    ? `<a href="${kpiSheetUrl}" target="_blank" rel="noopener"
         style="font:600 12px/1.4 -apple-system,sans-serif;color:${C.brandDark};text-decoration:none;">Open KPI sheet →</a>`
    : '';

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="border:1px solid ${C.border};border-radius:8px;background:#FFFFFF;
                margin-top:16px;overflow:hidden;">
    <tr>
      <td style="background:linear-gradient(135deg,${C.brandDark} 0%,${C.brand} 100%);padding:10px 14px;">
        <span style="font:700 12px/1.4 -apple-system,sans-serif;color:#FFFFFF;">
          📊 EXECUTIVE REPORT DISPATCH &amp; KPI DASHBOARD
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${kpiStat('Total Reports', kpi.totalReports, C.brandDark, 'all cadences')}
            ${kpiStat('Daily', kpi.dailyReports, C.brand, 'dispatches')}
            ${kpiStat('Weekly', kpi.weeklyReports, C.tech, 'dispatches')}
            ${kpiStat('Monthly', kpi.monthlyReports, C.violet, 'dispatches')}
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;">
          <tr>
            ${kpiStat('Dispatch Rate', kpi.dispatchRate, C.brandDark, 'delivery health')}
            <td style="padding:0 4px;width:75%;"></td>
          </tr>
        </table>

        <div style="margin-top:14px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};
                    text-transform:uppercase;letter-spacing:.6px;">Cadence breakdown</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
          <tr style="background:${C.surface};">
            <th align="left"  style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Cadence</th>
            <th align="right" style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Total</th>
            <th align="right" style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Sent</th>
            <th align="right" style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Pending</th>
            <th align="right" style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Rate</th>
          </tr>
          ${cadenceRows(kpi)}
        </table>

        <div style="margin-top:14px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};
                    text-transform:uppercase;letter-spacing:.6px;">Status category</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
          <tr style="background:${C.surface};">
            <th align="left"  style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Category</th>
            <th align="right" style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Count</th>
            <th align="right" style="padding:6px 8px;font:600 10px/1.4 -apple-system,sans-serif;color:${C.muted};">Share</th>
          </tr>
          ${statusRows(kpi)}
        </table>

        ${link ? `<div style="margin-top:12px;">${link}</div>` : ''}
      </td>
    </tr>
  </table>`;
}

/** Plain-text rendering of the KPI block for the text/plain alternative. */
export function kpiText(kpi: KpiSnapshot): string {
  const lines = [
    'EXECUTIVE REPORT DISPATCH & KPI DASHBOARD',
    ...'-'.repeat(41),
    `  Total Reports : ${kpi.totalReports}`,
    `  Daily         : ${kpi.dailyReports}`,
    `  Weekly        : ${kpi.weeklyReports}`,
    `  Monthly       : ${kpi.monthlyReports}`,
    `  Dispatch Rate : ${kpi.dispatchRate}`,
    '',
    '  Cadence    Total   Sent  Pending    Rate',
  ];

  for (const r of kpi.cadence.filter((c) => c.cadence)) {
    lines.push(
      `  ${r.cadence.padEnd(10)}${String(r.total).padStart(5)}${String(r.sent).padStart(7)}` +
        `${String(r.pending).padStart(9)}${r.rate.padStart(8)}`,
    );
  }

  lines.push('', '  Status              Count    Share');
  for (const s of kpi.status.filter((c) => c.category)) {
    lines.push(`  ${s.category.padEnd(18)}${String(s.count).padStart(5)}${s.share.padStart(9)}`);
  }

  return lines.join('\n');
}