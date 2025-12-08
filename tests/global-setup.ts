import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for RRIO tests - CI Optimized 
 * Skips backend checks for frontend-only testing
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up RRIO test environment...');
  console.log('🔧 Mode: CI Frontend-only with mock API');
  void config;
  
  // Wait for services to be ready
  const baseURL = 'http://localhost:3000';
  
  // Check if frontend is ready
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let retries = 0;
  const maxRetries = process.env.CI ? 60 : 30; // More time in CI
  
  console.log('⏳ Waiting for frontend to be ready...');
  while (retries < maxRetries) {
    try {
      await page.goto(baseURL, { waitUntil: 'load', timeout: 10000 });
      console.log('✅ Frontend is ready');
      break;
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        console.error('❌ Frontend failed to start within timeout');
        console.error('Error details:', error);
        throw error;
      }
      console.log(`⏳ Retrying frontend connection... attempt ${retries}/${maxRetries}`);
      await page.waitForTimeout(3000);
    }
  }
  
  // Skip backend checks in CI - we're using mock API
  console.log('⚡ Skipping backend checks - using mock API system');
  
  // Verify key components load
  console.log('🔍 Verifying RRIO components...');
  try {
    await page.goto(baseURL);
    
    // Wait for main layout to load
    await page.waitForSelector('[data-testid="main-layout"], .terminal-card, main', { timeout: 15000 });
    console.log('✅ Main layout loaded');
    
    // Check for GRII headline or any header component
    await page.waitForSelector('h1, [data-testid="grii-headline"], header', { timeout: 10000 });
    console.log('✅ Header components loaded');
    
  } catch (error) {
    console.warn('⚠️  Some components may not be fully ready:', error);
  }
  
  await browser.close();
  console.log('🎉 Test environment setup complete! Mock API enabled.');
}

export default globalSetup;