/**
 * Buttons with `data-copy` put that value on the clipboard and confirm in
 * their inner <span> for 1.5 s. If the clipboard is denied, nothing changes;
 * the link or mailto next to the button still works.
 */
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
  const label = button.querySelector('span')!;
  const idle = label.textContent;
  let timer: number | undefined;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy!);
    } catch {
      return;
    }
    label.textContent = 'Copied ✓';
    clearTimeout(timer);
    timer = window.setTimeout(() => (label.textContent = idle), 1500);
  });
}
