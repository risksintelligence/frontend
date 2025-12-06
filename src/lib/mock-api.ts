/**
 * Mock API System for CI Tests
 * 100% isolated from production - uses only fake data
 */

// Mock data responses - completely fake, never touches real systems
export const MOCK_RESPONSES = {
  // Analytics endpoints
  '/api/v1/analytics/geri': {
    geri_score: 75.3,
    trend: 'stable',
    last_updated: '2024-12-06T12:00:00Z',
    components: {
      financial_stability: 78.2,
      trade_resilience: 72.4,
      supply_chain_health: 75.9
    },
    status: 'mock_data'
  },

  '/api/v1/analytics/components': {
    financial_health: { score: 78.5, trend: 'improving' },
    trade_stress: { score: 65.2, trend: 'stable' },
    supply_chain: { score: 82.1, trend: 'improving' },
    status: 'mock_data'
  },

  '/api/v1/analytics/economic': {
    gdp_growth: 2.3,
    inflation: 3.1,
    unemployment: 5.7,
    indicators: [
      { name: 'GDP Growth', value: 2.3, trend: 'positive' },
      { name: 'Inflation', value: 3.1, trend: 'stable' },
      { name: 'Unemployment', value: 5.7, trend: 'improving' }
    ],
    status: 'mock_data'
  },

  // AI endpoints
  '/api/v1/ai/forecast/next-24h': {
    forecast: {
      risk_level: 'moderate',
      confidence: 0.85,
      predicted_score: 74.8,
      factors: ['Market volatility', 'Supply chain delays']
    },
    status: 'mock_data'
  },

  '/api/v1/ai/regime/current': {
    regime: 'stable_growth',
    confidence: 0.92,
    duration_days: 45,
    characteristics: ['Low volatility', 'Steady growth', 'Stable inflation'],
    status: 'mock_data'
  },

  '/api/v1/ai/explainability': {
    top_factors: [
      { factor: 'Trade Balance', impact: 0.23, direction: 'positive' },
      { factor: 'Market Volatility', impact: -0.18, direction: 'negative' },
      { factor: 'Supply Chain Health', impact: 0.15, direction: 'positive' }
    ],
    status: 'mock_data'
  },

  // Impact endpoints
  '/api/v1/impact/partners': {
    partners: [
      {
        name: 'Mock University',
        type: 'academic',
        status: 'active',
        projects: ['Economic Modeling', 'Risk Analysis']
      },
      {
        name: 'Mock Financial Corp',
        type: 'industry',
        status: 'active',
        projects: ['Market Intelligence']
      }
    ],
    status: 'mock_data'
  },

  '/api/v1/impact/ras': {
    total_assessments: 156,
    completed: 134,
    in_progress: 22,
    success_rate: 0.89,
    avg_completion_time: 12.5,
    status: 'mock_data'
  },

  '/api/v1/impact/ras/history': {
    history: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      assessments: Math.floor(Math.random() * 10) + 5,
      completed: Math.floor(Math.random() * 8) + 3
    })),
    status: 'mock_data'
  },

  // Anomalies endpoints
  '/api/v1/anomalies/latest': {
    anomalies: [
      {
        id: 'mock_001',
        type: 'market_volatility',
        severity: 'medium',
        description: 'Mock anomaly for testing',
        timestamp: new Date().toISOString(),
        confidence: 0.87
      }
    ],
    status: 'mock_data'
  },

  '/api/v1/anomalies/history': {
    anomalies: Array.from({ length: 10 }, (_, i) => ({
      id: `mock_${i + 1}`,
      type: 'test_anomaly',
      severity: ['low', 'medium', 'high'][i % 3],
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    })),
    status: 'mock_data'
  },

  // Monitoring endpoints
  '/api/v1/monitoring/provider-health': {
    providers: {
      world_bank: { status: 'healthy', last_update: '2024-12-06T12:00:00Z' },
      fred: { status: 'healthy', last_update: '2024-12-06T12:00:00Z' },
      wto_statistics: { status: 'healthy', last_update: '2024-12-06T12:00:00Z' }
    },
    overall_health: 'good',
    status: 'mock_data'
  },

  '/api/v1/transparency/data-freshness': {
    freshness: {
      economic_data: '2 hours ago',
      market_data: '15 minutes ago',
      geopolitical_data: '1 hour ago'
    },
    status: 'mock_data'
  },

  '/api/v1/monitoring/series-freshness/history': {
    series: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      freshness_score: Math.random() * 100
    })),
    status: 'mock_data'
  },

  // ML endpoints
  '/api/v1/ml/insights/summary': {
    insights: [
      {
        type: 'trend_analysis',
        description: 'Mock trend insight for testing',
        confidence: 0.91
      },
      {
        type: 'risk_prediction',
        description: 'Mock risk insight for testing',
        confidence: 0.84
      }
    ],
    status: 'mock_data'
  },

  // Communication endpoints
  '/api/v1/communication/newsletter-status': {
    subscribers: 1250,
    last_sent: '2024-12-01T09:00:00Z',
    open_rate: 0.73,
    status: 'mock_data'
  },

  // Additional endpoints for pages
  '/api/v1/analytics/export/awards-metrics': {
    platform_metrics: {
      total_estimated_users: 2450,
      total_sessions: 12850,
      platform_age_days: 180,
      average_user_rating: 4.7
    },
    feature_adoption: {
      grii_analysis: 1850,
      monte_carlo_simulations: 950,
      stress_testing: 720,
      explainability_analysis: 1200,
      network_analysis: 680,
      data_exports: 340
    },
    geographic_reach: {
      countries_served: 45
    },
    status: 'mock_data'
  },

  '/api/v1/analytics/overview': {
    page_views: 18750,
    unique_visitors: 5240,
    bounce_rate: 0.24,
    avg_session_duration: 385,
    top_pages: [
      { path: '/dashboard', views: 5240 },
      { path: '/analytics', views: 3180 },
      { path: '/simulation', views: 2140 }
    ],
    status: 'mock_data'
  },

  '/api/v1/simulation/scenarios': {
    stress_scenarios: {
      supply_chain_disruption: { severity: 'high' },
      market_volatility: { severity: 'medium' },
      geopolitical_crisis: { severity: 'critical' }
    },
    monte_carlo_params: {
      default_iterations: 10000
    },
    updated_at: '2024-12-06T12:00:00Z',
    status: 'mock_data'
  },

  // Network endpoints
  '/api/v1/network/supply-cascade': {
    nodes: [
      { id: 'mock_node_1', name: 'Mock Supplier', risk_score: 25 },
      { id: 'mock_node_2', name: 'Mock Distributor', risk_score: 35 }
    ],
    edges: [
      { source: 'mock_node_1', target: 'mock_node_2', weight: 0.8 }
    ],
    status: 'mock_data'
  },

  '/api/v1/network/cascade/impacts': {
    impacts: [
      {
        source: 'mock_disruption',
        affected_sectors: ['manufacturing', 'retail'],
        economic_impact: 125000000
      }
    ],
    status: 'mock_data'
  },

  // WTO endpoints (that were causing 500 errors)
  '/api/v1/wto/trade-volume/global': {
    total_volume: 12500000000,
    growth_rate: 0.023,
    top_traders: [
      { country: 'USA', volume: 1500000000 },
      { country: 'China', volume: 1400000000 },
      { country: 'Germany', volume: 850000000 }
    ],
    status: 'mock_data'
  },

  // Intelligence endpoints (404s)
  '/api/v1/intel/sp-global/vulnerabilities': {
    vulnerabilities: [
      {
        sector: 'technology',
        risk_level: 'medium',
        description: 'Mock vulnerability for testing'
      }
    ],
    status: 'mock_data'
  },

  // Page view tracking
  '/api/v1/analytics/page-view': {
    success: true,
    status: 'mock_data'
  },

  // Geopolitical endpoints
  '/api/v1/geopolitical/disruptions': {
    disruptions: [
      {
        id: 'mock_geo_1',
        type: 'trade_restriction',
        severity: 'medium',
        affected_regions: ['Asia-Pacific'],
        description: 'Mock geopolitical disruption for testing'
      }
    ],
    status: 'mock_data'
  },

  // Maritime endpoints
  '/api/v1/maritime/health': {
    ports: [
      { name: 'Mock Port', status: 'operational', congestion: 0.25 }
    ],
    overall_health: 'good',
    status: 'mock_data'
  },

  // Data lineage endpoints
  '/api/v1/monitoring/data-lineage/VIX': {
    lineage: {
      source: 'Mock Data Provider',
      last_updated: '2024-12-06T12:00:00Z',
      quality_score: 0.95
    },
    status: 'mock_data'
  }
};

// Mock fetch function
export function createMockFetch(): typeof fetch {
  return async function mockFetch(url: string | URL | Request): Promise<Response> {
    const urlString = url.toString();
    
    // Extract the path from the URL
    const urlObj = new URL(urlString, 'http://localhost');
    const path = urlObj.pathname + urlObj.search;
    
    // Find matching mock response
    let mockData = null;
    
    // Try exact match first
    if (MOCK_RESPONSES[path as keyof typeof MOCK_RESPONSES]) {
      mockData = MOCK_RESPONSES[path as keyof typeof MOCK_RESPONSES];
    } else {
      // Try partial matches for dynamic endpoints
      for (const [mockPath, response] of Object.entries(MOCK_RESPONSES)) {
        if (path.includes(mockPath) || mockPath.includes(path.split('?')[0])) {
          mockData = response;
          break;
        }
      }
    }
    
    // If no mock found, return 404
    if (!mockData) {
      console.log(`[MOCK] No mock data for: ${path} - returning 404`);
      return new Response(JSON.stringify({ 
        error: 'Not Found', 
        message: `Mock endpoint not configured for ${path}`,
        status: 'mock_data'
      }), {
        status: 404,
        statusText: 'Not Found',
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`[MOCK] Serving mock data for: ${path}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    
    return new Response(JSON.stringify(mockData), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' }
    });
  };
}

// Check if we should use mock API
export function shouldUseMockApi(): boolean {
  // Use mock in CI environment
  if (process.env.CI === 'true') {
    return true;
  }
  
  // Use mock if explicitly enabled
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
    return true;
  }
  
  // Use mock if we're in test mode
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  
  return false;
}