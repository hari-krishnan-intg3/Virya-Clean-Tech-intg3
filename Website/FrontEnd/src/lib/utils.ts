import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

/** Stable, dependency-free event tracking hook for future analytics wiring. */
export function trackEvent(name: string, payload: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  const detail = { event: name, ...payload, at: Date.now() };

  // Default sink: a DOM CustomEvent. Connect GA4 / Plausible / Segment by
  // listening to `virya:track` on window — no other file needs to change.
  window.dispatchEvent(new CustomEvent('virya:track', { detail }));
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));