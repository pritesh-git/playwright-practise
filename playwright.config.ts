import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Automation Exercise Test Suite
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Maximum time one test can run for */
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Workers: run 2 workers locally for stability with web tests */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use */
  reporter: [['html', { open: 'never' }], ['list']],
  /* Shared settings for all the projects below */
  use: {
    baseURL: 'https://automationexercise.com',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
