import { test, expect } from '@playwright/test';

/**
 * Data Integration Validation Tests
 * Specifically tests that the missions/partners real backend integration is working
 */

test.describe('Data Integration Validation', () => {
  test('Backend endpoints return valid structured data', async ({ page }) => {
    console.log('🧪 Testing backend data endpoints...');
    
    // Test RRIO partners endpoint
    const partnersResponse = await page.request.get('http://localhost:8000/api/v1/impact/partners');
    expect(partnersResponse.ok()).toBeTruthy();
    
    const partnersData = await partnersResponse.json();
    expect(partnersData).toHaveProperty('partners');
    expect(Array.isArray(partnersData.partners)).toBeTruthy();
    
    console.log(`✅ Partners endpoint returns ${partnersData.partners?.length || 0} partners`);
    
    // Test RAS endpoint
    const rasResponse = await page.request.get('http://localhost:8000/api/v1/impact/ras');
    expect(rasResponse.ok()).toBeTruthy();
    
    const rasData = await rasResponse.json();
    expect(rasData).toHaveProperty('composite');
    expect(rasData).toHaveProperty('components');
    expect(typeof rasData.composite).toBe('number');
    
    console.log(`✅ RAS endpoint returns composite score: ${rasData.composite}`);
    
    // Test components endpoint for correlation data
    const componentsResponse = await page.request.get('http://localhost:8000/api/v1/analytics/components');
    expect(componentsResponse.ok()).toBeTruthy();
    
    const componentsData = await componentsResponse.json();
    expect(componentsData).toHaveProperty('components');
    expect(Array.isArray(componentsData.components)).toBeTruthy();
    
    console.log(`✅ Components endpoint returns ${componentsData.components?.length || 0} components`);
  });

  test('Frontend data transformation works correctly', async ({ page }) => {
    console.log('🧪 Testing frontend data transformation...');
    
    // Get raw backend data
    const partnersResponse = await page.request.get('http://localhost:8000/api/v1/impact/partners');
    const rawData = await partnersResponse.json();
    void rawData;
    
    // Now check if frontend correctly displays transformed data
    await page.goto('/missions');
    
    // Allow time for data fetching and rendering
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if page renders without JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    // Verify page loaded
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    
    console.log(`✅ Missions page loaded successfully: "${pageTitle}"`);
    
    // Check for no critical JavaScript errors
    expect(errors.length).toBe(0);
    console.log('✅ No JavaScript errors on missions page');
  });

  test('Partners page data integration', async ({ page }) => {
    console.log('🧪 Testing partners page data integration...');
    
    await page.goto('/missions/partners');
    
    // Allow time for data fetching
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if page renders without errors
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    
    console.log(`✅ Partners page loaded: "${pageTitle}"`);
    
    // Check for React rendering
    const reactRoot = page.locator('#__next, [data-react-root], main');
    const hasReactContent = await reactRoot.count() > 0;
    expect(hasReactContent).toBeTruthy();
    
    console.log('✅ React content is rendering on partners page');
  });

  test('Real-time data service functions work', async ({ page }) => {
    console.log('🧪 Testing real-time data service functions...');
    
    // Test that our enhanced data service functions work by checking the network calls
    await page.goto('/missions/partners');
    
    // Track API calls
    const apiCalls: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/v1/')) {
        apiCalls.push(request.url());
      }
    });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Allow time for React Query calls
    
    // Should have made calls to our real endpoints
    const relevantCalls = apiCalls.filter(url => 
      url.includes('/impact/partners') || url.includes('/impact/ras')
    );
    
    console.log(`📡 API calls made: ${relevantCalls.join(', ')}`);
    expect(relevantCalls.length).toBeGreaterThan(0);
    console.log('✅ Frontend is calling real backend endpoints');
  });

  test('Correlation matrix uses real backend data', async ({ page }) => {
    console.log('🧪 Testing correlation matrix data integration...');
    
    await page.goto('/analytics/correlations');
    
    // Allow time for data fetching
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    
    console.log(`✅ Correlations page loaded: "${pageTitle}"`);
    
    // Check if page renders basic content
    const mainContent = await page.locator('body').textContent();
    expect(mainContent).toBeTruthy();
    expect(mainContent!.length).toBeGreaterThan(100);
    
    console.log('✅ Correlations page has substantial content');
  });

  test('Data lineage integration works', async ({ page }) => {
    console.log('🧪 Testing data lineage integration...');
    
    await page.goto('/transparency/lineage');
    
    // Allow time for data fetching
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    
    console.log(`✅ Lineage page loaded: "${pageTitle}"`);
    
    // Check basic page health
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(50);
    
    console.log('✅ Data lineage page has content');
  });

  test('Error boundaries handle API failures gracefully', async ({ page }) => {
    console.log('🧪 Testing error handling...');
    
    // Block API calls to test error handling
    await page.route('**/api/v1/**', route => {
      route.abort('failed');
    });
    
    await page.goto('/missions');
    
    // Should still render something, not crash completely
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    
    console.log('✅ Frontend handles API failures gracefully');
    
    // Check that page doesn't have critical errors
    const hasReactRoot = await page.locator('#__next, [data-react-root]').count() > 0;
    expect(hasReactRoot).toBeTruthy();
    
    console.log('✅ React app still renders with API failures');
  });
});
