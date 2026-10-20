import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { CardImage, Reveal } from '@/components/ui';
import { insights, marketShifts } from '@/data/insights';
import { visualAssets } from '@/data/visuals';

const INSIGHT_VISUALS = [
  visualAssets.solarMarketRooftop,
  visualAssets.solarMarketPanels,
  visualAssets.solarComplex,
  visualAssets.rooftopSolarArray,
];
const SHIFT_VISUALS = [
  visualAssets.realEstate,
  visualAssets.fleetCharging,
  visualAssets.manufacturing,
  visualAssets.warehousing,
];

interface InsightBandProps {
  /** Only show the first N figures. */
  limit?: number;
}

/**
 * The "why now" band.
 *
 * Every number is attributed to a named public source with an as-of date.
 * That is deliberate: this audience includes CFOs who check figures, and an
 * unsourced statistic on a clean-energy site costs more trust than it wins.
 */
export function InsightBand({ limit = 4 }: InsightBandProps) {
  return (
    <section className="section bg-mist">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">
            <span className="rule-accent" />
            Why now
          </p>
          <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl lg:text-[2.9rem]">
            The numbers behind the <span className="text-gradient">conversation</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
            These are the current published figures from government sources.
            We publish them with attribution because the people who approve this
            spend check them, and because a clean-energy company quoting
            unsourced numbers has already lost the argument.
          </p>
        </Reveal>

        {/* Figures */}
        <dl className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {insights.slice(0, limit).map((insight, index) => (
            <Reveal key={insight.id} delay={index * 0.08} as="div">
              <div className="card card-hover h-full overflow-hidden">
                <CardImage image={INSIGHT_VISUALS[index % INSIGHT_VISUALS.length]} />
                <div className="p-6">
                  <dt className="flex items-start justify-between gap-3">
                    <span className="font-heading text-4xl font-extrabold leading-none text-ink">
                      {insight.value}
                      <span className="ml-1.5 text-base font-bold text-emerald-600">
                        {insight.unit}
                      </span>
                    </span>
                    <TrendingUp className="h-5 w-5 shrink-0 text-emerald-500/40" />
                  </dt>

                  <dd className="mt-4">
                    <p className="text-[0.95rem] font-semibold text-ink">{insight.label}</p>
                    <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-muted">
                      {insight.note}
                    </p>
                    <p className="mt-3 border-t border-line pt-3 text-[0.72rem] leading-relaxed text-ink-faint">
                      {insight.source} · as of {insight.asOf}
                    </p>
                  </dd>
                </div>
              </div>
            </Reveal>
          ))}
        </dl>

        {/* The judgement behind the numbers */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {marketShifts.map((shift, index) => (
            <Reveal key={shift.title} delay={index * 0.06} as="div">
              <article className="card h-full overflow-hidden">
                <CardImage image={SHIFT_VISUALS[index % SHIFT_VISUALS.length]} />
                <div className="p-7">
                  <h3 className="text-lg font-bold leading-snug text-ink">{shift.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                    {shift.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <Link
            to="/faq"
            className="inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-emerald-700 hover:underline"
          >
            Read the questions we get asked before the first call
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}