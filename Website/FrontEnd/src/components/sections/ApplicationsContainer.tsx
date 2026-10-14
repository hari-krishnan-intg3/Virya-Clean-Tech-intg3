import { ArrowUpRight } from 'lucide-react';
import { applications } from '@/data/content';
import { Reveal, SectionHeading, SmartImage } from '@/components/ui';
import { cn, scrollToSection, trackEvent } from '@/lib/utils';

const SPANS: Record<string, string> = {
  tall: 'sm:row-span-2',
  wide: 'sm:col-span-2',
  normal: '',
};

export function ApplicationsContainer() {
  return (
    <section
      id="applications"
      aria-labelledby="applications-title"
      className="section relative overflow-hidden bg-mist"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Solutions across applications"
          title={
            <>
              Clean Energy Solutions for <span className="text-gradient">Real-World Needs</span>
            </>
          }
          description="The kinds of problems Virya Cleantech solves — designed around residential, commercial, fleet and industrial requirements."
          align="center"
        />

        <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-line bg-white/70 px-5 py-4 text-center text-sm leading-relaxed text-ink-muted">
          <strong className="font-semibold text-ink">Note:</strong> the scenarios below are
          illustrative application areas, not a record of completed Virya projects. Our company
          profile does not publish case studies.
        </p>

        <div className="mt-12 grid auto-rows-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, index) => (
            <Reveal
              key={app.id}
              delay={index * 0.07}
              className={cn(SPANS[app.span], 'min-h-[15rem]')}
            >
              <a
                href={app.href}
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('application_click', { target: app.id });
                  scrollToSection(app.href.slice(1), 96);
                }}
                className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-line bg-ink shadow-soft"
              >
                <SmartImage
                  src={app.image}
                  alt={app.imageAlt}
                  width={800}
                  height={600}
                  fill
                  focal={app.focal}
                  sizes="(min-width:1024px) 32vw, (min-width:640px) 48vw, 100vw"
                  className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/10 transition-opacity duration-500 group-hover:from-ink group-hover:via-ink/55"
                />

                <div className="relative p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                    {app.category}
                  </span>

                  <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-white">
                    {app.title}
                  </h3>

                  <p className="mt-2 max-h-0 overflow-hidden text-[0.9rem] leading-relaxed text-white/70 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                    {app.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-emerald-400">
                    Explore solution
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}