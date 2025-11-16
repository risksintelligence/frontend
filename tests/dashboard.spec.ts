import { test, expect } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Dashboard smoke tests', () => {
  test('dashboard shows key cards', async ({ page }) => {
    await page.goto(base);
    await expect(page.getByText('GRII Score')).toBeVisible();
    await expect(page.getByText('Regime')).toBeVisible();
    await expect(page.getByText('Resilience Activation Score')).toBeVisible();
    await expect(page.locator('main')).toHaveScreenshot('dashboard.png');
  });

  test('anomaly card and mission highlight render', async ({ page }) => {
    await page.goto(base);
    await expect(page.getByText('Anomaly Feed')).toBeVisible();
    await expect(page.getByText('Sector Mission')).toBeVisible();
  });
});

test.describe('Transparency portal', () => {
  test('shows RAS and data freshness', async ({ page }) => {
    await page.goto(`${base}/transparency`);
    await expect(page.getByText('Transparency Portal')).toBeVisible();
    await expect(page.getByText('Data Freshness')).toBeVisible();
    await expect(page.getByText('Resilience Activation Score')).toBeVisible();
    await expect(page.locator('main')).toHaveScreenshot('transparency.png');
  });
});
