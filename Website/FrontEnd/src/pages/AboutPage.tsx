import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Ruler, Users, Wrench } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';
import { BUSINESS, CONTACT } from '@/app/siteConfig';
import { services } from '@/data/services';

const PRINCIPLES = [
  {
    icon: Ruler,
    title: 'Site context before assumptions',
    body: 'Energy use, physical conditions, existing infrastructure and operating needs help shape a useful project discussion.',
  },
  {
    icon: Wrench,
    title: 'Clear scope and responsibilities',
    body: 'Technical work, deliverables, approvals and follow-up should be defined for the specific project before work proceeds.',
  },
  {
    icon: Leaf,
    title: 'Claims grounded in evidence',
    body: 'Savings, performance and environmental outcomes depend on the project and should be supported by stated assumptions and appropriate records.',
  },
  {
    icon: Users,
    title: 'Collaboration by agreement',
    body: 'Data access, monitoring, maintenance and post-project support are clarified as part of the agreed service scope.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            A practical approach to <span className="text-gradient">clean-energy progress.</span>
          </>
        }
        description="Virya Cleantech helps businesses explore solar, EV charging, energy storage, connected-energy technology and assessment services. The appropriate solution depends on the facility, operating requirements and confirmed project scope."
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
                    Clean-energy decisions involve more than selecting a
                    technology. Site conditions, energy use, existing
                    infrastructure, operating requirements and local rules all
                    influence what may be practical.
                  </p>
                  <p>
                    Virya's published service areas cover solar, EV charging,
                    storage, energy software and consulting. A first
                    conversation helps clarify the project objective and the
                    information needed to assess relevant options for a
                    particular facility.
                  </p>
                  <p>
                    The aim is to make the decision process clearer: describe
                    what is known, identify what still needs checking, and agree
                    on appropriate next steps without assuming a result before
                    the site has been assessed.
                  </p>
                </div>

                <blockquote className="mt-10 rounded-[1.6rem] border-l-[3px] border-emerald-500 bg-mist p-7">
                  <p className="text-lg font-semibold leading-relaxed text-ink">
                    A useful project discussion starts with the operating need
                    and the evidence available, not a promised outcome.
                  </p>
                  <footer className="mt-4 text-[0.85rem] text-ink-faint">
                    {BUSINESS.name} — working principle
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
                        Bengaluru, Karnataka, India
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">{BUSINESS.partnerNote}</dt>
                      <dd className="mt-1 text-ink-muted">
                        Company association.
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
              Clear information before a decision
            </h2>
            <p className="mt-5 text-center text-base leading-relaxed text-ink-muted">
              Project outcomes and service responsibilities depend on the
              facility and agreed scope. Before proceeding, clarify the details
              that matter to your organisation.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Service scope', 'Confirm which services, deliverables and responsibilities are included.'],
                ['Technical assumptions', 'Review site information, constraints, approvals and any assumptions behind estimates.'],
                ['Evidence and outcomes', 'Use project-specific records for performance, savings or environmental claims.'],
              ].map(([title, body]) => (
                <article key={title} className="card h-full p-6 text-left">
                  <h3 className="font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">{body}</p>
                </article>
              ))}
            </div>

            <p className="mt-8 text-center text-[0.93rem] leading-relaxed text-ink-muted">
              A project discussion can help identify the relevant service area
              and what information may be needed for a closer review.{' '}
              <Link to="/request-consultation" className="font-semibold text-emerald-700 hover:underline">
                Request that conversation <ArrowRight className="inline h-4 w-4" />
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Discuss your facility and energy requirements"
        body="Share the site context and the question you are working through. The team can help clarify relevant information and possible next steps."
        secondary={{ label: 'See the process', to: '/process' }}
      />
    </>
  );
}