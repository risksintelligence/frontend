import { test, expect } from '@playwright/test';

/**
 * RRIO Network Analysis E2E Tests
 * Tests network topology, vulnerability tables, and dependency charts
 */

test.describe('Network Analysis Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/network');
  });

  test('should load network analysis page', async ({ page }) => {
    // Check page loads
    await expect(page.locator('main')).toBeVisible();
    
    // Should show network-specific content
    const networkHeader = page.locator('h1, h2').filter({ hasText: /network|topology/i });
    await expect(networkHeader.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display network topology overview', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for network components
    const networkComponents = page.locator('[data-testid*="network"], .terminal-card').first();
    await expect(networkComponents).toBeVisible({ timeout: 10000 });
    
    // Should have Bloomberg styling
    await expect(networkComponents).toHaveClass(/terminal|font-mono/);
  });

  test('should show vulnerability table if data exists', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for vulnerability table or empty state
    const vulnerabilitySection = page.locator('text=/vulnerability/i, [data-testid*="vulnerability"]');
    
    if (await vulnerabilitySection.first().isVisible({ timeout: 5000 })) {
      // If vulnerability data exists, table should be properly formatted
      const table = page.locator('table, .terminal-card').filter({ hasText: /vulnerability/i });
      await expect(table.first()).toBeVisible();
    }
  });

  test('should display partner dependency status', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for partner dependency information
    const dependencySection = page.locator('text=/partner.*dependencies|dependency.*chart/i');
    
    if (await dependencySection.first().isVisible({ timeout: 5000 })) {
      // Check for status indicators (stable/watch/critical)
      const statusElements = page.locator('text=/stable|watch|critical/i');
      await expect(statusElements.first()).toBeVisible();
    }
  });

  test('should show network statistics', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for network metrics like node count, critical paths
    const statsPattern = /nodes|paths|risk|critical/i;
    const statsElements = page.locator(`text=${statsPattern}`);
    
    await expect(statsElements.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have semantic risk coloring', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Check for risk-based coloring
    const riskColors = page.locator('[class*="terminal-green"], [class*="terminal-orange"], [class*="terminal-red"]');
    await expect(riskColors.first()).toBeVisible({ timeout: 8000 });
  });

  test('should show data attribution', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for data source and timestamp attribution
    const attribution = page.locator('text=/Data:.*Cache.*L1|Updated.*UTC/');
    await expect(attribution.first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle empty network data gracefully', async ({ page }) => {
    // Simulate empty network response
    await page.route('**/api/v1/network/topology', route => 
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ nodes: [], criticalPaths: [], summary: 'No network data available' })
      })
    );
    
    await page.goto('/network');
    await page.waitForTimeout(2000);
    
    // Should show empty state message
    const emptyState = page.locator('text=/no.*network|no.*data|connect.*api/i');
    await expect(emptyState.first()).toBeVisible();
  });

  test('should have interactive elements', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for interactive buttons
    const buttons = page.locator('button').filter({ hasText: /explain|scenario|mission/i });
    
    if (await buttons.first().isVisible({ timeout: 5000 })) {
      // Should have proper styling
      await expect(buttons.first()).toHaveClass(/font-mono/);
      
      // Should be clickable
      await expect(buttons.first()).toBeEnabled();
    }
  });
});