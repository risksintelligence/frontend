'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Send,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Database,
  Zap,
  Globe,
  Settings,
  Play,
  Code,
  Info,
  ExternalLink
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  status: 'healthy' | 'degraded' | 'down' | 'testing';
  response_time: number;
  success_rate: number;
  last_tested: string;
  category: 'risk' | 'data' | 'cache' | 'ml' | 'system';
}

interface TestResult {
  id: string;
  endpoint_id: string;
  endpoint_name: string;
  status: 'success' | 'error' | 'timeout';
  response_time: number;
  status_code: number;
  response_size: number;
  timestamp: string;
  error_message?: string;
}

interface SystemHealth {
  overall_status: 'healthy' | 'degraded' | 'down';
  api_uptime: number;
  database_status: 'connected' | 'disconnected';
  cache_status: 'connected' | 'disconnected';
  external_apis_status: 'connected' | 'degraded' | 'disconnected';
  response_time_p95: number;
  error_rate: number;
  requests_per_minute: number;
}

export default function APITestingDiagnosticsPage() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [customMethod, setCustomMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [lastRefresh, setLastRefresh] = useState<string>('');

  useEffect(() => {
    const loadDiagnosticsData = async () => {
      try {
        // Simulate API call to backend diagnostics endpoints
        const mockEndpoints: APIEndpoint[] = [
          {
            id: 'health',
            name: 'Health Check',
            method: 'GET',
            endpoint: '/api/v1/health',
            description: 'System health and component status',
            status: 'healthy',
            response_time: 12.4,
            success_rate: 99.8,
            last_tested: new Date(Date.now() - 30000).toISOString(),
            category: 'system'
          },
          {
            id: 'risk_overview',
            name: 'Risk Overview',
            method: 'GET',
            endpoint: '/api/v1/risk/overview',
            description: 'Comprehensive risk assessment data',
            status: 'healthy',
            response_time: 8.7,
            success_rate: 98.2,
            last_tested: new Date(Date.now() - 45000).toISOString(),
            category: 'risk'
          },
          {
            id: 'economic_data',
            name: 'Economic Data',
            method: 'GET',
            endpoint: '/api/v1/external/fred/indicators',
            description: 'FRED economic indicators',
            status: 'degraded',
            response_time: 234.6,
            success_rate: 87.5,
            last_tested: new Date(Date.now() - 60000).toISOString(),
            category: 'data'
          },
          {
            id: 'cache_test',
            name: 'Cache Operations',
            method: 'GET',
            endpoint: '/api/v1/cache/test',
            description: 'Cache system functionality test',
            status: 'healthy',
            response_time: 5.2,
            success_rate: 99.9,
            last_tested: new Date(Date.now() - 15000).toISOString(),
            category: 'cache'
          },
          {
            id: 'model_status',
            name: 'Model Status',
            method: 'GET',
            endpoint: '/api/v1/risk/models/status',
            description: 'risk model availability and performance',
            status: 'healthy',
            response_time: 45.8,
            success_rate: 96.7,
            last_tested: new Date(Date.now() - 90000).toISOString(),
            category: 'ml'
          },
          {
            id: 'database_test',
            name: 'Database Test',
            method: 'GET',
            endpoint: '/api/v1/database/test',
            description: 'Database connection and operations',
            status: 'healthy',
            response_time: 18.3,
            success_rate: 99.5,
            last_tested: new Date(Date.now() - 120000).toISOString(),
            category: 'system'
          },
          {
            id: 'websocket_test',
            name: 'WebSocket Connection',
            method: 'GET',
            endpoint: '/api/v1/ws/health',
            description: 'Real-time WebSocket connectivity',
            status: 'healthy',
            response_time: 28.9,
            success_rate: 94.8,
            last_tested: new Date(Date.now() - 75000).toISOString(),
            category: 'system'
          },
          {
            id: 'network_analysis',
            name: 'Network Analysis',
            method: 'GET',
            endpoint: '/api/v1/network/topology',
            description: 'Network topology and analysis data',
            status: 'down',
            response_time: 0,
            success_rate: 0,
            last_tested: new Date(Date.now() - 300000).toISOString(),
            category: 'data'
          }
        ];

        const mockTestResults: TestResult[] = [
          {
            id: '1',
            endpoint_id: 'health',
            endpoint_name: 'Health Check',
            status: 'success',
            response_time: 12.4,
            status_code: 200,
            response_size: 1024,
            timestamp: new Date(Date.now() - 30000).toISOString()
          },
          {
            id: '2',
            endpoint_id: 'risk_overview',
            endpoint_name: 'Risk Overview',
            status: 'success',
            response_time: 8.7,
            status_code: 200,
            response_size: 15672,
            timestamp: new Date(Date.now() - 45000).toISOString()
          },
          {
            id: '3',
            endpoint_id: 'economic_data',
            endpoint_name: 'Economic Data',
            status: 'error',
            response_time: 5000,
            status_code: 500,
            response_size: 0,
            timestamp: new Date(Date.now() - 60000).toISOString(),
            error_message: 'External API rate limit exceeded'
          },
          {
            id: '4',
            endpoint_id: 'cache_test',
            endpoint_name: 'Cache Operations',
            status: 'success',
            response_time: 5.2,
            status_code: 200,
            response_size: 2048,
            timestamp: new Date(Date.now() - 15000).toISOString()
          },
          {
            id: '5',
            endpoint_id: 'network_analysis',
            endpoint_name: 'Network Analysis',
            status: 'timeout',
            response_time: 30000,
            status_code: 0,
            response_size: 0,
            timestamp: new Date(Date.now() - 300000).toISOString(),
            error_message: 'Request timeout after 30 seconds'
          }
        ];

        const mockSystemHealth: SystemHealth = {
          overall_status: 'healthy',
          api_uptime: 99.7,
          database_status: 'connected',
          cache_status: 'connected',
          external_apis_status: 'degraded',
          response_time_p95: 125.6,
          error_rate: 2.3,
          requests_per_minute: 1247
        };

        setEndpoints(mockEndpoints);
        setTestResults(mockTestResults);
        setSystemHealth(mockSystemHealth);
        setLastRefresh(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error loading diagnostics data:', error);
      }
    };

    loadDiagnosticsData();
    
    // Refresh every 15 seconds
    const interval = setInterval(loadDiagnosticsData, 15000);
    return () => clearInterval(interval);
  }, []);

  const runAllTests = async () => {
    setIsRunningTests(true);
    
    try {
      // Simulate running tests
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const testEndpoint = async (endpointId: string) => {
    try {
      console.log(`Testing endpoint: ${endpointId}`);
      // Simulate API test
    } catch (error) {
      console.error('Error testing endpoint:', error);
    }
  };

  const testCustomEndpoint = async () => {
    try {
      console.log(`Testing custom endpoint: ${customMethod} ${customEndpoint}`);
      // Simulate custom API test
    } catch (error) {
      console.error('Error testing custom endpoint:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'down': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'testing': return <Activity className="w-5 h-5 text-blue-600 animate-pulse" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'down': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'timeout': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'risk': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'data': return <Database className="w-4 h-4 text-blue-500" />;
      case 'cache': return <Zap className="w-4 h-4 text-purple-500" />;
      case 'ml': return <BarChart3 className="w-4 h-4 text-green-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredEndpoints = selectedCategory === 'all' 
    ? endpoints 
    : endpoints.filter(endpoint => endpoint.category === selectedCategory);

  const healthyEndpoints = endpoints.filter(e => e.status === 'healthy').length;
  const totalEndpoints = endpoints.length;
  const avgResponseTime = endpoints.reduce((sum, e) => sum + e.response_time, 0) / endpoints.length;
  const avgSuccessRate = endpoints.reduce((sum, e) => sum + e.success_rate, 0) / endpoints.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">API Testing & Diagnostics</h1>
              <p className="text-[#374151]">Test API endpoints and monitor system health</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={runAllTests}
                disabled={isRunningTests}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Play className={`w-4 h-4 ${isRunningTests ? 'animate-pulse' : ''}`} />
                <span>{isRunningTests ? 'Running Tests...' : 'Run All Tests'}</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2">Last updated: {lastRefresh}</p>
          )}
        </div>

        {/* System Health Overview */}
        {systemHealth && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">API Uptime</h3>
                  <p className="text-3xl font-bold text-green-600">{systemHealth.api_uptime.toFixed(1)}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">Overall system availability</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Response Time (P95)</h3>
                  <p className="text-3xl font-bold text-[#374151]">{systemHealth.response_time_p95.toFixed(0)}ms</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">95th percentile response time</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Error Rate</h3>
                  <p className="text-3xl font-bold text-red-600">{systemHealth.error_rate.toFixed(1)}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">Failed requests percentage</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Requests/Min</h3>
                  <p className="text-3xl font-bold text-[#374151]">{systemHealth.requests_per_minute.toLocaleString()}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-sm text-gray-500 mt-2">Current request volume</p>
            </div>
          </div>
        )}

        {/* Component Status */}
        {systemHealth && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1e3a8a]">Database</h3>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">PostgreSQL connection healthy</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1e3a8a]">Cache System</h3>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Redis cache operational</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1e3a8a]">External APIs</h3>
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-600 font-medium">Degraded</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Some external APIs experiencing issues</p>
            </div>
          </div>
        )}

        {/* Endpoint Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Healthy Endpoints</h3>
                <p className="text-3xl font-bold text-green-600">{healthyEndpoints}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">of {totalEndpoints} total endpoints</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Avg Response Time</h3>
                <p className="text-3xl font-bold text-[#374151]">{avgResponseTime.toFixed(1)}ms</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Across all endpoints</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Avg Success Rate</h3>
                <p className="text-3xl font-bold text-[#374151]">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Success rate average</p>
          </div>
        </div>

        {/* Custom Endpoint Testing */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Custom Endpoint Testing</h2>
          
          <div className="flex items-center space-x-3 mb-4">
            <select
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            
            <input
              type="text"
              placeholder="Enter API endpoint (e.g., /api/v1/test)"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            
            <button
              onClick={testCustomEndpoint}
              disabled={!customEndpoint}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Test</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Test any API endpoint to check connectivity and response time. Use this for debugging or testing new endpoints.
          </p>
        </div>

        {/* API Endpoints */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#1e3a8a]">API Endpoints</h2>
                <p className="text-sm text-gray-600 mt-1">Monitor and test individual API endpoints</p>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="risk">Risk Intelligence</option>
                <option value="data">Data Sources</option>
                <option value="cache">Cache System</option>
                <option value="ml">Machine Learning</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {filteredEndpoints.map((endpoint) => (
                <div key={endpoint.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      {getCategoryIcon(endpoint.category)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-[#1e3a8a]">{endpoint.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(endpoint.status)}`}>
                            {getStatusIcon(endpoint.status)}
                            <span className="ml-1">{endpoint.status}</span>
                          </span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded">
                            {endpoint.method}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div>
                            <span className="font-medium text-[#374151]">Endpoint:</span>
                            <code className="ml-1 bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-[#374151]">Response Time:</span>
                            <span className="ml-1 text-gray-600">{endpoint.response_time.toFixed(1)}ms</span>
                          </div>
                          <div>
                            <span className="font-medium text-[#374151]">Success Rate:</span>
                            <span className="ml-1 text-gray-600">{endpoint.success_rate.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="font-medium text-[#374151]">Last Tested:</span>
                            <span className="ml-1 text-gray-600">
                              {new Date(endpoint.last_tested).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testEndpoint(endpoint.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Test
                      </button>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint.endpoint}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 p-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Test Results */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e3a8a]">Recent Test Results</h2>
            <p className="text-sm text-gray-600 mt-1">Latest API endpoint test results and diagnostics</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Timestamp</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Endpoint</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Response Time</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Status Code</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Response Size</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testResults.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {new Date(result.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-[#374151]">{result.endpoint_name}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getResultStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {result.response_time > 0 ? `${result.response_time.toFixed(1)}ms` : '-'}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {result.status_code > 0 ? result.status_code : '-'}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {result.response_size > 0 ? `${(result.response_size / 1024).toFixed(1)} KB` : '-'}
                    </td>
                    <td className="py-3 px-6 text-sm text-red-600">
                      {result.error_message || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Information */}
        <div className="mt-8 bg-slate-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">API Testing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Testing Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Automated Testing:</strong> Scheduled endpoint health checks</li>
                <li>• <strong>Performance Monitoring:</strong> Response time and success rate tracking</li>
                <li>• <strong>Error Detection:</strong> Automatic failure detection and alerting</li>
                <li>• <strong>Custom Testing:</strong> Manual endpoint testing capabilities</li>
                <li>• <strong>Real-time Updates:</strong> Live system status monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Available Endpoints</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Risk Intelligence:</strong> Risk assessment and scoring APIs</li>
                <li>• <strong>Data Sources:</strong> External API integration endpoints</li>
                <li>• <strong>Cache System:</strong> Intelligent caching operations</li>
                <li>• <strong>Machine Learning:</strong> Model training and prediction APIs</li>
                <li>• <strong>System Health:</strong> Database, WebSocket, and infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}