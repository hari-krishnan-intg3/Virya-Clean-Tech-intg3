import type { ReportType } from './config.js';

/** Reporting timezone — India, matching the business. */
export const TZ = 'Asia/Kolkata';

export interface Period {
  type: ReportType;
  label: string;
  from: Date;
  to: Date;
  /** Human range, e.g. "12 Oct 2026 – 18 Oct 2026". */
  rangeLabel: string;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Monday-based week start. */
function startOfWeek(d: Date): Date {
  const copy = startOfDay(d);
  const day = copy.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function startOfMonth(d: Date): Date {
  const copy = startOfDay(d);
  copy.setDate(1);
  return copy;
}

export function getPeriod(type: ReportType, now = new Date()): Period {
  const to = new Date(now);

  let from: Date;
  let label: string;

  switch (type) {
    case 'daily':
      from = startOfDay(to);
      label = 'Daily Report';
      break;
    case 'weekly':
      from = startOfWeek(to);
      label = 'Weekly Report';
      break;
    case 'monthly':
      from = startOfMonth(to);
      label = 'Monthly Report';
      break;
  }

  return {
    type,
    label,
    from,
    to,
    rangeLabel: `${formatDate(from)} – ${formatDate(to)}`,
  };
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(d: Date): string {
  return d.toLocaleString('en-IN', {
    timeZone: TZ,
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}