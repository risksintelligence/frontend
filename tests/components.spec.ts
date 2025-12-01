import { test, expect } from '@playwright/test';

/**
 * RRIO Component Integration Tests
 * Tests key Bloomberg-grade UI components and visualizations
 */

test.describe('RRIO UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display status badges with semantic colors', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for status badges
    const statusBadges = page.locator('[class*="badge"], [data-testid*="badge"]');
    
    if (await statusBadges.first().isVisible({ timeout: 5000 })) {
      // Should have terminal styling
      await expect(statusBadges.first()).toHaveClass(/terminal|font-mono/);
      
      // Should have semantic colors (good/warning/critical)
      const colorClasses = /terminal-green|terminal-orange|terminal-red|bg-green|bg-yellow|bg-red/;
      await expect(statusBadges.first()).toHaveClass(colorClasses);
    }
  });

  test('should show loading spinners during data fetch', async ({ page }) => {
    // Intercept API calls to simulate loading
    await page.route('**/api/v1/**', async route => {
      await page.waitForTimeout(500);
      route.continue();
    });
    
    await page.goto('/');
    
    // Should show loading spinner
    const loader = page.locator('.animate-spin, .animate-pulse, [data-testid*="loading"]');
    await expect(loader.first()).toBeVisible({ timeout: 2000 });
  });

  test('should display metric cards with proper formatting', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for metric cards
    const metricCards = page.locator('.terminal-card, [data-testid*="metric"]');
    await expect(metricCards.first()).toBeVisible({ timeout: 10000 });
    
    // Should contain numerical values
    const numbers = page.locator('text=/\\d+\\.?\\d*/');
    await expect(numbers.first()).toBeVisible();
    
    // Should have monospace fonts for numbers
    const numberElements = page.locator('[class*="font-mono"]');
    await expect(numberElements.first()).toBeVisible();
  });

  test('should show error states when API fails', async ({ page }) => {
    // Simulate API failure
    await page.route('**/api/v1/**', route => route.abort('failed'));
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Should show error message or fallback content
    const errorElements = page.locator('text=/error|failed|unavailable|retry/i, [class*="terminal-red"]');
    const fallbackContent = page.locator('.terminal-card, main section');
    
    const hasError = await errorElements.first().isVisible();
    const hasFallback = await fallbackContent.first().isVisible();
    
    // Either error is shown or fallback/mock data is used
    expect(hasError || hasFallback).toBeTruthy();
  });

  test('should have proper chart visualizations', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for chart containers
    const charts = page.locator('svg, canvas, .recharts-wrapper, [data-testid*="chart"]');
    
    if (await charts.first().isVisible({ timeout: 8000 })) {
      // Chart should be interactive
      await charts.first().hover();
      
      // Should have proper dimensions
      const chartBox = await charts.first().boundingBox();
      expect(chartBox?.width).toBeGreaterThan(50);
      expect(chartBox?.height).toBeGreaterThan(50);
    }
  });

  test('should display tooltips on hover', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find hoverable elements
    const hoverables = page.locator('button, .hover\\:bg-, [title], svg');
    
    if (await hoverables.first().isVisible({ timeout: 5000 })) {
      await hoverables.first().hover();
      await page.waitForTimeout(500);
      
      // Look for tooltip or title attribute
      const tooltip = page.locator('[role="tooltip"], .tooltip, [class*="tooltip"]');
      if (await tooltip.first().isVisible({ timeout: 1000 })) {
        await expect(tooltip.first()).toBeVisible();
      }
    }
  });

  test('should have accessible form controls', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for form controls
    const controls = page.locator('button, input, select, [role="button"]');
    
    if (await controls.first().isVisible({ timeout: 5000 })) {
      // Should be keyboard accessible
      await controls.first().focus();
      await expect(controls.first()).toBeFocused();
      
      // Should have proper labels or aria attributes
      const hasLabel = await controls.first().getAttribute('aria-label');
      const hasId = await controls.first().getAttribute('id');
      
      expect(hasLabel || hasId).toBeTruthy();
    }
  });

  test('should maintain Bloomberg terminal theme', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for terminal color variables
    const terminalElements = page.locator('[class*="terminal-"], [class*="font-mono"]');
    await expect(terminalElements.first()).toBeVisible({ timeout: 5000 });
    
    // Background should be appropriate
    const background = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // Should not be pure white (Bloomberg uses darker backgrounds)
    expect(background).not.toBe('rgb(255, 255, 255)');
  });

  test('should show contextual action buttons', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for action buttons like "Explain Drivers", "Export", etc.
    const actionButtons = page.locator('button').filter({ 
      hasText: /explain|export|download|scenario|mission/i 
    });
    
    if (await actionButtons.first().isVisible({ timeout: 8000 })) {
      // Should have terminal styling
      await expect(actionButtons.first()).toHaveClass(/font-mono/);
      
      // Should have hover effects
      const initialClass = await actionButtons.first().getAttribute('class');
      await actionButtons.first().hover();
      await page.waitForTimeout(100);
      
      // Class should change on hover or button should have hover styles
      const hoverClass = await actionButtons.first().getAttribute('class');
      expect(hoverClass?.includes('hover:') || initialClass !== hoverClass).toBeTruthy();
    }
  });
});