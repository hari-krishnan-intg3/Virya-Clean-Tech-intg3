import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { CardImage, Reveal, ServiceCard } from '@/components/ui';
import { services } from '@/data/services';
import { visualAssets } from '@/data/visuals';

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title={
          <>
            Explore solutions for your <span className="text-gradient">energy requirements.</span>
          </>
        }
        description="Compare solar, EV charging, storage, connected-energy software, and assessment options. Start with your site and operating goals; suitability is confirmed through a project-specific review."
        primary={{ label: 'Discuss Your Project', to: '/request-consultation' }}
        secondary={{ label: 'How we work', to: '/process' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }]}
      />
      {/* Image-led service cards */}
      <section className="section">
        <div className="shell">
          <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05} as="div" className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="rule-accent" />Choosing a starting point</p>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">Start with the question your site needs to answer.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">Your first review can focus on site energy use, available infrastructure, vehicle patterns, storage needs, or missing project information.</p>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/insights" className="btn-outline">Read energy insights</Link>
            <Link to="/faq" className="btn-outline">Common questions</Link>
          </div>
        </div>
      </section>

      {/* How to choose */}
      <section className="section">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Choosing
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Where each of these starts
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                when: 'You want to understand energy use',
                then: 'Energy audit',
                image: visualAssets.siteAssessment,
                because:
                  'Available bills, meter data and operating context can help frame a review of energy requirements. Operating hours and known changes can reveal what information is missing before options are compared.',
                to: '/services/consulting',
                cta: 'Start with an audit',
              },
              {
                when: 'You are exploring on-site generation or storage',
                then: 'Solar or storage design',
                image: visualAssets.rooftopSolarArray,
                because:
                  'Site area, structural conditions, energy use, electrical infrastructure and project objectives influence feasibility. Clarify ownership, roof or land access and any connection constraints before a system is sized.',
                to: '/services/solar',
                cta: 'Scope a system',
              },
              {
                when: 'Your site is planning for electric vehicles',
                then: 'EV infrastructure',
                image: visualAssets.fleetCharging,
                because:
                  'Vehicle use, parking duration, charging demand and available electrical capacity help shape the discussion. Routes, dwell windows, site layout and charging operations also affect what should be assessed.',
                to: '/services/ev-charging',
                cta: 'Scope chargers',
              },
            ].map((item, index) => (
              <Reveal key={item.when} delay={index * 0.08} as="div">
                <article className="card card-hover flex h-full flex-col overflow-hidden">
                  <CardImage image={item.image} className="aspect-[16/9]" />
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                      {item.when}
                    </p>
                    <h3 className="mt-4 text-xl font-bold text-ink">{item.then}</h3>
                    <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink-muted">
                      {item.because}
                    </p>
                    <Link
                      to={item.to}
                      className="mt-6 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-emerald-700 hover:underline"
                    >
                      {item.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure where to begin?"
        body="Share your facility type, location and project question. The team can help identify which information may be useful and whether a more detailed assessment is appropriate."
        primary={{ label: 'Discuss Your Project', to: '/request-consultation' }}
        secondary={{ label: 'Contact Us', to: '/contact' }}
      />
    </>
  );
}