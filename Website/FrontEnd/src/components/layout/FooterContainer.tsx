import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { LogoMark } from '@/components/ui';
import { ADDRESS_LINES, BUSINESS, CONTACT, FOOTER_LINKS, SOCIAL_LINKS } from '@/app/siteConfig';
import { insights } from '@/data/insights';
import { trackEvent } from '@/lib/utils';

export function FooterContainer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-white">
      {/* Reference-style primary grid motif, faded out at the top. */}
      <div
        className="grid-lines mask-fade-b pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60"
        aria-hidden="true"
      />

      <div className="shell relative pb-10 pt-16 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p className="font-heading text-lg font-extrabold tracking-[0.1em] text-ink">
                  {BUSINESS.name}
                </p>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-ink-faint">
                  {BUSINESS.subLabel}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-[0.92rem] leading-relaxed text-ink-muted">
              Explore solar, EV charging, storage, connected-energy technology
              and assessment services for business and facility requirements.
            </p>

            {SOCIAL_LINKS.length > 0 && (
              <ul className="mt-5 flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:border-emerald-500/40 hover:text-emerald-700"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Company */}
          <nav className="lg:col-span-2" aria-label="Company">
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
              Company
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.92rem] text-ink-muted transition-colors hover:text-emerald-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="lg:col-span-2" aria-label="Services">
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
              Services
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.92rem] text-ink-muted transition-colors hover:text-emerald-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
              Get in touch
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  onClick={() => trackEvent('nav_click', { target: 'phone' })}
                  className="group flex gap-3 text-[0.92rem] text-ink-muted transition-colors hover:text-emerald-700"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="group-hover:underline">{CONTACT.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.emailHref}
                  onClick={() => trackEvent('nav_click', { target: 'email' })}
                  className="group flex gap-3 text-[0.92rem] text-ink-muted transition-colors hover:text-emerald-700"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="group-hover:underline">{CONTACT.email}</span>
                </a>
              </li>
              <li className="flex gap-3 text-[0.92rem] leading-relaxed text-ink-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <address className="not-italic">
                  {ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>

            <Link
              to="/request-consultation"
              onClick={() => trackEvent('cta_click', { placement: 'footer' })}
              className="mt-5 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-emerald-700 hover:underline"
            >
              Request a consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Sourced market figures, with attribution. */}
        <div className="mt-14 rounded-[1.6rem] border border-line bg-mist p-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
            India energy context — latest published
          </p>
          <dl className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {insights.slice(0, 4).map((insight) => (
              <div key={insight.id}>
                <dt className="text-2xl font-extrabold leading-none text-ink">
                  {insight.value}
                  <span className="ml-1 text-sm font-semibold text-emerald-600">
                    {insight.unit}
                  </span>
                </dt>
                <dd className="mt-2 text-[0.8rem] leading-relaxed text-ink-muted">
                  {insight.label}
                  <span className="mt-1 block text-[0.7rem] text-ink-faint">
                    {insight.source} · {insight.asOf}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-center text-[0.8rem] text-ink-faint sm:text-left">
            © {year} {BUSINESS.name}. {BUSINESS.partnerNote}.
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('virya:privacy-settings'))}
              className="text-[0.8rem] font-semibold text-ink-muted transition-colors hover:text-emerald-700"
            >
              Privacy settings
            </button>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                trackEvent('back_to_top');
              }}
              className="text-[0.8rem] font-semibold text-ink-muted transition-colors hover:text-emerald-700"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}