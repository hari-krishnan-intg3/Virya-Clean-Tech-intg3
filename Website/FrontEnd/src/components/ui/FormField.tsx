import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FieldShellProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Label + control + hint/error wrapper.
 * The label is always visible (never floating-only) so it stays readable for
 * screen readers, in forced-colours mode and on touch devices.
 */
export const FieldShell = forwardRef<HTMLDivElement, FieldShellProps>(function FieldShell(
  { label, htmlFor, required, hint, error, children, className },
  ref,
) {
  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-0.5 text-emerald-500">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="ml-1.5 font-normal text-ink-faint">(optional)</span>
        )}
      </label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

/** Shared aria wiring so every control announces its error/hint correctly. */
export function fieldA11y(id: string, error?: string, hint?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}