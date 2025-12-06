import { defineConfig, devices } from '@playwright/test';

/**
 * CI-Optimized RRIO Frontend Test Configuration
 * Focused tests for CI/CD pipeline validation
 */
export default defineConfig({
  testDir: './tests',
  testMatch: [
    'critical-smoke.spec.ts',
    'production-readiness-validation.spec.ts'
  ],
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1,
  /* Use single worker for CI stability */
  workers: 1,
  /* Reporter to use */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['github']
  ],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:3000',
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
    /* Accept downloads */
    acceptDownloads: true,
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers - CI optimized */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  
  /* Start web server for CI tests */
  webServer: {
    command: 'npm run build && npm run start',
    port: 3000,
    reuseExistingServer: false,
    timeout: 120 * 1000, // 2 minutes
  },

  /* Test timeout - increased for CI */
  timeout: 60 * 1000, // 60 seconds per test
  expect: {
    /* Global expect timeout */
    timeout: 15 * 1000, // 15 seconds
  },

  /* Output directory */
  outputDir: 'test-results/',
});