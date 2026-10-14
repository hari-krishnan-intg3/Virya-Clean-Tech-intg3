import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';
import {
  CAREERS,
  ROLE_SLUGS,
  benefits,
  hiringStages,
  roles,
  // Aliased: `values` alone collides visually with the form state inside
  // ApplicationForm, and the two have nothing to do with each other.
  values as employerValues,
  type Role,
} from '@/data/careers';
import { cn } from '@/lib/utils';
import { flush, track } from '@/lib/session';

const TEAM_FILTERS = ['All teams', ...Array.from(new Set(roles.map((r) => r.team)))];

/* ------------------------------------------------------------------ */
/* Application form                                                    */
/* ------------------------------------------------------------------ */

interface ApplicationValues {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  portfolio: string;
  message: string;
  consent: boolean;
}

const EMPTY: ApplicationValues = {
  fullName: '',
  email: '',
  phone: '',
  role: 'open-application',
  experience: '',
  portfolio: '',
  message: '',
  consent: false,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Application form.
 *
 * Postings a resume URL rather than an upload: there is no file storage in
 * this stack, and a Drive link is what people can actually send. It keeps
 * the form working with zero extra infrastructure.
 */
function ApplicationForm({ presetRole }: { presetRole?: string }) {
  const [values, setValues] = useState<ApplicationValues>({
    ...EMPTY,
    role: presetRole && ROLE_SLUGS.includes(presetRole) ? presetRole : 'open-application',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const selected = roles.find((r) => r.slug === values.role);

  const set = <K extends keyof ApplicationValues>(key: K, value: ApplicationValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const canSubmit =
    values.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) &&
    values.message.trim().length >= 20 &&
    values.consent;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || status === 'submitting') return;

    setStatus('submitting');
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          roleLabel: selected?.title ?? 'Open application',
          source: 'careers-page',
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Application failed (${response.status})`);

      setStatus('success');
      void flush('submit');
      track('careers_application_submitted', { role: values.role });
    } catch (caught) {
      if ((caught as Error)?.name === 'AbortError') return;
      setError(
        'We could not send that. Please try again, or email your details directly — nothing is lost either way.',
      );
      setStatus('error');
    } finally {
      abortRef.current = null;
    }
  };

  if (status === 'success') {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-6 text-2xl font-extrabold text-ink">Application received</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
          It is with the {selected?.team ?? 'hiring'} lead now, not sitting in a generic inbox.
          Someone will reply either way — including when the role is filled.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setStatus('idle');
          }}
          className="btn-outline mt-7"
        >
          Submit another application
        </button>
      </div>
    );
  }

  const field = 'field';
  const label = 'label';

  return (
    <form onSubmit={submit} noValidate className="card p-7 sm:p-9">
      <h3 className="text-xl font-extrabold text-ink">
        {selected ? `Apply — ${selected.title}` : 'Send an application'}
      </h3>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">
        Link your resume or portfolio rather than attaching a file — a public link is faster
        for both of us.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-name">
            Full name <span className="text-emerald-600">*</span>
          </label>
          <input
            id="c-name"
            className={field}
            value={values.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="c-email">
            Email <span className="text-emerald-600">*</span>
          </label>
          <input
            id="c-email"
            type="email"
            inputMode="email"
            className={field}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className={label} htmlFor="c-phone">
            Phone <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="c-phone"
            type="tel"
            inputMode="tel"
            className={field}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
            placeholder="+91 00000 00000"
          />
        </div>

        <div>
          <label className={label} htmlFor="c-role">
            Role
          </label>
          <div className="relative">
            <select
              id="c-role"
              className={cn(field, 'appearance-none pr-10')}
              value={values.role}
              onChange={(e) => set('role', e.target.value)}
            >
              <option value="open-application">Open application</option>
              {roles.map((role) => (
                <option key={role.slug} value={role.slug}>
                  {role.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="c-portfolio">
            Resume or portfolio link
          </label>
          <input
            id="c-portfolio"
            type="url"
            className={field}
            value={values.portfolio}
            onChange={(e) => set('portfolio', e.target.value)}
            placeholder="https://linkedin.com/in/… or a Drive link"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label} htmlFor="c-message">
            Why this, and why here? <span className="text-emerald-600">*</span>
          </label>
          <textarea
            id="c-message"
            rows={5}
            className={cn(field, 'min-h-32 resize-y')}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="A couple of sentences on the work you want to be doing, and one thing you have built that you are proud of."
            required
          />
          <p className="mt-1.5 text-[0.75rem] text-ink-faint">
            {values.message.trim().length}/20 characters minimum
          </p>
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={(e) => set('consent', e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-line text-emerald-500"
        />
        <span className="text-[0.88rem] leading-relaxed text-ink-muted">
          I agree that Virya Clean Tech may store and process this application for recruitment
          purposes.
        </span>
      </label>

      {status === 'error' && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[0.88rem] text-red-800">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={!canSubmit || status === 'submitting'} className="btn-primary-lg">
          {status === 'submitting' ? 'Sending…' : 'Send application'}
          <Send className="h-4 w-4" />
        </button>

        <a href={CAREERS.emailHref} className="text-[0.9rem] font-semibold text-ink-muted hover:text-emerald-700">
          or email {CAREERS.email}
        </a>
      </div>

      {!canSubmit && status === 'idle' && (
        <p className="mt-4 text-[0.78rem] text-ink-faint">
          Name, a valid email, 20 characters of message and the consent tick are required.
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CareersPage() {
  const [team, setTeam] = useState('All teams');
  const [focusedRole, setFocusedRole] = useState<string | undefined>(undefined);

  const visible = useMemo(
    () => (team === 'All teams' ? roles : roles.filter((r) => r.team === team)),
    [team],
  );

  const applyTo = (role: Role) => {
    setFocusedRole(role.slug);
    track('careers_role_apply', { role: role.slug });
    requestAnimationFrame(() => {
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Build the systems that <span className="text-gradient">actually get switched on</span>
          </>
        }
        description="Virya is a small engineering team working on solar, storage, EV charging and the monitoring that ties them together. If you want your work energised rather than presented, this is a short list of roles and an honest description of what each one involves."
        primary={{ label: 'See open roles', to: '#roles' }}
        secondary={{ label: 'Send an open application', to: '#apply' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Careers', to: '/careers' }]}
      />

      {/* Why here */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  The work
                </p>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  Newer energy, older engineering discipline
                </h2>
                <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-muted">
                  <p>
                    The technology in this industry moves fast and the engineering standards
                    have not moved at all. Modules and cells change every year; earthing,
                    protection, commissioning and safety do not get a software update.
                  </p>
                  <p>
                    That combination is what makes it an interesting place to work. You get to
                    use hardware that did not exist five years ago, and you are expected to
                    hold it to a standard that is a century old. Very few jobs offer both.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-5 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <Reveal key={benefit.title} delay={index * 0.05} as="div">
                    <article className="card h-full p-6">
                      <h3 className="text-[1rem] font-bold text-ink">{benefit.title}</h3>
                      <p className="mt-2 text-[0.89rem] leading-relaxed text-ink-muted">
                        {benefit.body}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              How we work
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Six things that are true here
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Written as things you can check on your first day, not aspirations.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {employerValues.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.05} as="div">
                <article className="card h-full p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-bold text-ink">{value.title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-muted">
                    {value.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="roles" className="section scroll-mt-28">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">
                <span className="rule-accent" />
                Open roles
              </p>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                {roles.length} roles, {CAREERS.location}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {TEAM_FILTERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTeam(option)}
                  aria-pressed={team === option}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[0.85rem] font-medium transition-colors',
                    team === option
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-line bg-white text-ink-muted hover:border-emerald-500/40 hover:text-emerald-700',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 space-y-5">
            {visible.map((role, index) => (
              <Reveal key={role.slug} delay={Math.min(index, 5) * 0.04} as="div">
                <article
                  className={cn(
                    'card card-hover overflow-hidden',
                    focusedRole === role.slug && 'border-emerald-500/40 ring-2 ring-emerald-500/20',
                  )}
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-5 p-7 pb-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-extrabold text-ink">{role.title}</h3>
                        {focusedRole === role.slug && (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white">
                            Selected
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.82rem] text-ink-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 text-ink-faint" />
                          {role.team}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-ink-faint" />
                          {role.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-ink-faint" />
                          {role.type}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-ink-faint" />
                          {role.level} level
                        </span>
                      </div>

                      <p className="mt-4 max-w-2xl text-[0.93rem] leading-relaxed text-ink-muted">
                        {role.summary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyTo(role)}
                      className="btn-primary shrink-0"
                    >
                      Apply
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Detail */}
                  <div className="grid gap-7 border-t border-line bg-mist p-7 lg:grid-cols-2">
                    <div>
                      <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        Why the role exists
                      </h4>
                      <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-muted">
                        {role.mandate}
                      </p>

                      <h4 className="mt-7 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        What you will do
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {role.responsibilities.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[0.89rem] leading-relaxed text-ink-muted">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                        What we are looking for
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {role.looking.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[0.89rem] leading-relaxed text-ink-muted">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {role.niceToHave.length > 0 && (
                        <>
                          <h4 className="mt-6 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                            Useful but not required
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {role.niceToHave.map((item) => (
                              <li key={item} className="flex gap-2.5 text-[0.87rem] leading-relaxed text-ink-muted">
                                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-50/70 p-4">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                          First ninety days
                        </p>
                        <p className="mt-1.5 text-[0.86rem] leading-relaxed text-emerald-900/85">
                          {role.firstNinetyDays}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-10">
            <div className="card flex flex-wrap items-center justify-between gap-5 p-7">
              <p className="max-w-2xl text-[0.93rem] leading-relaxed text-ink-muted">
                {CAREERS.openApplicationNote}
              </p>
              <a href="#apply" className="btn-outline shrink-0">
                Open application
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hiring process */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              What to expect
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Five stages, no mystery rounds
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              You will always know which stage you are at, what it tested, and what happens next.
            </p>
          </Reveal>

          <ol className="mt-14 space-y-4">
            {hiringStages.map((item, index) => (
              <Reveal key={item.stage} delay={index * 0.05} as="li">
                <div className="card flex flex-wrap items-start gap-5 p-6 sm:gap-7 sm:p-7">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-sm font-bold text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[1.05rem] font-bold text-ink">{item.stage}</h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">{item.detail}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-[0.75rem] font-medium text-ink-muted">
                    {item.duration}
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1} className="mt-10">
            <div className="rounded-[1.6rem] border border-line bg-white p-7">
              <h3 className="text-[1.05rem] font-bold text-ink">Equal opportunity</h3>
              <p className="mt-3 max-w-3xl text-[0.9rem] leading-relaxed text-ink-muted">
                Virya Clean Tech hires on capability and evidence. We do not discriminate on
                gender, caste, religion, disability, age, sexual orientation or place of origin,
                and we do not ask about any of those in the first conversation. If you need an
                adjustment at any stage of the process, tell us and we will arrange it without
                making it a discussion.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="section scroll-mt-28">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  Apply
                </p>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  Send it to the person who will read it
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink-muted">
                  Applications land with the relevant team lead as a tracked item, not in a
                  shared inbox. You will hear back either way.
                </p>

                <ul className="mt-8 space-y-4 text-[0.9rem] text-ink-muted">
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      Prefer email?{' '}
                      <a href={CAREERS.emailHref} className="font-semibold text-emerald-700 hover:underline">
                        {CAREERS.email}
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{CAREERS.location}</span>
                  </li>
                </ul>

                <p className="mt-8 text-[0.82rem] leading-relaxed text-ink-faint">
                  Not an engineering role? We still read it.{' '}
                  <Link to="/about" className="font-semibold text-emerald-700 hover:underline">
                    Read about how we operate first
                  </Link>{' '}
                  so you know what you are applying into.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal delay={0.08}>
                <ApplicationForm presetRole={focusedRole} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Not looking for a job right now?"
        body="Most of the useful intelligence about a company comes from its clients. If you have a site with a rising bill or a fleet to electrify, that conversation is worth more to both of us than any speculative application."
        primary={{ label: 'Request a consultation', to: '/request-consultation' }}
        secondary={{ label: 'See open roles', to: '/roles' }}
      />
    </>
  );
}