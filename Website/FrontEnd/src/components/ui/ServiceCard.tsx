import { ArrowUpRight, Cpu, LineChart, Sun, Zap } from 'lucide-react';
import type { Service } from '@/data/services';
import type { IconName } from '@/data/services';
import { cn, scrollToSection, trackEvent } from '@/lib/utils';
import { publishServiceIntent } from '@/lib/serviceIntent';
import { SmartImage } from './Image';

const ICONS: Record<IconName, typeof Sun> = {
  Sun,
  Zap,
  Cpu,
  LineChart,
};

const TONES: Record<IconName, { chip: string; glow: string; text: string }> = {
  Sun: {
    chip: 'bg-amber-50 text-amber-600 ring-amber-200/70',
    glow: 'group-hover:shadow-[0_0_0_1px_rgba(245,158,11,0.35)]',
    text: 'text-amber-600',
  },
  Zap: {
    chip: 'bg-sky-50 text-sky-600 ring-sky-200/70',
    glow: 'group-hover:shadow-[0_0_0_1px_rgba(14,165,233,0.35)]',
    text: 'text-sky-600',
  },
  Cpu: {
    chip: 'bg-violet-50 text-violet-600 ring-violet-200/70',
    glow: 'group-hover:shadow-[0_0_0_1px_rgba(139,92,246,0.35)]',
    text: 'text-violet-600',
  },
  LineChart: {
    chip: 'bg-emerald-50 text-emerald-600 ring-emerald-200/70',
    glow: 'group-hover:shadow-[0_0_0_1px_rgba(16,185,129,0.35)]',
    text: 'text-emerald-600',
  },
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon];
  const tone = TONES[service.icon];

  return (
    <article
      id={`service-${service.id}`}
      className={cn(
        'card card-hover group relative flex scroll-mt-28 flex-col overflow-hidden',
        tone.glow,
      )}
    >
      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <SmartImage
          src={service.image}
          alt={service.imageAlt}
          width={640}
          height={400}
          fill
          focal="center"
          sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw"
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent"
        />

        <span className="absolute left-4 top-4 font-heading text-xs font-bold tracking-[0.2em] text-white/85">
          {service.index}
        </span>

        <span
          className={cn(
            'absolute bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1',
            tone.chip,
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-heading text-lg font-bold leading-snug tracking-tight">
          {service.title}
        </h3>

        <p className="text-[0.94rem] leading-relaxed text-ink-muted">{service.description}</p>

        <ul className="mt-1 space-y-2">
          {service.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
              <span
                aria-hidden="true"
                className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
              />
              {item}
            </li>
          ))}
        </ul>

        <a
          href="#booking"
          data-service={service.id}
          onClick={(event) => {
            event.preventDefault();
            trackEvent('service_cta_click', { service: service.id });
            // Tell the booking form which service to pre-select, then scroll.
            publishServiceIntent(service.id);
            scrollToSection('booking', 96);
          }}
          className={cn(
            'mt-auto inline-flex w-fit items-center gap-1.5 pt-2 font-heading text-sm font-semibold',
            'text-emerald-900 transition-colors hover:text-emerald-500',
          )}
        >
          Discover service
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  );
}