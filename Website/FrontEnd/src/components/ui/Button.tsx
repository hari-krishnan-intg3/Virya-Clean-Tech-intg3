import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Shows a spinner and blocks duplicate submissions. */
  loading?: boolean;
}

const SIZES: Record<Size, string> = {
  sm: 'btn-sm',
  md: '',
  lg: '',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading = false, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        variant === 'primary' ? (size === 'lg' ? 'btn-primary-lg' : 'btn-primary') : '',
        variant === 'outline' ? (size === 'lg' ? 'btn-outline-lg' : 'btn-outline') : '',
        variant === 'ghost' ? 'btn-ghost' : '',
        SIZES[size],
        loading && 'cursor-wait',
        className,
      )}
      {...rest}
    >
      {loading && (
        <svg
          className="h-4 w-4 shrink-0 animate-spin"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.25" />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
      {children}
    </button>
  );
});