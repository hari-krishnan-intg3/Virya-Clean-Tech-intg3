import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from '@/components/ui';
import { MegaMenu } from './MegaMenu';
import { CONTACT, NAV } from '@/app/siteConfig';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/utils';

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

  const condensed = scrolled || menuOpen;

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
            ? 'border-b border-line/80 bg-white/85 shadow-soft backdrop-blur-xl'
            : 'border-b border-white/10 bg-white/5 backdrop-blur-md',
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
              <Logo tone={condensed ? 'dark' : 'light'} />
            </Link>

            {/* ── Desktop ─────────────────────────────────────────── */}
            <ul className="hidden items-center gap-1 lg:flex">
              {NAV.map((group) => (
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
              <a
                href={CONTACT.phoneHref}
                onClick={() => trackEvent('nav_click', { target: 'phone' })}
                className={cn(
                  'hidden items-center gap-2 rounded-lg px-2.5 py-2 text-[0.9rem] font-semibold transition-colors xl:inline-flex',
                  condensed ? 'text-ink-muted hover:text-emerald-700' : 'text-white/80 hover:text-white',
                )}
              >
                <Phone className="h-4 w-4" />
                {CONTACT.phoneDisplay}
              </a>

              <Link
                to="/request-consultation"
                onClick={() => trackEvent('nav_click', { target: 'consultation' })}
                className="btn-primary btn-sm hidden shadow-soft sm:inline-flex"
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
              className="fixed inset-x-0 top-[4.25rem] z-40 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-b-[1.6rem] border-b border-line bg-white shadow-lift lg:hidden"
            >
              <div className="shell flex flex-col gap-1 py-6">
                {NAV.map((group, index) => {
                  const expanded = openGroup === group.label;

                  return (
                    <div key={group.label} className="border-b border-line/70 last:border-0">
                      <div className="flex items-center">
                        <Link
                          to={group.to}
                          onClick={() => trackEvent('nav_click', { target: group.to })}
                          className="flex flex-1 items-center gap-3 py-4 text-[1.05rem] font-bold text-ink"
                        >
                          <span className="font-mono text-[0.7rem] text-ink-faint">
                            0{index + 1}
                          </span>
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
                          <motion.ul
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={reduced ? undefined : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            {group.columns.flatMap((column) => column.items).map((item) => (
                              <li key={item.to + item.label}>
                                <Link
                                  to={item.to}
                                  onClick={() => trackEvent('nav_click', { target: item.to })}
                                  className="block py-2.5 pl-9 pr-2 text-[0.92rem] text-ink-muted"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
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
                  <a
                    href={CONTACT.phoneHref}
                    className="btn-outline w-full"
                    onClick={() => trackEvent('nav_click', { target: 'phone' })}
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT.phoneDisplay}
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}