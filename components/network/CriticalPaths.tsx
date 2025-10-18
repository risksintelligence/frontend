import React, { useState, useEffect } from 'react';
import { Route, AlertTriangle, TrendingUp, RefreshCw, Eye, MapPin } from 'lucide-react';
import { useNetworkAnalysis } from '../../hooks/useNetworkAnalysis';

interface CriticalPathsProps {
  apiUrl: string;
}

export const CriticalPaths: React.FC<CriticalPathsProps> = ({
  apiUrl
}) => {
  const { criticalPaths, loading, error, fetchCriticalPaths, clearError } = useNetworkAnalysis(apiUrl);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'risk' | 'length' | 'name'>('risk');

  useEffect(() => {
    fetchCriticalPaths();
  }, [fetchCriticalPaths]);

  const getRiskColor = (risk: number) => {
    if (risk >= 0.8) return 'text-red-600 bg-red-100 border-red-200';
    if (risk >= 0.6) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (risk >= 0.4) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 0.8) return 'Critical';
    if (risk >= 0.6) return 'High';
    if (risk >= 0.4) return 'Medium';
    return 'Low';
  };

  const getBottleneckSeverity = (score: number) => {
    if (score >= 0.8) return { label: 'Severe', color: 'text-red-600' };
    if (score >= 0.6) return { label: 'Moderate', color: 'text-orange-600' };
    if (score >= 0.4) return { label: 'Minor', color: 'text-yellow-600' };
    return { label: 'Minimal', color: 'text-green-600' };
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1);
  };

  const sortedPaths = [...criticalPaths].sort((a, b) => {
    switch (sortBy) {
      case 'risk':
        return b.total_risk - a.total_risk;
      case 'length':
        return b.path_length - a.path_length;
      case 'name':
        return a.path_name.localeCompare(b.path_name);
      default:
        return 0;
    }
  });

  const selectedPathDetails = selectedPath 
    ? criticalPaths.find(p => p.path_id === selectedPath)
    : null;

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading critical paths...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 mb-2">Error loading critical paths</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (criticalPaths.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Critical Paths</h3>
            <p className="text-gray-600">No critical paths have been identified in the network.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Route className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Critical Path Analysis</h3>
                <p className="text-sm text-gray-600">
                  Analysis of critical dependency paths and potential bottlenecks
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="risk">Sort by Risk</option>
                <option value="length">Sort by Length</option>
                <option value="name">Sort by Name</option>
              </select>
              <button
                onClick={fetchCriticalPaths}
                disabled={loading}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{criticalPaths.length}</div>
              <div className="text-sm text-gray-600">Critical Paths</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {criticalPaths.filter(p => p.total_risk >= 0.8).length}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {criticalPaths.reduce((sum, p) => sum + p.bottlenecks.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Bottlenecks</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {criticalPaths.length > 0 
                  ? (criticalPaths.reduce((sum, p) => sum + p.path_length, 0) / criticalPaths.length).toFixed(1)
                  : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Avg Path Length</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Paths List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Critical Paths</h4>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paths List */}
            <div className="space-y-3">
              {sortedPaths.map((path) => (
                <div
                  key={path.path_id}
                  onClick={() => setSelectedPath(path.path_id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPath === path.path_id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{path.path_name}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getRiskColor(path.total_risk)}`}>
                        {getRiskLevel(path.total_risk)}
                      </span>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Length:</span>
                      <div className="font-medium">{path.path_length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk:</span>
                      <div className="font-medium">{formatScore(path.total_risk)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Bottlenecks:</span>
                      <div className="font-medium">{path.bottlenecks.length}</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {path.nodes.length} nodes • {path.edges.length} edges
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Risk Level</span>
                      <span>{formatScore(path.total_risk)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          path.total_risk >= 0.8 ? 'bg-red-500' :
                          path.total_risk >= 0.6 ? 'bg-orange-500' :
                          path.total_risk >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${path.total_risk * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Path Details */}
            <div>
              {selectedPathDetails ? (
                <div className="space-y-4">
                  {/* Path Overview */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">{selectedPathDetails.path_name}</h5>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-600">Path Length</div>
                        <div className="text-lg font-bold text-gray-900">{selectedPathDetails.path_length}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-600">Total Risk</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatScore(selectedPathDetails.total_risk)}%
                        </div>
                      </div>
                    </div>

                    {/* Path Visualization */}
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Path Flow</h6>
                      <div className="flex items-center space-x-1 text-xs overflow-x-auto">
                        {selectedPathDetails.nodes.map((nodeId, index) => (
                          <React.Fragment key={nodeId}>
                            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                              {nodeId}
                            </div>
                            {index < selectedPathDetails.nodes.length - 1 && (
                              <div className="text-gray-400">→</div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottlenecks */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h6 className="font-medium text-gray-900 mb-3">Bottlenecks</h6>
                    {selectedPathDetails.bottlenecks.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPathDetails.bottlenecks.map((bottleneck) => {
                          const severity = getBottleneckSeverity(bottleneck.bottleneck_score);
                          return (
                            <div key={bottleneck.node_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium text-sm">{bottleneck.node_id}</div>
                                <div className="text-xs text-gray-600">
                                  Capacity: {formatScore(bottleneck.capacity_utilization)}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-bold ${severity.color}`}>
                                  {severity.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatScore(bottleneck.bottleneck_score)}%
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No bottlenecks identified
                      </div>
                    )}
                  </div>

                  {/* Alternative Paths */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h6 className="font-medium text-gray-900 mb-3">Alternative Paths</h6>
                    {selectedPathDetails.alternative_paths.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPathDetails.alternative_paths.slice(0, 3).map((altPath, index) => (
                          <div key={altPath.path_id} className="p-2 bg-gray-50 rounded">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">Alternative #{index + 1}</div>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className="text-gray-600">
                                  Cost: +{formatScore(altPath.cost_multiplier - 1)}%
                                </span>
                                <span className="text-gray-600">
                                  Reliability: {formatScore(altPath.reliability_score)}%
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {altPath.nodes.length} nodes
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No alternative paths available
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">Select a path to view detailed analysis</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis Summary */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">Risk Analysis Summary</h4>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* High Risk Paths */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600 font-medium mb-2">High Risk Paths</div>
              <div className="text-2xl font-bold text-red-700">
                {criticalPaths.filter(p => p.total_risk >= 0.8).length}
              </div>
              <div className="text-sm text-red-600">Require immediate attention</div>
            </div>

            {/* Medium Risk Paths */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-orange-600 font-medium mb-2">Medium Risk Paths</div>
              <div className="text-2xl font-bold text-orange-700">
                {criticalPaths.filter(p => p.total_risk >= 0.4 && p.total_risk < 0.8).length}
              </div>
              <div className="text-sm text-orange-600">Monitor closely</div>
            </div>

            {/* Critical Bottlenecks */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-yellow-600 font-medium mb-2">Critical Bottlenecks</div>
              <div className="text-2xl font-bold text-yellow-700">
                {criticalPaths.reduce((sum, p) => 
                  sum + p.bottlenecks.filter(b => b.bottleneck_score >= 0.8).length, 0
                )}
              </div>
              <div className="text-sm text-yellow-600">Need capacity expansion</div>
            </div>

            {/* Alternative Options */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-600 font-medium mb-2">Alternative Options</div>
              <div className="text-2xl font-bold text-green-700">
                {criticalPaths.reduce((sum, p) => sum + p.alternative_paths.length, 0)}
              </div>
              <div className="text-sm text-green-600">Redundancy available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Immediate Actions</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Address high-risk paths with mitigation strategies</li>
              <li>• Expand capacity at critical bottlenecks</li>
              <li>• Implement monitoring for medium-risk paths</li>
              <li>• Test alternative path activation procedures</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Long-term Strategy</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Develop redundant paths for critical flows</li>
              <li>• Invest in bottleneck capacity improvements</li>
              <li>• Create dynamic routing capabilities</li>
              <li>• Establish path performance monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};