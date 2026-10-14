import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view for navbar highlighting.
 * Uses IntersectionObserver so it never blocks scrolling.
 */
export function useActiveSection(ids: string[], rootMarginTop = 96): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = '';
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId) setActive(bestId);
      },
      {
        rootMargin: `-${rootMarginTop}px 0px -45% 0px`,
        threshold: [0, 0.15, 0.3, 0.6, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join('|'), rootMarginTop]);

  return active;
}