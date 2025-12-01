# RRIO Monitoring and Logging Setup

## Overview
The RRIO frontend implements comprehensive monitoring using Sentry for error tracking, performance monitoring, and user analytics. This ensures Bloomberg-grade reliability and observability for the financial intelligence platform.

## Sentry Configuration

### 1. Environment Setup
Create a `.env.local` file based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env.local

# Add your Sentry DSN
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 2. Sentry Project Setup
1. Create a new Sentry project for RRIO Frontend
2. Copy the DSN from project settings
3. Configure release tracking for deployment monitoring

### 3. Configuration Files
- `sentry.client.config.ts` - Client-side error tracking and performance monitoring
- `sentry.server.config.ts` - Server-side API route monitoring  
- `sentry.edge.config.ts` - Edge runtime monitoring for middleware

## Monitoring Features

### Error Tracking
```typescript
import { rrio, RRIOErrorType } from '@/lib/monitoring';

// Log RRIO-specific errors with context
rrio.logError(
  new Error('GRII calculation failed'),
  RRIOErrorType.DATA_QUALITY,
  {
    component: 'RiskOverview',
    riskScore: 65,
    dataSource: 'backend_api',
    cacheLayer: 'L1'
  }
);
```

### Performance Monitoring
```typescript
import { timeOperation, rrio } from '@/lib/monitoring';

// Time critical operations
const result = await timeOperation(
  'fetch-grii-data',
  () => fetchGRIIData(),
  { component: 'Dashboard', cacheLayer: 'L1' }
);

// Track manual performance metrics
rrio.trackPerformance('chart-render', 150, {
  component: 'RealTimeChart',
  dataPoints: 100
});
```

### User Interaction Tracking
```typescript
// Track user actions for UX insights
rrio.trackUserAction('export-report', 'RiskDashboard', {
  reportType: 'pdf',
  riskLevel: 'high'
});
```

### Cache Performance Monitoring
```typescript
// Track RRIO's 3-tier cache system
rrio.trackCacheEvent('hit', 'L1', 'grii-data');
rrio.trackCacheEvent('miss', 'L2', 'network-topology');
```

### API Monitoring
```typescript
// Automatic API call tracking in realTimeDataService.ts
rrio.trackAPICall('/api/v1/analytics/geri', 'GET', 200, 250, {
  cacheLayer: 'L1',
  dataSource: 'backend_api'
});
```

## Component-Level Monitoring

### Using the Error Handler Hook
```typescript
import { useRRIOErrorHandler } from '@/lib/monitoring';

function RiskDashboard() {
  const { logError, trackAction, trackPerformance } = useRRIOErrorHandler('RiskDashboard');
  
  const handleExport = async () => {
    try {
      trackAction('export-initiated');
      const start = performance.now();
      
      await exportRiskReport();
      
      trackPerformance('export-report', performance.now() - start);
      trackAction('export-completed');
    } catch (error) {
      logError(error, { action: 'export-report' });
    }
  };
  
  return (
    <button onClick={handleExport}>
      Export Risk Report
    </button>
  );
}
```

## Data Quality Monitoring

```typescript
// Track data quality issues
rrio.trackDataQuality(
  'Missing GRII components data',
  'backend-api',
  'medium',
  {
    component: 'ComponentsCard',
    expectedFields: ['economic', 'market', 'geopolitical'],
    missingFields: ['technical']
  }
);
```

## Alerts and Dashboards

### Sentry Alerts
Configure alerts for:
- API error rate > 5%
- Page load time > 3 seconds
- JavaScript errors in production
- Cache miss rate > 20%

### Custom Dashboards
Monitor:
- RRIO-specific error trends
- Performance metrics by component
- User interaction patterns
- Cache performance across L1/L2/L3 tiers
- Data quality metrics

### Bloomberg-Grade SLAs
- **Page Load Time**: < 2 seconds (95th percentile)
- **API Response Time**: < 500ms (95th percentile)  
- **Error Rate**: < 0.1% in production
- **Cache Hit Rate**: > 80% for L1 Redis

## Production Deployment

### 1. Sentry Release Tracking
```bash
# Create release
npx @sentry/wizard -i nextjs

# Deploy with release tracking
NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA=$(git rev-parse HEAD) npm run build
```

### 2. Environment Variables
```bash
# Production environment
NEXT_PUBLIC_SENTRY_DSN=https://prod-dsn@sentry.io/project
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

### 3. Performance Budget
Set performance budgets in Sentry:
- Largest Contentful Paint < 2.5s
- First Input Delay < 100ms  
- Cumulative Layout Shift < 0.1

## Troubleshooting

### Common Issues
1. **Missing Sentry DSN**: Check environment variables
2. **High error volume**: Review error filtering in config
3. **Performance issues**: Check `tracesSampleRate` setting
4. **Missing context**: Ensure error boundaries wrap components

### Debug Mode
```bash
# Run with Sentry debug logging
SENTRY_LOG_LEVEL=debug npm run dev
```

## Integration with Error Boundaries

The ErrorBoundary component automatically integrates with Sentry:

```typescript
<ErrorBoundary 
  context="RiskDashboard"
  onError={(error, errorInfo) => {
    rrio.logError(error, RRIOErrorType.USER_ACTION, {
      component: 'RiskDashboard',
      errorInfo: errorInfo.componentStack
    });
  }}
>
  <RiskDashboard />
</ErrorBoundary>
```

This setup ensures comprehensive monitoring of the RRIO platform with Bloomberg-grade reliability and observability standards.