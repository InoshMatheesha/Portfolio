// copy.ts - Copies a value to the clipboard and confirms it on the button.

export function initCopy(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    const value = button.dataset.copy;
    if (!label || !value) continue;

    const idle = label.textContent ?? '';
    let timer = 0;

    const show = (text: string, copied: boolean): void => {
      label.textContent = text;
      button.classList.toggle('is-copied', copied);
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        label.textContent = idle;
        button.classList.remove('is-copied');
      }, 2200);
    };

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
        show('Copied', true);
      } catch {
        // Clipboard access was refused, so point at the selectable address instead.
        show('Select the address below', false);
      }
    });
  }
}
