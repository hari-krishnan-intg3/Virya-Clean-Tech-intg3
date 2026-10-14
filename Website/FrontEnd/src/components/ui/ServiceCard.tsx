import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/data/services';
import { cn } from '@/lib/utils';

/**
 * Compact service card used in grid layouts.
 *
 * Renders the service as a link rather than a card that scrolls: with
 * routing, every service has a real URL, so the whole surface is clickable
 * and the destination can be shared.
 */
export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className={cn(
        'card card-hover group flex h-full flex-col p-7 focus-visible:ring-2',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow',
            service.gradient,
          )}
        >
          <service.icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-line bg-mist px-3 py-1 text-[0.72rem] font-semibold text-ink-muted">
          {service.scale}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold leading-snug text-ink transition-colors group-hover:text-emerald-700">
        {service.title}
      </h3>

      <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-ink-muted">
        {service.tagline}
      </p>

      <ul className="mt-5 space-y-2">
        {service.capabilities.slice(0, 3).map((capability) => (
          <li key={capability} className="flex items-start gap-2 text-[0.85rem] text-ink-muted">
            <span
              className={cn(
                'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br',
                service.gradient,
              )}
            />
            {capability}
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-emerald-700">
        Explore {service.label.toLowerCase()}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}