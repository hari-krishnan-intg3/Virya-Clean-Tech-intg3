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
  /** Compact variant for detail pages that open immediately with content. */
  compact?: boolean;
}

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
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={compact ? 'relative overflow-hidden bg-ink pt-32 pb-14 sm:pt-36 sm:pb-16' : 'section relative overflow-hidden bg-mist pt-32'}
    >
      <div
        className="grid-lines pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      />
      {!compact && (
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden="true"
        />
      )}

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

        <div className={compact ? 'max-w-3xl' : 'max-w-3xl'}>
          <p className="eyebrow">
            <span className="rule-accent" />
            {eyebrow}
          </p>

          <h1
            className={
              compact
                ? 'mt-5 text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl lg:text-5xl'
                : 'mt-5 text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-6xl'
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
    <section className="section relative overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
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