import { defineConfig, devices } from '@playwright/test';

/* Runs against the built site (`astro build` first); `make check` does both.
   Port 4322 leaves 4321 free for `make dev` while checks run. */
const base = 'http://localhost:4322';

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: base },
  webServer: {
    // `--ignore-lock` keeps preview in the foreground; under an AI agent Astro would otherwise background it.
    command: 'npx astro preview --port 4322 --ignore-lock',
    url: base,
    // A server already on 4322 may be serving another checkout's dist/.
    reuseExistingServer: false,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } },
  ],
});
