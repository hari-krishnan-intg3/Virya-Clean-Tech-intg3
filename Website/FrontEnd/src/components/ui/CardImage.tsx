import { SmartImage } from './Image';
import type { VisualAsset } from '@/data/visuals';
import { cn } from '@/lib/utils';

export function CardImage({
  image,
  className = 'aspect-[16/8]',
}: {
  image: VisualAsset;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <SmartImage
        src={image.src}
        alt={image.alt}
        width={1200}
        height={600}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#07110f]/55 to-transparent"
      />
    </div>
  );
}
