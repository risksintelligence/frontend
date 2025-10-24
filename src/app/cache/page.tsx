'use client';

import { useState, useEffect } from 'react';
import { 
  Zap, 
  Database, 
  HardDrive, 
  Clock, 
  TrendingUp,
  Activity,
  RefreshCw,
  Trash2,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Settings,
  Eye,
  Info
} from 'lucide-react';

interface CacheMetrics {
  redis: {
    status: 'connected' | 'disconnected';
    memory_used: number;
    memory_total: number;
    hits: number;
    misses: number;
    hit_rate: number;
    keys_count: number;
    avg_response_time: number;
  };
  postgresql: {
    status: 'connected' | 'disconnected';
    cache_size: number;
    entries_count: number;
    hits: number;
    misses: number;
    hit_rate: number;
    avg_response_time: number;
  };
  file_system: {
    status: 'available' | 'unavailable';
    cache_size: number;
    entries_count: number;
    hits: number;
    misses: number;
    hit_rate: number;
    avg_response_time: number;
  };
  overall: {
    total_requests: number;
    total_hits: number;
    overall_hit_rate: number;
    avg_response_time: number;
    data_freshness: number;
  };
}

interface CacheEntry {
  key: string;
  size: number;
  ttl: number;
  created_at: string;
  last_accessed: string;
  access_count: number;
  tier: 'redis' | 'postgresql' | 'file';
  data_type: string;
}

export default function CacheManagementPage() {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [selectedTier, setSelectedTier] = useState<'all' | 'redis' | 'postgresql' | 'file'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const loadCacheData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch real cache metrics from API
        const response = await fetch('/api/v1/cache/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch cache metrics');
        }
        const data = await response.json();
        setMetrics(data.metrics);

        // Fetch cache entries
        const entriesResponse = await fetch('/api/v1/cache/keys');
        if (!entriesResponse.ok) {
          throw new Error('Failed to fetch cache entries');
        }
        const entriesData = await entriesResponse.json();
        setCacheEntries(entriesData.keys || []);
        setLastRefresh(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error loading cache data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCacheData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadCacheData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/cache/metrics');
      if (!response.ok) {
        throw new Error('Failed to refresh cache metrics');
      }
      const data = await response.json();
      setMetrics(data.metrics);
      
      const entriesResponse = await fetch('/api/v1/cache/keys');
      if (!entriesResponse.ok) {
        throw new Error('Failed to refresh cache entries');
      }
      const entriesData = await entriesResponse.json();
      setCacheEntries(entriesData.keys || []);
      
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error refreshing cache data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async (tier: string) => {
    try {
      const pattern = tier === 'all' ? '*' : `${tier}:*`;
      const response = await fetch(`/api/v1/cache/clear?pattern=${encodeURIComponent(pattern)}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear ${tier} cache`);
      }
      
      setShowClearConfirm(false);
      await refreshCache();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'redis': return <Zap className="w-4 h-4 text-red-500" />;
      case 'postgresql': return <Database className="w-4 h-4 text-blue-500" />;
      case 'file': return <HardDrive className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'redis': return 'bg-red-100 text-red-800';
      case 'postgresql': return 'bg-blue-100 text-blue-800';
      case 'file': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEntries = selectedTier === 'all' 
    ? cacheEntries 
    : cacheEntries.filter(entry => entry.tier === selectedTier);

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-[#374151]">Loading cache management data...</p>
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
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Intelligent Cache Management</h1>
              <p className="text-[#374151]">Monitor and manage the three-tier caching system</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Cache</span>
              </button>
              <button
                onClick={refreshCache}
                disabled={isLoading}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2">Last updated: {lastRefresh}</p>
          )}
        </div>

        {/* Overall Metrics */}
        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Overall Hit Rate</h3>
                    <p className="text-3xl font-bold text-green-600">{metrics.overall.overall_hit_rate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Across all cache tiers</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Response Time</h3>
                    <p className="text-3xl font-bold text-[#374151]">{metrics.overall.avg_response_time.toFixed(1)}ms</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Average across all requests</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Total Requests</h3>
                    <p className="text-3xl font-bold text-[#374151]">{metrics.overall.total_requests.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Since system startup</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Data Freshness</h3>
                    <p className="text-3xl font-bold text-[#374151]">{metrics.overall.data_freshness.toFixed(1)}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Current data quality score</p>
              </div>
            </div>

            {/* Tier Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Redis L1 Cache */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-semibold text-[#1e3a8a]">Redis (L1)</h2>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{((metrics.redis.memory_used / metrics.redis.memory_total) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(metrics.redis.memory_used / metrics.redis.memory_total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatBytes(metrics.redis.memory_used)} / {formatBytes(metrics.redis.memory_total)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Hit Rate</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.redis.hit_rate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Response Time</p>
                      <p className="text-2xl font-bold text-[#374151]">{metrics.redis.avg_response_time.toFixed(1)}ms</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Keys</p>
                      <p className="text-lg font-semibold text-[#374151]">{metrics.redis.keys_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Hits/Misses</p>
                      <p className="text-lg font-semibold text-[#374151]">
                        {metrics.redis.hits.toLocaleString()}/{metrics.redis.misses.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PostgreSQL L2 Cache */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Database className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-[#1e3a8a]">PostgreSQL (L2)</h2>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#374151] mb-2">Cache Size</p>
                    <p className="text-2xl font-bold text-[#374151]">{formatBytes(metrics.postgresql.cache_size)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Hit Rate</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.postgresql.hit_rate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Response Time</p>
                      <p className="text-2xl font-bold text-[#374151]">{metrics.postgresql.avg_response_time.toFixed(1)}ms</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Entries</p>
                      <p className="text-lg font-semibold text-[#374151]">{metrics.postgresql.entries_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Hits/Misses</p>
                      <p className="text-lg font-semibold text-[#374151]">
                        {metrics.postgresql.hits.toLocaleString()}/{metrics.postgresql.misses.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* File System L3 Cache */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-6 h-6 text-green-500" />
                    <h2 className="text-xl font-semibold text-[#1e3a8a]">File System (L3)</h2>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Available</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-[#374151] mb-2">Cache Size</p>
                    <p className="text-2xl font-bold text-[#374151]">{formatBytes(metrics.file_system.cache_size)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Hit Rate</p>
                      <p className="text-2xl font-bold text-green-600">{metrics.file_system.hit_rate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Response Time</p>
                      <p className="text-2xl font-bold text-[#374151]">{metrics.file_system.avg_response_time.toFixed(1)}ms</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Entries</p>
                      <p className="text-lg font-semibold text-[#374151]">{metrics.file_system.entries_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#374151]">Hits/Misses</p>
                      <p className="text-lg font-semibold text-[#374151]">
                        {metrics.file_system.hits.toLocaleString()}/{metrics.file_system.misses.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Cache Entries */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#1e3a8a]">Cache Entries</h2>
                <p className="text-sm text-gray-600 mt-1">Browse and manage cached data entries</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Tiers</option>
                  <option value="redis">Redis (L1)</option>
                  <option value="postgresql">PostgreSQL (L2)</option>
                  <option value="file">File System (L3)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Cache Key</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Tier</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Size</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">TTL</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Last Accessed</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Access Count</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Data Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntries.map((entry, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="py-3 px-6">
                      <span className="text-sm font-mono text-[#374151]">{entry.key}</span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTierColor(entry.tier)}`}>
                        {getTierIcon(entry.tier)}
                        <span className="ml-1">{entry.tier}</span>
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{formatBytes(entry.size)}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{formatDuration(entry.ttl)}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {new Date(entry.last_accessed).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{entry.access_count}</td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded">
                        {entry.data_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clear Cache Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <h3 className="text-lg font-semibold text-[#1e3a8a]">Clear Cache</h3>
              </div>
              <p className="text-[#374151] mb-6">
                Are you sure you want to clear the cache? This will remove all cached data and may temporarily impact system performance.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => clearCache('all')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear All Cache
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Technical Information */}
        <div className="mt-8 bg-slate-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Cache Architecture Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Three-Tier Strategy</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>L1 (Redis):</strong> Ultra-fast in-memory cache (&lt;5ms)</li>
                <li>• <strong>L2 (PostgreSQL):</strong> Persistent database cache (&lt;20ms)</li>
                <li>• <strong>L3 (File System):</strong> Long-term disk cache (&lt;100ms)</li>
                <li>• Automatic fallback between tiers</li>
                <li>• Background refresh workers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Performance Benefits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Zero external API calls for cached data</li>
                <li>• Graceful degradation during API failures</li>
                <li>• Intelligent cache warming and eviction</li>
                <li>• Rate limit protection</li>
                <li>• Sub-10ms response times for hot data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}