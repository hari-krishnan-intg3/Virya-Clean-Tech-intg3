import type { ReportType } from './config';

/**
 * Reads and updates the "Reports KPI" tab — the executive dispatch dashboard
 * that lives in the shared workbook.
 *
 * Sheet layout (1-based rows, 0-indexed columns):
 *
 *   B2   title
 *   B3   generated line
 *   B5   KPI headings     B6 KPI values     B8 KPI sublabels
 *   B10  table headers    B11:F13 cadence   H11:J13 status
 */

export interface KpiSnapshot {
  totalReports: number;
  dailyReports: number;
  weeklyReports: number;
  monthlyReports: number;
  dispatchRate: string;
  generatedLine: string;
  cadence: {
    cadence: string;
    total: number;
    sent: number;
    pending: number;
    rate: string;
  }[];
  status: { category: string; count: number; share: string }[];
}

type Reader = (range: string) => Promise<string[][]>;
type Writer = (range: string, values: (string | number)[][]) => Promise<void>;

function toNumber(value: string | undefined): number {
  if (!value) return 0;
  const n = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export class KpiStore {
  private readonly fetchRange: Reader;
  private readonly putRange: Writer;

  constructor(fetchRange: Reader, putRange: Writer) {
    this.fetchRange = fetchRange;
    this.putRange = putRange;
  }

  /** Reads the current dashboard values. */
  async snapshot(): Promise<KpiSnapshot> {
    const rows = await this.fetchRange('A1:M16').catch(() => [] as string[][]);
    const cell = (r: number, c: number) => rows[r - 1]?.[c] ?? '';

    return {
      // Row 6 counters sit in B, D, F, H and J (0-indexed 1,3,5,7,9).
      // C, E, G and I are blank spacers and must not be read.
      totalReports: toNumber(cell(6, 1)),
      dailyReports: toNumber(cell(6, 3)),
      weeklyReports: toNumber(cell(6, 5)),
      monthlyReports: toNumber(cell(6, 7)),
      dispatchRate: cell(6, 9) || '0.0%',
      generatedLine: cell(3, 1),
      cadence: [11, 12, 13].map((r) => ({
        cadence: cell(r, 1),
        total: toNumber(cell(r, 2)),
        sent: toNumber(cell(r, 3)),
        pending: toNumber(cell(r, 4)),
        rate: cell(r, 5) || '0.0%',
      })),
      status: [11, 12, 13].map((r) => ({
        category: cell(r, 7),
        count: toNumber(cell(r, 8)),
        share: cell(r, 9) || '0.0%',
      })),
    };
  }

  /**
   * Increments the counters for `type` and refreshes every derived row:
   * totals, percentages, sublabels and the generated timestamp.
   */
  async increment(type: ReportType, ok: boolean): Promise<KpiSnapshot> {
    const current = await this.snapshot();

    const next: KpiSnapshot = { ...current };
    if (ok) {
      next.totalReports += 1;
      if (type === 'daily') next.dailyReports += 1;
      if (type === 'weekly') next.weeklyReports += 1;
      if (type === 'monthly') next.monthlyReports += 1;
    }

    const sentTotal = next.dailyReports + next.weeklyReports + next.monthlyReports;
    const rate =
      next.totalReports > 0 ? `${((sentTotal / next.totalReports) * 100).toFixed(1)}%` : '0.0%';
    const pendingTotal = Math.max(next.totalReports - sentTotal, 0);

    const row = (label: string, total: number, sent: number, pending: number) => [
      label,
      total,
      sent,
      pending,
      total > 0 ? `${((sent / total) * 100).toFixed(1)}%` : '0.0%',
    ];

    const cadenceTable = [
      row('Daily', next.dailyReports, next.dailyReports, 0),
      row('Weekly', next.weeklyReports, next.weeklyReports, 0),
      row('Monthly', next.monthlyReports, next.monthlyReports, 0),
      row('Total Overall', next.totalReports, sentTotal, pendingTotal),
    ];

    const statusTable = [
      ['Sent / Delivered', sentTotal, rate],
      [
        'Pending / Queue',
        pendingTotal,
        next.totalReports > 0 ? `${((pendingTotal / next.totalReports) * 100).toFixed(1)}%` : '0.0%',
      ],
      ['Total Tracked', next.totalReports, '100.0%'],
    ];

    const generated = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // KPI value row (row 6) — columns B, D, F, H, J with spacers between.
    await this.putRange('B6:J6', [
      [
        next.totalReports,
        '',
        next.dailyReports,
        '',
        next.weeklyReports,
        '',
        next.monthlyReports,
        '',
        rate,
      ],
    ]);

    // Sub-captions on row 8 live only in D, F, H and J. Writing the whole
    // B8:J8 span would erase the "Across 3 cadences" label in B8, so the
    // ranges are written individually.
    await this.putRange('D8:D8', [[`Sent: ${next.dailyReports}`]]);
    await this.putRange('F8:F8', [[`Sent: ${next.weeklyReports}`]]);
    await this.putRange('H8:H8', [[`Sent: ${next.monthlyReports}`]]);
    await this.putRange('J8:J8', [[ok ? 'Healthy' : 'Awaiting Data']]);

    // Cadence table (rows 11-14, columns B-F)
    await this.putRange('B11:F14', cadenceTable);

    // Status table (rows 11-13, columns H-J)
    await this.putRange('H11:J13', statusTable);

    // Clear the stray duplicate written to K:M by an earlier revision.
    await this.putRange('K11:M13', [['', '', ''], ['', '', ''], ['', '', '']]);

    // Timestamp line (row 3)
    await this.putRange('B3:B3', [
      [
        `Generated: ${generated}  |  Live Source: 'Reports'  |  ` +
          `Cadence: Daily • Weekly • Monthly  |  Status: ${ok ? 'Active Digest' : 'Awaiting Data'}`,
      ],
    ]);

    return {
      totalReports: next.totalReports,
      dailyReports: next.dailyReports,
      weeklyReports: next.weeklyReports,
      monthlyReports: next.monthlyReports,
      dispatchRate: rate,
      generatedLine: `Generated: ${generated}`,
      cadence: cadenceTable.slice(0, 3).map((r) => ({
        cadence: String(r[0]),
        total: Number(r[1]),
        sent: Number(r[2]),
        pending: Number(r[3]),
        rate: String(r[4]),
      })),
      status: statusTable.map((r) => ({
        category: String(r[0]),
        count: Number(r[1]),
        share: String(r[2]),
      })),
    };
  }
}