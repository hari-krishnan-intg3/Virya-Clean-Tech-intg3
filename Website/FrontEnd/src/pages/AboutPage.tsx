import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Ruler, Users, Wrench } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';
import { BUSINESS, CONTACT, PENDING_CONFIRMATION } from '@/app/siteConfig';
import { services } from '@/data/services';

const PRINCIPLES = [
  {
    icon: Ruler,
    title: 'Measured before proposed',
    body: 'We do not quote from a photograph or a rate card. Twelve months of interval data comes first, because it is the difference between a payback you can defend and one you cannot.',
  },
  {
    icon: Wrench,
    title: 'Engineers who build it',
    body: 'The people in the design review are the people who will be on site. No handoff to a delivery team that has never seen the design.',
  },
  {
    icon: Leaf,
    title: 'Sustainability as arithmetic',
    body: 'We would rather show you a project with a modest carbon number that will actually be built than an ambitious one that will be challenged in year two.',
  },
  {
    icon: Users,
    title: 'Long after handover',
    body: 'Monitoring is handed over, not rented back. You keep the alerting and the data whether or not you engage us again.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            A young engineering team building <span className="text-gradient">the boring parts well</span>
          </>
        }
        description="Virya Clean Tech designs and builds solar, EV charging, battery storage and the software that makes them work together. We are based in Bengaluru and we work across India on industrial, commercial and institutional sites."
        primary={{ label: 'Talk to the team', to: '/contact' }}
        secondary={{ label: 'What we build', to: '/services' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }]}
      />

      {/* Mission */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  What we are actually trying to do
                </h2>

                <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-muted">
                  <p>
                    The energy transition in India is not primarily an
                    engineering problem any more. Solar is cheap, storage is
                    available, chargers exist. What is missing is the layer that
                    makes those assets work on a specific site with a specific
                    tariff and a specific load shape.
                  </p>
                  <p>
                    That is the gap Virya was formed to work in. We take an
                    operating site — a plant, a warehouse, a depot, a hospital,
                    a mall — and we design the whole energy system around how
                    that site actually behaves: when it draws power, when it
                    does not, what an outage costs, and what the tariff charges
                    for the peak.
                  </p>
                  <p>
                    It is less glamorous than a technology story and considerably
                    more useful. Our goal is to change how energy is consumed in
                    the modern built world, with solutions that are sustainable,
                    practical, and that survive contact with a finance director.
                  </p>
                </div>

                <blockquote className="mt-10 rounded-[1.6rem] border-l-[3px] border-emerald-500 bg-mist p-7">
                  <p className="text-lg font-semibold leading-relaxed text-ink">
                    A project that does not clear your own hurdle rate is not a
                    sustainability project. It is an expense.
                  </p>
                  <footer className="mt-4 text-[0.85rem] text-ink-faint">
                    {BUSINESS.name} — engineering principle
                  </footer>
                </blockquote>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="card p-7">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                    At a glance
                  </p>
                  <dl className="mt-5 space-y-4 text-[0.92rem]">
                    <div>
                      <dt className="font-semibold text-ink">Registered office</dt>
                      <dd className="mt-1 text-ink-muted">
                        {CONTACT.address.locality}, {CONTACT.address.region}{' '}
                        {CONTACT.address.postalCode}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">Operating hours</dt>
                      <dd className="mt-1 text-ink-muted">{CONTACT.businessHoursLabel}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">Capabilities</dt>
                      <dd className="mt-1 text-ink-muted">
                        {services.map((s) => s.label).join(', ')}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">Geography</dt>
                      <dd className="mt-1 text-ink-muted">
                        Bengaluru-based, working across India
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">{BUSINESS.partnerNote}</dt>
                      <dd className="mt-1 text-ink-muted">
                        Our corporate and technical backbone.
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              How we operate
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Four things we hold to
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.07} as="div">
                <article className="card card-hover h-full p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <principle.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{principle.title}</h3>
                  <p className="mt-3 text-[0.93rem] leading-relaxed text-ink-muted">
                    {principle.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*
        Honesty section. A young company has no project count worth
        publishing, so we say so rather than inventing one.
      */}
      <section className="section">
        <div className="shell">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-extrabold text-ink sm:text-3xl">
              What we will not claim
            </h2>
            <p className="mt-5 text-center text-base leading-relaxed text-ink-muted">
              We are an early-stage team and there are things a visitor should
              reasonably want to know that we cannot yet evidence. Rather than
              fill the page, here is the list.
            </p>

            <ul className="mt-10 space-y-3">
              {PENDING_CONFIRMATION.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-line bg-mist px-5 py-4 text-[0.93rem] leading-relaxed text-ink-muted"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-center text-[0.93rem] leading-relaxed text-ink-muted">
              What we will give you on a call instead: the technical lead who
              would run your project, a realistic timeline including the
              approvals that slip most programmes, and an honest view of whether
              you need us at all.{' '}
              <Link to="/request-consultation" className="font-semibold text-emerald-700 hover:underline">
                Request that conversation <ArrowRight className="inline h-4 w-4" />
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Come and argue with us about your energy bill"
        body="The first conversation is a diagnosis, not a pitch. Bring your interval data if you have it, or just bring the problem."
        secondary={{ label: 'See the process', to: '/process' }}
      />
    </>
  );
}