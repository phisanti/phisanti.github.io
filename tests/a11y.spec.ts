import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { pages, themes } from './pages';

for (const theme of themes) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      // Reveal and intro animations start content at opacity 0; reduced motion shows the settled page.
      await page.emulateMedia({ reducedMotion: 'reduce' });
    });

    for (const path of pages) {
      test(`axe wcag2a/aa ${path}`, async ({ page }) => {
        await page.goto(path, { waitUntil: 'networkidle' });
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
      });
    }
  });
}
