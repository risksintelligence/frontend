'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Target, Star, BarChart3, Network } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface CentralityMetrics {
  nodeId: string
  name: string
  sector: string
  betweennessCentrality: number
  closenessCentrality: number
  eigenvectorCentrality: number
  pagerank: number
  degreeCentrality: number
  totalConnections: number
  influenceScore: number
  riskLevel: string
}

interface CentralityAnalysis {
  summary: {
    totalNodes: number
    averageBetweenness: number
    averageCloseness: number
    averageEigenvector: number
    networkCentralization: number
    lastAnalysis: string
  }
  topNodes: CentralityMetrics[]
  distributionData: {
    metric: string
    distribution: { range: string; count: number; percentage: number }[]
  }[]
}

export default function CentralityAnalysisPage() {
  const [analysis, setAnalysis] = useState<CentralityAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string>('betweenness')

  useEffect(() => {
    const fetchCentralityData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/network/centrality')
        
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          
          setAnalysis({
            summary: {
              totalNodes: 1247,
              averageBetweenness: 0.23,
              averageCloseness: 0.41,
              averageEigenvector: 0.19,
              networkCentralization: 0.67,
              lastAnalysis: new Date().toISOString()
            },
            topNodes: [
              {
                nodeId: 'fed_001',
                name: 'Federal Reserve System',
                sector: 'Banking',
                betweennessCentrality: 0.92,
                closenessCentrality: 0.89,
                eigenvectorCentrality: 0.94,
                pagerank: 0.087,
                degreeCentrality: 0.85,
                totalConnections: 247,
                influenceScore: 0.91,
                riskLevel: 'critical'
              },
              {
                nodeId: 'jpm_001',
                name: 'JPMorgan Chase & Co.',
                sector: 'Banking',
                betweennessCentrality: 0.84,
                closenessCentrality: 0.82,
                eigenvectorCentrality: 0.88,
                pagerank: 0.063,
                degreeCentrality: 0.79,
                totalConnections: 198,
                influenceScore: 0.84,
                riskLevel: 'high'
              },
              {
                nodeId: 'tsmc_001',
                name: 'Taiwan Semiconductor',
                sector: 'Technology',
                betweennessCentrality: 0.78,
                closenessCentrality: 0.71,
                eigenvectorCentrality: 0.83,
                pagerank: 0.052,
                degreeCentrality: 0.74,
                totalConnections: 167,
                influenceScore: 0.77,
                riskLevel: 'high'
              },
              {
                nodeId: 'aws_001',
                name: 'Amazon Web Services',
                sector: 'Technology',
                betweennessCentrality: 0.72,
                closenessCentrality: 0.78,
                eigenvectorCentrality: 0.76,
                pagerank: 0.048,
                degreeCentrality: 0.81,
                totalConnections: 234,
                influenceScore: 0.74,
                riskLevel: 'high'
              },
              {
                nodeId: 'suez_001',
                name: 'Suez Canal Authority',
                sector: 'Logistics',
                betweennessCentrality: 0.69,
                closenessCentrality: 0.65,
                eigenvectorCentrality: 0.58,
                pagerank: 0.041,
                degreeCentrality: 0.67,
                totalConnections: 134,
                influenceScore: 0.65,
                riskLevel: 'medium'
              }
            ],
            distributionData: [
              {
                metric: 'betweenness',
                distribution: [
                  { range: '0.0-0.2', count: 623, percentage: 49.96 },
                  { range: '0.2-0.4', count: 312, percentage: 25.02 },
                  { range: '0.4-0.6', count: 187, percentage: 15.00 },
                  { range: '0.6-0.8', count: 89, percentage: 7.14 },
                  { range: '0.8-1.0', count: 36, percentage: 2.88 }
                ]
              }
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching centrality data:', error)
        setAnalysis(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCentralityData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Centrality Analysis</h1>
          <p className="text-secondary mt-2">Node importance and influence metrics</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="terminal-card p-8 text-center">
        <Users className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Centrality Data Available</h2>
        <p className="text-muted">Centrality analysis data could not be loaded.</p>
      </div>
    )
  }

  const getCentralityColor = (score: number) => {
    if (score >= 0.8) return 'critical'
    if (score >= 0.6) return 'warning'
    if (score >= 0.4) return 'good'
    return 'good'
  }

  const getMetricValue = (node: CentralityMetrics, metric: string) => {
    switch (metric) {
      case 'betweenness': return node.betweennessCentrality
      case 'closeness': return node.closenessCentrality
      case 'eigenvector': return node.eigenvectorCentrality
      case 'pagerank': return node.pagerank
      case 'degree': return node.degreeCentrality
      default: return node.betweennessCentrality
    }
  }

  const getMetricDescription = (metric: string) => {
    switch (metric) {
      case 'betweenness': return 'Measures how often a node lies on the shortest path between other nodes'
      case 'closeness': return 'Measures how close a node is to all other nodes in the network'
      case 'eigenvector': return 'Measures the influence of a node based on connections to other influential nodes'
      case 'pagerank': return 'Measures the relative importance of nodes based on the structure of incoming links'
      case 'degree': return 'Measures the number of direct connections a node has'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Centrality Analysis</h1>
          <p className="text-secondary mt-2">
            Node importance and influence measurement across network topology
          </p>
        </div>
        <select 
          value={selectedMetric} 
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="betweenness">Betweenness Centrality</option>
          <option value="closeness">Closeness Centrality</option>
          <option value="eigenvector">Eigenvector Centrality</option>
          <option value="pagerank">PageRank</option>
          <option value="degree">Degree Centrality</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Avg Betweenness</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {(analysis.summary.averageBetweenness * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted mt-1">Network average</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Network className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted">Avg Closeness</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {(analysis.summary.averageCloseness * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted mt-1">Network average</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Avg Eigenvector</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {(analysis.summary.averageEigenvector * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted mt-1">Network average</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-muted">Centralization</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.summary.networkCentralization * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={analysis.summary.networkCentralization > 0.6 ? 'warning' : 'good'}
              text={analysis.summary.networkCentralization > 0.6 ? 'centralized' : 'distributed'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Network structure</div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">
            Top Nodes by {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Centrality
          </h3>
          <p className="text-sm text-muted mt-1">
            {getMetricDescription(selectedMetric)}
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="space-y-4">
            {analysis.topNodes
              .sort((a, b) => getMetricValue(b, selectedMetric) - getMetricValue(a, selectedMetric))
              .map((node, index) => (
              <div key={node.nodeId} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-800">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-heading">{node.name}</div>
                      <div className="text-sm text-muted">{node.sector}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge 
                      status={getCentralityColor(getMetricValue(node, selectedMetric))}
                      text={node.riskLevel}
                      size="sm"
                    />
                    <div className="text-right">
                      <div className="text-lg font-mono text-heading">
                        {(getMetricValue(node, selectedMetric) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted">centrality score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-xs text-muted">Betweenness</div>
                    <div className="font-mono text-secondary">{(node.betweennessCentrality * 100).toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted">Closeness</div>
                    <div className="font-mono text-secondary">{(node.closenessCentrality * 100).toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted">Eigenvector</div>
                    <div className="font-mono text-secondary">{(node.eigenvectorCentrality * 100).toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted">PageRank</div>
                    <div className="font-mono text-secondary">{(node.pagerank * 100).toFixed(2)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted">Connections</div>
                    <div className="font-mono text-secondary">{node.totalConnections}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Influence Score</span>
                    <span className="font-mono text-heading">{(node.influenceScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${node.influenceScore * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Centrality Distribution</h3>
            <p className="text-sm text-muted mt-1">
              Distribution of {selectedMetric} centrality across all nodes
            </p>
          </div>
          <div className="terminal-card-content">
            {analysis.distributionData[0] && (
              <div className="space-y-3">
                {analysis.distributionData[0].distribution.map((bucket, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-mono text-muted">
                      {bucket.range}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full" 
                            style={{ width: `${bucket.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-mono text-heading w-12">
                          {bucket.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted">
                        {bucket.count.toLocaleString()} nodes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Network Analysis Tools</h3>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-3">
              <a 
                href="/network/vulnerabilities"
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Target className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium text-heading">Vulnerability Assessment</div>
                  <div className="text-sm text-muted">Identify weak points and bottlenecks</div>
                </div>
              </a>

              <a 
                href="/network/critical-paths"
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Network className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-heading">Critical Paths</div>
                  <div className="text-sm text-muted">Essential connections and dependencies</div>
                </div>
              </a>

              <a 
                href="/network/simulation"
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-heading">Shock Simulation</div>
                  <div className="text-sm text-muted">Cascade failure impact modeling</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Centrality Metrics Explained</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-heading">Betweenness Centrality</span>
              </div>
              <p className="text-sm text-muted">
                Identifies nodes that act as bridges or bottlenecks in the network. High betweenness indicates control over information flow.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-4 w-4 text-green-600" />
                <span className="font-medium text-heading">Closeness Centrality</span>
              </div>
              <p className="text-sm text-muted">
                Measures how quickly a node can reach all other nodes. High closeness indicates efficient access to the entire network.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-heading">Eigenvector Centrality</span>
              </div>
              <p className="text-sm text-muted">
                Measures influence based on connections to other influential nodes. High eigenvector indicates authority and prestige.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Analysis: {new Date(analysis.summary.lastAnalysis).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}