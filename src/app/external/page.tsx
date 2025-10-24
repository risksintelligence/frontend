'use client';

import { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Activity,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Building2,
  Users,
  Globe
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error' | 'rate_limited';
  lastSync: string;
  nextSync: string;
  recordsProcessed: number;
  errorCount: number;
  apiKey: boolean;
  rateLimit: {
    limit: number;
    remaining: number;
    resetTime: string;
  };
  dataTypes: string[];
}

interface APICall {
  id: string;
  source: string;
  endpoint: string;
  method: string;
  timestamp: string;
  status: number;
  responseTime: number;
  dataSize: number;
}

export default function ExternalDataSourcesPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [recentCalls, setRecentCalls] = useState<APICall[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  // Simulate real data sources based on backend configuration
  useEffect(() => {
    const loadDataSources = async () => {
      setIsLoading(true);
      
      // Load real data sources from backend
      try {
        const response = await fetch('/api/v1/external/data-sources');
        if (!response.ok) {
          throw new Error('Failed to fetch data sources');
        }
        
        const data = await response.json();
        const realSources: DataSource[] = data.sources || [];
        
        // Fetch recent API calls
        const callsResponse = await fetch('/api/v1/external/recent-calls');
        const callsData = await callsResponse.json();
        const realCalls: APICall[] = callsData.calls || [];

        setDataSources(realSources);
        setRecentCalls(realCalls);
        setLastRefresh(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error loading data sources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDataSources();
  }, []);

  const refreshDataSources = async () => {
    setIsLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rate_limited':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'disconnected':
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
      default:
        return <Database className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'rate_limited': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (sourceId: string) => {
    switch (sourceId) {
      case 'fred': return <TrendingUp className="w-8 h-8 text-blue-600" />;
      case 'bea': return <BarChart3 className="w-8 h-8 text-green-600" />;
      case 'bls': return <Users className="w-8 h-8 text-purple-600" />;
      case 'census': return <Building2 className="w-8 h-8 text-orange-600" />;
      case 'cisa': return <AlertTriangle className="w-8 h-8 text-red-600" />;
      case 'noaa': return <Globe className="w-8 h-8 text-indigo-600" />;
      default: return <Database className="w-8 h-8 text-gray-600" />;
    }
  };

  const connectedSources = dataSources.filter(s => s.status === 'connected').length;
  const totalRecords = dataSources.reduce((sum, source) => sum + source.recordsProcessed, 0);
  const totalErrors = dataSources.reduce((sum, source) => sum + source.errorCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-[#374151]">Loading external data sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">External Data Sources</h1>
              <p className="text-[#374151]">Monitor and manage connections to external data APIs</p>
            </div>
            <button
              onClick={refreshDataSources}
              disabled={isLoading}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2">Last refreshed: {lastRefresh}</p>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Active Sources</h3>
                <p className="text-3xl font-bold text-green-600">{connectedSources}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">of {dataSources.length} total sources</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Records Processed</h3>
                <p className="text-3xl font-bold text-[#374151]">{totalRecords.toLocaleString()}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Total across all sources</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">API Errors</h3>
                <p className="text-3xl font-bold text-red-600">{totalErrors}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Errors in last 24 hours</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Sync Status</h3>
                <p className="text-3xl font-bold text-[#374151]">
                  {Math.round((connectedSources / dataSources.length) * 100)}%
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Overall health score</p>
          </div>
        </div>

        {/* Data Sources List */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e3a8a]">Data Source Status</h2>
            <p className="text-sm text-gray-600 mt-1">Real-time status of all external API connections</p>
          </div>
          
          <div className="overflow-x-auto">
            <div className="space-y-4 p-6">
              {dataSources.map((source) => (
                <div key={source.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getSourceIcon(source.id)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#1e3a8a]">{source.name}</h3>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(source.status)}`}>
                            {source.status.replace('_', ' ')}
                          </span>
                          {source.apiKey && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              API Key Required
                            </span>
                          )}
                        </div>
                        <p className="text-[#374151] mb-3">{source.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium text-[#374151]">Last Sync</p>
                            <p className="text-sm text-gray-600">{new Date(source.lastSync).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#374151]">Next Sync</p>
                            <p className="text-sm text-gray-600">{new Date(source.nextSync).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#374151]">Records Processed</p>
                            <p className="text-sm text-gray-600">{source.recordsProcessed.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 mb-3">
                          <div>
                            <p className="text-sm font-medium text-[#374151]">Rate Limit</p>
                            <p className="text-sm text-gray-600">
                              {source.rateLimit.remaining}/{source.rateLimit.limit} remaining
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#374151]">Errors</p>
                            <p className="text-sm text-gray-600">{source.errorCount} in 24h</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#374151]">Endpoint</p>
                            <a 
                              href={source.endpoint} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            >
                              <span className="truncate max-w-xs">{source.endpoint}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#374151] mb-2">Data Types</p>
                          <div className="flex flex-wrap gap-2">
                            {source.dataTypes.map((type) => (
                              <span 
                                key={type}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(source.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent API Calls */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e3a8a]">Recent API Calls</h2>
            <p className="text-sm text-gray-600 mt-1">Latest API requests and their status</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Timestamp</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Source</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Endpoint</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Response Time</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Data Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 text-sm text-[#374151]">
                      {new Date(call.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-[#374151]">{call.source}</td>
                    <td className="py-3 px-6 text-sm text-gray-600 font-mono">{call.endpoint}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        call.status === 200 
                          ? 'bg-green-100 text-green-800' 
                          : call.status === 429
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{call.responseTime}ms</td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {call.dataSize > 0 ? `${(call.dataSize / 1024).toFixed(1)} KB` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}