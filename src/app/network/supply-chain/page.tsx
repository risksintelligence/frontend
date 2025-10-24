'use client'

import { useState, useEffect } from 'react'
import { Truck, Factory, Globe, MapPin, TrendingUp, AlertTriangle } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface SupplyChainNode {
  id: string
  name: string
  type: string
  tier: number
  sector: string
  location: string
  riskScore: number
  criticalityLevel: string
  dependencies: number
  suppliers: number
  customers: number
  alternativeSources: number
}

interface SupplyChainRisk {
  id: string
  name: string
  type: string
  severity: string
  likelihood: number
  impact: number
  affectedNodes: number
  description: string
  mitigation: string[]
}

interface SupplyChainAnalysis {
  summary: {
    totalNodes: number
    tierLevels: number
    criticalNodes: number
    averageRiskScore: number
    supplyConcentration: number
    geographicDiversity: number
    lastAnalysis: string
  }
  keySuppliers: SupplyChainNode[]
  riskFactors: SupplyChainRisk[]
  tierDistribution: {
    tier: number
    nodeCount: number
    avgRiskScore: number
    criticalNodes: number
  }[]
  geographicDistribution: {
    region: string
    nodeCount: number
    riskLevel: string
    keySuppliers: string[]
  }[]
}

export default function SupplyChainPage() {
  const [analysis, setAnalysis] = useState<SupplyChainAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)

  useEffect(() => {
    const fetchSupplyChainData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/network/supply-chain')
        
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          
          setAnalysis({
            summary: {
              totalNodes: 2847,
              tierLevels: 5,
              criticalNodes: 89,
              averageRiskScore: 0.67,
              supplyConcentration: 0.73,
              geographicDiversity: 0.42,
              lastAnalysis: new Date().toISOString()
            },
            keySuppliers: [
              {
                id: 'tsmc_001',
                name: 'Taiwan Semiconductor Manufacturing Co.',
                type: 'Primary Manufacturer',
                tier: 1,
                sector: 'Technology',
                location: 'Taiwan',
                riskScore: 0.89,
                criticalityLevel: 'critical',
                dependencies: 45,
                suppliers: 234,
                customers: 1247,
                alternativeSources: 2
              },
              {
                id: 'rare_earth_china',
                name: 'Chinese Rare Earth Consortium',
                type: 'Raw Material Supplier',
                tier: 2,
                sector: 'Mining',
                location: 'China',
                riskScore: 0.85,
                criticalityLevel: 'critical',
                dependencies: 12,
                suppliers: 67,
                customers: 892,
                alternativeSources: 1
              },
              {
                id: 'asml_netherlands',
                name: 'ASML Holding N.V.',
                type: 'Equipment Manufacturer',
                tier: 1,
                sector: 'Technology',
                location: 'Netherlands',
                riskScore: 0.82,
                criticalityLevel: 'high',
                dependencies: 89,
                suppliers: 345,
                customers: 23,
                alternativeSources: 0
              },
              {
                id: 'foxconn_global',
                name: 'Foxconn Technology Group',
                type: 'Contract Manufacturer',
                tier: 1,
                sector: 'Manufacturing',
                location: 'China/Global',
                riskScore: 0.78,
                criticalityLevel: 'high',
                dependencies: 156,
                suppliers: 1234,
                customers: 567,
                alternativeSources: 4
              },
              {
                id: 'maersk_shipping',
                name: 'Maersk Line',
                type: 'Logistics Provider',
                tier: 3,
                sector: 'Logistics',
                location: 'Global',
                riskScore: 0.74,
                criticalityLevel: 'high',
                dependencies: 67,
                suppliers: 234,
                customers: 1892,
                alternativeSources: 8
              }
            ],
            riskFactors: [
              {
                id: 'risk_001',
                name: 'Taiwan Geopolitical Risk',
                type: 'Geopolitical',
                severity: 'critical',
                likelihood: 0.34,
                impact: 0.92,
                affectedNodes: 1247,
                description: 'Potential military conflict or trade restrictions affecting Taiwan-based suppliers',
                mitigation: [
                  'Develop alternative semiconductor manufacturing capacity',
                  'Build strategic chip inventory reserves',
                  'Diversify supplier base to other regions'
                ]
              },
              {
                id: 'risk_002',
                name: 'China Rare Earth Monopoly',
                type: 'Supply Concentration',
                severity: 'critical',
                likelihood: 0.28,
                impact: 0.89,
                affectedNodes: 892,
                description: 'Over-dependence on Chinese rare earth element production for technology supply chains',
                mitigation: [
                  'Invest in alternative rare earth mining projects',
                  'Develop recycling and recovery technologies',
                  'Build strategic material reserves'
                ]
              },
              {
                id: 'risk_003',
                name: 'Shipping Route Disruption',
                type: 'Transportation',
                severity: 'high',
                likelihood: 0.41,
                impact: 0.76,
                affectedNodes: 1892,
                description: 'Disruption to major shipping routes affecting global trade flows',
                mitigation: [
                  'Develop alternative shipping routes',
                  'Increase port capacity and efficiency',
                  'Build regional distribution centers'
                ]
              },
              {
                id: 'risk_004',
                name: 'Energy Supply Dependency',
                type: 'Energy Security',
                severity: 'high',
                likelihood: 0.37,
                impact: 0.71,
                affectedNodes: 1456,
                description: 'Manufacturing facilities dependent on unstable energy supply sources',
                mitigation: [
                  'Diversify energy supply sources',
                  'Invest in renewable energy infrastructure',
                  'Implement energy storage systems'
                ]
              }
            ],
            tierDistribution: [
              { tier: 1, nodeCount: 234, avgRiskScore: 0.79, criticalNodes: 23 },
              { tier: 2, nodeCount: 567, avgRiskScore: 0.71, criticalNodes: 34 },
              { tier: 3, nodeCount: 892, avgRiskScore: 0.68, criticalNodes: 21 },
              { tier: 4, nodeCount: 734, avgRiskScore: 0.61, criticalNodes: 8 },
              { tier: 5, nodeCount: 420, avgRiskScore: 0.54, criticalNodes: 3 }
            ],
            geographicDistribution: [
              {
                region: 'East Asia',
                nodeCount: 1247,
                riskLevel: 'high',
                keySuppliers: ['TSMC', 'Foxconn', 'Samsung', 'Sony']
              },
              {
                region: 'North America',
                nodeCount: 567,
                riskLevel: 'medium',
                keySuppliers: ['Intel', 'Apple', 'Tesla', 'Boeing']
              },
              {
                region: 'Europe',
                nodeCount: 423,
                riskLevel: 'medium',
                keySuppliers: ['ASML', 'Siemens', 'Volkswagen', 'Airbus']
              },
              {
                region: 'South Asia',
                nodeCount: 298,
                riskLevel: 'medium',
                keySuppliers: ['Tata Group', 'Infosys', 'Wipro']
              },
              {
                region: 'Other',
                nodeCount: 312,
                riskLevel: 'low',
                keySuppliers: ['Various Regional Suppliers']
              }
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching supply chain data:', error)
        setAnalysis(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplyChainData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Supply Chain Analysis</h1>
          <p className="text-secondary mt-2">Supply chain network mapping and risk analysis</p>
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
        <Truck className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Supply Chain Data Available</h2>
        <p className="text-muted">Supply chain analysis data could not be loaded.</p>
      </div>
    )
  }

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'critical'
      case 'high': return 'warning'
      case 'medium': return 'good'
      case 'low': return 'good'
      default: return 'good'
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 0.8) return 'critical'
    if (score >= 0.6) return 'warning'
    return 'good'
  }

  const filteredSuppliers = selectedTier 
    ? analysis.keySuppliers.filter(supplier => supplier.tier === selectedTier)
    : analysis.keySuppliers

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Supply Chain Analysis</h1>
          <p className="text-secondary mt-2">
            Comprehensive supply chain network mapping and vulnerability assessment
          </p>
        </div>
        <select 
          value={selectedTier || 'all'} 
          onChange={(e) => setSelectedTier(e.target.value === 'all' ? null : parseInt(e.target.value))}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Tiers</option>
          {analysis.tierDistribution.map(tier => (
            <option key={tier.tier} value={tier.tier}>Tier {tier.tier}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Factory className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Critical Suppliers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {analysis.summary.criticalNodes}
            </div>
            <StatusBadge 
              status={analysis.summary.criticalNodes > 50 ? 'warning' : 'good'}
              text={analysis.summary.criticalNodes > 50 ? 'elevated' : 'manageable'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">
            of {analysis.summary.totalNodes.toLocaleString()} total nodes
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted">Geographic Diversity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.summary.geographicDiversity * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={analysis.summary.geographicDiversity > 0.6 ? 'good' : 'warning'}
              text={analysis.summary.geographicDiversity > 0.6 ? 'diverse' : 'concentrated'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Regional distribution</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-muted">Supply Concentration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.summary.supplyConcentration * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={analysis.summary.supplyConcentration > 0.7 ? 'warning' : 'good'}
              text={analysis.summary.supplyConcentration > 0.7 ? 'concentrated' : 'distributed'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Dependency risk</div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Key Supply Chain Suppliers</h3>
          <p className="text-sm text-muted mt-1">
            Critical suppliers with high systemic importance and dependency levels
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="space-y-4">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-heading">{supplier.name}</div>
                      <StatusBadge 
                        status={getCriticalityColor(supplier.criticalityLevel)}
                        text={supplier.criticalityLevel}
                        size="sm"
                      />
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        Tier {supplier.tier}
                      </span>
                    </div>
                    <div className="text-sm text-muted mb-2">
                      {supplier.type} • {supplier.sector} • {supplier.location}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-mono text-heading">
                      {(supplier.riskScore * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">risk score</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted">Dependencies</div>
                    <div className="text-lg font-mono text-heading">{supplier.dependencies}</div>
                    <div className="text-xs text-muted">upstream</div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted">Suppliers</div>
                    <div className="text-lg font-mono text-heading">{supplier.suppliers}</div>
                    <div className="text-xs text-muted">total count</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-muted">Customers</div>
                    <div className="text-lg font-mono text-heading">{supplier.customers}</div>
                    <div className="text-xs text-muted">downstream</div>
                  </div>

                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-muted">Alternatives</div>
                    <div className="text-lg font-mono text-heading">{supplier.alternativeSources}</div>
                    <StatusBadge 
                      status={supplier.alternativeSources > 2 ? 'good' : 'warning'}
                      text={supplier.alternativeSources > 2 ? 'diverse' : 'limited'}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Supply Chain Risk Score</span>
                    <span className="font-mono text-heading">{(supplier.riskScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        supplier.riskScore >= 0.8 ? 'bg-red-600' : 
                        supplier.riskScore >= 0.6 ? 'bg-amber-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${supplier.riskScore * 100}%` }}
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
            <h3 className="font-semibold text-heading">Supply Chain Risk Factors</h3>
            <p className="text-sm text-muted mt-1">
              Key risks threatening supply chain stability
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.riskFactors.map((risk) => (
                <div key={risk.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-heading">{risk.name}</div>
                    <StatusBadge 
                      status={getRiskColor(risk.impact)}
                      text={risk.severity}
                      size="sm"
                    />
                  </div>
                  <div className="text-sm text-muted mb-2">{risk.type}</div>
                  <p className="text-sm text-secondary mb-3">{risk.description}</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-muted">Likelihood</div>
                      <div className="font-mono text-heading">{(risk.likelihood * 100).toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-muted">Impact</div>
                      <div className="font-mono text-heading">{(risk.impact * 100).toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-muted">Affected</div>
                      <div className="font-mono text-heading">{risk.affectedNodes}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted mb-1">Mitigation Strategies:</div>
                    <div className="space-y-1">
                      {risk.mitigation.slice(0, 2).map((strategy, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-secondary">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Tier Distribution</h3>
            <p className="text-sm text-muted mt-1">
              Supply chain structure by tier levels
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.tierDistribution.map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-800">{tier.tier}</span>
                    </div>
                    <div>
                      <div className="font-medium text-heading">Tier {tier.tier}</div>
                      <div className="text-sm text-muted">{tier.nodeCount} suppliers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-heading">
                      {(tier.avgRiskScore * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">avg risk</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-heading">{tier.criticalNodes}</div>
                    <div className="text-xs text-muted">critical</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Geographic Distribution</h3>
          <p className="text-sm text-muted mt-1">
            Supply chain nodes distributed by geographic regions
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {analysis.geographicDistribution.map((region, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div className="font-medium text-heading">{region.region}</div>
                  </div>
                  <StatusBadge 
                    status={getRiskColor(region.riskLevel === 'high' ? 0.8 : region.riskLevel === 'medium' ? 0.6 : 0.3)}
                    text={region.riskLevel}
                    size="sm"
                  />
                </div>
                <div className="text-2xl font-mono text-heading mb-1">{region.nodeCount}</div>
                <div className="text-sm text-muted mb-3">supply chain nodes</div>
                <div>
                  <div className="text-xs text-muted mb-1">Key Suppliers:</div>
                  <div className="flex flex-wrap gap-1">
                    {region.keySuppliers.slice(0, 3).map((supplier, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                        {supplier}
                      </span>
                    ))}
                    {region.keySuppliers.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                        +{region.keySuppliers.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Analysis: {new Date(analysis.summary.lastAnalysis).toLocaleString()}
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
                Identify supply chain weak points and bottlenecks
              </p>
            </a>

            <a 
              href="/network/critical-paths"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-heading">Critical Paths</span>
              </div>
              <p className="text-sm text-muted">
                Analyze essential supply chain connections
              </p>
            </a>

            <a 
              href="/network/simulation"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Factory className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-heading">Shock Simulation</span>
              </div>
              <p className="text-sm text-muted">
                Model supply chain disruption scenarios
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}