'use client';

import { useState, useEffect } from 'react';
import { Activity, Network, Shield, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import NetworkVisualization from './NetworkVisualization';

interface NetworkMetrics {
  totalNodes: number;
  totalEdges: number;
  networkDensity: number;
  clusteringCoefficient: number;
  averagePathLength: number;
  networkEfficiency: number;
  criticalNodes: number;
  vulnerableConnections: number;
  systemicRiskScore: number;
  lastAnalysis: string;
}

interface CriticalNode {
  id: string;
  name: string;
  type: string;
  centralityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  connections: number;
  sector: string;
}

interface NetworkData {
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    group: string;
    centrality: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    connections: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    weight: number;
    type: string;
    strength: number;
  }>;
  metrics: {
    totalNodes: number;
    totalEdges: number;
    density: number;
    clustering: number;
  };
}

export default function NetworkOverview() {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [criticalNodes, setCriticalNodes] = useState<CriticalNode[]>([]);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewResponse, visualizationResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/network/overview`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/network/visualization`)
      ]);

      if (overviewResponse.ok) {
        const overviewData = await overviewResponse.json();
        if (overviewData.status === 'success') {
          setMetrics(overviewData.data.network_metrics);
          setCriticalNodes(overviewData.data.critical_components.critical_nodes || []);
        }
      }

      if (visualizationResponse.ok) {
        const vizData = await visualizationResponse.json();
        if (vizData.status === 'success') {
          setNetworkData(vizData.data);
        }
      }

      // If no real data available, show empty state
      if (!overviewResponse.ok && !visualizationResponse.ok) {
        throw new Error('Network data temporarily unavailable');
      }
    } catch (err) {
      console.error('Error fetching network data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load network data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 0.3) return 'good';
    if (score <= 0.6) return 'warning';
    return 'critical';
  };

  const getCentralityStatus = (score: number) => {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'warning';
    return 'good';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-card p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">Network Data Unavailable</h2>
        <p className="text-muted">{error}</p>
        <button 
          onClick={fetchNetworkData}
          className="mt-4 px-4 py-2 bg-terminal-blue text-white rounded hover:bg-terminal-blue/80"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Metrics Overview */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="terminal-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Network className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-muted">Network Topology</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold font-mono text-heading">
                  {metrics.totalNodes.toLocaleString()}
                </div>
                <div className="text-xs text-muted">
                  nodes, {metrics.totalEdges.toLocaleString()} edges
                </div>
                <div className="text-xs text-muted">
                  Density: {(metrics.networkDensity * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="terminal-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-muted">Network Efficiency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold font-mono text-heading">
                  {(metrics.networkEfficiency * 100).toFixed(1)}%
                </div>
                <StatusBadge 
                  status={metrics.networkEfficiency > 0.6 ? 'good' : 'warning'}
                  text={metrics.networkEfficiency > 0.6 ? 'optimal' : 'degraded'}
                  size="sm"
                />
              </div>
              <div className="text-xs text-muted mt-1">
                Avg path length: {metrics.averagePathLength.toFixed(1)}
              </div>
            </div>

            <div className="terminal-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-muted">Systemic Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold font-mono text-heading">
                  {(metrics.systemicRiskScore * 100).toFixed(1)}%
                </div>
                <StatusBadge 
                  status={getRiskColor(metrics.systemicRiskScore)}
                  text={
                    metrics.systemicRiskScore <= 0.3 ? 'low' : 
                    metrics.systemicRiskScore <= 0.6 ? 'medium' : 'high'
                  }
                  size="sm"
                />
              </div>
              <div className="text-xs text-muted mt-1">
                {metrics.criticalNodes} critical nodes
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="terminal-card">
              <div className="terminal-card-header">
                <h3 className="font-semibold text-heading">Network Structure Analysis</h3>
                <p className="text-sm text-muted mt-1">
                  Structural properties and connectivity metrics
                </p>
              </div>
              <div className="terminal-card-content space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-heading">Clustering Coefficient</div>
                    <div className="text-sm text-muted">Local interconnectedness measure</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono text-heading">
                      {(metrics.clusteringCoefficient * 100).toFixed(1)}%
                    </div>
                    <StatusBadge 
                      status={metrics.clusteringCoefficient > 0.7 ? 'good' : 'warning'}
                      text={metrics.clusteringCoefficient > 0.7 ? 'high' : 'moderate'}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <div className="font-medium text-heading">Vulnerable Connections</div>
                    <div className="text-sm text-muted">Single points of failure</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono text-heading">
                      {metrics.vulnerableConnections}
                    </div>
                    <StatusBadge 
                      status={metrics.vulnerableConnections < 100 ? 'good' : 'warning'}
                      text={metrics.vulnerableConnections < 100 ? 'stable' : 'elevated'}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Nodes */}
            <div className="terminal-card">
              <div className="terminal-card-header">
                <h3 className="font-semibold text-heading">Critical Nodes</h3>
                <p className="text-sm text-muted mt-1">
                  High-impact nodes with systemic importance
                </p>
              </div>
              <div className="terminal-card-content">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {criticalNodes.slice(0, 5).map((node) => (
                    <div key={node.id} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-heading text-sm">{node.name}</div>
                        <StatusBadge 
                          status={getCentralityStatus(node.centralityScore)}
                          text={node.riskLevel}
                          size="sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-muted">Type</div>
                          <div className="font-medium text-secondary">{node.type}</div>
                        </div>
                        <div>
                          <div className="text-muted">Sector</div>
                          <div className="font-medium text-secondary">{node.sector}</div>
                        </div>
                        <div>
                          <div className="text-muted">Links</div>
                          <div className="font-medium text-secondary">{node.connections}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-muted text-xs mb-1">
                          Centrality: {(node.centralityScore * 100).toFixed(1)}%
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${node.centralityScore * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Network Visualization */}
      {networkData && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Interactive Network Map</h3>
            <p className="text-sm text-muted mt-1">
              Explore network topology and node relationships
            </p>
          </div>
          <div className="terminal-card-content">
            <NetworkVisualization
              data={networkData}
              width={800}
              height={500}
              interactive={true}
              showLabels={true}
              onNodeClick={(node) => {
                console.log('Node clicked:', node);
                // Handle node selection for detailed analysis
              }}
              onLinkClick={(link) => {
                console.log('Link clicked:', link);
                // Handle link selection for relationship analysis
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Analysis Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="terminal-card p-6 text-center">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <div className="text-lg font-semibold text-heading mb-1">Centrality Analysis</div>
          <div className="text-sm text-muted mb-3">
            Node importance and influence metrics
          </div>
          <a 
            href="/network/centrality" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Analyze Centrality
          </a>
        </div>

        <div className="terminal-card p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <div className="text-lg font-semibold text-heading mb-1">Vulnerability Assessment</div>
          <div className="text-sm text-muted mb-3">
            System weak points and bottlenecks
          </div>
          <a 
            href="/network/vulnerabilities" 
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            Assess Vulnerabilities
          </a>
        </div>

        <div className="terminal-card p-6 text-center">
          <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <div className="text-lg font-semibold text-heading mb-1">Shock Simulation</div>
          <div className="text-sm text-muted mb-3">
            Cascade failure impact modeling
          </div>
          <a 
            href="/network/simulation" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Run Simulation
          </a>
        </div>
      </div>

      {metrics && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Analysis Metadata</h3>
          </div>
          <div className="terminal-card-content">
            <div className="text-sm text-muted">
              Last Analysis: {new Date(metrics.lastAnalysis).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}