// buttons.ts - Pointer-tracked sheen on every button, plus a magnetic pull where asked.
import type { Env } from './main';

export function initButtons(env: Env): void {
  if (!env.finePointer || env.reducedMotion) return;

  for (const button of document.querySelectorAll<HTMLElement>('.btn')) {
    const magnetic = button.hasAttribute('data-magnet');

    button.addEventListener('pointermove', (event) => {
      const box = button.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      button.style.setProperty('--mx', `${x.toFixed(1)}px`);
      button.style.setProperty('--my', `${y.toFixed(1)}px`);
      if (!magnetic) return;
      // The button leans a fraction of the way toward the pointer.
      button.style.setProperty('--tx', `${((x - box.width / 2) * 0.16).toFixed(1)}px`);
      button.style.setProperty('--ty', `${((y - box.height / 2) * 0.22).toFixed(1)}px`);
    });

    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--tx', '0px');
      button.style.setProperty('--ty', '0px');
    });
  }
}
