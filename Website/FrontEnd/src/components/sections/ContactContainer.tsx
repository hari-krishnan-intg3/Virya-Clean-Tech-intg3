import { ArrowRight, ExternalLink, Mail, MapPin } from 'lucide-react';
import { ADDRESS_LINES, CONTACT, MAP_LINK, MAP_QUERY } from '@/app/siteConfig';
import { Button, Reveal, SectionHeading } from '@/components/ui';
import { scrollToSection, trackEvent } from '@/lib/utils';

export function ContactContainer() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section bg-mist">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title={
                <>
                  Let&apos;s Talk <span className="text-gradient">Clean Energy</span>
                </>
              }
              description="Whether you're planning a solar installation, exploring EV charging, or investigating smarter energy systems, let's discuss your requirements."
            />

            {/* Primary action: the enquiry form */}
            <Reveal delay={0.1}>
              <div className="mt-9 rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
                <p className="font-heading text-base font-bold text-ink">
                  Start with the enquiry form
                </p>
                <p className="mt-1.5 text-[0.94rem] leading-relaxed text-ink-muted">
                  Tell us about your site, energy goals and timeline. It&apos;s the fastest way
                  to get a considered response from our team.
                </p>

                <Button
                  size="lg"
                  className="mt-5 w-full sm:w-auto"
                  onClick={() => {
                    trackEvent('cta_click', { placement: 'contact', target: 'booking' });
                    scrollToSection('booking');
                  }}
                >
                  Open Enquiry Form
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </Reveal>

            {/* Direct details — email + address only */}
            <ul className="mt-5 space-y-3">
              {[
                {
                  icon: Mail,
                  label: 'Email',
                  href: CONTACT.emailHref,
                  hint: 'Tap to compose an email',
                  accent: 'text-emerald-500',
                  content: (
                    <span className="mt-1 block break-words font-heading text-[0.98rem] font-semibold text-ink">
                      {CONTACT.email}
                    </span>
                  ),
                },
                {
                  icon: MapPin,
                  label: 'Location',
                  href: MAP_LINK,
                  hint: 'View on Google Maps',
                  accent: 'text-amber-500',
                  content: (
                    <span className="mt-1 block space-y-0.5">
                      {ADDRESS_LINES.map((line) => (
                        <span key={line} className="block text-[0.94rem] leading-snug text-ink">
                          {line}
                        </span>
                      ))}
                    </span>
                  ),
                },
              ].map((item, index) => (
                <Reveal key={item.label} delay={0.14 + index * 0.06}>
                  <li>
                    <a
                      href={item.href}
                      target={item.href === MAP_LINK ? '_blank' : undefined}
                      rel={item.href === MAP_LINK ? 'noopener noreferrer' : undefined}
                      onClick={() =>
                        trackEvent('contact_click', {
                          method: item.label.toLowerCase(),
                          placement: 'contact-section',
                        })
                      }
                      className="card card-hover flex items-start gap-4 p-5"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mist">
                        <item.icon className={`h-5 w-5 ${item.accent}`} aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
                          {item.label}
                        </span>
                        {item.content}
                        <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-ink-faint">
                          {item.hint}
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </span>
                      </span>
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="relative h-full min-h-[22rem] overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
                <iframe
                  title="Map showing VIRYA CLEANTECH office location in Bengaluru, Karnataka"
                  src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />

                <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl border border-line bg-white/95 p-5 shadow-lift backdrop-blur-md">
                  <p className="font-heading text-sm font-bold text-ink">
                    VIRYA CLEANTECH Office
                  </p>
                  <address className="mt-1.5 not-italic text-sm leading-relaxed text-ink-muted">
                    {ADDRESS_LINES.join(', ')}
                  </address>
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('contact_click', { method: 'map-overlay' })}
                    className="pointer-events-auto mt-3 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-emerald-700 hover:text-emerald-500"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}