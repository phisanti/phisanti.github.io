import { expect, test } from '@playwright/test';
import { pages, themes } from './pages';

/* Each page renders in each theme without console errors; full-page screenshots
   land in test-results/ for eyeballing, they are not compared. */

for (const theme of themes) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    });

    for (const path of pages) {
      test(`renders ${path}`, async ({ page }, testInfo) => {
        const errors: string[] = [];
        page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
        page.on('pageerror', (err) => errors.push(err.message));

        await page.goto(path, { waitUntil: 'networkidle' });
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        if (path === '/') await expect(page.locator('canvas.strata')).toBeAttached();

        const name = `${path.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home'}-${theme}.png`;
        await page.screenshot({ path: testInfo.outputPath(name), fullPage: true });
        expect(errors).toEqual([]);
      });
    }

    test('code panels follow the theme', async ({ page }) => {
      await page.goto('/posts/2025/09/mcpr/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const panel = theme === 'light' ? 'rgb(244, 239, 222)' : 'rgb(30, 35, 38)';
      await expect(page.locator('.prose pre').first()).toHaveCSS('background-color', panel);
    });
  });
}

test('reduced motion leaves the hero content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const child of await page.locator('[data-intro] > *').all()) {
    await expect(child).toHaveCSS('opacity', '1');
  }
});
