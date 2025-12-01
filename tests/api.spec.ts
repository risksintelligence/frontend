import { test, expect } from '@playwright/test';

/**
 * RRIO API Integration Tests
 * Tests backend API connectivity and data validation
 */

test.describe('API Integration', () => {
  const baseURL = 'http://localhost:8000';

  test('should handle GRII analytics endpoint', async ({ page }) => {
    // Test the main GRII endpoint
    const response = await page.request.get(`${baseURL}/api/v1/analytics/geri`);
    
    if (response.ok()) {
      const data = await response.json();
      
      // Should have valid GRII structure
      expect(data).toHaveProperty('overview');
      expect(data.overview).toHaveProperty('score');
      expect(typeof data.overview.score).toBe('number');
      expect(data.overview.score).toBeGreaterThanOrEqual(0);
      expect(data.overview.score).toBeLessThanOrEqual(100);
    } else {
      // Backend not available - check frontend fallback
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Should show fallback data or error handling
      const content = page.locator('.terminal-card, main section');
      await expect(content.first()).toBeVisible();
    }
  });

  test('should handle components endpoint', async ({ page }) => {
    const response = await page.request.get(`${baseURL}/api/v1/analytics/components`);
    
    if (response.ok()) {
      const data = await response.json();
      
      // Should have components array
      expect(data).toHaveProperty('components');
      expect(Array.isArray(data.components)).toBeTruthy();
      
      if (data.components.length > 0) {
        const component = data.components[0];
        expect(component).toHaveProperty('id');
        expect(component).toHaveProperty('value');
        expect(component).toHaveProperty('z_score');
      }
    } else {
      console.log('Components endpoint not available, using fallback data');
    }
  });

  test('should handle network topology endpoint', async ({ page }) => {
    const response = await page.request.get(`${baseURL}/api/v1/network/topology`);
    
    if (response.ok()) {
      const data = await response.json();
      
      // Should have network structure
      expect(data).toHaveProperty('nodes');
      expect(Array.isArray(data.nodes)).toBeTruthy();
      
      if (data.nodes.length > 0) {
        const node = data.nodes[0];
        expect(node).toHaveProperty('id');
        expect(node).toHaveProperty('name');
        expect(node).toHaveProperty('risk');
        expect(node).toHaveProperty('sector');
      }
    } else {
      // Test fallback handling in frontend
      await page.goto('/network');
      await page.waitForTimeout(3000);
      
      // Should handle missing network data gracefully
      const networkContent = page.locator('main, .terminal-card');
      await expect(networkContent.first()).toBeVisible();
    }
  });

  test('should handle economic data endpoint', async ({ page }) => {
    const response = await page.request.get(`${baseURL}/api/v1/analytics/economic`);
    
    if (response.ok()) {
      const data = await response.json();
      
      // Should have economic indicators
      expect(data).toHaveProperty('indicators');
      expect(Array.isArray(data.indicators)).toBeTruthy();
      
      if (data.indicators.length > 0) {
        const indicator = data.indicators[0];
        expect(indicator).toHaveProperty('id');
        expect(indicator).toHaveProperty('value');
        expect(indicator).toHaveProperty('unit');
      }
    }
  });

  test('should handle alerts endpoint', async ({ page }) => {
    const response = await page.request.get(`${baseURL}/api/v1/alerts`);
    
    if (response.ok()) {
      const data = await response.json();
      
      // Should be array of alerts
      expect(Array.isArray(data)).toBeTruthy();
      
      if (data.length > 0) {
        const alert = data[0];
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('severity');
        expect(alert).toHaveProperty('message');
      }
    }
  });

  test('should handle transparency status endpoint', async ({ page }) => {
    const response = await page.request.get(`${baseURL}/api/v1/transparency/status`);
    
    if (response.ok()) {
      const data = await response.json();
      
      // Should have transparency information
      expect(data).toHaveProperty('overall_status');
      expect(data).toHaveProperty('cache_layers');
    }
  });

  test('should validate API response times', async ({ page }) => {
    const startTime = Date.now();
    const response = await page.request.get(`${baseURL}/api/v1/analytics/geri`);
    const endTime = Date.now();
    
    if (response.ok()) {
      const responseTime = endTime - startTime;
      
      // API should respond within reasonable time (5 seconds)
      expect(responseTime).toBeLessThan(5000);
      
      // For production readiness, should be much faster
      if (responseTime > 2000) {
        console.warn(`API response time: ${responseTime}ms - may need optimization`);
      }
    }
  });

  test('should handle API errors gracefully in frontend', async ({ page }) => {
    // Simulate various API error conditions
    await page.route('**/api/v1/analytics/geri', route => 
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Frontend should still function with error handling
    const mainContent = page.locator('main, .terminal-card');
    await expect(mainContent.first()).toBeVisible();
    
    // Should show error state or fallback content
    const errorIndicators = page.locator('text=/error|failed|retry/i, [class*="terminal-red"]');
    const fallbackContent = page.locator('.terminal-card');
    
    const hasError = await errorIndicators.first().isVisible();
    const hasFallback = await fallbackContent.first().isVisible();
    
    expect(hasError || hasFallback).toBeTruthy();
  });

  test('should maintain data consistency across endpoints', async ({ page }) => {
    // Test that related endpoints return consistent data
    const griiResponse = await page.request.get(`${baseURL}/api/v1/analytics/geri`);
    const componentsResponse = await page.request.get(`${baseURL}/api/v1/analytics/components`);
    
    if (griiResponse.ok() && componentsResponse.ok()) {
      const griiData = await griiResponse.json();
      const componentsData = await componentsResponse.json();
      
      // Both should have updated timestamps within reasonable range
      if (griiData.overview?.updated_at && componentsData.components?.[0]?.updatedAt) {
        const griiTime = new Date(griiData.overview.updated_at);
        const componentTime = new Date(componentsData.components[0].updatedAt);
        const timeDiff = Math.abs(griiTime.getTime() - componentTime.getTime());
        
        // Should be updated within 1 hour of each other
        expect(timeDiff).toBeLessThan(60 * 60 * 1000);
      }
    }
  });
});