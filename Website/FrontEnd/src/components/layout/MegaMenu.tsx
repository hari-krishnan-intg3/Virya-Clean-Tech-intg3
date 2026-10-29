import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavGroup } from '@/app/siteConfig';

interface MegaMenuProps {
  group: NavGroup;
  /** Whether the header is currently in its condensed, scrolled state. */
  condensed: boolean;
}

/**
 * Hover-revealed navigation panel.
 *
 * Opens on pointer entry, closes on pointer exit with a short grace delay so
 * a visitor crossing the gap between the trigger and the panel does not lose
 * it. Fully operable by keyboard: the trigger is a real link, Tab moves into
 * the panel, and Escape returns focus to the trigger.
 */
export function MegaMenu({ group, condensed }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const closeTimer = useRef<number>();
  const pinnedOpen = useRef(false);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const hide = () => {
    if (pinnedOpen.current) return;
    // Grace period so the pointer can travel diagonally into the panel.
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  const hideNow = () => {
    window.clearTimeout(closeTimer.current);
    pinnedOpen.current = false;
    setOpen(false);
  };

  const togglePinned = () => {
    if (pinnedOpen.current) {
      hideNow();
      return;
    }
    pinnedOpen.current = true;
    show();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      hideNow();
      const trigger = document.querySelector<HTMLAnchorElement>(`[data-menu-trigger="${group.label}"]`);
      trigger?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, group.label]);

  if (!group.columns?.length) return null;

  const panelId = `megamenu-${group.label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={() => {
        setFocusWithin(true);
        show();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setFocusWithin(false);
          hide();
        }
      }}
    >
      <div className="flex items-center">
        <Link
          to={group.to}
          data-menu-trigger={group.label}
          className={cn(
            'group inline-flex items-center rounded-lg px-3 py-2 text-[0.95rem] font-semibold transition-colors duration-200',
            open || focusWithin
              ? 'text-emerald-700'
              : condensed
                ? 'text-ink hover:text-emerald-700'
                : 'text-white/85 hover:text-white',
          )}
        >
          {group.label}
        </Link>
        <button
          type="button"
          onClick={togglePinned}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? 'Close' : 'Open'} ${group.label} menu`}
          className={cn(
            'grid h-9 w-8 place-items-center rounded-lg transition-colors hover:bg-white/10',
            condensed ? 'text-ink-faint' : 'text-white/60',
          )}
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} />
        </button>
      </div>

      {/* Full-width panel, positioned against the viewport rather than the trigger. */}
      <div
        id={panelId}
        role="region"
        aria-label={group.label}
        hidden={!open}
        className="fixed left-1/2 top-[4.5rem] z-50 w-[min(84rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"
      >
        <div
          className={cn(
            'panel overflow-hidden transition-[opacity,transform] duration-200',
            open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0',
          )}
        >
          <div className="grid max-h-[min(78vh,46rem)] overflow-y-auto lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="flex flex-col justify-between border-b border-white/10 bg-[#0d2019] p-6 sm:p-7 lg:border-b-0 lg:border-r">
              <div>
                <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-emerald-300">
                  <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                  {group.context?.eyebrow ?? 'Explore'}
                </span>
                <h2 className="mt-4 text-xl font-bold leading-snug text-white">
                  {group.context?.title ?? group.label}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {group.context?.description ?? 'Explore information and resources from Virya Clean Tech.'}
                </p>
              </div>
              <Link
                to={group.to}
                onClick={hideNow}
                className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Explore {group.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>

            <div
              className={cn(
                'grid gap-x-6 gap-y-6 p-5 sm:p-7',
                group.columns.length >= 6
                  ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'sm:grid-cols-2',
              )}
            >
              {group.columns.map((column) => (
                <div key={column.heading} className="rounded-lg bg-white/[0.02] p-3 border border-white/5">
                  <p className="mb-2.5 border-b border-white/10 pb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-emerald-400">
                    {column.heading}
                  </p>
                  <ul className="space-y-1">
                    {column.items.map((item) => (
                      <li key={item.to + item.label}>
                        <Link
                          to={item.to}
                          onClick={hideNow}
                          className="group/item block rounded-lg p-2 transition-colors duration-200 hover:bg-white/5"
                        >
                          <span className="flex items-center justify-between text-[0.88rem] font-semibold text-ink transition-colors group-hover/item:text-emerald-300">
                            <span>{item.label}</span>
                            <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" aria-hidden="true" />
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[0.74rem] leading-relaxed text-ink-muted">
                            {item.description}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {group.feature && (
            <div className="border-t border-white/10 bg-[#091510] px-6 py-4 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="max-w-lg">
                  <p className="text-sm font-bold text-ink">{group.feature.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                    {group.feature.body}
                  </p>
                </div>
                <Link
                  to={group.feature.to}
                  onClick={hideNow}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/25 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:border-emerald-300/50 hover:bg-emerald-300/10"
                >
                  {group.feature.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}