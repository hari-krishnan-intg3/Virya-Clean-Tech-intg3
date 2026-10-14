import { differentiators } from '@/data/content';
import { Reveal, SectionHeading, SmartImage } from '@/components/ui';

export function WhyViryaContainer() {
  return (
    <section
      id="why-virya"
      aria-labelledby="why-title"
      className="section bg-mist"
    >
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Visual */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-white shadow-lift sm:aspect-[4/4.4]">
                  <SmartImage
                    src="https://viryacleantech.com/wp-content/uploads/elementor/thumbs/female-maintenance-engineer-controls-the-work-of-w-2021-12-09-04-14-06-utc-r6meidpuek646827clcskxuzu6n5w9vjl7nfud2a88.jpg"
                    alt="Maintenance engineer controlling clean-energy equipment on site."
                    width={1024}
                    height={1024}
                    fill
                    focal="center 35%"
                    sizes="(min-width:1024px) 40vw, 100vw"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent"
                  />
                </div>

                {/* Floating stat-free proof card */}
                <div className="absolute -bottom-6 -right-2 w-56 rounded-2xl border border-line bg-white/95 p-5 shadow-lift backdrop-blur-md sm:-right-6">
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
                    Our approach
                  </p>
                  <p className="mt-2 font-heading text-base font-bold leading-snug text-ink">
                    Engineering first. Sustainability always.
                  </p>
                  <div aria-hidden="true" className="mt-4 flex gap-1.5">
                    <span className="h-1 w-9 rounded-full bg-emerald-500" />
                    <span className="h-1 w-5 rounded-full bg-sky-500" />
                    <span className="h-1 w-2.5 rounded-full bg-emerald-500/40" />
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute -left-12 -top-12 -z-10 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl"
                />
              </div>
            </Reveal>
          </div>

          {/* Differentiators */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Why Virya"
              title={
                <>
                  Engineering a Smarter, More <span className="text-gradient">Sustainable Future</span>
                </>
              }
              description="Choosing the right clean-energy partner shapes the success of your sustainability goals. We bring together technology, technical depth, and a genuine focus on innovation."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {differentiators.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 0.08}>
                    <article className="card card-hover h-full p-6">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 font-heading text-base font-bold leading-snug tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-muted">
                        {item.description}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}