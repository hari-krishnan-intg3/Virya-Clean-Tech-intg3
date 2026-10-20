import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getService } from '@/data/services';
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

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const hide = () => {
    // Grace period so the pointer can travel diagonally into the panel.
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  const hideNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
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
      <Link
        to={group.to}
        data-menu-trigger={group.label}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'group inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[0.95rem] font-semibold transition-colors duration-200',
          open || focusWithin
            ? 'text-emerald-700'
            : condensed
              ? 'text-ink hover:text-emerald-700'
              : 'text-white/85 hover:text-white',
        )}
      >
        {group.label}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            open && 'rotate-180',
            condensed ? 'text-ink-faint' : 'text-white/60',
          )}
        />
      </Link>

      {/* Full-width panel, positioned against the viewport rather than the trigger. */}
      <div
        id={panelId}
        role="region"
        aria-label={group.label}
        hidden={!open}
        className="fixed left-1/2 top-[4.5rem] z-50 w-[min(56rem,90vw)] -translate-x-1/2 pt-3"
      >
        <div
          className={cn(
            'panel overflow-hidden transition-[opacity,transform] duration-200',
            open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0',
          )}
        >
          <div className="grid gap-x-8 gap-y-6 p-7 sm:grid-cols-2">
            {group.columns.map((column) => (
              <div key={column.heading}>
                <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                  {column.heading}
                </p>
                <ul className="space-y-1">
                  {column.items.map((item) => {
                    const service = item.accent ? getService(item.accent) : undefined;

                    return (
                      <li key={item.to + item.label}>
                        <Link
                          to={item.to}
                          onClick={hideNow}
                          className="group/item flex gap-3 rounded-xl p-2.5 transition-colors duration-200 hover:bg-mist"
                        >
                          {service && (
                            <span
                              className={cn(
                                'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white',
                                service.gradient,
                              )}
                            >
                              <service.icon className="h-4 w-4" strokeWidth={2} />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="flex items-center gap-1 text-[0.95rem] font-semibold text-ink transition-colors group-hover/item:text-emerald-700">
                              {item.label}
                              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                            </span>
                            <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-ink-muted">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {group.feature && (
            <div className="border-t border-white/10 bg-[#0c1a16] px-7 py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="max-w-md">
                  <p className="text-[0.95rem] font-bold text-ink">{group.feature.title}</p>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-muted">
                    {group.feature.body}
                  </p>
                </div>
                <Link to={group.feature.to} onClick={hideNow} className="btn-outline btn-sm">
                  {group.feature.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}