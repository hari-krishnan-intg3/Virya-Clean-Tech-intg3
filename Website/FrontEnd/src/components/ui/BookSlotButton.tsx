/**
 * "Book a Slot" — Google Calendar Appointment Scheduling.
 *
 * WHAT THIS COMPONENT DOES
 * ------------------------
 * It renders ONE clean, on-brand button that opens the Google Calendar
 * scheduling page in a NEW TAB. It deliberately does NOT embed Google's
 * generated widget, because that widget:
 *   - flashes an unstyled loading state,
 *   - injects inline styles that clash with the site design, and
 *   - owns its own click behaviour.
 *
 * Instead the button is a normal anchor to the schedule URL with
 * `target="_blank"`, and the connector in
 * `Google Calender/google-calendar-scheduler.js` remains available for anyone
 * who wants the official Google-hosted widget instead
 * (`window.viryaCalendar.mount(...)`).
 *
 * Because it is a plain link, it works with JavaScript disabled, has no
 * loading state, and can never leave a dead CTA on the page.
 */

import { CalendarDays } from 'lucide-react';
import { cn, trackEvent } from '@/lib/utils';

/** Kept in sync with Google Calender/google-calendar-scheduler.js */
const SCHEDULE_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1-Myc88FYtEND8wgo8SVAbjqdR0VooEdkm1qr7NJlCLMl-u3qwJNZkU7sRk9UVE0FWjF6NPB6c?gv=true';

export interface BookSlotButtonProps {
  className?: string;
  size?: 'md' | 'lg';
  label?: string;
  /** Placement identifier used for conversion tracking. */
  placement?: string;
}

export function BookSlotButton({
  className,
  size = 'md',
  label = 'Book a Slot',
  placement = 'unknown',
}: BookSlotButtonProps) {
  return (
    <a
      href={SCHEDULE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('booking_slot_opened', { placement })}
      className={cn(
        'btn group',
        size === 'lg' ? 'btn-primary-lg' : 'btn-primary',
        className,
      )}
    >
      <CalendarDays
        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      />
      {label}
      <span className="sr-only"> (opens the booking calendar in a new tab)</span>
    </a>
  );
}