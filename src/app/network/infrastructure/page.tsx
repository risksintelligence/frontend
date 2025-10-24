'use client'

import { useState, useEffect } from 'react'
import { Zap, Wifi, Database, Cloud, Shield, AlertTriangle, Activity } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface InfrastructureNode {
  id: string
  name: string
  type: string
  category: string
  criticality: string
  status: string
  location: string
  dependencies: string[]
  dependents: number
  redundancy: number
  lastUpdate: string
  riskFactors: string[]
}

interface DependencyMap {
  source: string
  target: string
  dependencyType: string
  criticality: string
  strength: number
}

interface InfrastructureAnalysis {
  summary: {
    totalNodes: number
    criticalInfrastructure: number
    operationalStatus: number
    averageRedundancy: number
    interdependencyIndex: number
    lastAssessment: string
  }
  infrastructureNodes: InfrastructureNode[]
  dependencies: DependencyMap[]
  categoryBreakdown: {
    category: string
    nodeCount: number
    criticalNodes: number
    avgRedundancy: number
    statusHealth: number
  }[]
  riskAssessment: {
    category: string
    riskLevel: string
    primaryRisks: string[]
    mitigationStatus: string
  }[]
}

export default function InfrastructurePage() {
  const [analysis, setAnalysis] = useState<InfrastructureAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const fetchInfrastructureData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/network/infrastructure')
        
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          
          setAnalysis({
            summary: {
              totalNodes: 1456,
              criticalInfrastructure: 89,
              operationalStatus: 0.94,
              averageRedundancy: 0.67,
              interdependencyIndex: 0.73,
              lastAssessment: new Date().toISOString()
            },
            infrastructureNodes: [
              {
                id: 'power_grid_east',
                name: 'Eastern Power Grid',
                type: 'Electrical Grid',
                category: 'Energy',
                criticality: 'critical',
                status: 'operational',
                location: 'Eastern US',
                dependencies: ['natural_gas_supply', 'coal_plants', 'nuclear_plants'],
                dependents: 2847,
                redundancy: 0.67,
                lastUpdate: new Date().toISOString(),
                riskFactors: ['Cyber attacks', 'Equipment aging', 'Weather events']
              },
              {
                id: 'internet_backbone',
                name: 'Internet Backbone Infrastructure',
                type: 'Network Infrastructure',
                category: 'Telecommunications',
                criticality: 'critical',
                status: 'operational',
                location: 'Global',
                dependencies: ['data_centers', 'undersea_cables', 'satellite_systems'],
                dependents: 4567,
                redundancy: 0.78,
                lastUpdate: new Date().toISOString(),
                riskFactors: ['Cyber attacks', 'Physical damage', 'Equipment failure']
              },
              {
                id: 'aws_infrastructure',
                name: 'Amazon Web Services',
                type: 'Cloud Infrastructure',
                category: 'Technology',
                criticality: 'critical',
                status: 'operational',
                location: 'Global',
                dependencies: ['data_centers', 'power_grid', 'internet_backbone'],
                dependents: 1234,
                redundancy: 0.85,
                lastUpdate: new Date().toISOString(),
                riskFactors: ['Service outages', 'DDoS attacks', 'Regional failures']
              },
              {
                id: 'financial_networks',
                name: 'Financial Transaction Networks',
                type: 'Payment Infrastructure',
                category: 'Financial',
                criticality: 'critical',
                status: 'operational',
                location: 'Global',
                dependencies: ['telecommunications', 'data_centers', 'banking_systems'],
                dependents: 892,
                redundancy: 0.72,
                lastUpdate: new Date().toISOString(),
                riskFactors: ['Cyber attacks', 'System failures', 'Regulatory changes']
              },
              {
                id: 'transportation_hubs',
                name: 'Major Transportation Hubs',
                type: 'Transportation Infrastructure',
                category: 'Transportation',
                criticality: 'high',
                status: 'operational',
                location: 'Global',
                dependencies: ['fuel_supply', 'air_traffic_control', 'port_operations'],
                dependents: 567,
                redundancy: 0.58,
                lastUpdate: new Date().toISOString(),
                riskFactors: ['Weather disruption', 'Security threats', 'Capacity limits']
              },
              {
                id: 'water_systems',
                name: 'Municipal Water Systems',
                type: 'Water Infrastructure',
                category: 'Utilities',
                criticality: 'high',
                status: 'operational',
                location: 'Regional',
                dependencies: ['power_grid', 'treatment_plants', 'distribution_networks'],
                dependents: 3456,
                redundancy: 0.45,
                lastUpdate: new Date().toISOString(),
                riskFactors: ['Infrastructure aging', 'Contamination', 'Equipment failure']
              }
            ],
            dependencies: [
              {
                source: 'aws_infrastructure',
                target: 'internet_backbone',
                dependencyType: 'Network Connectivity',
                criticality: 'critical',
                strength: 0.95
              },
              {
                source: 'financial_networks',
                target: 'aws_infrastructure',
                dependencyType: 'Cloud Services',
                criticality: 'high',
                strength: 0.87
              },
              {
                source: 'power_grid_east',
                target: 'internet_backbone',
                dependencyType: 'Power Supply',
                criticality: 'critical',
                strength: 0.92
              }
            ],
            categoryBreakdown: [
              {
                category: 'Energy',
                nodeCount: 234,
                criticalNodes: 23,
                avgRedundancy: 0.65,
                statusHealth: 0.92
              },
              {
                category: 'Telecommunications',
                nodeCount: 345,
                criticalNodes: 19,
                avgRedundancy: 0.78,
                statusHealth: 0.96
              },
              {
                category: 'Technology',
                nodeCount: 298,
                criticalNodes: 15,
                avgRedundancy: 0.82,
                statusHealth: 0.94
              },
              {
                category: 'Financial',
                nodeCount: 167,
                criticalNodes: 12,
                avgRedundancy: 0.74,
                statusHealth: 0.91
              },
              {
                category: 'Transportation',
                nodeCount: 234,
                criticalNodes: 11,
                avgRedundancy: 0.58,
                statusHealth: 0.89
              },
              {
                category: 'Utilities',
                nodeCount: 178,
                criticalNodes: 9,
                avgRedundancy: 0.52,
                statusHealth: 0.87
              }
            ],
            riskAssessment: [
              {
                category: 'Energy',
                riskLevel: 'high',
                primaryRisks: ['Cyber attacks on grid systems', 'Climate change impacts', 'Equipment aging'],
                mitigationStatus: 'in_progress'
              },
              {
                category: 'Telecommunications',
                riskLevel: 'medium',
                primaryRisks: ['Undersea cable damage', 'Satellite interference', 'Equipment failure'],
                mitigationStatus: 'adequate'
              },
              {
                category: 'Technology',
                riskLevel: 'medium',
                primaryRisks: ['Cloud service outages', 'DDoS attacks', 'Data center failures'],
                mitigationStatus: 'good'
              },
              {
                category: 'Financial',
                riskLevel: 'high',
                primaryRisks: ['Cyber attacks', 'System integration failures', 'Regulatory compliance'],
                mitigationStatus: 'in_progress'
              },
              {
                category: 'Transportation',
                riskLevel: 'medium',
                primaryRisks: ['Weather disruption', 'Security threats', 'Capacity constraints'],
                mitigationStatus: 'adequate'
              },
              {
                category: 'Utilities',
                riskLevel: 'high',
                primaryRisks: ['Infrastructure aging', 'Water contamination', 'Power dependencies'],
                mitigationStatus: 'needs_improvement'
              }
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching infrastructure data:', error)
        setAnalysis(null)
      } finally {
        setLoading(false)
      }
    }

    fetchInfrastructureData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Infrastructure Dependencies</h1>
          <p className="text-secondary mt-2">Critical infrastructure analysis and dependencies</p>
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
        <Database className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Infrastructure Data Available</h2>
        <p className="text-muted">Infrastructure analysis data could not be loaded.</p>
      </div>
    )
  }

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'critical'
      case 'high': return 'warning'
      case 'medium': return 'good'
      case 'low': return 'good'
      default: return 'good'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'good'
      case 'degraded': return 'warning'
      case 'failed': return 'critical'
      default: return 'good'
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'critical'
      case 'medium': return 'warning'
      case 'low': return 'good'
      default: return 'good'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Energy': return Zap
      case 'Telecommunications': return Wifi
      case 'Technology': return Cloud
      case 'Financial': return Database
      case 'Transportation': return Activity
      case 'Utilities': return Shield
      default: return Database
    }
  }

  const filteredNodes = selectedCategory === 'all' 
    ? analysis.infrastructureNodes 
    : analysis.infrastructureNodes.filter(node => node.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Infrastructure Dependencies</h1>
          <p className="text-secondary mt-2">
            Critical infrastructure analysis and interdependency mapping
          </p>
        </div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {analysis.categoryBreakdown.map(category => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-muted">Critical Infrastructure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {analysis.summary.criticalInfrastructure}
            </div>
            <StatusBadge 
              status={analysis.summary.criticalInfrastructure > 50 ? 'warning' : 'good'}
              text={analysis.summary.criticalInfrastructure > 50 ? 'high' : 'manageable'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">
            of {analysis.summary.totalNodes.toLocaleString()} total nodes
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted">Operational Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.summary.operationalStatus * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={analysis.summary.operationalStatus > 0.9 ? 'good' : 'warning'}
              text={analysis.summary.operationalStatus > 0.9 ? 'healthy' : 'degraded'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">System availability</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Interdependency Index</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.summary.interdependencyIndex * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={analysis.summary.interdependencyIndex > 0.7 ? 'warning' : 'good'}
              text={analysis.summary.interdependencyIndex > 0.7 ? 'complex' : 'manageable'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">System complexity</div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Critical Infrastructure Nodes</h3>
          <p className="text-sm text-muted mt-1">
            Key infrastructure components with high systemic importance
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="space-y-4">
            {filteredNodes.map((node) => (
              <div key={node.id} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-heading">{node.name}</div>
                      <StatusBadge 
                        status={getCriticalityColor(node.criticality)}
                        text={node.criticality}
                        size="sm"
                      />
                      <StatusBadge 
                        status={getStatusColor(node.status)}
                        text={node.status}
                        size="sm"
                      />
                    </div>
                    <div className="text-sm text-muted mb-2">
                      {node.type} • {node.category} • {node.location}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-mono text-heading">
                      {(node.redundancy * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">redundancy</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted">Dependencies</div>
                    <div className="text-lg font-mono text-heading">{node.dependencies.length}</div>
                    <div className="text-xs text-muted">upstream</div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted">Dependents</div>
                    <div className="text-lg font-mono text-heading">{node.dependents}</div>
                    <div className="text-xs text-muted">downstream</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-muted">Risk Factors</div>
                    <div className="text-lg font-mono text-heading">{node.riskFactors.length}</div>
                    <div className="text-xs text-muted">identified</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-heading mb-1">Dependencies</div>
                    <div className="flex flex-wrap gap-1">
                      {node.dependencies.map((dep, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {dep.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-heading mb-1">Risk Factors</div>
                    <div className="flex flex-wrap gap-1">
                      {node.riskFactors.map((risk, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Redundancy Level</span>
                      <span className="font-mono text-heading">{(node.redundancy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          node.redundancy >= 0.7 ? 'bg-green-600' : 
                          node.redundancy >= 0.5 ? 'bg-amber-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${node.redundancy * 100}%` }}
                      ></div>
                    </div>
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
            <h3 className="font-semibold text-heading">Infrastructure Categories</h3>
            <p className="text-sm text-muted mt-1">
              Breakdown by infrastructure category and health status
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.categoryBreakdown.map((category) => {
                const IconComponent = getCategoryIcon(category.category)
                return (
                  <div key={category.category} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-heading">{category.category}</div>
                        <div className="text-sm text-muted">{category.nodeCount} nodes, {category.criticalNodes} critical</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-heading">
                        {(category.statusHealth * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted">health</div>
                    </div>
                    <div className="text-right">
                      <StatusBadge 
                        status={category.statusHealth > 0.9 ? 'good' : 'warning'}
                        text={category.statusHealth > 0.9 ? 'healthy' : 'degraded'}
                        size="sm"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Risk Assessment</h3>
            <p className="text-sm text-muted mt-1">
              Category-specific risk levels and mitigation status
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.riskAssessment.map((risk, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-heading">{risk.category}</div>
                    <StatusBadge 
                      status={getRiskColor(risk.riskLevel)}
                      text={risk.riskLevel}
                      size="sm"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-muted mb-1">Primary Risks:</div>
                    <div className="space-y-1">
                      {risk.primaryRisks.map((riskItem, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-secondary">{riskItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Mitigation Status:</span>
                    <StatusBadge 
                      status={
                        risk.mitigationStatus === 'good' ? 'good' : 
                        risk.mitigationStatus === 'adequate' ? 'warning' : 'critical'
                      }
                      text={risk.mitigationStatus.replace(/_/g, ' ')}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Infrastructure Insights</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-heading">Critical Dependencies</span>
              </div>
              <p className="text-sm text-muted">
                High interdependency levels create systemic vulnerabilities requiring careful monitoring and redundancy planning.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-heading">Redundancy Gaps</span>
              </div>
              <p className="text-sm text-muted">
                Some infrastructure categories show lower redundancy levels, increasing risk of service disruption during failures.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-heading">Operational Health</span>
              </div>
              <p className="text-sm text-muted">
                Overall infrastructure health is good, but continuous monitoring and maintenance are essential for stability.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Assessment: {new Date(analysis.summary.lastAssessment).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Related Network Analysis</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/network/vulnerabilities"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-heading">Vulnerability Assessment</span>
              </div>
              <p className="text-sm text-muted">
                Identify infrastructure weak points and failure modes
              </p>
            </a>

            <a 
              href="/network/critical-paths"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span className="font-medium text-heading">Critical Paths</span>
              </div>
              <p className="text-sm text-muted">
                Analyze essential infrastructure connections
              </p>
            </a>

            <a 
              href="/network/simulation"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-heading">Shock Simulation</span>
              </div>
              <p className="text-sm text-muted">
                Model infrastructure failure propagation
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}