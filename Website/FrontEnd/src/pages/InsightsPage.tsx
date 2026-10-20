import { ArrowUpRight, BookOpenText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal, SmartImage } from '@/components/ui';
import { insights, marketShifts } from '@/data/insights';
import { visualAssets } from '@/data/visuals';

const INSIGHT_VISUALS = [
  visualAssets.solar,
  visualAssets.solarInstallation,
  visualAssets.solar,
  visualAssets.solarInstallation,
  visualAssets.ev,
  visualAssets.ev,
  visualAssets.wind,
  visualAssets.solar,
];

const SHIFT_VISUALS = [
  visualAssets.solar,
  visualAssets.ev,
  visualAssets.storage,
  visualAssets.engineering,
];

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={<>Useful context for <span className="text-gradient">better energy decisions.</span></>}
        description="Explore selected market figures and practical considerations for businesses evaluating clean-energy and connected-energy options. Source links and publication dates are included where available."
        primary={{ label: 'Explore solutions', to: '/services' }}
        secondary={{ label: 'Common questions', to: '/faq' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights' }]}
      />

      <section className="section">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Published figures
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Market context, with sources attached.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              These figures describe broader market activity; they do not
              predict the suitability, performance or economics of an individual
              project. Check the linked source for the latest information.
            </p>
          </Reveal>

          <dl className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {insights.map((insight, index) => (
              <Reveal key={insight.id} delay={index * 0.04} as="div">
                <div className="card flex h-full flex-col overflow-hidden">
                  <div className="relative h-36 overflow-hidden">
                    <SmartImage
                      src={INSIGHT_VISUALS[index % INSIGHT_VISUALS.length].src}
                      alt={INSIGHT_VISUALS[index % INSIGHT_VISUALS.length].alt}
                      width={960}
                      height={480}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#07110f]/55 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <dt className="font-heading text-3xl font-extrabold leading-tight text-ink">
                      {insight.value}{' '}
                      <span className="text-base font-bold text-emerald-700">{insight.unit}</span>
                    </dt>
                    <dd className="mt-4 flex flex-1 flex-col">
                      <p className="font-semibold text-ink">{insight.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{insight.note}</p>
                      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-ink-faint">
                        {insight.source} · as of {insight.asOf}
                      </p>
                      {insight.href && (
                        <a
                          href={insight.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline"
                        >
                          View source <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Questions to explore
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              What the broader trends may prompt a business to ask.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {marketShifts.map((shift, index) => (
              <Reveal key={shift.title} delay={index * 0.05} as="div">
                <article className="card h-full overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <SmartImage
                      src={SHIFT_VISUALS[index % SHIFT_VISUALS.length].src}
                      alt={SHIFT_VISUALS[index % SHIFT_VISUALS.length].alt}
                      width={1200}
                      height={600}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#07110f]/60 to-transparent" />
                    <span className="absolute bottom-4 left-5 grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-[#07110f]/55 text-emerald-300 backdrop-blur">
                      <BookOpenText className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <h3 className="text-lg font-bold text-ink">{shift.title}</h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">{shift.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Link
            to="/services"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
          >
            Explore Virya service areas <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <CtaBand
        title="Turn a question into a project discussion"
        body="Market figures are only a starting point. Share your site context and operating requirements to discuss what may need a closer review."
        primary={{ label: 'Request a consultation', to: '/request-consultation' }}
        secondary={{ label: 'Read the FAQs', to: '/faq' }}
      />
    </>
  );
}