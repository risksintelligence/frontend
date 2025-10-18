import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import NetworkGraph from '../../components/visualizations/NetworkGraph';
import { Network, Activity, TrendingUp, AlertTriangle, BarChart3, Target } from 'lucide-react';

interface NetworkAnalysisData {
  nodes: any[];
  edges: any[];
  metrics: any;
  communities: any[];
  last_updated: string;
}

interface CentralityData {
  centrality: any[];
  topNodes: any[];
  analysisTimestamp: string;
  methodology: any;
}

interface CriticalPathsData {
  criticalPaths: any[];
  totalPaths: number;
  analysisTimestamp: string;
  methodology: any;
}

interface VulnerabilityData {
  vulnerability_scores: any[];
  overall_vulnerability_score: number;
  most_vulnerable: any[];
  category_analysis: any;
  risk_distribution: any;
  network_metrics: any;
  analysis_timestamp: string;
}

export default function NetworkAnalysisPage() {
  const [networkData, setNetworkData] = useState<NetworkAnalysisData | null>(null);
  const [centralityData, setCentralityData] = useState<CentralityData | null>(null);
  const [criticalPaths, setCriticalPaths] = useState<CriticalPathsData | null>(null);
  const [vulnerabilityData, setVulnerabilityData] = useState<VulnerabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'centrality' | 'paths' | 'vulnerability'>('overview');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/network/analysis`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNetworkData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch network data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCentralityData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/network/centrality`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCentralityData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch centrality data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCriticalPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/network/critical-paths`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCriticalPaths(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch critical paths');
    } finally {
      setLoading(false);
    }
  };

  const fetchVulnerabilityData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/network/vulnerability-assessment`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVulnerabilityData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vulnerability data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'centrality':
        if (!centralityData) fetchCentralityData();
        break;
      case 'paths':
        if (!criticalPaths) fetchCriticalPaths();
        break;
      case 'vulnerability':
        if (!vulnerabilityData) fetchVulnerabilityData();
        break;
    }
  };

  if (loading && !networkData) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading network analysis...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium">Error loading network analysis</div>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={fetchNetworkData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Advanced Network Risk Analysis
            </h1>
            <p className="mt-2 text-gray-600">
              Comprehensive systemic risk analysis with centrality metrics, critical paths, and vulnerability assessment
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Network Overview', icon: Network },
                  { id: 'centrality', name: 'Centrality Analysis', icon: Target },
                  { id: 'paths', name: 'Critical Paths', icon: TrendingUp },
                  { id: 'vulnerability', name: 'Vulnerability Assessment', icon: AlertTriangle }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as typeof activeTab)}
                      className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon
                        className={`mr-2 h-5 w-5 ${
                          activeTab === tab.id
                            ? 'text-blue-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && networkData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow border">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Risk Network Visualization
                      </h3>
                      <NetworkGraph
                        data={{
                          nodes: networkData.nodes.map(node => ({
                            id: node.id,
                            name: node.name,
                            category: node.type,
                            riskLevel: node.risk_level,
                            systemicImportance: node.metadata?.importance || 0.5,
                            description: node.metadata?.description || '',
                          })),
                          links: networkData.edges.map(edge => ({
                            source: edge.source,
                            target: edge.target,
                            strength: edge.weight,
                            riskPropagation: edge.strength,
                            type: edge.type,
                          })),
                          timestamp: networkData.last_updated,
                        }}
                        width={800}
                        height={600}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow border">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Network Metrics
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Nodes:</span>
                          <span className="text-sm font-medium">{networkData.metrics?.total_nodes || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Connections:</span>
                          <span className="text-sm font-medium">{networkData.metrics?.total_edges || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Network Density:</span>
                          <span className="text-sm font-medium">{(networkData.metrics?.network_density * 100 || 0).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Clustering Coefficient:</span>
                          <span className="text-sm font-medium">{networkData.metrics?.average_clustering_coefficient || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {networkData.communities && (
                    <div className="bg-white rounded-lg shadow border">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Network Communities
                        </h3>
                        <div className="space-y-3">
                          {networkData.communities.map((community, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900">{community.name}</span>
                                <span className="text-sm text-gray-600">{community.nodes?.length || 0} nodes</span>
                              </div>
                              <div className="mt-1 text-sm text-gray-600">
                                Modularity: {community.modularity_score?.toFixed(2) || 'N/A'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'centrality' && (
              <div className="space-y-6">
                {centralityData ? (
                  <>
                    <div className="bg-white rounded-lg shadow border">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Node Centrality Rankings
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Node</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Centrality Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Systemic Importance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {centralityData.centrality.slice(0, 10).map((node, idx) => (
                                <tr key={idx}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {node.nodeName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {node.category}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 w-16">
                                        <div
                                          className="h-2 rounded-full bg-blue-500"
                                          style={{ width: `${node.centralityScore * 100}%` }}
                                        ></div>
                                      </div>
                                      <span>{(node.centralityScore * 100).toFixed(1)}%</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {(node.systemicImportance * 100).toFixed(0)}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {node.riskLevel?.toFixed(1) || 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Methodology</h3>
                        <p className="text-sm text-gray-600">{centralityData.methodology?.description}</p>
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Calculation Factors:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {centralityData.methodology?.factors?.map((factor: string, idx: number) => (
                              <li key={idx}>• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow border">
                    <div className="p-12 text-center">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading centrality analysis...</p>
                        </>
                      ) : (
                        <p className="text-gray-600">Click to load centrality analysis</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'paths' && (
              <div className="space-y-6">
                {criticalPaths ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {criticalPaths.criticalPaths.slice(0, 6).map((path, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow border">
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">{path.description}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                path.riskCategory === 'Critical' ? 'bg-red-100 text-red-800' :
                                path.riskCategory === 'High' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {path.riskCategory}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4">{path.mechanism}</p>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Average Risk Level:</span>
                                <span className="font-medium">{path.avgRiskLevel.toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Path Length:</span>
                                <span className="font-medium">{path.pathLength} nodes</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Criticality Score:</span>
                                <span className="font-medium">{path.criticalityScore.toFixed(1)}</span>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    path.avgRiskLevel > 60 ? 'bg-red-500' :
                                    path.avgRiskLevel > 40 ? 'bg-orange-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${path.avgRiskLevel}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow border">
                    <div className="p-12 text-center">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading critical paths analysis...</p>
                        </>
                      ) : (
                        <p className="text-gray-600">Click to load critical paths analysis</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vulnerability' && (
              <div className="space-y-6">
                {vulnerabilityData ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white rounded-lg shadow border p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {(vulnerabilityData.overall_vulnerability_score * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Overall Vulnerability</div>
                      </div>
                      <div className="bg-white rounded-lg shadow border p-6 text-center">
                        <div className="text-3xl font-bold text-red-600">
                          {vulnerabilityData.network_metrics?.critical_nodes || 0}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Critical Nodes</div>
                      </div>
                      <div className="bg-white rounded-lg shadow border p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {vulnerabilityData.network_metrics?.high_vulnerability_nodes || 0}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">High Risk Nodes</div>
                      </div>
                      <div className="bg-white rounded-lg shadow border p-6 text-center">
                        <div className="text-3xl font-bold text-gray-600">
                          {vulnerabilityData.network_metrics?.total_nodes || 0}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Total Nodes</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Most Vulnerable Components
                        </h3>
                        <div className="space-y-4">
                          {vulnerabilityData.most_vulnerable?.map((node, idx) => (
                            <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-red-900">{node.node_name}</h4>
                                  <p className="text-sm text-red-700 mt-1">{node.systemic_impact}</p>
                                  <div className="mt-2 space-y-1">
                                    {node.risk_factors?.map((factor: string, factorIdx: number) => (
                                      <div key={factorIdx} className="text-xs text-red-600">• {factor}</div>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-2xl font-bold text-red-600">
                                    {(node.vulnerability_score * 100).toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-red-600">Vulnerability Score</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow border">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {vulnerabilityData.risk_distribution?.low || 0}
                            </div>
                            <div className="text-sm text-green-700">Low Risk</div>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                              {vulnerabilityData.risk_distribution?.medium || 0}
                            </div>
                            <div className="text-sm text-yellow-700">Medium Risk</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {vulnerabilityData.risk_distribution?.high || 0}
                            </div>
                            <div className="text-sm text-orange-700">High Risk</div>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {vulnerabilityData.risk_distribution?.critical || 0}
                            </div>
                            <div className="text-sm text-red-700">Critical Risk</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow border">
                    <div className="p-12 text-center">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading vulnerability assessment...</p>
                        </>
                      ) : (
                        <p className="text-gray-600">Click to load vulnerability assessment</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}