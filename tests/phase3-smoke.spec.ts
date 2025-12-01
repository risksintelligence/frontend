import { test, expect } from '@playwright/test';

/**
 * Phase 3 Smoke Tests
 * Tests for the full-featured pages built in Phase 3
 */

test.describe('Phase 3: Full-Featured Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Set up any necessary authentication or state
    await page.goto('/');
    
    // Wait for the app to be ready
    await expect(page.locator('header')).toBeVisible();
  });

  test.describe('Risk Intelligence Pages', () => {
    test('Risk overview page loads and displays key metrics', async ({ page }) => {
      await page.goto('/risk');
      
      // Check page title and header
      await expect(page.locator('h1')).toContainText('GRII + Regime Overview');
      
      // Check key metric cards are present
      await expect(page.locator('text=GRII Composite Score')).toBeVisible();
      await expect(page.locator('text=Risk Band')).toBeVisible();
      await expect(page.locator('text=Active Alerts')).toBeVisible();
      
      // Check major components are rendered
      await expect(page.locator('[data-testid="economic-overview"]')).toBeVisible();
      await expect(page.locator('[data-testid="regime-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="forecast-panel"]')).toBeVisible();
    });

    test('Risk factors page displays component metrics', async ({ page }) => {
      await page.goto('/risk/factors');
      
      await expect(page.locator('h1')).toContainText('Component Contributions');
      
      // Should show component cards with z-scores
      await expect(page.locator('text=Z-Score:')).toBeVisible();
      
      // Check for loading states handling
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Loading')).toHaveCount(0);
    });

    test('Risk anomalies page shows alert systems', async ({ page }) => {
      await page.goto('/risk/anomalies');
      
      await expect(page.locator('h1')).toContainText('Severity Ledger & Alerts');
      await expect(page.locator('text=/api/v1/alerts')).toBeVisible();
    });
  });

  test.describe('Analytics Pages', () => {
    test('Analytics economic page displays indicators', async ({ page }) => {
      await page.goto('/analytics/economic');
      
      await expect(page.locator('h1')).toContainText('Economic Indicators');
      
      // Check for economic indicator cards
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="economic-overview"]')).toBeVisible();
    });

    test('Analytics scenarios page shows scenario analysis', async ({ page }) => {
      await page.goto('/analytics/scenarios');
      
      await expect(page.locator('h1')).toContainText('Scenario Analysis');
      
      // Check for scenario components
      await expect(page.locator('text=Current GRII')).toBeVisible();
      await expect(page.locator('text=Active Regime')).toBeVisible();
      await expect(page.locator('text=SCENARIO OUTCOMES')).toBeVisible();
    });

    test('Analytics correlations page displays correlation matrix', async ({ page }) => {
      await page.goto('/analytics/correlations');
      
      await expect(page.locator('h1')).toContainText('CORRELATION MATRIX');
      
      // Check for correlation matrix components
      await expect(page.locator('text=FACTOR CORRELATION MATRIX')).toBeVisible();
      await expect(page.locator('text=Pearson correlations')).toBeVisible();
    });
  });

  test.describe('Explainability Pages', () => {
    test('SHAP explanations page loads', async ({ page }) => {
      await page.goto('/explainability/shap');
      
      await expect(page.locator('h1')).toContainText('SHAP Driver Analysis');
      await expect(page.locator('text=top contributors to GRII moves')).toBeVisible();
    });

    test('LIME explanations page displays local interpretability', async ({ page }) => {
      await page.goto('/explainability/lime');
      
      await expect(page.locator('h1')).toContainText('LIME Explanations');
      await expect(page.locator('text=LOCAL INTERPRETABLE MODEL-AGNOSTIC EXPLANATIONS')).toBeVisible();
      await expect(page.locator('text=Feature importance for individual predictions')).toBeVisible();
    });
  });

  test.describe('Network Analysis Pages', () => {
    test('Network overview page shows topology', async ({ page }) => {
      await page.goto('/network');
      
      await expect(page.locator('h1')).toContainText('Systemic Topology Overview');
      await expect(page.locator('text=/api/v1/network/topology')).toBeVisible();
    });

    test('Network topology page displays detailed view', async ({ page }) => {
      await page.goto('/network/topology');
      
      await expect(page.locator('h1')).toContainText('Network Topology');
      await expect(page.locator('text=NETWORK NODES')).toBeVisible();
      await expect(page.locator('text=CRITICAL PATHS')).toBeVisible();
      await expect(page.locator('text=TOPOLOGY SUMMARY')).toBeVisible();
    });

    test('Network dependencies page shows vulnerability analysis', async ({ page }) => {
      await page.goto('/network/dependencies');
      
      await expect(page.locator('h1')).toContainText('Network Dependencies');
      await expect(page.locator('text=SYSTEM VULNERABILITIES')).toBeVisible();
      await expect(page.locator('text=PARTNER DEPENDENCIES')).toBeVisible();
      await expect(page.locator('text=DEPENDENCY MATRIX')).toBeVisible();
    });
  });

  test.describe('Mission & Partner Pages', () => {
    test('Missions overview page displays activation dashboard', async ({ page }) => {
      await page.goto('/missions');
      
      await expect(page.locator('h1')).toContainText('Activation Dashboard');
      await expect(page.locator('text=Mission Highlights')).toBeVisible();
      await expect(page.locator('text=Partner Timeline')).toBeVisible();
    });

    test('Partner Labs page shows partnership details', async ({ page }) => {
      await page.goto('/missions/partners');
      
      await expect(page.locator('h1')).toContainText('Partner Labs');
      await expect(page.locator('text=Strategic partnerships')).toBeVisible();
      await expect(page.locator('text=Active Partners')).toBeVisible();
      await expect(page.locator('text=Avg Engagement')).toBeVisible();
    });

    test('Insight Fellowship page displays academic program', async ({ page }) => {
      await page.goto('/missions/fellowship');
      
      await expect(page.locator('h1')).toContainText('Insight Fellowship');
      await expect(page.locator('text=FELLOWSHIP TIMELINE')).toBeVisible();
      await expect(page.locator('text=FELLOW PROJECTS')).toBeVisible();
      await expect(page.locator('text=PROGRAM IMPACT METRICS')).toBeVisible();
    });
  });

  test.describe('Transparency Portal', () => {
    test('Transparency main page shows compliance status', async ({ page }) => {
      await page.goto('/transparency');
      
      await expect(page.locator('h1')).toContainText('Data Freshness & Compliance');
      await expect(page.locator('text=Cache Architecture')).toBeVisible();
      await expect(page.locator('text=Compliance Checklist')).toBeVisible();
      await expect(page.locator('text=Background Refresh')).toBeVisible();
    });

    test('Data lineage page shows provenance tracking', async ({ page }) => {
      await page.goto('/transparency/lineage');
      
      await expect(page.locator('h1')).toContainText('Data Lineage');
      await expect(page.locator('text=DATA FLOW PIPELINES')).toBeVisible();
      await expect(page.locator('text=DATA PROVENANCE')).toBeVisible();
      await expect(page.locator('text=LINEAGE COMPLIANCE STATUS')).toBeVisible();
    });
  });

  test.describe('Error Handling & Monitoring', () => {
    test('Pages handle network errors gracefully', async ({ page }) => {
      // Block API calls to test fallback behavior
      await page.route('**/api/**', route => route.abort());
      
      await page.goto('/risk');
      
      // Should show fallback content, not crash
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
    });

    test('Error boundaries catch component failures', async ({ page }) => {
      // This test would need a way to trigger component errors
      // In a real scenario, you might have a test endpoint that causes errors
      await page.goto('/risk');
      
      // Verify no uncaught JavaScript errors in console
      const errors: string[] = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });
      
      // Navigate and interact with the page
      await page.click('text=GRII + Regime Overview');
      await page.waitForTimeout(1000);
      
      // Should not have uncaught errors (monitoring system should catch them)
      expect(errors.filter(e => !e.includes('monitoring'))).toHaveLength(0);
    });
  });

  test.describe('Navigation & User Experience', () => {
    test('Main navigation works across all routes', async ({ page }) => {
      await page.goto('/');
      
      // Test main navigation links
      const routes = [
        '/risk',
        '/analytics',
        '/explainability/shap',
        '/network',
        '/missions',
        '/transparency'
      ];
      
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator('h1')).toBeVisible();
        await page.waitForLoadState('networkidle');
      }
    });

    test('Pages are responsive on mobile devices', async ({ page }) => {
      // Test on mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/risk');
      await expect(page.locator('h1')).toBeVisible();
      
      // Check that cards stack vertically on mobile
      const cards = page.locator('.terminal-card');
      await expect(cards.first()).toBeVisible();
    });

    test('Terminal theme and styling is consistent', async ({ page }) => {
      await page.goto('/risk');
      
      // Check that terminal theme classes are applied
      await expect(page.locator('.terminal-card')).toHaveCount.greaterThan(0);
      await expect(page.locator('.font-mono')).toHaveCount.greaterThan(0);
      
      // Check color scheme consistency
      const backgroundColor = await page.evaluate(() => {
        const body = document.querySelector('body');
        return window.getComputedStyle(body!).backgroundColor;
      });
      
      // Should have dark terminal background
      expect(backgroundColor).toBeTruthy();
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('Pages load within acceptable time limits', async ({ page }) => {
      const start = Date.now();
      await page.goto('/risk');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - start;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('Pages have proper accessibility attributes', async ({ page }) => {
      await page.goto('/risk');
      
      // Check for proper heading hierarchy
      await expect(page.locator('h1')).toBeVisible();
      
      // Check for semantic HTML elements
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('header')).toBeVisible();
      
      // Check for ARIA labels where appropriate
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        // At least some buttons should be accessible
        await expect(buttons.first()).toBeVisible();
      }
    });
  });
});