import { useState } from 'react';
import { Info } from 'lucide-react';
import { ecosystemFlows, ecosystemNodes, type EcosystemNode } from '@/data/content';
import { cn } from '@/lib/utils';
import { Reveal, SectionHeading, SmartImage } from '@/components/ui';
import { visualAssets, type VisualAsset } from '@/data/visuals';

const nodeById = (id: string) => ecosystemNodes.find((n) => n.id === id)!;
const NODE_VISUALS: Record<string, VisualAsset> = {
  solar: visualAssets.solarInstallation,
  battery: visualAssets.storage,
  ev: visualAssets.viryaEvCharging,
  systems: visualAssets.viryaWind,
};

/** Quadratic curve between two diagram points, bowed outward from the centre. */
function flowPath(from: EcosystemNode, to: EcosystemNode): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  // Push the control point away from the centre so flows read as a ring.
  const bow = 0.18;
  const cx = midX + (midX - 50) * bow;
  const cy = midY + (midY - 50) * bow;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

export function EnergyEcosystemContainer() {
  const [active, setActive] = useState<string>('solar');
  const activeNode = nodeById(active);

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="section bg-white"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="Technology ecosystem"
          title={
            <>
              One Connected Vision for <span className="text-gradient">Smarter Energy</span>
            </>
          }
          description="Our four solution areas reinforce one another. The diagram below illustrates how solar, storage, charging and intelligent systems relate — select any node to read how it connects."
          align="center"
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Diagram */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto aspect-square w-full max-w-xl">
              {/* Grid backdrop */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-line bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.07),transparent_62%)]"
              />
              <div
                aria-hidden="true"
                className="grid-lines absolute inset-[8%] rounded-full opacity-70"
              />

              {/* Connectors */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <linearGradient id="eco-stroke" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {ecosystemFlows.map((flow, index) => {
                  const highlighted = flow.from === active || flow.to === active;
                  return (
                  <path
                    key={`${flow.from}-${flow.to}`}
                    d={flowPath(nodeById(flow.from), nodeById(flow.to))}
                    fill="none"
                    stroke="url(#eco-stroke)"
                    strokeWidth={1.6}
                    strokeOpacity={highlighted ? 0.95 : 0.16}
                    strokeLinecap="round"
                    strokeDasharray={highlighted ? '4 4' : '2 7'}
                    vectorEffect="non-scaling-stroke"
                    style={{
                      animation: highlighted
                        ? `flowDash 2.8s linear ${index * 0.45}s infinite`
                        : 'none',
                    }}
                  />
                  );
                })}
              </svg>

              {/* Nodes */}
              {ecosystemNodes.map((node, index) => {
                const Icon = node.icon;
                const isActive = active === node.id;
                return (
                  <Reveal
                    key={node.id}
                    delay={0.1 + index * 0.08}
                    className="absolute z-10"
                  >
                    <div
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className="-translate-x-1/2 -translate-y-1/2"
                    >
                      <button
                        type="button"
                        onClick={() => setActive(node.id)}
                        aria-pressed={isActive}
                        className={cn(
                          'group flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-2xl border bg-white shadow-soft transition-all duration-300',
                          'hover:-translate-y-1 hover:shadow-lift sm:h-24 sm:w-24',
                          isActive && 'border-emerald-500/50 shadow-lift',
                        )}
                      >
                        <span
                          className={cn(
                            'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10',
                            node.gradient,
                          )}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="px-1 text-center font-heading text-[0.62rem] font-bold leading-tight text-ink sm:text-[0.7rem]">
                          {node.label.split(' ')[0]}
                        </span>

                        {/* Pulse ring */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-2xl border-2"
                          style={{
                            borderColor: `${node.accent}55`,
                            animation: isActive
                              ? 'none'
                              : `floatY 6s ease-in-out ${index * 0.4}s infinite`,
                          }}
                        />
                      </button>
                    </div>
                  </Reveal>
                );
              })}

              {/* Central hub */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  aria-live="polite"
                  className="relative flex h-36 w-36 flex-col items-center justify-center rounded-2xl border border-emerald-500/40 bg-white/95 px-3 text-center shadow-lift backdrop-blur-sm sm:h-40 sm:w-40"
                >
                  <span className="relative h-8 w-8 overflow-hidden rounded-full border border-emerald-500/20">
                    <SmartImage
                      src={NODE_VISUALS[activeNode.id].src}
                      alt={NODE_VISUALS[activeNode.id].alt}
                      width={96}
                      height={96}
                      fill
                      sizes="32px"
                    />
                  </span>
                  <p className="mt-2 font-heading text-[0.75rem] font-extrabold leading-tight text-ink sm:text-sm">
                    {activeNode.label}
                  </p>
                  <p className="mt-1 text-[0.62rem] leading-snug text-ink-muted sm:text-[0.68rem]">
                    Selected system
                  </p>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl border border-emerald-500/35"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accessible description + node list */}
          <div className="lg:col-span-5">
            <ul className="space-y-3">
              {ecosystemNodes.map((node) => {
                const Icon = node.icon;
                const isActive = active === node.id;
                return (
                  <li key={node.id}>
                    <button
                      type="button"
                      onClick={() => setActive(node.id)}
                      aria-pressed={isActive}
                      className={cn(
                        'flex w-full items-start gap-4 rounded-2xl border border-line bg-white p-5 text-left transition-all duration-300',
                        'hover:border-emerald-500/30 hover:shadow-soft',
                        isActive && 'border-emerald-500/40 bg-emerald-500/[0.04] shadow-soft',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white',
                          node.gradient,
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>

                      <span className="min-w-0">
                        <span className="block font-heading text-base font-bold text-ink">
                          {node.label}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                          {node.description}
                        </span>

                        <span
                          className={cn(
                            'mt-2 block overflow-hidden text-xs leading-relaxed transition-all duration-300',
                            isActive ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0',
                          )}
                        >
                          <span className="mt-2 inline-flex flex-wrap items-center gap-1.5">
                            {ecosystemFlows
                              .filter((f) => f.from === node.id || f.to === node.id)
                              .map((f) => {
                                const other = nodeById(f.from === node.id ? f.to : f.from);
                                return (
                                  <span key={f.from + f.to} className="block text-[0.72rem]">
                                    <span className="font-semibold text-ink">{f.label} · {other.label}:</span>{' '}
                                    {f.description}
                                  </span>
                                );
                              })}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-line bg-mist p-4 text-sm leading-relaxed text-ink-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
              This diagram represents Virya&apos;s four solution areas and how they can work
              together. Each area is delivered as a distinct engagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}