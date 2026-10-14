import { ArrowUp, Mail, MapPin } from 'lucide-react';
import {
  ADDRESS_LINES,
  CONTACT,
  MAP_LINK,
  SOCIAL_LINKS,
} from '@/app/siteConfig';
import { scrollToSection, trackEvent } from '@/lib/utils';
import { Logo } from '@/components/ui';

const QUICK_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

const SERVICE_LINKS = [
  { id: 'service-solar', label: 'Solar Power' },
  { id: 'service-ev-charging', label: 'EV Charging' },
  { id: 'service-software-iot', label: 'IoT Integration' },
  { id: 'service-consulting', label: 'Energy Audits' },
];

export function FooterContainer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    trackEvent('back_to_top');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-mist">
      {/* Decorative energy motif */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute -right-24 -top-24 h-80 w-80 text-emerald-500/10"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        >
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="46" />
          <circle cx="100" cy="100" r="22" />
          <path d="M0 100h200M100 0v200" />
          <path d="M30 30l140 140M170 30L30 170" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/70 to-transparent" />
      </div>

      <div className="shell relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-ink-muted">
              Pioneers innovative, sustainable energy solutions for a cleaner tomorrow.
            </p>

            {SOCIAL_LINKS.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink-muted transition-colors hover:border-emerald-500/40 hover:text-emerald-600"
                    >
                      <span className="sr-only">{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-6 text-xs text-ink-faint">
              Solar &amp; Renewable Energy powered by Algobiz Innovations LLP
            </p>
          </div>

          {/* Links */}
          <nav className="lg:col-span-2" aria-label="Quick links">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-ink">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id);
                    }}
                    className="text-[0.94rem] text-ink-muted transition-colors hover:text-emerald-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label="Services">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-ink">
              Services
            </h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.id, 96);
                    }}
                    className="text-[0.94rem] text-ink-muted transition-colors hover:text-emerald-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-ink">
              Get in touch
            </h2>

            <address className="mt-4 space-y-3.5 not-italic text-[0.94rem] text-ink-muted">
              <a
                href={CONTACT.emailHref}
                onClick={() => trackEvent('contact_click', { method: 'email' })}
                className="flex items-start gap-3 break-all transition-colors hover:text-emerald-600"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                {CONTACT.email}
              </a>

              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('contact_click', { method: 'map' })}
                className="flex items-start gap-3 transition-colors hover:text-emerald-600"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>
                  {ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </a>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-ink-muted">
            &copy; {year} VIRYA CLEANTECH. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/*
              Privacy / Terms links are intentionally omitted: no public URLs are
              published on the official website yet. Add them here once available.
            */}
            <button
              type="button"
              onClick={backToTop}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 font-heading text-sm font-semibold text-ink transition-colors hover:border-emerald-500/40 hover:text-emerald-600"
            >
              Back to top
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}