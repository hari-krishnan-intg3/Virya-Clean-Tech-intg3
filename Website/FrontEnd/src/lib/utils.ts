import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { track } from './session';

/** Merge conditional class names, resolving conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Smooth-scroll to a section id, accounting for the fixed navbar. */
export function scrollToSection(id: string, offset = 76): void {
  const element = document.getElementById(id);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

/**
 * Stable event-tracking hook used by every component.
 *
 * Delegates to the session layer, which batches events and ships them to
 * `/api/session`. The `virya:track` CustomEvent is still dispatched so an
 * external analytics tool can be attached without touching this file.
 */
export function trackEvent(name: string, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  track(name, payload);

  window.dispatchEvent(
    new CustomEvent('virya:track', { detail: { event: name, ...payload, at: Date.now() } }),
  );
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));