import { cn } from '@/lib/utils';
import { BUSINESS } from '@/app/siteConfig';

/**
 * Energy-inspired mark used alongside the wordmark.
 * The official logo lives in the CMS and is not loaded here to avoid any
 * unintended brand conflict — this symbol is a neutral, technical stand-in.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
        'bg-gradient-to-br from-emerald-500 to-sky-500 shadow-soft',
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className="h-6 w-6" focusable="false">
        <path d="M35 10 18 35h11l-3 19 17-25H32l3-19Z" fill="#fff" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
    </span>
  );
}

export function Logo({
  className,
  tone = 'dark',
}: {
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-base font-extrabold tracking-[0.16em] sm:text-lg',
            tone === 'dark' ? 'text-ink' : 'text-white',
          )}
        >
          {BUSINESS.name}
        </span>
        <span
          className={cn(
            'mt-1 text-[0.55rem] font-medium uppercase tracking-[0.34em]',
            tone === 'dark' ? 'text-ink-faint' : 'text-white/60',
          )}
        >
          Clean Technology
        </span>
      </span>
    </span>
  );
}