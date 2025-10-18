import React, { useState, useEffect } from 'react';
import { Network, TrendingUp, Users, Zap, Target, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNetworkAnalysis } from '../../hooks/useNetworkAnalysis';

interface CentralityAnalysisProps {
  apiUrl: string;
}

export const CentralityAnalysis: React.FC<CentralityAnalysisProps> = ({
  apiUrl
}) => {
  const { centralityAnalysis, loading, error, fetchCentralityAnalysis, clearError } = useNetworkAnalysis(apiUrl);
  const [selectedCentrality, setSelectedCentrality] = useState<'betweenness' | 'closeness' | 'degree' | 'eigenvector'>('betweenness');

  useEffect(() => {
    fetchCentralityAnalysis();
  }, [fetchCentralityAnalysis]);

  const getCentralityDescription = (type: string) => {
    switch (type) {
      case 'betweenness':
        return 'Measures how often a node appears on shortest paths between other nodes. High betweenness indicates control over information flow.';
      case 'closeness':
        return 'Measures how close a node is to all other nodes. High closeness indicates ability to quickly reach other nodes.';
      case 'degree':
        return 'Measures the number of direct connections a node has. High degree indicates high connectivity.';
      case 'eigenvector':
        return 'Measures the influence of a node based on connections to other influential nodes. High eigenvector indicates high influence.';
      default:
        return '';
    }
  };

  const getCentralityIcon = (type: string) => {
    switch (type) {
      case 'betweenness':
        return <Target className="w-5 h-5" />;
      case 'closeness':
        return <Zap className="w-5 h-5" />;
      case 'degree':
        return <Users className="w-5 h-5" />;
      case 'eigenvector':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Network className="w-5 h-5" />;
    }
  };

  const getCentralityColor = (type: string) => {
    switch (type) {
      case 'betweenness':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'closeness':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'degree':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'eigenvector':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatScore = (score: number) => {
    return score.toFixed(4);
  };

  const filteredRankings = centralityAnalysis?.node_rankings.filter(
    ranking => ranking.centrality_type === selectedCentrality
  ) || [];

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading centrality analysis...</span>
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
            <div className="text-red-600 mb-2">Error loading centrality analysis</div>
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

  if (!centralityAnalysis) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Centrality Data</h3>
            <p className="text-gray-600">Centrality analysis data is not available.</p>
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
              <Network className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Network Centrality Analysis</h3>
                <p className="text-sm text-gray-600">
                  Analysis of node importance and influence within the network
                </p>
              </div>
            </div>
            <button
              onClick={fetchCentralityAnalysis}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Centrality Type Selection */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {(['betweenness', 'closeness', 'degree', 'eigenvector'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCentrality(type)}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  selectedCentrality === type
                    ? getCentralityColor(type)
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {getCentralityIcon(type)}
                  <span className="font-medium text-sm capitalize">{type}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {type === 'betweenness' && 'Information flow control'}
                  {type === 'closeness' && 'Network reachability'}
                  {type === 'degree' && 'Direct connectivity'}
                  {type === 'eigenvector' && 'Influential connections'}
                </div>
              </button>
            ))}
          </div>

          {/* Centrality Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2 capitalize">{selectedCentrality} Centrality</h4>
            <p className="text-blue-800 text-sm">{getCentralityDescription(selectedCentrality)}</p>
          </div>
        </div>
      </div>

      {/* Top Nodes by Selected Centrality */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 capitalize">
            Top Nodes by {selectedCentrality} Centrality
          </h4>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {filteredRankings.slice(0, 10).map((ranking, index) => (
              <div
                key={ranking.node_id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    #{ranking.rank}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{ranking.node_name}</h5>
                    <p className="text-sm text-gray-600">{ranking.interpretation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatScore(ranking.score)}</div>
                  <div className="text-xs text-gray-500 capitalize">{ranking.centrality_type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Nodes Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Most Influential */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium text-gray-900">Most Influential</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {centralityAnalysis.top_influential.slice(0, 5).map((nodeId, index) => {
                const ranking = centralityAnalysis.node_rankings.find(
                  r => r.node_id === nodeId && r.centrality_type === 'eigenvector'
                );
                return (
                  <div key={nodeId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{ranking?.node_name || nodeId}</span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Most Vulnerable */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-gray-900">Most Vulnerable</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {centralityAnalysis.top_vulnerable.slice(0, 5).map((nodeId, index) => {
                const ranking = centralityAnalysis.node_rankings.find(
                  r => r.node_id === nodeId
                );
                return (
                  <div key={nodeId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{ranking?.node_name || nodeId}</span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Critical Connectors */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Critical Connectors</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-2">
              {centralityAnalysis.critical_connectors.slice(0, 5).map((nodeId, index) => {
                const ranking = centralityAnalysis.node_rankings.find(
                  r => r.node_id === nodeId && r.centrality_type === 'betweenness'
                );
                return (
                  <div key={nodeId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{ranking?.node_name || nodeId}</span>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Centrality Distribution Visualization */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Centrality Distribution</h4>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Network className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <div className="text-gray-600">Centrality distribution chart would render here</div>
              <div className="text-sm text-gray-500">
                Showing distribution of {selectedCentrality} centrality scores
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Analysis Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Key Insights</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Network shows clear hierarchical structure with key influential nodes</li>
              <li>• Critical connectors control information flow across network segments</li>
              <li>• Vulnerability concentrated in high-degree nodes</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Monitor critical connectors for early warning signals</li>
              <li>• Strengthen resilience of most vulnerable nodes</li>
              <li>• Develop redundancies for high-influence pathways</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Analysis generated on {new Date(centralityAnalysis.analysis_date).toLocaleString()}
        </div>
      </div>
    </div>
  );
};