import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { Service } from '@/data/services';
import { cn } from '@/lib/utils';
import { SmartImage } from './Image';

/**
 * Image-led service card with a compact expandable scope summary.
 */
export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  return (
    <article className={cn('card card-hover group flex h-full flex-col overflow-hidden', className)}>
      <Link
        to={`/services/${service.slug}`}
        aria-label={`Explore ${service.title}`}
        className="relative block aspect-[16/9] overflow-hidden focus-visible:z-10"
      >
        <SmartImage
          src={service.image}
          alt={service.imageAlt}
          width={1600}
          height={900}
          fill
          sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#07110f]/90 via-[#07110f]/15 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/90">
            {service.label}
          </span>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-[#07110f]/40 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white', service.gradient)}>
            <service.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-ink-faint">
            {service.scale}
          </p>
        </div>

        <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-snug text-ink transition-colors group-hover:text-emerald-300">
          {service.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[0.92rem] leading-relaxed text-ink-muted">
          {service.tagline}
        </p>

        <details className="group/details mt-4 border-t border-line pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-emerald-300 focus-visible:outline-none">
            <span>What to consider</span>
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open/details:rotate-180" aria-hidden="true" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{service.cardSummary}</p>
          <ul className="mt-4 space-y-2">
            {service.capabilities.slice(0, 3).map((capability) => (
              <li key={capability} className="flex items-start gap-2 text-[0.85rem] leading-relaxed text-ink-muted">
                <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br', service.gradient)} />
                {capability}
              </li>
            ))}
          </ul>
        </details>

        <Link
          to={`/services/${service.slug}`}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-300 focus-visible:outline-none"
        >
          Explore {service.label.toLowerCase()}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}