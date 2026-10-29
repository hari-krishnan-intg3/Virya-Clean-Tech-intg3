import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@/components/ui';
import { MegaMenu } from './MegaMenu';
import { NAV } from '@/app/siteConfig';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/utils';

const NAV_ORDER = ['Home', 'Offerings', 'Industries', 'Carbon Economics', 'Energy Platforms', 'Insights', 'About'];
const orderedNav = [...NAV].sort((left, right) => NAV_ORDER.indexOf(left.label) - NAV_ORDER.indexOf(right.label));

/**
 * Primary navigation.
 *
 * Desktop is a hover-revealed mega menu (see `MegaMenu`). Mobile is a full
 * sheet with collapsible groups. Both expose the same destinations so nothing
 * is desktop-only.
 */
export function NavbarContainer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const scrolled = useScrolled(24);
  const reduced = usePrefersReducedMotion();
  const location = useLocation();

  const condensed = scrolled || menuOpen || location.pathname !== '/';

  // Any navigation closes the mobile sheet.
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [location.pathname, location.search]);

  // Lock the body while the sheet is open, restoring whatever was there.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300',
          condensed
            ? 'border-b border-white/10 bg-[#07110f]/95 shadow-soft backdrop-blur-xl'
            : 'border-b border-white/10 bg-[#07110f]/45 backdrop-blur-xl',
        )}
      >
        <nav className="shell" aria-label="Primary">
          <div
            className={cn(
              'flex items-center justify-between gap-6 transition-[padding] duration-300',
              condensed ? 'py-2.5' : 'py-4',
            )}
          >
            <Link
              to="/"
              onClick={() => trackEvent('nav_click', { target: 'home' })}
              aria-label="Virya Clean Tech — home"
              className="shrink-0"
            >
              <Logo tone="light" />
            </Link>

            {/* ── Desktop ─────────────────────────────────────────── */}
            <ul className="hidden items-center gap-1 lg:flex">
              {orderedNav.map((group) => (
                <li key={group.label} className="relative">
                  {group.columns ? (
                    <MegaMenu group={group} condensed={condensed} />
                  ) : (
                    <NavLink
                      to={group.to}
                      onClick={() => trackEvent('nav_click', { target: group.to })}
                      className={({ isActive }) =>
                        cn(
                          'rounded-lg px-3 py-2 text-[0.95rem] font-semibold transition-colors duration-200',
                          condensed
                            ? isActive
                              ? 'text-emerald-700'
                              : 'text-ink hover:text-emerald-700'
                            : isActive
                              ? 'text-white'
                              : 'text-white/85 hover:text-white',
                        )
                      }
                    >
                      {group.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            {/* ── Actions ─────────────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/request-consultation"
                onClick={() => trackEvent('nav_click', { target: 'consultation' })}
                className="btn-primary hidden h-10 min-w-[12rem] justify-center px-5 text-sm leading-none shadow-soft sm:inline-flex"
              >
                Request Consultation
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen((open) => !open);
                  trackEvent('nav_click', { target: 'mobile-menu' });
                }}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className={cn(
                  'inline-grid h-10 w-10 place-items-center rounded-lg border transition-colors lg:hidden',
                  condensed
                    ? 'border-line bg-white text-ink'
                    : 'border-white/25 bg-white/10 text-white backdrop-blur',
                )}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile sheet ──────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="sheet"
              id="mobile-nav"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-[4.25rem] z-[60] max-h-[calc(100vh-5rem)] overflow-y-auto rounded-b-[1.6rem] border-b border-line bg-white shadow-lift lg:hidden"
            >
              <div className="shell flex flex-col gap-1 py-6">
                {orderedNav.map((group) => {
                  const expanded = openGroup === group.label;

                  return (
                    <div key={group.label} className="border-b border-line/70 last:border-0">
                      <div className="flex items-center">
                        <Link
                          to={group.to}
                          onClick={() => trackEvent('nav_click', { target: group.to })}
                          className="flex flex-1 items-center gap-3 py-4 text-[1.05rem] font-bold text-ink"
                        >
                          {group.label}
                        </Link>
                        {group.columns && (
                          <button
                            type="button"
                            onClick={() => setOpenGroup(expanded ? null : group.label)}
                            aria-expanded={expanded}
                            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${group.label}`}
                            className="grid h-10 w-10 place-items-center rounded-lg text-ink-muted"
                          >
                            <ChevronDown
                              className={cn('h-5 w-5 transition-transform', expanded && 'rotate-180')}
                            />
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {expanded && group.columns && (
                          <motion.div
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={reduced ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden pb-2"
                          >
                            <div className="mb-3 rounded-xl bg-mist p-4">
                              <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-emerald-700">
                                {group.context?.eyebrow ?? 'Explore'}
                              </p>
                              <p className="mt-1.5 text-sm font-semibold text-ink">
                                {group.context?.title ?? group.label}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                                {group.context?.description}
                              </p>
                            </div>
                            {group.columns.map((column) => (
                              <div key={column.heading} className="mb-3">
                                <p className="px-3 pb-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ink-faint">
                                  {column.heading}
                                </p>
                                {column.items.map((item) => (
                                  <Link
                                    key={item.to + item.label}
                                    to={item.to}
                                    onClick={() => trackEvent('nav_click', { target: item.to })}
                                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-mist"
                                  >
                                    <span className="block text-sm font-semibold text-ink">{item.label}</span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                                      {item.description}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            ))}
                            {group.feature && (
                              <Link
                                to={group.feature.to}
                                onClick={() => trackEvent('nav_click', { target: group.feature?.to ?? '' })}
                                className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-emerald-700/20 bg-emerald-50 p-4"
                              >
                                <span>
                                  <span className="block text-sm font-semibold text-ink">{group.feature.title}</span>
                                  <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                                    {group.feature.body}
                                  </span>
                                </span>
                                <span className="shrink-0 text-xs font-bold text-emerald-700">
                                  {group.feature.cta}
                                </span>
                              </Link>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    to="/request-consultation"
                    onClick={() => trackEvent('cta_click', { placement: 'mobile-nav' })}
                    className="btn-primary-lg w-full"
                  >
                    Request Consultation
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}