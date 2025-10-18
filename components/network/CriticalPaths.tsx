import React, { useState, useEffect } from 'react';
import { Route, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
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
    if (risk >= 80) return 'text-red-600 bg-red-100 border-red-200';
    if (risk >= 60) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (risk >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };


  const sortedPaths = [...criticalPaths].sort((a, b) => {
    switch (sortBy) {
      case 'risk':
        return b.totalRisk - a.totalRisk;
      case 'length':
        return b.pathLength - a.pathLength;
      case 'name':
        return a.description.localeCompare(b.description);
      default:
        return 0;
    }
  });


  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading critical paths analysis...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
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

  if (!criticalPaths || criticalPaths.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Critical Paths Found</h3>
            <p className="text-gray-600">Critical path analysis data is not available.</p>
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
              <Route className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Critical Paths Analysis</h3>
                <p className="text-sm text-gray-600">
                  Economic risk propagation pathways and transmission mechanisms
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="risk">Sort by Risk Level</option>
                <option value="length">Sort by Path Length</option>
                <option value="name">Sort by Description</option>
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
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{criticalPaths.length}</div>
              <div className="text-sm text-gray-600">Total Paths</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {criticalPaths.filter(p => p.riskCategory === 'Critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {criticalPaths.filter(p => p.riskCategory === 'High').length}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {criticalPaths.filter(p => p.riskCategory === 'Moderate').length}
              </div>
              <div className="text-sm text-gray-600">Moderate Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Paths List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Risk Propagation Paths</h4>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedPaths.map((path, index) => (
            <div key={path.pathId} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="font-medium text-gray-900">{path.description}</h5>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>Type: {path.pathType}</span>
                        <span>Length: {path.pathLength} nodes</span>
                        <span>Risk: {path.totalRisk.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(path.totalRisk)}`}>
                      {path.riskCategory} Risk
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700">
                    <strong>Mechanism:</strong> {path.mechanism}
                  </div>

                  {/* Path Flow */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 text-sm">
                      {path.path.map((nodeId, nodeIndex) => {
                        const nodeDetail = path.pathDetails.find(detail => detail.nodeId === nodeId);
                        return (
                          <React.Fragment key={nodeId}>
                            <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {nodeDetail?.nodeName || nodeId}
                            </div>
                            {nodeIndex < path.path.length - 1 && (
                              <span className="text-gray-400">→</span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPath(selectedPath === path.pathId.toString() ? null : path.pathId.toString())}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded Details */}
              {selectedPath === path.pathId.toString() && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Path Details */}
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">Path Node Details</h6>
                      <div className="space-y-2">
                        {path.pathDetails.map((detail) => (
                          <div key={detail.nodeId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{detail.nodeName}</div>
                              <div className="text-xs text-gray-600">
                                Category: {detail.category} | Value: {detail.currentValue}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${getRiskColor(detail.riskLevel).split(' ')[0]}`}>
                                {detail.riskLevel.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Path Metrics */}
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">Path Metrics</h6>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Risk Score:</span>
                          <span className="font-medium">{path.totalRisk.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Risk Level:</span>
                          <span className="font-medium">{path.avgRiskLevel.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Path Length:</span>
                          <span className="font-medium">{path.pathLength} nodes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Criticality Score:</span>
                          <span className="font-medium">{path.criticalityScore.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Analysis Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Key Findings</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• {criticalPaths.length} critical risk propagation paths identified</li>
              <li>• {criticalPaths.filter(p => p.riskCategory === 'Critical').length} paths pose critical risk to system stability</li>
              <li>• {criticalPaths.filter(p => p.pathType === 'monetary_policy').length} paths related to monetary policy transmission</li>
              <li>• Average path length: {(criticalPaths.reduce((acc, p) => acc + p.pathLength, 0) / criticalPaths.length).toFixed(1)} nodes</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Risk Management Recommendations</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Monitor high-risk paths for early warning indicators</li>
              <li>• Implement risk mitigation strategies for critical transmission mechanisms</li>
              <li>• Develop contingency plans for path disruption scenarios</li>
              <li>• Strengthen resilience at key network nodes and connections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};