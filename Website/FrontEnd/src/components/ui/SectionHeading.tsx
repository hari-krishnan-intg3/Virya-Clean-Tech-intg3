import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  /** Small uppercase label above the title, e.g. "What we do". */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Renders an animated "energy flow" rule beneath the heading. */
  decorate?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  decorate = false,
  as: Tag = 'h2',
  id,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <header className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="eyebrow">
          <span
            aria-hidden="true"
            className="inline-block h-px w-6 bg-emerald-500/60 sm:w-8"
          />
          {eyebrow}
        </p>
      )}

      <Tag
        id={id}
        className="mt-4 text-balance font-heading text-[1.75rem] font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.9rem]"
      >
        {title}
      </Tag>

      {decorate && (
        <div
          aria-hidden="true"
          className={cn('mt-6 flex items-center gap-1.5', centered && 'justify-center')}
        >
          <span className="h-1 w-10 rounded-full bg-emerald-500" />
          <span className="h-1 w-5 rounded-full bg-sky-500" />
          <span className="h-1 w-2.5 rounded-full bg-emerald-500/40" />
        </div>
      )}

      {description && (
        <p
          className={cn(
            'mt-5 text-pretty text-base leading-relaxed text-ink-muted sm:text-lg',
            centered && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}