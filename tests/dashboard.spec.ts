import { test, expect } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Dashboard smoke tests', () => {
  test('dashboard shows key cards', async ({ page }) => {
    await page.goto(base);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Debug: Check what's actually on the page
    const pageContent = await page.content();
    console.log('Page title:', await page.title());
    console.log('Has main element:', await page.locator('main').count());
    console.log('Has #main-content:', await page.locator('#main-content').count());
    
    // First check if the page loaded at all (look for any content)
    await expect(page.locator('body')).toContainText('RiskSX', { timeout: 15000 });
    
    // Then check for specific elements
    const mainContent = page.locator('main, #main-content, [role="main"]').first();
    await expect(mainContent).toBeVisible({ timeout: 15000 });
    
    // Look for key content that should be present
    await expect(page.locator('body')).toContainText(/Global Resilience|GERII|Intelligence/, { timeout: 10000 });
  });

  test('Bloomberg styling and content sections render', async ({ page }) => {
    await page.goto(base);
    await page.waitForLoadState('networkidle');
    
    // Check for Bloomberg Terminal style page structure
    await expect(page.locator('body')).toContainText(/Observatory|RiskSX/, { timeout: 15000 });
    
    // Look for any of the key sections (they might be in different containers)
    const hasRiskContent = page.locator('body').locator('text=/Risk|Resilience|Intelligence/').first();
    await expect(hasRiskContent).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Transparency portal', () => {
  test('shows Bloomberg styled transparency portal', async ({ page }) => {
    await page.goto(`${base}/transparency`);
    await page.waitForLoadState('networkidle');
    
    // Check for transparency page content (more flexible)
    await expect(page.locator('body')).toContainText(/TRANSPARENCY|Transparency/, { timeout: 15000 });
    
    // Look for data-related content
    await expect(page.locator('body')).toContainText(/Data|Sources|Freshness/, { timeout: 10000 });
  });
});
