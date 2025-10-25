'use client'

import { useState, useEffect } from 'react'
import { Network, Route, AlertTriangle } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface PathSegment {
  nodeId: string
  nodeName: string
  nodeType: string
  sector: string
  centralityScore: number
  connectionStrength: number
}

interface CriticalPath {
  id: string
  name: string
  description: string
  source: PathSegment
  target: PathSegment
  segments: PathSegment[]
  pathLength: number
  redundancy: number
  riskLevel: string
  importance: number
  vulnerabilityScore: number
  alternativePaths: number
  dependentSystems: string[]
}

interface PathAnalysis {
  summary: {
    totalPaths: number
    criticalPaths: number
    averagePathLength: number
    redundancyScore: number
    systemResilience: number
    lastAnalysis: string
  }
  paths: CriticalPath[]
  networkDependencies: {
    sector: string
    pathCount: number
    averageRedundancy: number
    riskLevel: string
  }[]
}

export default function CriticalPathsPage() {
  const [analysis, setAnalysis] = useState<PathAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPathData()
  }, [])

  const fetchPathData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/network/critical-paths`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.status === 'success') {
          // Transform backend data to expected format
          const transformedData = {
            summary: {
              totalPaths: result.data.path_summary?.total_paths || 0,
              criticalPaths: result.data.path_summary?.critical_paths || 0,
              averagePathLength: result.data.path_summary?.average_path_length || 0,
              redundancyScore: result.data.path_summary?.redundancy_score || 0,
              systemResilience: result.data.path_summary?.system_resilience || 0,
              lastAnalysis: new Date().toISOString()
            },
            paths: result.data.critical_paths?.map((path: any) => ({
              id: path.path_id,
              name: path.path_name,
              description: path.description,
              source: {
                nodeId: path.source_node.node_id,
                nodeName: path.source_node.node_name,
                nodeType: path.source_node.node_type,
                sector: path.source_node.sector,
                centralityScore: path.source_node.centrality_score,
                connectionStrength: path.source_node.connection_strength
              },
              target: {
                nodeId: path.target_node.node_id,
                nodeName: path.target_node.node_name,
                nodeType: path.target_node.node_type,
                sector: path.target_node.sector,
                centralityScore: path.target_node.centrality_score,
                connectionStrength: path.target_node.connection_strength
              },
              segments: path.path_segments?.map((segment: any) => ({
                nodeId: segment.node_id,
                nodeName: segment.node_name,
                nodeType: segment.node_type,
                sector: segment.sector,
                centralityScore: segment.centrality_score,
                connectionStrength: segment.connection_strength
              })) || [],
              pathLength: path.path_length,
              redundancy: path.redundancy_score,
              riskLevel: path.risk_level,
              importance: path.importance_score,
              vulnerabilityScore: path.vulnerability_score,
              alternativePaths: path.alternative_paths_count,
              dependentSystems: path.dependent_systems || []
            })) || [],
            networkDependencies: result.data.network_dependencies?.map((dep: any) => ({
              sector: dep.sector,
              pathCount: dep.path_count,
              averageRedundancy: dep.average_redundancy,
              riskLevel: dep.risk_level
            })) || []
          }
          setAnalysis(transformedData)
        } else {
          throw new Error(result.message || 'Failed to fetch critical paths data')
        }
      } else {
        throw new Error(`HTTP error ${response.status}`)
      }
    } catch (err) {
      console.error('Error fetching critical paths data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load critical paths data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Critical Paths Analysis</h1>
          <p className="text-secondary mt-2">Essential connections and dependency analysis</p>
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

  if (error) {
    return (
      <div className="terminal-card p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">Critical Paths Data Unavailable</h2>
        <p className="text-muted">{error}</p>
        <button 
          onClick={fetchPathData}
          className="mt-4 px-4 py-2 bg-terminal-blue text-white rounded hover:bg-terminal-blue/80"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="terminal-card p-8 text-center">
        <Network className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Critical Paths Data Available</h2>
        <p className="text-muted">Critical paths analysis data could not be loaded.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Critical Paths Analysis</h1>
        <p className="text-secondary mt-2">
          Essential connections and dependency analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Network className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Total Paths</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {analysis.summary.totalPaths}
          </div>
          <div className="text-xs text-muted mt-1">analyzed connections</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-muted">Critical Paths</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {analysis.summary.criticalPaths}
          </div>
          <div className="text-xs text-muted mt-1">high-risk dependencies</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Route className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted">System Resilience</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {(analysis.summary.systemResilience * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted mt-1">path redundancy</div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Critical Path Analysis</h3>
          <p className="text-sm text-muted mt-1">
            Essential network connections and dependency chains
          </p>
        </div>
        <div className="terminal-card-content">
          {analysis.paths.length > 0 ? (
            <div className="space-y-4">
              {analysis.paths.map((path) => (
                <div key={path.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-heading">{path.name}</div>
                    <StatusBadge 
                      status={path.riskLevel === 'critical' ? 'critical' : 
                              path.riskLevel === 'high' ? 'warning' : 'good'}
                      text={path.riskLevel}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-muted mb-3">{path.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted">Path Length</div>
                      <div className="font-mono text-heading">{path.pathLength}</div>
                    </div>
                    <div>
                      <div className="text-muted">Redundancy</div>
                      <div className="font-mono text-heading">{(path.redundancy * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted">Importance</div>
                      <div className="font-mono text-heading">{(path.importance * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted">Alternatives</div>
                      <div className="font-mono text-heading">{path.alternativePaths}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-8">
              No critical paths data available
            </div>
          )}
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Network Dependencies by Sector</h3>
        </div>
        <div className="terminal-card-content">
          {analysis.networkDependencies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.networkDependencies.map((dep, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="font-medium text-heading mb-2">{dep.sector}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Paths:</span>
                      <span className="font-mono">{dep.pathCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Avg Redundancy:</span>
                      <span className="font-mono">{(dep.averageRedundancy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Risk Level:</span>
                      <StatusBadge 
                        status={dep.riskLevel === 'critical' ? 'critical' : 
                                dep.riskLevel === 'high' ? 'warning' : 'good'}
                        text={dep.riskLevel}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-8">
              No network dependencies data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}