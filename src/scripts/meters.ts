// meters.ts - Lights the proficiency bar graphs in sequence when they scroll into view.
import type { Env } from './main';

export function initMeters(env: Env): void {
  const list = document.querySelector<HTMLElement>('[data-meters]');
  if (!list || env.reducedMotion || !('IntersectionObserver' in window)) return;

  list.classList.add('is-armed');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      list.classList.add('is-lit');
      observer.disconnect();
    },
    { threshold: 0.35 },
  );
  observer.observe(list);
}
