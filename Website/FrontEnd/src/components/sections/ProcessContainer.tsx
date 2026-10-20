import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Compass, DraftingCompass, HardHat, LineChart } from 'lucide-react';
import { processSteps } from '@/data/process';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';
import { CardImage, SectionHeading } from '@/components/ui';
import { visualAssets } from '@/data/visuals';

const ICONS = [Compass, DraftingCompass, HardHat, LineChart];
const STEP_VISUALS = [
  visualAssets.viryaEngineering,
  visualAssets.industrialAssessment,
  visualAssets.industrial,
  visualAssets.viryaEnergy,
];

export function ProcessContainer() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 85%', 'end 55%'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Hooks must be called unconditionally — both axes are derived up-front.
  const progressY = useTransform(scaleX, (value) => value);
  const progressX = useTransform(scaleX, (value) => value);

  return (
    <section id="process" aria-labelledby="process-title" className="section bg-white">
      <div className="shell">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              A Streamlined Path to <span className="text-gradient">Smarter Energy</span>
            </>
          }
          description="Explore the questions that can help move a project from initial enquiry toward an appropriate, site-specific next step."
          align="center"
        />

        <div ref={trackRef} className="relative mt-16 lg:mt-20">
          {/* Rail — full width on desktop, vertical on mobile */}
          <div
            aria-hidden="true"
            className="absolute left-[1.375rem] top-2 h-[calc(100%-1rem)] w-px bg-line lg:left-0 lg:top-[1.375rem] lg:h-px lg:w-full"
          >
            <motion.div
              className={cn(
                'origin-top bg-gradient-to-r from-emerald-500 via-emerald-500 to-sky-500',
                'h-full w-full',
              )}
              style={
                reduced
                  ? { scaleX: 1, scaleY: 1 }
                  : { scaleX: progressX, scaleY: progressY }
              }
            />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step, index) => {
              const Icon = ICONS[index];
              return (
                <li key={step.number} className="relative pl-14 lg:pl-0">
                  {/* Node */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute left-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-full',
                      'border border-line bg-white shadow-soft lg:relative lg:top-0',
                    )}
                  >
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </span>

                  <article className="card mt-4 overflow-hidden lg:mt-5">
                    <CardImage image={STEP_VISUALS[index]} className="aspect-[16/9]" />
                    <div className="p-5">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-emerald-700">
                        Stage {step.number}
                      </p>
                      <h3 className="mt-2 font-heading text-lg font-bold leading-snug tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-[0.94rem] leading-relaxed text-ink-muted">
                        {step.description}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-12 text-center text-sm text-ink-faint">
          Support continues after deployment according to the scope agreed for your project.
        </p>
      </div>
    </section>
  );
}