import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Mail,
  RotateCcw,
  Send,
} from 'lucide-react';
import {
  bookingSchema,
  defaultBookingValues,
  submitBookingRequest,
  type BookingFormValues,
} from '@/lib/validation';
import { trackEvent } from '@/lib/utils';
import { subscribeServiceIntent } from '@/lib/serviceIntent';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { CONTACT } from '@/app/siteConfig';
import { BookSlotButton, Button, FieldShell, SectionHeading, fieldA11y } from '@/components/ui';

const SERVICE_OPTIONS: { value: BookingFormValues['service']; label: string }[] = [
  { value: 'solar', label: 'Solar Power' },
  { value: 'ev-charging', label: 'EV Charging' },
  { value: 'battery', label: 'Battery Technology' },
  { value: 'iot', label: 'IoT Integration' },
  { value: 'consulting', label: 'Energy Audit' },
  { value: 'other', label: 'Other' },
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function BookingFormContainer() {
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: defaultBookingValues,
    mode: 'onBlur',
  });

  // Service cards publish their intent; pre-select the matching option and
  // surface the choice so it is obvious why the dropdown changed.
  const [prefilled, setPrefilled] = useState<string | null>(null);

  useEffect(
    () =>
      subscribeServiceIntent((service) => {
        if (!SERVICE_OPTIONS.some((option) => option.value === service)) return;
        setValue('service', service, { shouldValidate: true, shouldDirty: true });
        setPrefilled(SERVICE_OPTIONS.find((o) => o.value === service)!.label);
        trackEvent('booking_service_prefilled', { service });
      }),
    [setValue],
  );

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const onSubmit = handleSubmit(async (values) => {
    if (status === 'submitting') return; // Block duplicate submissions.

    setStatus('submitting');
    setErrorMessage(null);
    trackEvent('booking_submit_start', { service: values.service });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await submitBookingRequest(
        { ...values, submittedAt: new Date().toISOString(), source: 'booking-form' },
        controller.signal,
      );
      setStatus('success');
      trackEvent('booking_submit_success', { service: values.service });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') return;
      setErrorMessage(
        'Something went wrong while sending your enquiry. Please try again, or reach us directly.',
      );
      setStatus('error');
      trackEvent('booking_submit_error');
    } finally {
      abortRef.current = null;
    }
  });

  const retry = () => {
    setStatus('idle');
    setErrorMessage(null);
  };

  const resetForm = () => {
    reset(defaultBookingValues);
    setPrefilled(null);
    setStatus('idle');
  };

  return (
    <section
      id="booking"
      aria-labelledby="booking-title"
      className="section relative overflow-hidden bg-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
      />

      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Let’s build something better"
              title={
                <>
                  Start Your <span className="text-gradient">Clean Energy Journey</span>
                </>
              }
              description="Tell us about your requirements. Our team can help you explore the clean-energy solutions best suited to your project."
            />

            <ul className="mt-10 space-y-4">
              {[
                'A short discovery call to understand your energy goals.',
                'A feasibility view covering technical and commercial angles.',
                'A tailored proposal using only the technologies your site needs.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
                    aria-hidden="true"
                  />
                  <span className="text-[0.94rem] leading-relaxed text-ink-muted">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-3xl border border-line bg-mist p-6 sm:p-7">
              <p className="font-heading text-base font-bold text-ink">
                Prefer to pick a time first?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                Reserve a slot on our live calendar and we&apos;ll confirm your
                consultation time by email.
              </p>

              <div className="mt-5">
                <BookSlotButton size="lg" placement="consultation" />
              </div>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                  or email us
                </span>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
              </div>

              <a
                href={CONTACT.emailHref}
                className="btn-outline w-full"
                onClick={() =>
                  trackEvent('contact_click', { method: 'email', placement: 'booking' })
                }
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email us
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-9">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    ref={successRef}
                    tabIndex={-1}
                    role="status"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="py-6 text-center"
                  >
                    <motion.span
                      initial={reduced ? false : { scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                      className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" aria-hidden="true" />
                    </motion.span>

                    <h3 className="mt-6 font-heading text-xl font-bold tracking-tight">
                      Thank you — we&apos;ve got it
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
                      Our team will review your requirements and get back to you shortly.
                      Need to talk sooner? Book a slot or call us directly.
                    </p>

                    <div className="mt-7 flex flex-col items-center justify-center gap-3">
                      <BookSlotButton placement="success" />
                      <button type="button" onClick={resetForm} className="btn-ghost">
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Send another enquiry
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    initial={false}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    className="space-y-5"
                  >
                    {status === 'error' && (
                      <div
                        role="alert"
                        className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                      >
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <div className="flex-1">
                          <p className="font-semibold">We couldn&apos;t send your enquiry.</p>
                          <p className="mt-1">{errorMessage}</p>
                        </div>
                        <button
                          type="button"
                          onClick={retry}
                          className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold underline underline-offset-2"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldShell label="Full name" htmlFor="fullName" required error={errors.fullName?.message}>
                        <input
                          {...fieldA11y('fullName', errors.fullName?.message)}
                          {...register('fullName')}
                          type="text"
                          autoComplete="name"
                          placeholder="Jane Cooper"
                          className={`field ${errors.fullName ? 'field-error' : ''}`}
                        />
                      </FieldShell>

                      <FieldShell label="Business email" htmlFor="email" required error={errors.email?.message}>
                        <input
                          {...fieldA11y('email', errors.email?.message)}
                          {...register('email')}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="jane@company.com"
                          className={`field ${errors.email ? 'field-error' : ''}`}
                        />
                      </FieldShell>

                      <FieldShell
                        label="Phone number"
                        htmlFor="phone"
                        hint="Include your country code, e.g. +91"
                        error={errors.phone?.message}
                      >
                        <input
                          {...fieldA11y('phone', errors.phone?.message, 'hint')}
                          {...register('phone')}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+91 00000 00000"
                          className={`field ${errors.phone ? 'field-error' : ''}`}
                        />
                      </FieldShell>

                      <FieldShell label="Company / Organisation" htmlFor="company" error={errors.company?.message}>
                        <input
                          {...fieldA11y('company', errors.company?.message)}
                          {...register('company')}
                          type="text"
                          autoComplete="organization"
                          placeholder="Company name"
                          className={`field ${errors.company ? 'field-error' : ''}`}
                        />
                      </FieldShell>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldShell
                        label="Service requested"
                        htmlFor="service"
                        required
                        hint={
                          prefilled
                            ? `Pre-filled from the service you selected: ${prefilled}`
                            : undefined
                        }
                        error={errors.service?.message}
                      >
                        <select
                          {...fieldA11y(
                            'service',
                            errors.service?.message,
                            prefilled ? 'service-hint' : undefined,
                          )}
                          {...register('service')}
                          defaultValue=""
                          className={`field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>')] bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-11 ${errors.service ? 'field-error' : ''}`}
                        >
                          <option value="" disabled>
                            Choose a service
                          </option>
                          {SERVICE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FieldShell>

                      <FieldShell label="Project location" htmlFor="location" error={errors.location?.message}>
                        <input
                          {...fieldA11y('location', errors.location?.message)}
                          {...register('location')}
                          type="text"
                          autoComplete="address-level2"
                          placeholder="City, state"
                          className={`field ${errors.location ? 'field-error' : ''}`}
                        />
                      </FieldShell>
                    </div>

                    <FieldShell
                      label="Project details"
                      htmlFor="details"
                      required
                      hint={`${getValues('details')?.length ?? 0}/2000 characters`}
                      error={errors.details?.message}
                    >
                      <textarea
                        {...fieldA11y('details', errors.details?.message, 'details-hint')}
                        {...register('details')}
                        rows={5}
                        placeholder="Tell us about your site, energy usage, timeline, or any specific requirements."
                        className={`field min-h-32 resize-y ${errors.details ? 'field-error' : ''}`}
                      />
                    </FieldShell>

                    <FieldShell label="Consent" htmlFor="consent" error={errors.consent?.message}>
                      <div className="flex items-start gap-3">
                        <input
                          id="consent"
                          type="checkbox"
                          {...register('consent')}
                          aria-invalid={errors.consent ? true : undefined}
                          aria-describedby={errors.consent ? 'consent-error' : undefined}
                          className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        />
                        <label htmlFor="consent" className="text-[0.9rem] leading-relaxed text-ink-muted">
                          I agree that VIRYA CLEANTECH may contact me about this enquiry.
                          {/*
                            No public privacy policy URL exists on the official site yet.
                            Link it here as soon as one is published.
                          */}
                        </label>
                      </div>
                    </FieldShell>

                    <div className="flex flex-col-reverse items-stretch gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-center gap-2 text-xs text-ink-faint">
                        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                        Your details are used only to respond to this enquiry.
                      </p>

                      <Button
                        type="submit"
                        size="lg"
                        loading={isSubmitting || status === 'submitting'}
                        className="shrink-0"
                      >
                        {status === 'submitting' ? 'Sending…' : 'Request Consultation'}
                        {status !== 'submitting' && <Send className="h-4 w-4" aria-hidden="true" />}
                      </Button>
                    </div>

                    <noscript>
                      <p className="rounded-2xl bg-mist p-4 text-sm">
                        JavaScript is required for this form. Please email us at{' '}
                        <a className="underline" href={CONTACT.emailHref}>
                          {CONTACT.email}
                        </a>{' '}
                        or book a slot on our calendar.
                      </p>
                    </noscript>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-8 border-t border-line pt-7">
              <p className="text-center text-sm text-ink-muted">
                Rather fill in a form?{' '}
                <span className="font-medium text-ink">
                  Send us your requirements below
                </span>{' '}
                and we&apos;ll get back to you.
              </p>
            </div>

            {/* Decorative corner motif */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"
            />
            </div>

            <p className="mt-4 text-center text-xs text-ink-faint">
              Enquiries are reviewed by the Virya Cleantech team. Response times depend on
              availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}