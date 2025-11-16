import { test, expect } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Dashboard smoke tests', () => {
  test('dashboard shows key cards', async ({ page }) => {
    await page.goto(base);
    // Check for Bloomberg Terminal style elements
    await expect(page.locator('#main-content')).toContainText('GERII');
    await expect(page.locator('#main-content')).toContainText('Regime');
    await expect(page.getByText('Resilience Activation Score')).toBeVisible();
    // Check for Bloomberg narrative section
    await expect(page.locator('#main-content')).toContainText('risk');
    // Skip screenshot in CI for now
    // await expect(page.locator('main')).toHaveScreenshot('dashboard.png');
  });

  test('Bloomberg styling and content sections render', async ({ page }) => {
    await page.goto(base);
    // Check for main Bloomberg Terminal sections
    await expect(page.locator('#main-content')).toContainText('Risk Drivers');
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
    // Check for Bloomberg Terminal style header
    await expect(page.getByText('TRANSPARENCY PORTAL')).toBeVisible();
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
