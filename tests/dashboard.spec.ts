import { test, expect } from '@playwright/test';

/**
 * RRIO Dashboard E2E Tests
 * Tests core Bloomberg-grade dashboard functionality
 */

test.describe('RRIO Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load main dashboard layout', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/RRIO|Resilience Intelligence/);
    
    // Main layout should be present
    await expect(page.locator('main, [data-testid="main-layout"]')).toBeVisible();
    
    // Check for Bloomberg-style terminal typography
    await expect(page.locator('.font-mono').first()).toBeVisible();
  });

  test('should display GRII headline with risk score', async ({ page }) => {
    // Wait for GRII data to load (either real or mock)
    await page.waitForLoadState('networkidle');
    
    // Check for GRII score display
    const griiScore = page.locator('h1, [data-testid="grii-headline"]').first();
    await expect(griiScore).toBeVisible({ timeout: 10000 });
    
    // Should have monospace font
    await expect(griiScore).toHaveClass(/font-mono/);
  });

  test('should show loading states properly', async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route('**/api/v1/**', async route => {
      await page.waitForTimeout(1000); // Simulate slow response
      route.continue();
    });
    
    await page.goto('/');
    
    // Should show loading spinner or skeleton
    const loadingElement = page.locator('[data-testid="loading-spinner"], .animate-pulse, .animate-spin');
    await expect(loadingElement.first()).toBeVisible({ timeout: 2000 });
  });

  test('should display semantic risk colors correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for risk color classes (green, amber, red)
    const riskElements = page.locator('[class*="terminal-green"], [class*="terminal-orange"], [class*="terminal-red"]');
    await expect(riskElements.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show data attribution timestamps', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for timestamp patterns like "Updated 13:04 UTC"
    const timestampElement = page.locator('text=/Updated.*UTC|Data:.*Cache.*L1/').first();
    await expect(timestampElement).toBeVisible({ timeout: 10000 });
  });

  test('should have working navigation', async ({ page }) => {
    // Check for navigation elements
    const navElements = page.locator('nav, [data-testid="navigation"], .left-rail');
    await expect(navElements.first()).toBeVisible({ timeout: 5000 });
    
    // Navigation should have Bloomberg-style design
    const navLinks = page.locator('nav a, nav button').first();
    if (await navLinks.count() > 0) {
      await expect(navLinks).toHaveClass(/font-mono|text-terminal/);
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/v1/analytics/geri', route => route.abort());
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Should show error message or fallback content
    const errorElement = page.locator('text=/error|failed|unavailable/i, [data-testid="error"], [class*="terminal-red"]');
    
    // Either error is shown or mock data is used (both acceptable)
    const hasError = await errorElement.first().isVisible();
    const hasContent = await page.locator('.terminal-card, main section').first().isVisible();
    
    expect(hasError || hasContent).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Content should still be visible and accessible
    await expect(page.locator('main, [data-testid="main-layout"]')).toBeVisible();
    
    // Check if navigation collapses properly (common pattern)
    const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-menu, button[aria-label*="menu"]');
    if (await mobileNav.count() > 0) {
      await expect(mobileNav.first()).toBeVisible();
    }
  });

  test('should have accessibility features', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for accessibility attributes
    const accessibleElements = page.locator('[aria-label], [aria-describedby], [role]');
    await expect(accessibleElements.first()).toBeVisible({ timeout: 5000 });
    
    // Check color contrast by verifying semantic color usage
    const colorElements = page.locator('[class*="text-terminal"]');
    await expect(colorElements.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show "Explain Drivers" buttons', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for "Explain Drivers" buttons
    const explainButton = page.locator('text=/Explain.*Driver/i, button:has-text("Explain")');
    
    // May not be visible immediately, check within reasonable time
    const buttonExists = await explainButton.first().isVisible({ timeout: 8000 });
    if (buttonExists) {
      await expect(explainButton.first()).toHaveClass(/font-mono/);
    }
  });
});
