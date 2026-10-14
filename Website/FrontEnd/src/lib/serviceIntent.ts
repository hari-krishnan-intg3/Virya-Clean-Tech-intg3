import type { ServiceValue } from './validation';

/**
 * Service-intent bridge.
 *
 * When a visitor clicks "discuss this" on a service page we need the
 * consultation form to arrive with that service already selected. With a
 * router in place the durable answer is a query parameter
 * (`/request-consultation?service=solar`), which survives a refresh and can
 * be shared. This event bus covers the in-app shortcut — open the form
 * instantly without a round trip through the URL.
 *
 * Replacing this module with router state is the only change needed if the
 * site ever moves to a server-driven form.
 */

const EVENT = 'virya:service-intent';

function isServiceValue(value: string): value is ServiceValue {
  return (
    value === 'solar' ||
    value === 'ev-charging' ||
    value === 'battery' ||
    value === 'software-iot' ||
    value === 'consulting' ||
    value === 'other'
  );
}

export function publishServiceIntent(service: string): void {
  if (typeof window === 'undefined' || !isServiceValue(service)) return;
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: service }));
}

export function subscribeServiceIntent(handler: (service: ServiceValue) => void): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<string>).detail;
    if (isServiceValue(detail)) handler(detail);
  };

  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/** Reads `?service=` off a search string, if it names a real service. */
export function readServiceFromQuery(search: string): ServiceValue | null {
  const value = new URLSearchParams(search).get('service');
  return value && isServiceValue(value) ? value : null;
}

/** Builds the consultation URL for a service slug. */
export function consultationUrlFor(service: string): string {
  return isServiceValue(service) ? `/request-consultation?service=${service}` : '/request-consultation';
}