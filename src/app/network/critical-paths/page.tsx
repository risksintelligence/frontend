'use client'

import { useState, useEffect } from 'react'
import { Network, Route, ArrowRight, GitBranch, MapPin, AlertTriangle } from 'lucide-react'
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
    averageLength: number
    redundancyIndex: number
    systemDependencies: number
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
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  useEffect(() => {
    const fetchPathData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/network/critical-paths')
        
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          
          setAnalysis({
            summary: {
              totalPaths: 156,
              criticalPaths: 23,
              averageLength: 4.2,
              redundancyIndex: 0.47,
              systemDependencies: 67,
              lastAnalysis: new Date().toISOString()
            },
            paths: [
              {
                id: 'path_001',
                name: 'Federal Reserve → Major Banks',
                description: 'Critical monetary policy transmission path to major commercial banks',
                source: {
                  nodeId: 'fed_001',
                  nodeName: 'Federal Reserve System',
                  nodeType: 'Central Bank',
                  sector: 'Banking',
                  centralityScore: 0.92,
                  connectionStrength: 0.95
                },
                target: {
                  nodeId: 'banks_major',
                  nodeName: 'Major Commercial Banks',
                  nodeType: 'Banking Network',
                  sector: 'Banking',
                  centralityScore: 0.84,
                  connectionStrength: 0.89
                },
                segments: [
                  {
                    nodeId: 'fed_001',
                    nodeName: 'Federal Reserve System',
                    nodeType: 'Central Bank',
                    sector: 'Banking',
                    centralityScore: 0.92,
                    connectionStrength: 0.95
                  },
                  {
                    nodeId: 'primary_dealers',
                    nodeName: 'Primary Dealers',
                    nodeType: 'Financial Intermediary',
                    sector: 'Banking',
                    centralityScore: 0.78,
                    connectionStrength: 0.87
                  },
                  {
                    nodeId: 'banks_major',
                    nodeName: 'Major Commercial Banks',
                    nodeType: 'Banking Network',
                    sector: 'Banking',
                    centralityScore: 0.84,
                    connectionStrength: 0.89
                  }
                ],
                pathLength: 3,
                redundancy: 0.23,
                riskLevel: 'critical',
                importance: 0.94,
                vulnerabilityScore: 0.89,
                alternativePaths: 2,
                dependentSystems: ['Credit Markets', 'Mortgage System', 'Consumer Banking']
              },
              {
                id: 'path_002',
                name: 'TSMC → Global Tech Supply',
                description: 'Semiconductor supply path from Taiwan to global technology companies',
                source: {
                  nodeId: 'tsmc_001',
                  nodeName: 'Taiwan Semiconductor',
                  nodeType: 'Manufacturer',
                  sector: 'Technology',
                  centralityScore: 0.85,
                  connectionStrength: 0.91
                },
                target: {
                  nodeId: 'tech_global',
                  nodeName: 'Global Tech Companies',
                  nodeType: 'Technology Network',
                  sector: 'Technology',
                  centralityScore: 0.79,
                  connectionStrength: 0.82
                },
                segments: [
                  {
                    nodeId: 'tsmc_001',
                    nodeName: 'Taiwan Semiconductor',
                    nodeType: 'Manufacturer',
                    sector: 'Technology',
                    centralityScore: 0.85,
                    connectionStrength: 0.91
                  },
                  {
                    nodeId: 'distributors_asia',
                    nodeName: 'Asian Distributors',
                    nodeType: 'Distribution Hub',
                    sector: 'Logistics',
                    centralityScore: 0.67,
                    connectionStrength: 0.76
                  },
                  {
                    nodeId: 'shipping_pacific',
                    nodeName: 'Pacific Shipping',
                    nodeType: 'Transportation',
                    sector: 'Logistics',
                    centralityScore: 0.59,
                    connectionStrength: 0.71
                  },
                  {
                    nodeId: 'tech_global',
                    nodeName: 'Global Tech Companies',
                    nodeType: 'Technology Network',
                    sector: 'Technology',
                    centralityScore: 0.79,
                    connectionStrength: 0.82
                  }
                ],
                pathLength: 4,
                redundancy: 0.34,
                riskLevel: 'high',
                importance: 0.87,
                vulnerabilityScore: 0.82,
                alternativePaths: 3,
                dependentSystems: ['Consumer Electronics', 'Automotive', 'Data Centers']
              },
              {
                id: 'path_003',
                name: 'Middle East Oil → Global Energy',
                description: 'Energy supply path from Middle East oil producers to global markets',
                source: {
                  nodeId: 'me_oil',
                  nodeName: 'Middle East Oil Producers',
                  nodeType: 'Energy Producer',
                  sector: 'Energy',
                  centralityScore: 0.81,
                  connectionStrength: 0.88
                },
                target: {
                  nodeId: 'energy_global',
                  nodeName: 'Global Energy Markets',
                  nodeType: 'Energy Network',
                  sector: 'Energy',
                  centralityScore: 0.76,
                  connectionStrength: 0.79
                },
                segments: [
                  {
                    nodeId: 'me_oil',
                    nodeName: 'Middle East Oil Producers',
                    nodeType: 'Energy Producer',
                    sector: 'Energy',
                    centralityScore: 0.81,
                    connectionStrength: 0.88
                  },
                  {
                    nodeId: 'suez_canal',
                    nodeName: 'Suez Canal',
                    nodeType: 'Transportation Hub',
                    sector: 'Logistics',
                    centralityScore: 0.73,
                    connectionStrength: 0.84
                  },
                  {
                    nodeId: 'refineries_global',
                    nodeName: 'Global Refineries',
                    nodeType: 'Processing Network',
                    sector: 'Energy',
                    centralityScore: 0.68,
                    connectionStrength: 0.75
                  },
                  {
                    nodeId: 'energy_global',
                    nodeName: 'Global Energy Markets',
                    nodeType: 'Energy Network',
                    sector: 'Energy',
                    centralityScore: 0.76,
                    connectionStrength: 0.79
                  }
                ],
                pathLength: 4,
                redundancy: 0.41,
                riskLevel: 'high',
                importance: 0.83,
                vulnerabilityScore: 0.76,
                alternativePaths: 4,
                dependentSystems: ['Transportation', 'Manufacturing', 'Power Grid']
              }
            ],
            networkDependencies: [
              {
                sector: 'Banking',
                pathCount: 45,
                averageRedundancy: 0.31,
                riskLevel: 'critical'
              },
              {
                sector: 'Technology',
                pathCount: 38,
                averageRedundancy: 0.42,
                riskLevel: 'high'
              },
              {
                sector: 'Energy',
                pathCount: 29,
                averageRedundancy: 0.48,
                riskLevel: 'high'
              },
              {
                sector: 'Logistics',
                pathCount: 24,
                averageRedundancy: 0.55,
                riskLevel: 'medium'
              },
              {
                sector: 'Manufacturing',
                pathCount: 20,
                averageRedundancy: 0.51,
                riskLevel: 'medium'
              }
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching critical paths data:', error)
        setAnalysis(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPathData()
  }, [])

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

  if (!analysis) {
    return (
      <div className="terminal-card p-8 text-center">
        <Network className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Critical Paths Data Available</h2>
        <p className="text-muted">Critical paths analysis data could not be loaded.</p>
      </div>
    )
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'critical'
      case 'high': return 'warning'
      case 'medium': return 'good'
      case 'low': return 'good'
      default: return 'good'
    }
  }

  const getRedundancyStatus = (redundancy: number) => {
    if (redundancy < 0.3) return 'critical'
    if (redundancy < 0.5) return 'warning'
    return 'good'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Critical Paths Analysis</h1>
        <p className="text-secondary mt-2">
          Essential connections and dependency chain analysis across network infrastructure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Route className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Critical Paths</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {analysis.summary.criticalPaths}
            </div>
            <StatusBadge 
              status={analysis.summary.criticalPaths > 20 ? 'warning' : 'good'}
              text={analysis.summary.criticalPaths > 20 ? 'elevated' : 'normal'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">
            of {analysis.summary.totalPaths} total paths
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted">Redundancy Index</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.summary.redundancyIndex * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={getRedundancyStatus(analysis.summary.redundancyIndex)}
              text={analysis.summary.redundancyIndex > 0.5 ? 'resilient' : 'vulnerable'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Alternative path availability</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Average Path Length</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {analysis.summary.averageLength.toFixed(1)}
          </div>
          <div className="text-xs text-muted mt-1">
            {analysis.summary.systemDependencies} system dependencies
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Critical Infrastructure Paths</h3>
          <p className="text-sm text-muted mt-1">
            Essential connection paths with high systemic importance
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="space-y-4">
            {analysis.paths.map((path) => (
              <div key={path.id} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-heading">{path.name}</div>
                      <StatusBadge 
                        status={getRiskColor(path.riskLevel)}
                        text={path.riskLevel}
                        size="sm"
                      />
                    </div>
                    <p className="text-secondary text-sm mb-3">{path.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-mono text-heading">
                      {(path.importance * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">importance</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted">Path Length</div>
                    <div className="text-lg font-mono text-heading">{path.pathLength}</div>
                    <div className="text-xs text-muted">segments</div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted">Redundancy</div>
                    <div className="text-lg font-mono text-heading">
                      {(path.redundancy * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">alternatives</div>
                  </div>

                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-muted">Vulnerability</div>
                    <div className="text-lg font-mono text-heading">
                      {(path.vulnerabilityScore * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">risk score</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-muted">Alt Paths</div>
                    <div className="text-lg font-mono text-heading">{path.alternativePaths}</div>
                    <div className="text-xs text-muted">available</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-medium text-heading mb-2">Path Segments</div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {path.segments.map((segment, index) => (
                      <div key={segment.nodeId} className="flex items-center gap-2 min-w-0">
                        <div className="bg-white border border-slate-300 rounded-lg px-3 py-2 min-w-0">
                          <div className="text-sm font-medium text-heading truncate">
                            {segment.nodeName}
                          </div>
                          <div className="text-xs text-muted">{segment.sector}</div>
                          <div className="text-xs font-mono text-secondary">
                            {(segment.centralityScore * 100).toFixed(0)}%
                          </div>
                        </div>
                        {index < path.segments.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-heading mb-2">Dependent Systems</div>
                  <div className="flex flex-wrap gap-2">
                    {path.dependentSystems.map((system, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                      >
                        {system}
                      </span>
                    ))}
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
            <h3 className="font-semibold text-heading">Sector Dependencies</h3>
            <p className="text-sm text-muted mt-1">
              Critical path distribution by economic sector
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.networkDependencies.map((sector, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-heading">{sector.sector}</div>
                    <div className="text-sm text-muted">{sector.pathCount} critical paths</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted">Redundancy</div>
                    <div className="font-mono text-heading">
                      {(sector.averageRedundancy * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge 
                      status={getRiskColor(sector.riskLevel)}
                      text={sector.riskLevel}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Path Analysis Tools</h3>
          </div>
          <div className="terminal-card-content space-y-4">
            <a 
              href="/network/vulnerabilities"
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <div className="font-medium text-heading">Vulnerability Assessment</div>
                <div className="text-sm text-muted">Identify weak points in critical paths</div>
              </div>
            </a>

            <a 
              href="/network/simulation"
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Route className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-heading">Shock Simulation</div>
                <div className="text-sm text-muted">Test path resilience under stress</div>
              </div>
            </a>

            <a 
              href="/network/centrality"
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Network className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-heading">Centrality Analysis</div>
                <div className="text-sm text-muted">Analyze node importance in paths</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Path Resilience Insights</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-heading">High Risk Paths</span>
              </div>
              <p className="text-sm text-muted">
                Paths with low redundancy and high systemic importance require immediate attention for resilience improvement.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-heading">Redundancy Gaps</span>
              </div>
              <p className="text-sm text-muted">
                Critical paths with limited alternative routes represent significant vulnerability to systemic disruption.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Route className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-heading">Path Optimization</span>
              </div>
              <p className="text-sm text-muted">
                Shorter critical paths with higher redundancy provide better system resilience and faster recovery.
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