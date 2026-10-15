import { z } from 'zod';
import { buildLeadContext } from './session';
import { markFormSubmitted } from './session';

/**
 * The consultation form's contract: schema, defaults and transport.
 *
 * Service values are the same slugs used by routes, the chatbot and Jira, so
 * a visitor who arrives from `/services/solar` and submits the form produces
 * one consistent record end to end.
 */
export const SERVICE_VALUES = [
  'solar',
  'ev-charging',
  'battery',
  'software-iot',
  'consulting',
  'other',
] as const;

export type ServiceValue = (typeof SERVICE_VALUES)[number];

export const bookingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(80, 'Please keep your name under 80 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^[+]?[\d][\d\s\-().]{6,18}\d$/.test(value),
      'Please enter a valid phone number, including the country code.',
    ),
  company: z.string().trim().max(120, 'Please keep this under 120 characters.').optional(),
  service: z.enum(SERVICE_VALUES, {
    errorMap: () => ({ message: 'Please choose the service you are interested in.' }),
  }),
  /** Monthly consumption in units — the single most useful qualification field. */
  consumption: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^[\d,.\s]{0,12}$/.test(value),
      'Please enter a number, for example 450000 or 4.5 lakh.',
    ),
  /** Rough roof area or site capacity in sq ft / kW, free text. */
  capacity: z
    .string()
    .trim()
    .max(80, 'Please keep this under 80 characters.')
    .optional(),
  location: z.string().trim().max(160, 'Please keep this under 160 characters.').optional(),
  details: z
    .string()
    .trim()
    .min(
      20,
      'Please share at least a couple of sentences (20+ characters) so we can help properly.',
    )
    .max(2000, 'Please keep your message under 2000 characters.'),
  consent: z.boolean().refine((value) => value === true, {
    message: 'Please confirm you agree to be contacted about this enquiry.',
  }),
  newsletterConsent: z.boolean().default(false),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const defaultBookingValues: BookingFormValues = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  service: undefined as unknown as ServiceValue,
  consumption: '',
  capacity: '',
  location: '',
  details: '',
  consent: false,
  newsletterConsent: false,
};

export interface BookingSubmission extends BookingFormValues {
  submittedAt: string;
  source: 'booking-form';
  /** Everything the session layer knows about this visit. */
  context: Record<string, unknown>;
}

export const LEADS_ENDPOINT =
  (import.meta.env.VITE_LEADS_ENDPOINT as string | undefined) || '/api/leads';

/**
 * Posts the enquiry.
 *
 * Sends submissions to the server-side Jira intake route by default.
 */
export async function submitBookingRequest(
  payload: BookingSubmission,
  signal?: AbortSignal,
): Promise<{ newsletterStatus: string }> {
  const body = JSON.stringify(payload);

  const response = await fetch(LEADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal,
  });
  const result = (await response.json().catch(() => null)) as
    | { ok?: boolean; newsletterStatus?: string }
    | null;
  if (!response.ok || result?.ok !== true) {
    throw new Error(`Lead intake failed (${response.status})`);
  }
  markFormSubmitted(payload.service);
  return { newsletterStatus: result.newsletterStatus ?? 'not-requested' };
}

/** Attaches the session snapshot so the server can file an enriched lead. */
export function buildSubmission(values: BookingFormValues): BookingSubmission {
  return {
    ...values,
    submittedAt: new Date().toISOString(),
    source: 'booking-form',
    context: buildLeadContext(),
  };
}