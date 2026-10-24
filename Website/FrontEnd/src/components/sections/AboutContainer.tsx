import { ArrowRight, Cpu, Leaf, Sparkles, Sun, Zap } from 'lucide-react';
import { SmartImage } from '@/components/ui';
import { Button } from '@/components/ui';
import { scrollToSection, trackEvent } from '@/lib/utils';
import { visualAssets } from '@/data/visuals';

/** Small connected-system motif: generation -> storage -> use -> insight. */
function EnergyLoop() {
  const stages = [
    { icon: Sun, label: 'Generate', accent: '#F59E0B' },
    { icon: Zap, label: 'Store', accent: '#8B5CF6' },
    { icon: Cpu, label: 'Manage', accent: '#10B981' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3" aria-hidden="true">
      {stages.map((stage, index) => (
        <div key={stage.label} className="flex items-center gap-3">
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-white shadow-soft"
            style={{ borderColor: `${stage.accent}40` }}
          >
            <stage.icon className="h-5 w-5" style={{ color: stage.accent }} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block font-heading text-sm font-bold text-ink">{stage.label}</span>
          </span>
          {index < stages.length - 1 && (
            <span className="ml-auto hidden h-px w-full max-w-10 bg-gradient-to-r from-line to-transparent sm:block lg:hidden" />
          )}
        </div>
      ))}
    </div>
  );
}

const PILLARS = [
  { icon: Sun, label: 'Solar power' },
  { icon: Zap, label: 'EV charging' },
  { icon: Cpu, label: 'Battery & IoT' },
  { icon: Sparkles, label: 'Custom software' },
];

export function AboutContainer() {
  return (
    <section id="about" aria-labelledby="about-title" className="section bg-white">
      <div className="shell">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Narrative */}
          <div className="lg:col-span-6">
            <p className="eyebrow">
              <span aria-hidden="true" className="inline-block h-px w-6 bg-emerald-500/60 sm:w-8" />
              About Virya Cleantech
            </p>

            <h2
              id="about-title"
              className="mt-4 text-balance font-heading text-[1.75rem] font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.9rem]"
            >
              Empowering the Future Through <span className="text-gradient">Clean Innovation</span>
            </h2>

            <div className="mt-6 space-y-5 text-[0.98rem] leading-relaxed text-ink-muted">
              <p>
                We are more than just a clean energy company — we are a passionate collective
                of innovators, engineers, and visionaries on a mission to reshape the world
                through sustainable technology.
              </p>
              <p>
                Our work spans renewable energy solutions across EV charging systems,
                advanced battery technology, and solar power innovations, with custom
                software and IoT integration connecting it all. We aim to drive impactful,
                practical change for a greener tomorrow.
              </p>
              <p>
                As a youthful and forward-thinking team, we combine technical expertise with
                bold creativity to challenge conventional energy systems and deliver
                cutting-edge, eco-friendly alternatives. Our journey is powered by
                collaboration, sustainability, and an unyielding commitment to a cleaner,
                smarter future.
              </p>
            </div>

            <figure className="mt-8 rounded-2xl border border-line bg-mist p-6">
              <blockquote className="text-pretty font-heading text-lg font-semibold leading-snug text-ink">
                “Our goal is to create sustainable, nature-friendly energy solutions for
                future generations.”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 text-sm text-ink-faint">
                <Leaf className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                Mission statement
              </figcaption>
            </figure>

            <div className="mt-9">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  trackEvent('cta_click', { placement: 'about', target: 'contact' });
                  scrollToSection('contact');
                }}
              >
                Talk to our team
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Visual composition */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-mist shadow-lift">
                <SmartImage
                  src={visualAssets.industrialAssessment.src}
                  alt={visualAssets.industrialAssessment.alt}
                  width={1024}
                  height={683}
                  fill
                  focal="center 35%"
                  sizes="(min-width:1024px) 46vw, 100vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"
                />
              </div>

              {/* Floating capability panel */}
              <div className="absolute -bottom-7 left-4 right-4 rounded-2xl border border-line bg-white/95 p-5 shadow-lift backdrop-blur-md sm:left-6 sm:right-auto sm:w-80">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
                  What we work across
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {PILLARS.map((pillar) => (
                    <li
                      key={pillar.label}
                      className="flex items-center gap-2 rounded-lg bg-mist px-2.5 py-2 text-[0.78rem] font-medium text-ink"
                    >
                      <pillar.icon className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                      {pillar.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 -z-10 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-10 left-10 -z-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"
              />
            </div>
          </div>
        </div>

        <div className="mt-24 rounded-2xl border border-line bg-mist p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10"
            >
              <Zap className="h-4 w-4 text-emerald-600" />
            </span>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-ink">
              How energy moves through our solutions
            </p>
          </div>
          <EnergyLoop />
        </div>
      </div>
    </section>
  );
}