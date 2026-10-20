import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Bike,
  Bus,
  CalendarDays,
  Car,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileCheck2,
  Gauge,
  Truck,
} from 'lucide-react';
import { CtaBand } from '@/components/sections/PageHero';
import { Reveal, SmartImage } from '@/components/ui';
import { getService, services } from '@/data/services';
import { disqualifiers } from '@/data/qualification';

const VEHICLE_APPLICATIONS = [
  {
    icon: Car,
    title: 'Cars and workplace charging',
    description:
      'Employee, visitor and customer parking can involve different dwell times and access needs. Review when vehicles are parked, how many may charge together, where spaces are located and whether access should be private or public.',
  },
  {
    icon: Bike,
    title: 'Bikes and two-wheelers',
    description:
      'Electric bikes and scooters often need charging close to regular parking or fleet turnaround areas. Consider secure locations, charging frequency, shared circuits, available power and how users will access the equipment.',
  },
  {
    icon: Bus,
    title: 'Electric buses',
    description:
      'Bus depots need charging plans that reflect route distance, return times, layovers and departure schedules. Depot layout, high-power demand, connection capacity and staged charging all need assessment before equipment is specified.',
  },
  {
    icon: Truck,
    title: 'Commercial and fleet vehicles',
    description:
      'Vans, delivery vehicles and other commercial fleets have operating windows tied to routes and service commitments. Review daily distance, vehicle mix, loading activity, time at depot and the electrical capacity available for charging.',
  },
];

/**
 * Service detail page.
 *
 * Built around the questions a procurement team actually asks in this order:
 * what is it, how big, how long, what do I get, what does it cost, who is it
 * for. Cost is deliberately not invented — it is routed to the audit.
 */
export default function ServiceDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const service = getService(slug);

  if (!service) return <Navigate to="/services" replace />;

  const others = services.filter((s) => s.slug !== service.slug);
  const Icon = service.icon;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pt-32 pb-16 sm:pt-36 sm:pb-20">
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
          className={`pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br ${service.gradient} opacity-20 blur-3xl`}
          aria-hidden="true"
        />

        <div className="shell relative">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[0.8rem] text-white/55">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li>
                <Link to="/services" className="transition-colors hover:text-white">
                  Services
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="font-semibold text-white/90">{service.label}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span
                className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-glow`}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] text-white sm:text-5xl lg:text-[3.5rem]">
                {service.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                {service.tagline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={`/request-consultation?service=${service.slug}`}
                  className="btn-primary-lg"
                >
                  Request a consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact#slots"
                  className="btn btn-lg border border-white/25 text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/5"
                >
                  <CalendarDays className="h-4 w-4" />
                  Book a slot
                </Link>
              </div>
            </div>

            {/* At-a-glance panel */}
            <div className="space-y-5 lg:col-span-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
                <SmartImage
                  src={service.image}
                  alt={service.imageAlt}
                  width={1600}
                  height={1000}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07110f]/55 to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07110f]/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {service.label}
                </span>
              </div>

              <div className="panel overflow-hidden">
                <dl className="divide-y divide-line">
                  <div className="flex items-center gap-4 p-5">
                    <Gauge className="h-5 w-5 shrink-0 text-emerald-500" />
                    <div>
                      <dt className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        Project context
                      </dt>
                      <dd className="text-[0.95rem] font-semibold text-ink">{service.scale}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5">
                    <Clock className="h-5 w-5 shrink-0 text-emerald-500" />
                    <div>
                      <dt className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        Timing
                      </dt>
                      <dd className="text-[0.95rem] font-semibold text-ink">
                        {service.timeline}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5">
                    <ClipboardList className="h-5 w-5 shrink-0 text-emerald-500" />
                    <div>
                      <dt className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        Entry point
                      </dt>
                      <dd className="text-[0.95rem] font-semibold text-ink">
                        {service.slug === 'consulting'
                          ? 'Discuss the site and assessment objective'
                          : 'Discuss site conditions and requirements'}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + capabilities */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  Overview
                </p>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  What this actually involves
                </h2>
                <p className="mt-6 text-base leading-relaxed text-ink-muted">{service.summary}</p>
              </Reveal>

              <Reveal delay={0.08} className="mt-12">
                  <h3 className="text-xl font-bold text-ink">Potential areas of scope</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                  The items below describe areas that may be considered. Confirm
                  availability, responsibilities and deliverables for your project
                  before proceeding.
                </p>
                <ul className="mt-6 space-y-3.5">
                  {service.capabilities.map((capability) => (
                    <li key={capability} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-[0.95rem] leading-relaxed text-ink-muted">
                        {capability}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="card p-7">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                    Best suited to
                  </p>
                  <ul className="mt-5 space-y-4">
                    {service.bestFor.map((fit) => (
                      <li key={fit} className="flex gap-3">
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${service.gradient}`}
                        />
                        <span className="text-[0.92rem] leading-relaxed text-ink-muted">{fit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.14} className="mt-6">
                <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50/60 p-7">
                  <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-amber-700">
                    <FileCheck2 className="h-4 w-4" />
                    Site-specific fit
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-amber-900/85">
                    A service page can help frame the discussion, but it cannot
                    confirm technical suitability. Site conditions, approvals,
                    operating needs and project scope need to be reviewed.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {disqualifiers.map((reason) => (
                      <li key={reason} className="text-[0.85rem] leading-relaxed text-amber-900/75">
                        · {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {service.slug === 'ev-charging' && (
        <section className="section bg-mist">
          <div className="shell">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">
                <span className="rule-accent" />
                Vehicle applications
              </p>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                Charging plans for cars, bikes, buses and fleets.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                Vehicle type is only one part of the design. Parking duration,
                usage patterns, electrical capacity and site operations determine
                what should be explored for each location.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {VEHICLE_APPLICATIONS.map((application, index) => (
                <Reveal key={application.title} delay={index * 0.06} as="div">
                  <article className="card h-full p-6 sm:p-7">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-emerald-700">
                      <application.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-ink">{application.title}</h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                      {application.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deliverables */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Possible project outputs
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Clear outputs for the agreed scope
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Outputs depend on the agreed work, the information available and
              any specialist review required. The project scope should state
              what will be provided and what remains outside it.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {service.deliverables.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.07} as="div">
                <article className="card card-hover h-full p-7">
                  <h3 className="mt-5 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  Common questions
                </p>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  What people ask before signing
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink-muted">
                  If your question is not here, the assistant on this page can
                  take it, or ask us directly.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <Reveal key={faq.question} delay={index * 0.06} as="div">
                    <details className="group card p-6 [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-start justify-between gap-4 text-[1rem] font-semibold text-ink">
                        {faq.question}
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 text-[0.93rem] leading-relaxed text-ink-muted">
                        {faq.answer}
                      </p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              Related capabilities
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
              Some projects involve more than one solution area. Whether they
              should be combined depends on the site, objectives, technical
              requirements and commercial review.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other, index) => (
              <Reveal key={other.slug} delay={index * 0.06} as="div">
                <Link to={`/services/${other.slug}`} className="card card-hover group h-full p-6">
                  <span
                    className={`inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${other.gradient} text-white`}
                  >
                    <other.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-heading text-[1.05rem] font-bold text-ink transition-colors group-hover:text-emerald-700">
                    {other.label}
                  </p>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-muted">
                    {other.cardSummary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Ready to scope ${service.label.toLowerCase()} for your site?`}
        body="Start with a conversation about your site and objectives. The next step depends on the information available and the review your project requires."
        secondary={{ label: 'See all services', to: '/services' }}
      />
    </>
  );
}