import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { SmartImage } from '@/components/ui';
import { MARKET_SEGMENTS } from '@/data/offeringsArchitecture';

export default function IndustriesPage() {
  const [activeSegmentSlug, setActiveSegmentSlug] = useState(MARKET_SEGMENTS[0].slug);

  return (
    <>
      <PageHero
        eyebrow="Consulting-Led Market Segments"
        title={
          <>
            CleanTech Architecture <span className="text-gradient">Engineered for Your Industry.</span>
          </>
        }
        description="Every sector operates under distinct load profiles, tariff structures, and decarbonization pressures. We align CleanTech offerings with sector-specific applications to deliver measurable business outcomes."
        primary={{ label: 'Discuss your facility', to: '/request-consultation' }}
        secondary={{ label: 'Explore CleanTech offerings', to: '/services' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Industries', to: '/industries' }]}
      />

      {/* Alignment Banner: Industry -> CleanTech Applications -> Business Outcomes */}
      <section className="border-b border-line bg-mist py-8">
        <div className="shell">
          <div className="rounded-2xl border border-line bg-card p-6 shadow-soft sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              The Virya Alignment Framework
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-3">
              <div className="border-l-2 border-emerald-400 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">Step 01</span>
                <h3 className="mt-1 text-base font-bold text-ink">Industry & Duty Cycles</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                  We analyze facility shift patterns, utility HT tariffs, power continuity requirements, and operating fleet schedules.
                </p>
              </div>
              <div className="border-l-2 border-sky-400 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">Step 02</span>
                <h3 className="mt-1 text-base font-bold text-ink">8 CleanTech Applications</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                  Sizing EVSE, Solar PV, BESS, IoT telemetry, AI load prediction, grid modernization, ESG compliance, and O&M.
                </p>
              </div>
              <div className="border-l-2 border-amber-400 pl-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">Step 03</span>
                <h3 className="mt-1 text-base font-bold text-ink">Tangible Business Outcomes</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                  Lower LCOE, peak-charge penalty avoidance, Scope 1 & 2 carbon reductions, and guaranteed uptime SLAs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segment Selector Sticky Bar */}
      <section className="sticky top-[4.25rem] z-30 border-b border-line bg-mist/95 backdrop-blur-md py-3">
        <div className="shell flex gap-2 overflow-x-auto pb-1">
          {MARKET_SEGMENTS.map((segment) => {
            const Icon = segment.icon;
            const isActive = activeSegmentSlug === segment.slug;
            return (
              <a
                key={segment.slug}
                href={`#${segment.slug}`}
                onClick={() => setActiveSegmentSlug(segment.slug)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-400 text-[#07110f]'
                    : 'border border-line bg-card text-ink-muted hover:text-ink'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {segment.title}
              </a>
            );
          })}
        </div>
      </section>

      {/* 8 Market Segments Detailed Deep-Dive */}
      <section className="section">
        <div className="shell space-y-20">
          {MARKET_SEGMENTS.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <article
                key={segment.slug}
                id={segment.slug}
                className="scroll-mt-36 rounded-2xl border border-line bg-card overflow-hidden shadow-soft"
              >
                {/* Segment Hero Header */}
                <div className="grid gap-8 border-b border-line bg-mist p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      <Icon className="h-3.5 w-3.5" />
                      Market Segment 0{index + 1}
                    </span>
                    <h2 className="mt-4 text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                      {segment.title}
                    </h2>
                    <p className="mt-2 text-base font-semibold text-emerald-400 sm:text-lg">
                      {segment.tagline}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                      {segment.overview}
                    </p>

                    {/* Applications Tags */}
                    <div className="mt-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                        Targeted CleanTech Applications:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {segment.applications.map((app) => (
                          <span
                            key={app}
                            className="rounded-md border border-line bg-card px-2.5 py-1 text-xs font-medium text-ink"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line lg:col-span-5">
                    <SmartImage
                      src={segment.image}
                      alt={segment.imageAlt}
                      width={800}
                      height={500}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07110f]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Icon className="h-3.5 w-3.5 text-emerald-300" />
                      {segment.title}
                    </span>
                  </div>
                </div>

                {/* 8 CleanTech Offering Cards per Segment */}
                <div className="p-6 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-ink sm:text-xl">
                        CleanTech Offerings Matrix for {segment.title}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        Eight modular capabilities configured around sector-specific duty cycles and loads.
                      </p>
                    </div>
                    <Link
                      to="/request-consultation"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      Scope for your facility
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {segment.applicationCards.map((card) => (
                      <Link
                        key={card.offering + card.title}
                        to={card.to}
                        className="group flex flex-col justify-between rounded-xl border border-line bg-mist/60 p-4 transition-all duration-200 hover:border-emerald-400/40 hover:bg-mist"
                      >
                        <div>
                          <span className="inline-block rounded bg-emerald-400/10 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-300">
                            {card.offering}
                          </span>
                          <h4 className="mt-2 text-sm font-bold text-ink group-hover:text-emerald-300 transition-colors">
                            {card.title}
                          </h4>
                          <p className="mt-1.5 text-xs font-medium text-emerald-400/90">
                            {card.spec}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-ink-muted line-clamp-3">
                            {card.benefit}
                          </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform">
                          Explore solution <ChevronRight className="h-3 w-3" />
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Business Outcomes Banner */}
                  <div className="mt-8 rounded-xl border border-emerald-400/20 bg-[#0c1a14] p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">
                        Measurable Business Outcomes
                      </h4>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {segment.businessOutcomes.map((outcome) => (
                        <div key={outcome} className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Ready to engineer clean energy for your industry?"
        body="Share your facility location, electricity single line diagram (SLD), and operating schedule. Virya will develop a consulting-led technical and commercial feasibility plan."
        primary={{ label: 'Request a technical consultation', to: '/request-consultation' }}
        secondary={{ label: 'Explore EV charging infrastructure', to: '/services/ev-charging' }}
      />
    </>
  );
}
