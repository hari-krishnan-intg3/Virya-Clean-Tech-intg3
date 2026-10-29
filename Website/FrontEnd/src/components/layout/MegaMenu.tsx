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
 * Compact, zero-scroll mega navigation panel.
 *
 * Information-dense layout engineered to fit within standard desktop
 * viewports without any vertical scrolling. Features reduced font scale,
 * tight spacing, and crisp CleanTech application hierarchies.
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
            'group inline-flex items-center rounded-lg px-2.5 py-1.5 text-[0.92rem] font-semibold transition-colors duration-200',
            open || focusWithin
              ? 'text-emerald-400'
              : condensed
                ? 'text-white/90 hover:text-emerald-400'
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
            'grid h-8 w-7 place-items-center rounded-md transition-colors hover:bg-white/10',
            condensed ? 'text-white/60' : 'text-white/60',
          )}
        >
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
        </button>
      </div>

      {/* Full-width panel, non-scrolling desktop container */}
      <div
        id={panelId}
        role="region"
        aria-label={group.label}
        hidden={!open}
        className="fixed left-1/2 top-[4.15rem] z-50 w-[min(94rem,calc(100vw-1.5rem))] -translate-x-1/2 pt-1"
      >
        <div
          className={cn(
            'panel overflow-hidden border border-white/10 bg-[#07130f]/95 shadow-2xl backdrop-blur-2xl transition-[opacity,transform] duration-200 rounded-xl',
            open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0',
          )}
        >
          <div className="grid max-h-[calc(100vh-5rem)] overflow-y-auto lg:max-h-none lg:overflow-visible lg:grid-cols-[13rem_minmax(0,1fr)]">
            <aside className="flex flex-col justify-between border-b border-white/10 bg-[#091a14] p-3.5 sm:p-4 lg:border-b-0 lg:border-r">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-emerald-400">
                  <Compass className="h-3 w-3" aria-hidden="true" />
                  {group.context?.eyebrow ?? 'Architecture'}
                </span>
                <h2 className="mt-1.5 text-base font-bold leading-snug text-white">
                  {group.context?.title ?? group.label}
                </h2>
                <p className="mt-1 text-[0.76rem] leading-snug text-ink-muted">
                  {group.context?.description ?? 'Explore CleanTech architectures and engineering capabilities from Virya.'}
                </p>
              </div>
              <Link
                to={group.to}
                onClick={hideNow}
                className="mt-3 inline-flex w-fit items-center gap-1.5 text-[0.8rem] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Explore {group.label}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </aside>

            <div
              className={cn(
                'grid gap-2 p-2.5',
                group.columns.length >= 6
                  ? 'sm:grid-cols-2 lg:grid-cols-4'
                  : group.columns.length >= 3
                    ? 'sm:grid-cols-2 lg:grid-cols-4'
                    : 'sm:grid-cols-2',
              )}
            >
              {group.columns.map((column) => (
                <div
                  key={column.heading}
                  className="rounded-lg bg-white/[0.025] p-2 border border-white/5 hover:border-emerald-500/25 hover:bg-white/[0.04] transition-colors"
                >
                  <p className="mb-1 border-b border-white/10 pb-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-emerald-400">
                    {column.heading}
                  </p>
                  <ul className="space-y-0.5">
                    {column.items.map((item) => (
                      <li key={item.to + item.label}>
                        <Link
                          to={item.to}
                          onClick={hideNow}
                          className="group/item block rounded px-1.5 py-0.5 transition-colors duration-150 hover:bg-white/5"
                        >
                          <span className="flex items-center justify-between text-[0.8rem] font-semibold text-white group-hover/item:text-emerald-300 transition-colors leading-tight">
                            <span>{item.label}</span>
                            <ArrowRight
                              className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-150 group-hover/item:translate-x-0 group-hover/item:opacity-100 text-emerald-400"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="mt-0.5 line-clamp-1 block text-[0.7rem] leading-tight text-ink-muted group-hover/item:text-ink-faint">
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
            <div className="border-t border-white/10 bg-[#06120e] px-4 py-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="max-w-2xl flex items-center gap-2">
                  <span className="font-semibold text-white text-[0.78rem] shrink-0">{group.feature.title}</span>
                  <span className="text-white/30 hidden sm:inline">•</span>
                  <span className="text-[0.72rem] text-ink-muted line-clamp-1">{group.feature.body}</span>
                </div>
                <Link
                  to={group.feature.to}
                  onClick={hideNow}
                  className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 px-2.5 py-0.5 text-[0.74rem] font-semibold text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-400/10 transition-colors shrink-0"
                >
                  {group.feature.cta}
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
