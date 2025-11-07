import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './features', // Cucumber features will use this indirectly for context
  timeout: 60 * 1000,   /* Global timeout */
  expect: {
    timeout: 60000,
  },
  fullyParallel: true, /* Run UI tests in parallel */
  workers: 2, /* Number of parallel workers */
  /* Retry failed tests once (you can adjust as needed) */
//   retries: process.env.CI ? 2 : 0,

  use: {
    headless: false,
    baseURL: 'https://demowebshop.tricentis.com/', // default API/UI base
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure', // capture Playwright traces for failed tests
  },
  
  /* Reporters — can later integrate Allure or HTML */
  reporter: [['html', { open: 'never' }],
    ['allure-playwright'] ],

  /* Configure projects (Browser configurations) */
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Output directory for test artifacts */
  outputDir: 'test-results/',

  /* Optional: global setup/teardown if needed for tokens, env setup, etc. */
  globalSetup: undefined,
  globalTeardown: undefined,
});
