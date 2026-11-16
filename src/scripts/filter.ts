// filter.ts - Category filter for the project grid, morphed with a view transition.
import type { Env } from './main';

export function initFilter(env: Env): void {
  const grid = document.querySelector<HTMLElement>('[data-grid]');
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  if (!grid || !buttons.length) return;

  const cards = [...grid.querySelectorAll<HTMLElement>('[data-category]')];
  const canMorph = !env.reducedMotion && typeof document.startViewTransition === 'function';

  // Named cards let the browser animate each one to its new slot.
  if (canMorph) {
    for (const card of cards) card.style.viewTransitionName = card.id;
  }

  const apply = (filter: string): void => {
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    }
    for (const card of cards) {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    }
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter ?? 'all';
      if (canMorph) document.startViewTransition(() => apply(filter));
      else apply(filter);
    });
  }
}
