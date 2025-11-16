import { test, expect } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Dashboard smoke tests', () => {
  test('dashboard shows key cards', async ({ page }) => {
    await page.goto(base);
    // Wait for content to load (avoid loading state)
    await page.waitForLoadState('networkidle');
    // Check for Bloomberg Terminal style elements (should be present even with API failures)
    await expect(page.locator('#main-content')).toContainText('Global Resilience Intelligence', { timeout: 10000 });
    // Check for either working content or fallback/loading states
    await expect(page.locator('#main-content')).toContainText(/Regime|loading|Calm/);
    // Skip screenshot in CI for now
    // await expect(page.locator('main')).toHaveScreenshot('dashboard.png');
  });

  test('Bloomberg styling and content sections render', async ({ page }) => {
    await page.goto(base);
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    // Check for main Bloomberg Terminal sections
    await expect(page.locator('#main-content')).toContainText('Risk Drivers', { timeout: 10000 });
    await expect(page.locator('#main-content')).toContainText('Partner Labs');
    // Check for transparency section
    await expect(page.locator('#main-content')).toContainText('Transparency');
    // Check for component trends
    await expect(page.locator('#main-content')).toContainText('Component Trends');
  });
});

test.describe('Transparency portal', () => {
  test('shows Bloomberg styled transparency portal', async ({ page }) => {
    await page.goto(`${base}/transparency`);
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    // Check for Bloomberg Terminal style header
    await expect(page.getByText('TRANSPARENCY PORTAL')).toBeVisible({ timeout: 10000 });
    // Check for main content sections with Bloomberg styling
    await expect(page.getByText('DATA FRESHNESS')).toBeVisible();
    await expect(page.getByText('RESILIENCE ACTIVATION SCORE')).toBeVisible();
    // Check for system status metrics
    await expect(page.locator('main')).toContainText('Data Sources');
    await expect(page.locator('main')).toContainText('Cache Efficiency');
    // Skip screenshot in CI for now
    // await expect(page.locator('main')).toHaveScreenshot('transparency.png');
  });
});
