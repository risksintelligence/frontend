import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for RRIO tests
 * Sets up authentication and initial state
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up RRIO test environment...');
  void config;
  
  // Wait for services to be ready
  const baseURL = 'http://localhost:3000';
    
  const backendURL = 'http://localhost:8000';
  
  // Check if frontend is ready
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let retries = 0;
  const maxRetries = 30; // 30 seconds
  
  console.log('⏳ Waiting for frontend to be ready...');
  while (retries < maxRetries) {
    try {
      await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 2000 });
      console.log('✅ Frontend is ready');
      break;
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        console.error('❌ Frontend failed to start within timeout');
        throw error;
      }
      await page.waitForTimeout(1000);
    }
  }
  
  // Check if backend is ready
  console.log('⏳ Waiting for backend to be ready...');
  retries = 0;
  let backendReady = false;
  
  while (retries < maxRetries && !backendReady) {
    try {
      const response = await page.request.get(`${backendURL}/api/v1/health/basic`);
      if (response.ok()) {
        console.log('✅ Backend is ready (health endpoint)');
        backendReady = true;
        break;
      }
    } catch {
      // Try alternative endpoints
      try {
        const geriResponse = await page.request.get(`${backendURL}/api/v1/analytics/geri`);
        if (geriResponse.status() !== 404) {
          console.log('✅ Backend is ready (via GERI endpoint)');
          backendReady = true;
          break;
        }
      } catch {
        // Last resort - check if any backend endpoint responds
        try {
          const rootResponse = await page.request.get(`${backendURL}/`);
          if (rootResponse.status() < 500) {
            console.log('✅ Backend is responding (via root endpoint)');
            backendReady = true;
            break;
          }
        } catch {
          retries++;
          if (retries === maxRetries) {
            console.warn('⚠️  Backend not responding, tests will continue with frontend-only mode');
            break;
          }
          console.log(`⏳ Backend check attempt ${retries}/${maxRetries}...`);
          await page.waitForTimeout(2000); // Increased wait time
        }
      }
    }
  }
  
  // Verify key components load
  console.log('🔍 Verifying RRIO components...');
  try {
    await page.goto(baseURL);
    
    // Wait for main layout to load
    await page.waitForSelector('[data-testid="main-layout"], .terminal-card, main', { timeout: 10000 });
    console.log('✅ Main layout loaded');
    
    // Check for GRII headline
    await page.waitForSelector('h1, [data-testid="grii-headline"]', { timeout: 5000 });
    console.log('✅ GRII headline component loaded');
    
  } catch (error) {
    console.warn('⚠️  Some components may not be fully ready:', error);
  }
  
  await browser.close();
  console.log('🎉 Test environment setup complete!');
}

export default globalSetup;
