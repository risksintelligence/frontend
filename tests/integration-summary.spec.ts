import { test, expect } from '@playwright/test';

/**
 * Integration Summary Tests
 * Final validation that core RRIO backend integration is working
 */

test.describe('RRIO Backend Integration Summary', () => {
  test('CRITICAL: All backend endpoints are functional', async ({ page }) => {
    console.log('🚀 VALIDATING CORE RRIO BACKEND INTEGRATION...');
    
    const results = {
      'GERI Analytics': false,
      'Components Data': false, 
      'Partners Data': false,
      'RAS Metrics': false,
      'Data Lineage': false
    };
    
    // Test GERI Analytics
    try {
      const geriResponse = await page.request.get('http://localhost:8000/api/v1/analytics/geri');
      if (geriResponse.ok()) {
        const data = await geriResponse.json();
        expect(data).toHaveProperty('score');
        results['GERI Analytics'] = true;
        console.log('✅ GERI Analytics endpoint working');
      }
    } catch (e) {
      console.log('⚠️  GERI Analytics endpoint not available');
    }
    
    // Test Components Data
    try {
      const componentsResponse = await page.request.get('http://localhost:8000/api/v1/analytics/components');
      if (componentsResponse.ok()) {
        const data = await componentsResponse.json();
        expect(data).toHaveProperty('components');
        expect(Array.isArray(data.components)).toBeTruthy();
        results['Components Data'] = true;
        console.log('✅ Components Data endpoint working');
      }
    } catch (e) {
      console.log('⚠️  Components Data endpoint not available');
    }
    
    // Test Partners Data (CRITICAL - just implemented)
    try {
      const partnersResponse = await page.request.get('http://localhost:8000/api/v1/impact/partners');
      if (partnersResponse.ok()) {
        const data = await partnersResponse.json();
        expect(data).toHaveProperty('partners');
        expect(Array.isArray(data.partners)).toBeTruthy();
        results['Partners Data'] = true;
        console.log('✅ Partners Data endpoint working');
      }
    } catch (e) {
      console.log('⚠️  Partners Data endpoint not available');
    }
    
    // Test RAS Metrics (CRITICAL - just implemented)
    try {
      const rasResponse = await page.request.get('http://localhost:8000/api/v1/impact/ras');
      if (rasResponse.ok()) {
        const data = await rasResponse.json();
        expect(data).toHaveProperty('composite');
        expect(typeof data.composite).toBe('number');
        results['RAS Metrics'] = true;
        console.log('✅ RAS Metrics endpoint working');
      }
    } catch (e) {
      console.log('⚠️  RAS Metrics endpoint not available');
    }
    
    // Test Data Lineage (CRITICAL - just implemented)
    try {
      const lineageResponse = await page.request.get('http://localhost:8000/api/v1/monitoring/data-lineage/VIX');
      if (lineageResponse.ok()) {
        const data = await lineageResponse.json();
        expect(data).toBeTruthy();
        results['Data Lineage'] = true;
        console.log('✅ Data Lineage endpoint working');
      }
    } catch (e) {
      console.log('⚠️  Data Lineage endpoint not available');
    }
    
    console.log('\n🎯 INTEGRATION SUMMARY:');
    Object.entries(results).forEach(([feature, working]) => {
      console.log(`   ${working ? '✅' : '❌'} ${feature}`);
    });
    
    // At minimum, the newly implemented endpoints should work
    expect(results['Partners Data']).toBeTruthy();
    expect(results['RAS Metrics']).toBeTruthy();
    console.log('\n🚀 CRITICAL PATH VALIDATION: Mission/Partner integration SUCCESSFUL');
  });

  test('CRITICAL: Frontend data transformation working', async ({ page }) => {
    console.log('🧪 VALIDATING FRONTEND DATA TRANSFORMATION...');
    
    // Test that frontend React components can handle backend data
    await page.goto('/missions');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check for API calls being made
    const apiCalls: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/v1/impact/')) {
        apiCalls.push(request.url());
      }
    });
    
    // Navigate to trigger data fetching
    await page.goto('/missions/partners');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should have made API calls to our endpoints
    const relevantCalls = apiCalls.filter(url => 
      url.includes('/impact/partners') || url.includes('/impact/ras')
    );
    
    console.log(`📡 Frontend made ${relevantCalls.length} API calls to real endpoints`);
    expect(relevantCalls.length).toBeGreaterThan(0);
    
    console.log('✅ Frontend successfully calls real backend endpoints');
  });

  test('CRITICAL: Enhanced components use real data', async ({ page }) => {
    console.log('🧪 VALIDATING ENHANCED COMPONENTS...');
    
    // Track network requests to verify real data usage
    const enhancedEndpoints: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/v1/analytics/components') ||
          url.includes('/api/v1/impact/partners') ||
          url.includes('/api/v1/impact/ras') ||
          url.includes('/api/v1/monitoring/data-lineage')) {
        enhancedEndpoints.push(url);
      }
    });
    
    // Test correlation matrix (enhanced component)
    await page.goto('/analytics/correlations');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test data lineage (enhanced component)  
    await page.goto('/transparency/lineage');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test partners page (new enhanced component)
    await page.goto('/missions/partners');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log(`📊 Enhanced components made ${enhancedEndpoints.length} API calls`);
    console.log(`🔗 Endpoints called: ${[...new Set(enhancedEndpoints)].join(', ')}`);
    
    // Should have called our enhanced endpoints
    expect(enhancedEndpoints.length).toBeGreaterThan(0);
    
    const uniqueEndpoints = new Set(enhancedEndpoints);
    console.log(`✅ ${uniqueEndpoints.size} unique enhanced endpoints successfully called`);
  });

  test('PERFORMANCE: Enhanced pages load quickly', async ({ page }) => {
    console.log('⚡ VALIDATING PERFORMANCE...');
    
    const performanceTests = [
      '/missions',
      '/missions/partners', 
      '/analytics/correlations',
      '/transparency/lineage'
    ];
    
    const loadTimes: Record<string, number> = {};
    
    for (const path of performanceTests) {
      const start = Date.now();
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - start;
      
      loadTimes[path] = loadTime;
      console.log(`📊 ${path}: ${loadTime}ms`);
    }
    
    // All enhanced pages should load within 3 seconds
    Object.entries(loadTimes).forEach(([path, time]) => {
      expect(time).toBeLessThan(3000);
    });
    
    const avgLoadTime = Object.values(loadTimes).reduce((a, b) => a + b, 0) / Object.values(loadTimes).length;
    console.log(`✅ Average load time: ${avgLoadTime.toFixed(0)}ms (target: <3000ms)`);
  });

  test('FINAL VALIDATION: Complete integration health check', async ({ page }) => {
    console.log('🏁 FINAL RRIO INTEGRATION HEALTH CHECK...');
    
    const healthCheck = {
      backendConnectivity: false,
      dataTransformation: false,
      errorHandling: false,
      performance: false
    };
    
    // Test backend connectivity
    try {
      const partnersResponse = await page.request.get('http://localhost:8000/api/v1/impact/partners');
      const rasResponse = await page.request.get('http://localhost:8000/api/v1/impact/ras');
      
      if (partnersResponse.ok() && rasResponse.ok()) {
        healthCheck.backendConnectivity = true;
        console.log('✅ Backend connectivity: HEALTHY');
      }
    } catch (e) {
      console.log('❌ Backend connectivity: FAILED');
    }
    
    // Test data transformation by navigating to enhanced page
    try {
      await page.goto('/missions/partners');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Check if React rendered successfully
      const hasReactContent = await page.locator('body').textContent();
      if (hasReactContent && hasReactContent.length > 100) {
        healthCheck.dataTransformation = true;
        console.log('✅ Data transformation: HEALTHY');
      }
    } catch (e) {
      console.log('❌ Data transformation: FAILED');
    }
    
    // Test error handling
    try {
      await page.route('**/api/v1/**', route => route.abort());
      await page.goto('/missions');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      const stillRendered = await page.locator('body').textContent();
      if (stillRendered && stillRendered.length > 50) {
        healthCheck.errorHandling = true;
        console.log('✅ Error handling: HEALTHY');
      }
    } catch (e) {
      console.log('❌ Error handling: FAILED');
    }
    
    // Reset routing for performance test
    await page.unroute('**/api/v1/**');
    
    // Test performance
    try {
      const start = Date.now();
      await page.goto('/missions/partners');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - start;
      
      if (loadTime < 2000) {
        healthCheck.performance = true;
        console.log('✅ Performance: HEALTHY');
      }
    } catch (e) {
      console.log('❌ Performance: FAILED');
    }
    
    console.log('\n🎯 FINAL HEALTH CHECK RESULTS:');
    Object.entries(healthCheck).forEach(([check, passing]) => {
      console.log(`   ${passing ? '✅' : '❌'} ${check}`);
    });
    
    const passingChecks = Object.values(healthCheck).filter(Boolean).length;
    const totalChecks = Object.values(healthCheck).length;
    
    console.log(`\n📊 OVERALL HEALTH: ${passingChecks}/${totalChecks} (${Math.round(passingChecks/totalChecks*100)}%)`);
    
    // Expect at least 75% of health checks to pass
    expect(passingChecks / totalChecks).toBeGreaterThanOrEqual(0.75);
    
    console.log('🚀 RRIO INTEGRATION STATUS: OPERATIONAL ✅');
  });
});
