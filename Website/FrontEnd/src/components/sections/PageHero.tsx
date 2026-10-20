import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Primary and secondary actions. */
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  /** Optional breadcrumb trail. */
  trail?: { label: string; to: string }[];
  /** Image stack shown beside the page heading. First image is the lead visual. */
  visual?: { src: string; alt: string }[];
  /** Compact variant for detail pages that open immediately with content. */
  compact?: boolean;
}

const PAGE_VISUALS: Record<string, { src: string; alt: string }[]> = {
  Capabilities: [
    { src: '/images/virya-solar.webp', alt: 'Solar panels at a commercial energy site.' },
    { src: '/images/virya-ev-charging.webp', alt: 'Electric vehicle charging infrastructure.' },
    { src: '/images/virya-engineering.webp', alt: 'Engineering equipment at a clean-energy facility.' },
  ],
  About: [
    { src: '/images/virya-engineering.webp', alt: 'Engineer reviewing equipment at a clean-energy facility.' },
    { src: '/images/virya-wind.webp', alt: 'Wind turbines generating renewable electricity.' },
    { src: '/images/virya-energy.webp', alt: 'Electricity infrastructure supporting an energy network.' },
  ],
  Careers: [
    { src: '/images/virya-engineering.webp', alt: 'Engineer working with technical equipment.' },
    { src: '/images/virya-ev-charging.webp', alt: 'Electric vehicle charging station.' },
    { src: '/images/virya-wind.webp', alt: 'Wind turbines across an open landscape.' },
  ],
  'Request a consultation': [
    { src: '/images/virya-solar.webp', alt: 'Commercial solar panels in daylight.' },
    { src: '/images/virya-energy.webp', alt: 'Energy transmission infrastructure.' },
    { src: '/images/virya-engineering.webp', alt: 'Engineer assessing clean-energy equipment.' },
  ],
  Contact: [
    { src: '/images/virya-engineering.webp', alt: 'Engineer at work in an energy facility.' },
    { src: '/images/virya-solar.webp', alt: 'Solar panels at a business site.' },
    { src: '/images/virya-ev-charging.webp', alt: 'Electric vehicle connected to a charger.' },
  ],
  Questions: [
    { src: '/images/virya-energy.webp', alt: 'Energy network infrastructure.' },
    { src: '/images/virya-solar.webp', alt: 'Solar generation panels.' },
    { src: '/images/virya-wind.webp', alt: 'Wind turbines generating power.' },
  ],
  'Who we work with': [
    { src: '/images/virya-engineering.webp', alt: 'Engineer inspecting equipment at an industrial site.' },
    { src: '/images/virya-ev-charging.webp', alt: 'Electric vehicle charging at a facility.' },
    { src: '/images/virya-solar.webp', alt: 'Solar panels serving a commercial site.' },
  ],
  Insights: [
    { src: '/images/virya-wind.webp', alt: 'Wind turbines across a renewable energy landscape.' },
    { src: '/images/virya-solar.webp', alt: 'Solar panels generating clean electricity.' },
    { src: '/images/virya-energy.webp', alt: 'Electricity infrastructure in the energy system.' },
  ],
  'How we work': [
    { src: '/images/virya-engineering.webp', alt: 'Engineer reviewing technical equipment.' },
    { src: '/images/virya-solar.webp', alt: 'Solar panels at an energy site.' },
    { src: '/images/virya-ev-charging.webp', alt: 'Electric vehicle charging infrastructure.' },
  ],
  'Projects & capabilities': [
    { src: '/images/virya-solar.webp', alt: 'Solar installation at a commercial site.' },
    { src: '/images/virya-engineering.webp', alt: 'Engineering work at an industrial facility.' },
    { src: '/images/virya-energy.webp', alt: 'Electricity infrastructure for energy projects.' },
  ],
};

/**
 * Shared header for every non-home page, so the site reads as one system
 * rather than a set of templates. Carries the breadcrumb and exactly one
 * primary action — the "request a consultation" path is never more than a
 * click away.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  primary = { label: 'Request a consultation', to: '/request-consultation' },
  secondary,
  trail,
  visual,
  compact = false,
}: PageHeroProps) {
  const pageVisual = visual ?? PAGE_VISUALS[eyebrow];

  return (
    <section
      className={compact ? 'relative overflow-hidden bg-ink pb-12 pt-28 sm:pb-14 sm:pt-32' : 'relative overflow-hidden bg-mist pb-14 pt-28 sm:pb-16 sm:pt-32'}
    >
      <div
        className="grid-lines pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      />
      <div className="shell relative">
        {trail && trail.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[0.8rem] text-ink-muted">
              {trail.map((crumb, index) => (
                <li key={crumb.to} className="flex items-center gap-2">
                  {index > 0 && <span className="text-ink-faint">/</span>}
                  <Link
                    to={crumb.to}
                    className="transition-colors hover:text-emerald-700"
                  >
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className={pageVisual?.length ? 'grid items-center gap-10 lg:grid-cols-12 lg:gap-12' : ''}>
          <div className={pageVisual?.length ? 'lg:col-span-7' : 'max-w-3xl'}>
            <p className="eyebrow">
              <span className="rule-accent" />
              {eyebrow}
            </p>

            <h1
              className={
                compact
                  ? 'mt-5 text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl lg:text-5xl'
                  : 'mt-5 text-3xl font-extrabold leading-[1.08] text-ink sm:text-4xl lg:text-5xl'
              }
            >
              {title}
            </h1>

            {description && (
              <p
                className={
                  compact
                    ? 'mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg'
                    : 'mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg'
                }
              >
                {description}
              </p>
            )}

            {(primary || secondary) && (
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {primary && (
                  <Link
                    to={primary.to}
                    className="btn-primary-lg"
                    data-testid="hero-primary"
                  >
                    {primary.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {secondary && (
                  <Link
                    to={secondary.to}
                    className={compact ? 'btn-ghost text-white/85 hover:bg-white/10 hover:text-white' : 'btn-outline-lg'}
                  >
                    {secondary.label}
                  </Link>
                )}
              </div>
            )}
          </div>

          {pageVisual && pageVisual.length > 0 && (
            <div className="relative mx-auto aspect-[1.08] w-full max-w-[34rem] lg:col-span-5" role="group" aria-label={`${eyebrow} images`}>
              {pageVisual.slice(0, 3).map((image, index) => (
                <figure
                  key={image.src}
                  className={[
                    'absolute overflow-hidden rounded-lg border border-white/20 bg-ink shadow-lift transition-transform duration-500 ease-out motion-reduce:transform-none',
                    'group/hero-stack hover:z-30 hover:rotate-0 hover:scale-[1.03]',
                    index === 0 && 'left-[4%] top-[8%] z-20 h-[76%] w-[78%] -rotate-2',
                    index === 1 && 'right-[1%] top-[1%] z-10 h-[55%] w-[43%] rotate-6',
                    index === 2 && 'bottom-[1%] right-[5%] z-0 h-[51%] w-[43%] -rotate-3',
                  ].filter(Boolean).join(' ')}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/hero-stack:scale-105"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07110f]/25 to-transparent" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Closing conversion band, reused at the foot of most pages. */
export function CtaBand({
  title,
  body,
  primary = { label: 'Request a consultation', to: '/request-consultation' },
  secondary,
}: {
  title: string;
  body: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden="true"
      />
      <div className="shell relative">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold leading-[1.12] text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/70">{body}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to={primary.to}
              className="btn-primary-lg border border-white/10 hover:bg-emerald-400"
            >
              {primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {secondary && (
              <Link
                to={secondary.to}
                className="btn btn-lg border border-white/25 text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/5"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}