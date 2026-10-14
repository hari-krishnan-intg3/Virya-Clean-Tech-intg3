import { useScroll, useSpring } from 'framer-motion';

/**
 * Page scroll progress (0 → 1), spring-smoothed.
 * Driven by Framer Motion's scroll listener so it never triggers a React
 * re-render on scroll.
 */
export function useScrollProgress(): ReturnType<typeof useSpring> {
  const { scrollYProgress } = useScroll();

  return useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
}