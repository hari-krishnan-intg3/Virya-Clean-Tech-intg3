import { z } from 'zod';

/** Service values double as analytics + CRM identifiers. */
export const SERVICE_VALUES = [
  'solar',
  'ev-charging',
  'battery',
  'iot',
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
      (value) =>
        !value ||
        /^[+]?[\d][\d\s\-().]{6,18}\d$/.test(value),
      'Please enter a valid phone number, including the country code.',
    ),

  company: z.string().trim().max(120, 'Please keep this under 120 characters.').optional(),

  service: z.enum(SERVICE_VALUES, {
    errorMap: () => ({ message: 'Please choose the service you are interested in.' }),
  }),

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
    message: 'Please confirm you agree to be contacted about your enquiry.',
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const defaultBookingValues: BookingFormValues = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  service: undefined as unknown as ServiceValue,
  location: '',
  details: '',
  consent: false,
};

export interface BookingSubmission extends BookingFormValues {
  submittedAt: string;
  /** Source of the enquiry, useful once analytics/CRM wiring is added. */
  source: 'booking-form';
}

/**
 * Where the consultation form should POST.
 *
 * Set `VITE_LEADS_ENDPOINT=/api/leads` (after deploying) so every submission
 * is filed into Jira and Google Sheets automatically. Blank = local
 * simulation, nothing leaves the browser.
 */
export const LEADS_ENDPOINT = (import.meta.env.VITE_LEADS_ENDPOINT as string | undefined) ?? '';

/** Sent as the `x-leads-key` header so the public endpoint can verify calls. */
export const LEADS_INGEST_KEY = (import.meta.env.VITE_LEADS_KEY as string | undefined) ?? '';

/**
 * Integration interface for the booking form.
 *
 * There is no backend on this prototype, so the default implementation
 * simulates a round-trip and clearly says so. To go live, point
 * `VITE_BOOKING_ENDPOINT` at your own API/CRM/webhook and it will be used
 * instead — no component changes required.
 */
export async function submitBookingRequest(
  payload: BookingSubmission,
  signal?: AbortSignal,
): Promise<void> {
  // Preferred path: the lead pipeline (Jira issue + Sheets row).
  if (LEADS_ENDPOINT) {
    const response = await fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(LEADS_INGEST_KEY ? { 'x-leads-key': LEADS_INGEST_KEY } : {}),
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Lead intake failed (${response.status})`);
    }
    return;
  }

  // Secondary path: a generic booking endpoint (CRM / form service).
  const endpoint = import.meta.env.VITE_BOOKING_ENDPOINT as string | undefined;

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Booking endpoint responded with ${response.status}`);
    }
    return;
  }

  // --- Prototype only ---------------------------------------------------
  // Simulates network latency so loading/success states can be exercised.
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, 1100);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  // Nothing is transmitted or stored. The UI states this explicitly.
}