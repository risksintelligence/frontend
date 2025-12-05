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
  while (retries < maxRetries) {
    try {
      const response = await page.request.get(`${backendURL}/health`);
      if (response.ok()) {
        console.log('✅ Backend is ready');
        break;
      }
    } catch {
      // Backend might not have health endpoint, try main endpoint
      try {
        await page.request.get(`${backendURL}/api/v1/analytics/geri`);
        console.log('✅ Backend is ready (via GERI endpoint)');
        break;
      } catch {
        retries++;
        if (retries === maxRetries) {
          console.warn('⚠️  Backend not responding, tests will use mock data');
          break;
        }
        await page.waitForTimeout(1000);
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
