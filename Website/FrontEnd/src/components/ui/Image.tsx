import { cn } from '@/lib/utils';

interface SmartImageProps {
  src: string;
  alt: string;
  /** Intrinsic width — required so the browser can reserve space (no CLS). */
  width: number;
  height: number;
  /** Fill the positioned parent instead of using intrinsic dimensions. */
  fill?: boolean;
  /** object-position value, e.g. "center 40%". */
  focal?: string;
  className?: string;
  /** Only the hero slide should set this; everything else lazy-loads. */
  priority?: boolean;
  sizes?: string;
}

/**
 * Lightweight <img> wrapper that always declares an aspect ratio up-front,
 * preventing layout shift while remote assets load.
 */
export function SmartImage({
  src,
  alt,
  width,
  height,
  fill = false,
  focal,
  className,
  priority = false,
  sizes,
}: SmartImageProps) {
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        className={cn('absolute inset-0 h-full w-full object-cover', className)}
        style={{ objectPosition: focal ?? 'center' }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
      className={cn('h-auto w-full', className)}
      style={{ objectPosition: focal ?? 'center' }}
    />
  );
}