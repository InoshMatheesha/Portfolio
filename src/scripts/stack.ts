// stack.ts - Links hero rows to stack plates and adds pointer parallax.
import type { Env } from './main';

export function initStack(env: Env): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const stack = hero?.querySelector<HTMLElement>('[data-stack]');
  if (!hero || !stack) return;

  const plates = [...stack.querySelectorAll<HTMLElement>('.plate')];
  const rows = [...hero.querySelectorAll<HTMLElement>('.row')];

  // Highlight one layer; plates above it lift away to expose it.
  const setActive = (n: number | null): void => {
    for (const plate of plates) {
      const layer = Number(plate.dataset.layer);
      plate.classList.toggle('is-active', layer === n);
      plate.classList.toggle('is-lifted', n !== null && layer > n);
    }
    for (const row of rows) {
      row.classList.toggle('is-active', Number(row.dataset.layer) === n);
    }
  };

  for (const el of [...plates, ...rows]) {
    const n = Number(el.dataset.layer);
    el.addEventListener('pointerenter', () => setActive(n));
    el.addEventListener('pointerleave', () => setActive(null));
    el.addEventListener('focus', () => setActive(n));
    el.addEventListener('blur', () => setActive(null));
  }

  // Pause idle animation once the hero has scrolled away.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      hero.classList.toggle('is-away', !entry?.isIntersecting);
    }).observe(hero);
  }

  if (!env.finePointer || env.reducedMotion) return;

  // Ease the stack toward the pointer instead of snapping to it.
  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let frame = 0;

  const tick = (): void => {
    x += (targetX - x) * 0.07;
    y += (targetY - y) * 0.07;
    stack.style.setProperty('--rz', `${(x * 12).toFixed(3)}deg`);
    stack.style.setProperty('--rx', `${(-y * 7).toFixed(3)}deg`);
    const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.0008;
    frame = settled ? 0 : requestAnimationFrame(tick);
  };

  const aim = (nextX: number, nextY: number): void => {
    targetX = nextX;
    targetY = nextY;
    if (!frame) frame = requestAnimationFrame(tick);
  };

  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    aim((event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5);
  });
  hero.addEventListener('pointerleave', () => aim(0, 0));
}
