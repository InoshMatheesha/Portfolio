// tilt.ts - Pointer-driven 3D tilt with a tracked highlight for cards and the portrait.
import type { Env } from './main';

export function initTilt(env: Env): void {
  if (!env.finePointer || env.reducedMotion) return;

  for (const host of document.querySelectorAll<HTMLElement>('[data-tilt]')) {
    const target = host.querySelector<HTMLElement>('[data-tilt-target]');
    if (!target) continue;
    const max = Number(host.dataset.tiltMax ?? 6);
    let frame = 0;

    host.addEventListener('pointerenter', () => {
      target.style.transitionDuration = '0.18s';
    });

    host.addEventListener('pointermove', (event) => {
      if (frame) return;
      // One style write per frame, however fast the pointer moves.
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = host.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width;
        const py = (event.clientY - box.top) / box.height;
        const rotateY = (px - 0.5) * 2 * max;
        const rotateX = (0.5 - py) * 2 * max;
        target.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        target.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        target.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      });
    });

    host.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      target.style.transitionDuration = '';
      target.style.transform = '';
    });
  }
}
