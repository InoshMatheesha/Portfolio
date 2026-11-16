// belt.ts - The project chain: endless right-to-left travel, filters, drag and controls.
import type { Env } from './main';

const SPEED = 42; // px per second
const HOLD = 5000; // ms the chain waits after someone moves it

export function initBelt(env: Env): void {
  const root = document.querySelector<HTMLElement>('[data-belt]');
  const view = root?.querySelector<HTMLElement>('[data-belt-view]');
  const track = root?.querySelector<HTMLElement>('[data-belt-track]');
  if (!root || !view || !track) return;

  const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const toggle = document.querySelector<HTMLButtonElement>('[data-belt-toggle]');
  const meter = document.querySelector<HTMLElement>('[data-belt-meter]');
  const originals = [...track.children] as HTMLElement[];

  // A second copy of every card lets the chain wrap without a seam.
  const clones = originals.map((card) => {
    const clone = card.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    for (const link of clone.querySelectorAll('a')) link.tabIndex = -1;
    track.append(clone);
    return clone;
  });

  let filter = 'all';
  let looping = false;
  let loopWidth = 0;
  let position = 0;
  let lastSeen = 0;
  let holdUntil = 0;
  let paused = env.reducedMotion;
  let onScreen = false;
  let hovering = false;
  let dragging = false;
  let running = false;
  let lastTime = 0;

  const matches = (card: HTMLElement): boolean => filter === 'all' || card.dataset.category === filter;
  const hold = (): void => void (holdUntil = performance.now() + HOLD);

  // Work out whether the visible cards are wide enough to loop.
  const measure = (): void => {
    for (const card of [...originals, ...clones]) card.hidden = !matches(card);
    const first = originals.find(matches);
    const firstClone = clones.find(matches);
    loopWidth = first && firstClone ? firstClone.offsetLeft - first.offsetLeft : 0;
    looping = loopWidth > view.clientWidth;
    if (!looping) for (const clone of clones) clone.hidden = true;
    root.classList.toggle('is-looping', looping);
  };

  const showProgress = (): void => {
    if (!meter) return;
    const ratio = looping ? (view.scrollLeft % loopWidth) / loopWidth : 0;
    meter.style.setProperty('--p', ratio.toFixed(4));
  };

  const tick = (time: number): void => {
    requestAnimationFrame(tick);
    const delta = Math.min(time - lastTime, 60);
    lastTime = time;

    // Any scroll the chain did not make itself is the visitor browsing.
    if (running && Math.abs(view.scrollLeft - lastSeen) > 2) hold();

    const shouldRun =
      looping && onScreen && !paused && !hovering && !dragging && time > holdUntil && !view.matches(':focus-within');
    if (shouldRun && !running) position = view.scrollLeft;
    running = shouldRun;
    if (!running) return;

    position += (SPEED * delta) / 1000;
    if (position >= loopWidth) position -= loopWidth;
    view.scrollLeft = position;
    lastSeen = view.scrollLeft;
    showProgress();
  };

  // Manual scrolling wraps too, so the chain never runs out either way.
  view.addEventListener('scroll', () => {
    if (running || !looping) return;
    if (view.scrollLeft >= loopWidth + 4) view.scrollLeft -= loopWidth;
    else if (view.scrollLeft <= 0) view.scrollLeft += loopWidth;
    showProgress();
  });

  for (const button of filters) {
    button.addEventListener('click', () => {
      filter = button.dataset.filter ?? 'all';
      for (const other of filters) other.setAttribute('aria-pressed', String(other === button));
      measure();
      view.scrollLeft = 0;
      running = false;
      showProgress();
    });
  }

  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-belt-step]')) {
    button.addEventListener('click', () => {
      const card = originals.find(matches);
      const step = (card?.offsetWidth ?? 320) + parseFloat(getComputedStyle(track).columnGap || '0');
      hold();
      running = false;
      view.scrollBy({ left: step * Number(button.dataset.beltStep), behavior: env.reducedMotion ? 'auto' : 'smooth' });
    });
  }

  if (toggle) {
    const render = (): void => {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Start the chain moving' : 'Pause the chain');
    };
    toggle.addEventListener('click', () => {
      paused = !paused;
      holdUntil = 0;
      render();
    });
    render();
  }

  view.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') hovering = true;
  });
  view.addEventListener('pointerleave', () => (hovering = false));
  view.addEventListener('touchstart', hold, { passive: true });
  view.addEventListener('wheel', hold, { passive: true });

  // Mouse drag scrolls the chain; a real drag swallows the click that ends it.
  let startX = 0;
  let startScroll = 0;
  let pressed = false;
  view.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    pressed = true;
    startX = event.clientX;
    startScroll = view.scrollLeft;
  });
  view.addEventListener('pointermove', (event) => {
    if (!pressed) return;
    const moved = event.clientX - startX;
    if (!dragging && Math.abs(moved) > 5) {
      dragging = true;
      view.setPointerCapture(event.pointerId);
      root.classList.add('is-dragging');
    }
    if (dragging) view.scrollLeft = startScroll - moved;
  });
  const release = (): void => {
    pressed = false;
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    hold();
    const swallow = (event: Event): void => {
      event.preventDefault();
      event.stopPropagation();
    };
    view.addEventListener('click', swallow, { capture: true, once: true });
    setTimeout(() => view.removeEventListener('click', swallow, true), 80);
  };
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', release);

  // Jumping to a project by link parks the chain on that card for a while.
  const onHash = (): void => {
    if (location.hash.startsWith('#project-')) holdUntil = performance.now() + HOLD * 2;
  };
  window.addEventListener('hashchange', onHash);
  onHash();

  new ResizeObserver(measure).observe(view);
  new IntersectionObserver(([entry]) => (onScreen = entry?.isIntersecting ?? false)).observe(view);

  measure();
  requestAnimationFrame(tick);
}
