// palette.ts - Command palette: open, filter, arrow-key selection and activation.

export function initPalette(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-palette]');
  const input = dialog?.querySelector<HTMLInputElement>('[data-palette-input]');
  const empty = dialog?.querySelector<HTMLElement>('[data-palette-empty]');
  if (!dialog || !input || !empty) return;

  const items = [...dialog.querySelectorAll<HTMLAnchorElement>('[data-palette-item]')];
  const groups = [...dialog.querySelectorAll<HTMLElement>('[data-palette-group]')];
  items.forEach((item, index) => (item.id = `palette-item-${index}`));

  let selected: HTMLAnchorElement | null = null;
  const visible = (): HTMLAnchorElement[] => items.filter((item) => !item.hidden);

  const select = (item: HTMLAnchorElement | null, scroll = true): void => {
    selected?.setAttribute('aria-selected', 'false');
    selected = item;
    if (!item) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    item.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', item.id);
    if (scroll) item.scrollIntoView({ block: 'nearest' });
  };

  // Every word typed must appear somewhere in the item text.
  const filter = (): void => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    for (const item of items) {
      const text = (item.textContent ?? '').toLowerCase();
      item.hidden = !words.every((word) => text.includes(word));
    }
    for (const group of groups) {
      group.hidden = !group.querySelector('[data-palette-item]:not([hidden])');
    }
    const first = visible()[0] ?? null;
    empty.hidden = first !== null;
    select(first);
  };

  const open = (): void => {
    if (dialog.open) return;
    input.value = '';
    dialog.showModal();
    filter();
    input.focus();
  };

  const move = (step: number): void => {
    const list = visible();
    if (!list.length) return;
    const index = selected ? list.indexOf(selected) : -1;
    select(list[(index + step + list.length) % list.length] ?? null);
  };

  input.addEventListener('input', filter);

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter' && selected) {
      event.preventDefault();
      selected.click();
    }
  });

  dialog.addEventListener('click', (event) => {
    // A click on the dialog element itself is a click on the backdrop.
    if (event.target === dialog || (event.target as Element).closest('[data-palette-item]')) {
      dialog.close();
    }
  });

  for (const item of items) {
    item.addEventListener('pointermove', () => {
      if (selected !== item) select(item, false);
    });
  }

  for (const trigger of document.querySelectorAll('[data-palette-open]')) {
    trigger.addEventListener('click', open);
  }

  document.addEventListener('keydown', (event) => {
    const typing = (event.target as Element | null)?.closest('input, textarea, [contenteditable]');
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    } else if (event.key === '/' && !typing && !dialog.open) {
      event.preventDefault();
      open();
    }
  });

  // Show the platform's own shortcut on the trigger.
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    const command = String.fromCharCode(0x2318);
    for (const key of document.querySelectorAll('[data-kbd]')) key.textContent = `${command} K`;
  }
}
