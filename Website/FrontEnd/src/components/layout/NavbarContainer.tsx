import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn, scrollToSection, trackEvent } from '@/lib/utils';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrolled } from '@/hooks/useScrolled';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Button, Logo } from '@/components/ui';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const;

const SECTION_IDS = LINKS.map((l) => l.id);

export function NavbarContainer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(24);
  const scrollProgress = useScrollProgress();
  const active = useActiveSection(SECTION_IDS);
  const reduced = usePrefersReducedMotion();

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Close the sheet on Escape and return focus to the trigger.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    trackEvent('nav_click', { target: id });
    // Wait a frame so the mobile sheet unmounts before scrolling.
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <>
      <a
        href="#about"
        className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-lg bg-emerald-500 px-4 py-2 font-heading text-sm font-semibold text-white"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out',
          scrolled ? 'py-2.5' : 'py-3 sm:py-5',
        )}
      >
        {/* Scroll progress rail */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500"
          style={{ scaleX: scrollProgress }}
        />

        <nav className="shell" aria-label="Primary">
          <div
            className={cn(
              'flex items-center justify-between gap-4 rounded-2xl px-3 transition-all duration-500 ease-out sm:px-4',
              scrolled
                ? 'h-14 border border-line/80 bg-white/80 shadow-lift backdrop-blur-xl backdrop-saturate-150 sm:h-16'
                : 'h-14 border border-white/15 bg-white/10 shadow-soft backdrop-blur-md backdrop-saturate-150 sm:h-16',
            )}
          >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go('home');
            }}
            className="rounded-xl"
            aria-label={`${'VIRYA CLEANTECH'} — home`}
          >
            <Logo tone={scrolled ? 'dark' : 'light'} />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.id);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative block rounded-full px-4 py-2 font-heading text-[0.9rem] font-semibold transition-colors duration-300',
                      scrolled
                        ? isActive
                          ? 'text-ink'
                          : 'text-ink-muted hover:text-ink'
                        : isActive
                          ? 'text-white'
                          : 'text-white/70 hover:text-white',
                    )}
                  >
                    {/* Pill highlight sits behind the label */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-0 -z-10 rounded-full',
                          scrolled
                            ? 'bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20'
                            : 'bg-white/15 ring-1 ring-inset ring-white/20',
                        )}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 380, damping: 32 }
                        }
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => {
                trackEvent('cta_click', { placement: 'navbar', target: 'booking' });
                go('booking');
              }}
            >
              Book Consultation
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors lg:hidden',
                scrolled
                  ? 'border-line bg-white text-ink'
                  : 'border-white/25 bg-white/10 text-white backdrop-blur-sm',
              )}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              key="sheet"
              id="mobile-nav"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-3 top-[4.75rem] z-40 origin-top overflow-hidden rounded-2xl border border-line bg-white/95 p-2 shadow-lift backdrop-blur-xl lg:hidden"
            >
              <ul className="shell flex flex-col gap-1 py-5">
                {LINKS.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={reduced ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduced ? 0 : 0.05 * index + 0.05 }}
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(link.id);
                      }}
                      aria-current={active === link.id ? 'page' : undefined}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-4 py-3 font-heading text-base font-semibold transition-colors',
                        active === link.id
                          ? 'bg-emerald-500/10 text-emerald-700'
                          : 'text-ink hover:bg-mist',
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs text-ink-faint"
                      >
                        0{index + 1}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="shell pb-6">
                <Button
                  className="w-full"
                  onClick={() => {
                    trackEvent('cta_click', { placement: 'mobile-nav', target: 'booking' });
                    go('booking');
                  }}
                >
                  Book Consultation
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}