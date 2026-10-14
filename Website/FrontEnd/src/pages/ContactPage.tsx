import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { BookSlotButton, Reveal } from '@/components/ui';
import { ADDRESS_LINES, CONTACT, MAP_EMBED, MAP_LINK } from '@/app/siteConfig';
import { officeStatus, visitorClock } from '@/lib/time';
import { trackEvent } from '@/lib/utils';

/**
 * Contact page.
 *
 * The live office-status indicator is the useful part: a visitor in London
 * should not be told to expect a call at 9am without knowing the Bengaluru
 * team is asleep when they read it.
 */
export default function ContactPage() {
  const [status] = useState(() => officeStatus());

  const channels = [
    {
      icon: Phone,
      label: 'Phone',
      value: CONTACT.phoneDisplay,
      href: CONTACT.phoneHref,
      note: status.open ? 'Answered now' : `Returns ${status.nextOpenLabel}`,
      live: status.open,
    },
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT.email,
      href: CONTACT.emailHref,
      note: 'Replies within one working day',
      live: true,
    },
    {
      icon: MapPin,
      label: 'Office',
      value: ADDRESS_LINES[2] ?? CONTACT.address.locality,
      href: MAP_LINK,
      note: 'Visits by appointment',
      live: false,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to an engineer, <span className="text-gradient">not a call centre</span>
          </>
        }
        description="Every enquiry reaches the same queue and gets a human owner. If you would rather talk than type, book a slot — it goes into the same place."
        primary={{ label: 'Request a consultation', to: '/request-consultation' }}
        secondary={{ label: 'Book a calendar slot', to: '#slots' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Contact', to: '/contact' }]}
      />

      {/* Channels */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-3">
            {channels.map((channel, index) => (
              <Reveal key={channel.label} delay={index * 0.07} as="div">
                <a
                  href={channel.href}
                  target={channel.label === 'Office' ? '_blank' : undefined}
                  rel={channel.label === 'Office' ? 'noopener noreferrer' : undefined}
                  onClick={() => trackEvent('contact_click', { channel: channel.label })}
                  className="card card-hover group flex h-full flex-col p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                      <channel.icon className="h-5 w-5" />
                    </span>
                    {channel.live && (
                      <span className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 animate-dot-pulse rounded-full bg-emerald-500" />
                        Live
                      </span>
                    )}
                  </div>

                  <p className="mt-5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                    {channel.label}
                  </p>
                  <p className="mt-2 text-[1.05rem] font-bold text-ink transition-colors group-hover:text-emerald-700">
                    {channel.value}
                  </p>
                  <p className="mt-2 text-[0.85rem] text-ink-muted">{channel.note}</p>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Office status — visitor time vs Bengaluru time */}
          <Reveal delay={0.12} className="mt-8">
            <div className="card flex flex-wrap items-center justify-between gap-6 p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-ink-muted">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[0.95rem] font-bold text-ink">
                    {status.open
                      ? 'Our Bengaluru team is online now'
                      : `Our Bengaluru team is offline — back ${status.nextOpenLabel}`}
                  </p>
                  <p className="mt-1 text-[0.87rem] text-ink-muted">
                    {CONTACT.businessHoursLabel}. It is{' '}
                    <span className="tabular-nums font-semibold text-ink">
                      {visitorClock()}
                    </span>{' '}
                    your time.
                  </p>
                </div>
              </div>

              <Link
                to="/request-consultation"
                onClick={() => trackEvent('cta_click', { placement: 'office-status' })}
                className="btn-primary"
              >
                Leave your details instead
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Booking + map */}
      <section id="slots" className="section scroll-mt-28 bg-mist">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="eyebrow">
                <span className="rule-accent" />
                Booking
              </p>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                Pick a slot, or send the detail
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                Booking a slot puts thirty minutes in the diary now. Sending the
                form lets us come back with a considered answer — which is
                usually what you want if the question involves numbers.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: 'Already know what you need',
                    body: 'Book a slot. Bring your interval data and we will work through it live.',
                  },
                  {
                    title: 'Still working out the question',
                    body: 'Use the form. Tell us the problem in your own words and we will reply with what we would need to look at.',
                  },
                  {
                    title: 'Comparing several vendors',
                    body: 'Send the quotes. We will normalise the BOQs so you are comparing the same scope.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>
                      <span className="block text-[0.95rem] font-semibold text-ink">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-[0.9rem] leading-relaxed text-ink-muted">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <BookSlotButton size="lg" placement="contact-page" />
                <Link to="/request-consultation" className="btn-outline-lg">
                  Open the enquiry form
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card overflow-hidden">
                <div className="p-7 pb-5">
                  <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                    <CalendarDays className="h-4 w-4" />
                    Where we are
                  </p>
                  <address className="mt-3 not-italic">
                    {ADDRESS_LINES.map((line) => (
                      <span key={line} className="block text-[0.95rem] leading-relaxed text-ink-muted">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-emerald-700 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>

                <iframe
                  title="Virya Clean Tech office location"
                  src={MAP_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-80 w-full border-0"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        title="Still deciding whether this is worth your time?"
        body="That is a reasonable place to be. Read what we get asked before a project starts, or ask the assistant on any page — it knows our scope and will say when a question is beyond it."
        primary={{ label: 'Read the FAQ', to: '/faq' }}
        secondary={{ label: 'Check fit', to: '/industries' }}
      />
    </>
  );
}