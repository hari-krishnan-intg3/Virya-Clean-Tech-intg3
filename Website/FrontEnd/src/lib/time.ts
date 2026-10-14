/**
 * Timezone-aware helpers.
 *
 * Everything here works in the *visitor's* timezone rather than the
 * browser's, so a visitor in London browsing the Bengaluru office gets a
 * sensible greeting and a sensible answer about whether anyone is awake.
 */

export type PartOfDay = 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface VisitorTime {
  /** IANA zone, e.g. "Europe/London". */
  timezone: string;
  hour: number;
  minute: number;
  /** 0 = Sunday. */
  weekday: number;
  day: string;
  date: string;
  time: string;
  partOfDay: PartOfDay;
}

const PARTS: { from: number; to: number; part: PartOfDay }[] = [
  { from: 5, to: 7, part: 'early-morning' },
  { from: 7, to: 12, part: 'morning' },
  { from: 12, to: 17, part: 'afternoon' },
  { from: 17, to: 21, part: 'evening' },
];

export function partOfDay(hour: number): PartOfDay {
  const match = PARTS.find((p) => hour >= p.from && hour < p.to);
  return match ? match.part : 'night';
}

/** Current wall-clock time in a specific IANA zone. */
export function timeIn(timezone: string, now = new Date()): VisitorTime {
  const safeZone = safeTimezone(timezone);

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: safeZone,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour12: false,
  }).formatToParts(now);

  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? '';

  const hour = Number(pick('hour')) % 24;
  const weekdayKey = pick('weekday').slice(0, 2);

  return {
    timezone: safeZone,
    hour,
    minute: Number(pick('minute')),
    weekday: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].indexOf(weekdayKey),
    day: pick('weekday'),
    date: `${pick('day')} ${pick('month')} ${pick('year')}`,
    time: `${String(hour).padStart(2, '0')}:${pick('minute')}`,
    partOfDay: partOfDay(hour),
  };
}

/** Guards against a bad IANA zone throwing inside Intl. */
export function safeTimezone(timezone?: string | null): string {
  if (!timezone) return 'Asia/Kolkata';
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: timezone });
    return timezone;
  } catch {
    return 'Asia/Kolkata';
  }
}

/** The visitor's own zone, falling back to the business zone. */
export function visitorTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}

/* ------------------------------------------------------------------ */
/* Office awareness                                                    */
/* ------------------------------------------------------------------ */

export interface OfficeStatus {
  /** Is the Bengaluru office open right now? */
  open: boolean;
  /** Same, but phrased for the visitor's timezone. */
  visitorHour: number;
  /** "Tomorrow morning", "after the weekend", "in about 3 hours". */
  nextOpenLabel: string;
}

/**
 * Whether the Bengaluru team is reachable, and when they next will be.
 * The office runs Mon–Sat, 10:00–19:00 IST.
 */
export function officeStatus(
  now = new Date(),
  hours = { open: 10, close: 19 },
  timezone = 'Asia/Kolkata',
): OfficeStatus {
  const ist = timeIn(timezone, now);
  const visitor = timeIn(visitorTimezone(), now);

  const isWeekend = ist.weekday === 0; // Sunday
  const inHours = ist.hour >= hours.open && ist.hour < hours.close;
  const open = !isWeekend && inHours;

  if (open) return { open: true, visitorHour: visitor.hour, nextOpenLabel: 'now' };

  // Works out how long until the office next opens, in IST hours.
  let hoursUntil: number;
  if (isWeekend) hoursUntil = ist.hour < hours.open ? hours.open - ist.hour : 24 - ist.hour + hours.open;
  else if (ist.hour < hours.open) hoursUntil = hours.open - ist.hour;
  else hoursUntil = 24 - ist.hour + hours.open;

  let nextOpenLabel: string;
  if (hoursUntil <= 1) nextOpenLabel = 'in about an hour';
  else if (hoursUntil <= 4) nextOpenLabel = `in about ${Math.round(hoursUntil)} hours`;
  else if (hoursUntil <= 14) nextOpenLabel = 'tomorrow morning';
  else nextOpenLabel = isWeekend ? 'after the weekend' : 'tomorrow';

  return { open: false, visitorHour: visitor.hour, nextOpenLabel };
}

/* ------------------------------------------------------------------ */
/* Greeting                                                            */
/* ------------------------------------------------------------------ */

export interface Greeting {
  /** Salutation that matches the visitor's local time of day. */
  salutation: string;
  /** Full opening line. */
  line: string;
  /** Follow-up prompt. */
  lead: string;
  /** True when the office is shut, so we steer to the form instead of chat. */
  officeClosed: boolean;
  nextOpenLabel: string;
  time: VisitorTime;
}

const SALUTATIONS: Record<PartOfDay, string> = {
  'early-morning': 'Good early morning',
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  night: 'Good evening',
};

/**
 * Builds a greeting from the visitor's own clock. Called once per session,
 * on the first render of the chatbot panel.
 */
export function buildGreeting(context?: { path?: string; service?: string }): Greeting {
  const zone = visitorTimezone();
  const time = timeIn(zone);
  const office = officeStatus();

  const salutation = SALUTATIONS[time.partOfDay];

  const opener =
    time.partOfDay === 'night'
      ? `${salutation} — it is ${time.time} your time, so I will keep this short.`
      : `${salutation} — it is ${time.time} in ${shortZone(zone)}.`;

  const officeLine = office.open
    ? 'Our Bengaluru team is online until 19:00 IST if you would rather talk to a person.'
    : `Our Bengaluru team is offline right now and reopens ${office.nextOpenLabel}. I can answer most questions now, or you can leave your details and someone will call you.`;

  const lead = context?.service
    ? `You are looking at ${context.service}. Ask me anything about it, or pick one of these.`
    : 'Tell me what you are trying to solve, or pick one of these to start.';

  return {
    salutation,
    line: `${opener} I am Virya's energy assistant — I can scope a project, sanity-check a quote, or explain what we do. ${officeLine}`,
    lead,
    officeClosed: !office.open,
    nextOpenLabel: office.nextOpenLabel,
    time,
  };
}

/** "Asia/Kolkata" → "IST". Falls back to the zone name for unknown zones. */
export function shortZone(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone;
  } catch {
    return timezone;
  }
}

/**
 * Live-updating clock string for the launcher badge, e.g. "14:32 IST".
 */
export function visitorClock(timezone = visitorTimezone()): string {
  const t = timeIn(timezone);
  return `${t.time} ${shortZone(timezone)}`;
}