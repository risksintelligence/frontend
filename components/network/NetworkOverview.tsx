import React, { useState, useEffect } from 'react';
import { Network, TrendingUp, Shield, Route, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import { useNetworkAnalysis } from '../../hooks/useNetworkAnalysis';

interface NetworkOverviewProps {
  apiUrl: string;
}

export const NetworkOverview: React.FC<NetworkOverviewProps> = ({
  apiUrl
}) => {
  const { 
    networkAnalysis, 
    centralityAnalysis, 
    vulnerabilityAssessment, 
    criticalPaths,
    loading, 
    error, 
    refreshNetworkData,
    clearError 
  } = useNetworkAnalysis(apiUrl);

  const [selectedMetric, setSelectedMetric] = useState<'centrality' | 'vulnerability' | 'paths' | 'resilience'>('centrality');

  useEffect(() => {
    refreshNetworkData();
  }, [refreshNetworkData]);

  const getNetworkHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const calculateNetworkHealth = () => {
    if (!networkAnalysis || !vulnerabilityAssessment) return 50;
    
    // Calculate network health based on various factors
    const densityScore = (networkAnalysis.metrics?.network_density || 0.3) * 100;
    const vulnerabilityScore = 100 - (vulnerabilityAssessment.overall_vulnerability_score * 100);
    const resilienceScore = vulnerabilityAssessment.network_metrics?.avg_vulnerability ? 
      100 - (vulnerabilityAssessment.network_metrics.avg_vulnerability * 100) : 50;
    
    return (densityScore + vulnerabilityScore + resilienceScore) / 3;
  };

  if (loading && !networkAnalysis) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading network analysis...</span>
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
            <div className="text-red-600 mb-2">Error loading network analysis</div>
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

  const networkHealth = calculateNetworkHealth();

  return (
    <div className="space-y-6">
      {/* Network Health Dashboard */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Network Health Overview</h3>
                <p className="text-sm text-gray-600">
                  Real-time analysis of economic network structure and stability
                </p>
              </div>
            </div>
            <button
              onClick={refreshNetworkData}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Network Health Score */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Network Health Score</h4>
              <div className={`text-4xl font-bold ${getNetworkHealthColor(networkHealth)}`}>
                {networkHealth.toFixed(0)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  networkHealth >= 80 ? 'bg-green-500' :
                  networkHealth >= 60 ? 'bg-yellow-500' :
                  networkHealth >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${networkHealth}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">
              Overall network resilience and stability assessment
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-blue-600" />
                <div className="text-sm text-blue-600">Total Nodes</div>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {networkAnalysis?.metrics?.total_nodes || 0}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <div className="text-sm text-purple-600">Network Density</div>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {((networkAnalysis?.metrics?.network_density || 0) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div className="text-sm text-red-600">Critical Nodes</div>
              </div>
              <div className="text-2xl font-bold text-red-900">
                {vulnerabilityAssessment?.network_metrics?.critical_nodes || 0}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div className="text-sm text-green-600">Resilience</div>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {vulnerabilityAssessment ? 
                  (100 - vulnerabilityAssessment.overall_vulnerability_score * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Components Toggle */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedMetric('centrality')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'centrality'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Centrality
            </button>
            <button
              onClick={() => setSelectedMetric('vulnerability')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'vulnerability'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Vulnerability
            </button>
            <button
              onClick={() => setSelectedMetric('paths')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'paths'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Route className="w-4 h-4 inline mr-2" />
              Critical Paths
            </button>
            <button
              onClick={() => setSelectedMetric('resilience')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'resilience'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Resilience
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Centrality Overview */}
          {selectedMetric === 'centrality' && centralityAnalysis && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Most Influential Network Nodes</h4>
              <div className="space-y-3">
                {centralityAnalysis.top_influential.slice(0, 5).map((nodeId, index) => {
                  const ranking = centralityAnalysis.node_rankings.find(
                    r => r.node_id === nodeId && r.centrality_type === 'eigenvector'
                  );
                  return (
                    <div key={nodeId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{ranking?.node_name || nodeId}</div>
                          <div className="text-sm text-gray-600">{ranking?.interpretation}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {ranking?.score.toFixed(3) || 'N/A'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vulnerability Overview */}
          {selectedMetric === 'vulnerability' && vulnerabilityAssessment && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Most Vulnerable Network Nodes</h4>
              <div className="space-y-3">
                {vulnerabilityAssessment.most_vulnerable.slice(0, 5).map((vuln, index) => (
                  <div key={vuln.node_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{vuln.node_name}</div>
                        <div className="text-sm text-gray-600">Current Value: {vuln.current_value}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      {(vuln.vulnerability_score * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Paths Overview */}
          {selectedMetric === 'paths' && criticalPaths && criticalPaths.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">High-Risk Propagation Paths</h4>
              <div className="space-y-3">
                {criticalPaths.slice(0, 5).map((path, index) => (
                  <div key={path.pathId} className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{path.description}</div>
                      <div className="text-lg font-bold text-purple-600">
                        {path.totalRisk.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Type: {path.pathType} | Length: {path.pathLength} nodes | Risk: {path.riskCategory}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resilience Overview */}
          {selectedMetric === 'resilience' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Network Resilience Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Risk Distribution</div>
                  {vulnerabilityAssessment && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Low Risk:</span>
                        <span className="font-medium">{vulnerabilityAssessment.risk_distribution.low}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Medium Risk:</span>
                        <span className="font-medium">{vulnerabilityAssessment.risk_distribution.medium}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>High Risk:</span>
                        <span className="font-medium">{vulnerabilityAssessment.risk_distribution.high}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Critical Risk:</span>
                        <span className="font-medium">{vulnerabilityAssessment.risk_distribution.critical}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Network Structure</div>
                  {networkAnalysis && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Nodes:</span>
                        <span className="font-medium">{networkAnalysis.metrics?.total_nodes || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Edges:</span>
                        <span className="font-medium">{networkAnalysis.metrics?.total_edges || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Density:</span>
                        <span className="font-medium">{((networkAnalysis.metrics?.network_density || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Clustering:</span>
                        <span className="font-medium">{((networkAnalysis.metrics?.average_clustering_coefficient || 0) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Network Analysis Tools</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/network/centrality"
            className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-gray-900">Centrality Analysis</div>
              <div className="text-xs text-gray-600">Node importance rankings</div>
            </div>
          </a>

          <a
            href="/network/vulnerability"
            className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Shield className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-medium text-gray-900">Vulnerability Assessment</div>
              <div className="text-xs text-gray-600">Network weakness analysis</div>
            </div>
          </a>

          <a
            href="/network/critical-paths"
            className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Route className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium text-gray-900">Critical Paths</div>
              <div className="text-xs text-gray-600">Risk propagation routes</div>
            </div>
          </a>

          <a
            href="/network/simulation"
            className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Activity className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-gray-900">Shock Simulation</div>
              <div className="text-xs text-gray-600">Impact modeling</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};