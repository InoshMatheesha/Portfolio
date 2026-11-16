// clock.ts - Shows the current local time for the time zone named on the element.

export function initClock(): void {
  const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
  const timeZone = clock?.dataset.clock;
  if (!clock || !timeZone) return;

  const fallback = clock.textContent ?? '';
  let format: Intl.DateTimeFormat;
  try {
    format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone });
  } catch {
    return;
  }

  const render = (): void => {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = `${format.format(now)} (${fallback})`;
  };

  render();
  setInterval(render, 20_000);
}
