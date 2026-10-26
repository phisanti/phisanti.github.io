/**
 * Restores the email address from `data-mask` (reversed, base64) once the page
 * runs, so crawlers reading the HTML find no plain address. Links become a
 * mailto (with `data-subject` if set), and `data-copy` buttons get it to copy
 * and are revealed.
 */
for (const el of document.querySelectorAll<HTMLElement>('[data-mask]')) {
  const address = [...atob(el.dataset.mask!)].reverse().join('');
  if (el instanceof HTMLAnchorElement) {
    const subject = el.dataset.subject;
    el.href = `mailto:${address}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  }
  if ('copy' in el.dataset) {
    el.dataset.copy = address;
    el.hidden = false;
  }
}
