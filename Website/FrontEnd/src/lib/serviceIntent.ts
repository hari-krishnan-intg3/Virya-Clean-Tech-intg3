import type { ServiceValue } from './validation';

/**
 * Tiny pub/sub used to pass intent between sections.
 *
 * Service cards publish the service a visitor is interested in; the booking
 * form subscribes and pre-selects the matching dropdown option. This keeps the
 * two components fully decoupled — swapping in a real routing layer later only
 * requires replacing this module.
 */

const EVENT = 'virya:service-intent';

export function publishServiceIntent(service: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: service }));
}

export function subscribeServiceIntent(handler: (service: ServiceValue) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: Event) => {
    const detail = (event as CustomEvent<string>).detail;
    handler(detail as ServiceValue);
  };

  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}