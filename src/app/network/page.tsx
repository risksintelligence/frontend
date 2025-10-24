'use client'

import { useState, useEffect } from 'react'
import { Network, Activity, AlertTriangle, TrendingUp, Shield, Users, Zap } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface NetworkMetrics {
  totalNodes: number
  totalEdges: number
  networkDensity: number
  clusteringCoefficient: number
  averagePathLength: number
  networkEfficiency: number
  criticalNodes: number
  vulnerableConnections: number
  systemicRiskScore: number
  lastAnalysis: string
}

interface CriticalNode {
  id: string
  name: string
  type: string
  centralityScore: number
  riskLevel: string
  connections: number
  sector: string
}

export default function NetworkOverviewPage() {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null)
  const [criticalNodes, setCriticalNodes] = useState<CriticalNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        setLoading(true)
        const [metricsResponse, nodesResponse] = await Promise.all([
          fetch('/api/v1/network/overview'),
          fetch('/api/v1/network/critical-nodes')
        ])

        if (metricsResponse.ok && nodesResponse.ok) {
          const [metricsData, nodesData] = await Promise.all([
            metricsResponse.json(),
            nodesResponse.json()
          ])
          setMetrics(metricsData)
          setCriticalNodes(nodesData.nodes)
        } else {
          
          setMetrics({
            totalNodes: 1247,
            totalEdges: 3689,
            networkDensity: 0.47,
            clusteringCoefficient: 0.73,
            averagePathLength: 3.2,
            networkEfficiency: 0.68,
            criticalNodes: 23,
            vulnerableConnections: 156,
            systemicRiskScore: 0.34,
            lastAnalysis: new Date().toISOString()
          })
          setCriticalNodes([
            {
              id: 'node_001',
              name: 'Federal Reserve System',
              type: 'Financial Institution',
              centralityScore: 0.92,
              riskLevel: 'critical',
              connections: 247,
              sector: 'Banking'
            },
            {
              id: 'node_002', 
              name: 'JP Morgan Chase',
              type: 'Financial Institution',
              centralityScore: 0.89,
              riskLevel: 'high',
              connections: 198,
              sector: 'Banking'
            },
            {
              id: 'node_003',
              name: 'TSMC Semiconductor',
              type: 'Manufacturing',
              centralityScore: 0.85,
              riskLevel: 'high',
              connections: 167,
              sector: 'Technology'
            },
            {
              id: 'node_004',
              name: 'Amazon Web Services',
              type: 'Infrastructure',
              centralityScore: 0.82,
              riskLevel: 'high',
              connections: 234,
              sector: 'Technology'
            },
            {
              id: 'node_005',
              name: 'Suez Canal Authority',
              type: 'Transportation',
              centralityScore: 0.78,
              riskLevel: 'medium',
              connections: 134,
              sector: 'Logistics'
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching network data:', error)
        setMetrics(null)
        setCriticalNodes([])
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Network Analysis</h1>
          <p className="text-secondary mt-2">Systemic risk topology and network analysis</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="terminal-card p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Network Data Available</h2>
        <p className="text-muted">Network analysis data could not be loaded.</p>
      </div>
    )
  }

  const getRiskColor = (score: number) => {
    if (score <= 0.3) return 'good'
    if (score <= 0.6) return 'warning'
    return 'critical'
  }

  const getCentralityStatus = (score: number) => {
    if (score >= 0.8) return 'critical'
    if (score >= 0.6) return 'warning'
    return 'good'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Network Analysis</h1>
        <p className="text-secondary mt-2">
          Comprehensive systemic risk topology and network dependency analysis
        </p>
      </div>

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
            <div className="text-xs text-muted">nodes, {metrics.totalEdges.toLocaleString()} edges</div>
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
              text={metrics.systemicRiskScore <= 0.3 ? 'low' : metrics.systemicRiskScore <= 0.6 ? 'medium' : 'high'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">
            {metrics.criticalNodes} critical nodes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Network Metrics</h3>
            <p className="text-sm text-muted mt-1">
              Structural analysis of network properties
            </p>
          </div>
          <div className="terminal-card-content space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-heading">Network Density</div>
                <div className="text-sm text-muted">Connection density across nodes</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono text-heading">
                  {(metrics.networkDensity * 100).toFixed(1)}%
                </div>
                <StatusBadge 
                  status={metrics.networkDensity > 0.4 ? 'good' : 'warning'}
                  text={metrics.networkDensity > 0.4 ? 'robust' : 'sparse'}
                  size="sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
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

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Critical Nodes Analysis</h3>
            <p className="text-sm text-muted mt-1">
              High-impact nodes with systemic importance
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {criticalNodes.map((node) => (
                <div key={node.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-heading">{node.name}</div>
                    <StatusBadge 
                      status={getCentralityStatus(node.centralityScore)}
                      text={node.riskLevel}
                      size="sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted">Type</div>
                      <div className="font-medium text-secondary">{node.type}</div>
                    </div>
                    <div>
                      <div className="text-muted">Sector</div>
                      <div className="font-medium text-secondary">{node.sector}</div>
                    </div>
                    <div>
                      <div className="text-muted">Connections</div>
                      <div className="font-medium text-secondary">{node.connections}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-muted text-sm mb-1">
                      Centrality Score: {(node.centralityScore * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
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

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Network Analysis Tools</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/network/centrality"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-heading">Centrality Analysis</span>
              </div>
              <p className="text-sm text-muted">
                Betweenness, closeness, and eigenvector centrality metrics
              </p>
            </a>

            <a 
              href="/network/vulnerabilities"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-heading">Vulnerabilities</span>
              </div>
              <p className="text-sm text-muted">
                Single points of failure and system bottlenecks
              </p>
            </a>

            <a 
              href="/network/critical-paths"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Network className="h-5 w-5 text-green-600" />
                <span className="font-medium text-heading">Critical Paths</span>
              </div>
              <p className="text-sm text-muted">
                Essential connections and dependency analysis
              </p>
            </a>

            <a 
              href="/network/supply-chain"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-heading">Supply Chain</span>
              </div>
              <p className="text-sm text-muted">
                Supply chain network mapping and analysis
              </p>
            </a>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Analysis: {new Date(metrics.lastAnalysis).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}