import { ArrowRight, Building2, ClipboardList, Gauge, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';

const ASSESSMENT_AREAS = [
  {
    icon: Building2,
    title: 'Facility and operations',
    body: 'Understand what the facility does, when it operates and who manages the site. Access rules, planned changes, ownership and operational constraints can affect what information is available and how a project could be reviewed.',
  },
  {
    icon: Gauge,
    title: 'Energy requirements',
    body: 'Review available bills or usage data alongside schedules, seasonal changes and equipment that must remain in service. Connect those details to the business objective so questions about demand, continuity or generation have useful context.',
  },
  {
    icon: MapPin,
    title: 'Site conditions',
    body: 'Consider roof or land area, structural condition, shading, parking layout and the existing electrical connection. Local utility rules, permissions, site access and safety requirements may need specialist review before feasibility is confirmed.',
  },
  {
    icon: ClipboardList,
    title: 'Scope and next steps',
    body: 'Identify service areas that may be relevant, what remains unknown and who needs to review it. Agree whether the next step is more data, a site visit, technical assessment or a separate commercial discussion.',
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects & capabilities"
        title={<>A clear view of <span className="text-gradient">what a project assessment covers.</span></>}
        description="Project requirements differ by facility and operating context. Use this overview to understand the information that can shape an initial clean-energy discussion."
        primary={{ label: 'Discuss a project', to: '/request-consultation' }}
        secondary={{ label: 'Explore solutions', to: '/services' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Projects & capabilities', to: '/projects' }]}
      />

      <section className="section">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Before a proposal
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Start with the requirement, not an assumed solution.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              An early review can help clarify the questions a project needs to
              answer. Technical suitability, project cost, performance and
              timing require appropriate site-specific information and review.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {ASSESSMENT_AREAS.map((area, index) => (
              <Reveal key={area.title} delay={index * 0.06} as="div">
                <article className="card h-full p-6 sm:p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <area.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{area.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                    {area.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              A useful starting point
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Bring what you know. Identify what still needs checking.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Share the context', 'Describe the facility, location, operating patterns and challenge. Mention what is changing and which teams will be involved in evaluating a possible project.'],
              ['Review relevant options', 'Compare service areas against site conditions and the objective. A preliminary discussion can identify questions, but it cannot replace an engineering review.'],
              ['Agree on a next step', 'Confirm what information, site access or specialist input is needed. Define the scope and responsibilities before committing to further work.'],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 0.06} as="div">
                <article className="card h-full p-6">
                  <h3 className="mt-3 text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Link
            to="/process"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
          >
            See the project process <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <CtaBand
        title="Have a facility or project to discuss?"
        body="Share the location, operating context and objective. The team can help identify what information may be useful for an initial review."
        primary={{ label: 'Request a consultation', to: '/request-consultation' }}
        secondary={{ label: 'Contact Virya', to: '/contact' }}
      />
    </>
  );
}