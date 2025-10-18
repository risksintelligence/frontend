import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useDataManagement } from '../../hooks/useDataManagement';

interface DataSourcesProps {
  apiUrl?: string;
  onSourceSelect?: (source: string) => void;
}

export default function DataSources({ 
  apiUrl = 'http://localhost:8000',
  onSourceSelect 
}: DataSourcesProps) {
  const {
    sources,
    series,
    loading,
    error,
    fetchSources,
    fetchSeries,
    exportData,
    clearError
  } = useDataManagement(apiUrl);

  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [seriesLimit, setSeriesLimit] = useState<number>(50);

  const handleSourceClick = async (sourceKey: string) => {
    setSelectedSource(sourceKey);
    onSourceSelect?.(sourceKey);
    await fetchSeries(sourceKey, { 
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      search: searchTerm || undefined,
      limit: seriesLimit 
    });
  };

  const handleSeriesSearch = async () => {
    if (selectedSource) {
      await fetchSeries(selectedSource, { 
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined,
        limit: seriesLimit 
      });
    }
  };

  const handleExport = async (sourceKey: string, format: 'json' | 'csv') => {
    await exportData({
      source: sourceKey,
      format,
      series: 'all'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'daily': return <TrendingUp className="w-4 h-4" />;
      case 'weekly': return <BarChart3 className="w-4 h-4" />;
      case 'monthly': case 'quarterly': return <Calendar className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading && !sources) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading data sources...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <div className="text-red-800 font-medium">{error.message}</div>
                {error.details && (
                  <div className="text-red-600 text-sm mt-1">{error.details}</div>
                )}
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary-900">Data Sources</h2>
            <p className="text-sm text-gray-600 mt-1">
              Explore and manage economic, financial, and supply chain data sources
            </p>
          </div>
          
          <button
            onClick={fetchSources}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Sources Overview */}
        {sources && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{sources.total_sources}</div>
              <div className="text-sm text-gray-600">Total Sources</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sources.active_sources}</div>
              <div className="text-sm text-gray-600">Active Sources</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {Object.values(sources.sources).reduce((sum, s) => sum + s.total_series, 0) / 1000}K
              </div>
              <div className="text-sm text-gray-600">Total Series</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {sources.data_coverage.economic_indicators + sources.data_coverage.financial_data}
              </div>
              <div className="text-sm text-gray-600">Coverage Areas</div>
            </div>
          </div>
        )}
      </div>

      {/* Data Sources Grid */}
      {sources && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(sources.sources).map(([sourceKey, source]) => (
            <div 
              key={sourceKey}
              className={`card hover:shadow-lg transition-shadow cursor-pointer ${
                selectedSource === sourceKey ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => handleSourceClick(sourceKey)}
            >
              {/* Source Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Database className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{sourceKey.toUpperCase()}</h3>
                    <div className={`text-xs px-2 py-1 rounded-full border inline-flex items-center ${getStatusColor(source.api_status)}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {source.api_status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Info */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{source.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Series:</span>
                    <div className="font-medium">{formatNumber(source.total_series)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <div className="flex items-center font-medium">
                      {getFrequencyIcon(source.update_frequency)}
                      <span className="ml-1 capitalize">{source.update_frequency}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <span className="text-gray-500 text-sm">Categories:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {source.categories.slice(0, 3).map((category, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {category.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {source.categories.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        +{source.categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Series */}
                <div>
                  <span className="text-gray-500 text-sm">Key Series:</span>
                  <div className="text-xs text-gray-700 mt-1">
                    {source.key_series.slice(0, 2).join(', ')}
                    {source.key_series.length > 2 && '...'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(source.last_update).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(sourceKey, 'csv');
                      }}
                      className="text-xs text-primary-600 hover:text-primary-800"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Series Explorer for Selected Source */}
      {selectedSource && series && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-900">
                {selectedSource.toUpperCase()} - Data Series Explorer
              </h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {series.returned} of {series.total_found} series
                </span>
                <button
                  onClick={() => handleExport(selectedSource, 'csv')}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Export All
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Categories</option>
                {sources?.sources[selectedSource]?.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <select
                value={seriesLimit}
                onChange={(e) => setSeriesLimit(parseInt(e.target.value))}
                className="input flex-1"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              
              <button
                onClick={handleSeriesSearch}
                disabled={loading}
                className="btn-primary px-4"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Series Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Series ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {series.series.map((seriesItem, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {seriesItem.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {seriesItem.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {seriesItem.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {getFrequencyIcon(seriesItem.frequency)}
                        <span className="ml-1 capitalize">{seriesItem.frequency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(seriesItem.start).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        View
                      </button>
                      <button 
                        onClick={() => handleExport(selectedSource, 'csv')}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {series.series.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No series found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
}