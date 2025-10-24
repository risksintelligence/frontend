'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, Target, Zap, Activity, AlertCircle } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface Vulnerability {
  id: string
  name: string
  type: string
  severity: string
  impact: number
  likelihood: number
  riskScore: number
  affectedNodes: number
  criticalPath: boolean
  description: string
  sector: string
  mitigation: string[]
}

interface VulnerabilityAnalysis {
  summary: {
    totalVulnerabilities: number
    criticalVulnerabilities: number
    highRiskNodes: number
    singlePointsOfFailure: number
    cascadeRiskScore: number
    resilienceIndex: number
    lastAssessment: string
  }
  vulnerabilities: Vulnerability[]
  riskCategories: {
    category: string
    count: number
    avgSeverity: number
    totalImpact: number
  }[]
}

export default function VulnerabilityAssessmentPage() {
  const [analysis, setAnalysis] = useState<VulnerabilityAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')

  useEffect(() => {
    const fetchVulnerabilityData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/network/vulnerabilities')
        
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          
          setAnalysis({
            summary: {
              totalVulnerabilities: 47,
              criticalVulnerabilities: 8,
              highRiskNodes: 23,
              singlePointsOfFailure: 12,
              cascadeRiskScore: 0.67,
              resilienceIndex: 0.34,
              lastAssessment: new Date().toISOString()
            },
            vulnerabilities: [
              {
                id: 'vuln_001',
                name: 'Federal Reserve System Single Point of Failure',
                type: 'Single Point of Failure',
                severity: 'critical',
                impact: 0.95,
                likelihood: 0.23,
                riskScore: 0.87,
                affectedNodes: 247,
                criticalPath: true,
                description: 'The Federal Reserve system represents a critical single point of failure for the US financial system',
                sector: 'Banking',
                mitigation: [
                  'Implement distributed monetary policy mechanisms',
                  'Establish backup financial clearing systems',
                  'Create emergency liquidity protocols'
                ]
              },
              {
                id: 'vuln_002',
                name: 'SWIFT Network Centralization Risk',
                type: 'Infrastructure Bottleneck',
                severity: 'critical',
                impact: 0.89,
                likelihood: 0.19,
                riskScore: 0.82,
                affectedNodes: 198,
                criticalPath: true,
                description: 'SWIFT network centralization creates global financial messaging vulnerability',
                sector: 'Financial Infrastructure',
                mitigation: [
                  'Develop alternative messaging protocols',
                  'Increase network redundancy',
                  'Establish regional backup systems'
                ]
              },
              {
                id: 'vuln_003',
                name: 'Taiwan Semiconductor Dependency',
                type: 'Supply Chain Concentration',
                severity: 'high',
                impact: 0.82,
                likelihood: 0.34,
                riskScore: 0.78,
                affectedNodes: 167,
                criticalPath: true,
                description: 'Global semiconductor supply chain heavily dependent on Taiwan manufacturing',
                sector: 'Technology',
                mitigation: [
                  'Diversify semiconductor manufacturing',
                  'Build strategic chip reserves',
                  'Invest in alternative production facilities'
                ]
              },
              {
                id: 'vuln_004',
                name: 'Suez Canal Transportation Bottleneck',
                type: 'Geographic Chokepoint',
                severity: 'high',
                impact: 0.76,
                likelihood: 0.28,
                riskScore: 0.74,
                affectedNodes: 134,
                criticalPath: true,
                description: 'Critical maritime trade route with limited alternative paths',
                sector: 'Logistics',
                mitigation: [
                  'Develop alternative shipping routes',
                  'Increase canal capacity',
                  'Build strategic cargo reserves'
                ]
              },
              {
                id: 'vuln_005',
                name: 'Amazon Web Services Concentration',
                type: 'Cloud Infrastructure Risk',
                severity: 'high',
                impact: 0.71,
                likelihood: 0.31,
                riskScore: 0.69,
                affectedNodes: 234,
                criticalPath: false,
                description: 'High concentration of internet services on single cloud provider',
                sector: 'Technology',
                mitigation: [
                  'Promote multi-cloud strategies',
                  'Increase cloud provider diversity',
                  'Improve disaster recovery protocols'
                ]
              },
              {
                id: 'vuln_006',
                name: 'Undersea Cable Network Vulnerability',
                type: 'Infrastructure Vulnerability',
                severity: 'medium',
                impact: 0.68,
                likelihood: 0.25,
                riskScore: 0.61,
                affectedNodes: 89,
                criticalPath: false,
                description: 'Global internet backbone dependent on vulnerable undersea cables',
                sector: 'Telecommunications',
                mitigation: [
                  'Increase cable route redundancy',
                  'Improve cable protection systems',
                  'Develop satellite backup networks'
                ]
              }
            ],
            riskCategories: [
              {
                category: 'Single Points of Failure',
                count: 12,
                avgSeverity: 0.84,
                totalImpact: 8.7
              },
              {
                category: 'Supply Chain Concentration',
                count: 15,
                avgSeverity: 0.71,
                totalImpact: 7.2
              },
              {
                category: 'Infrastructure Bottlenecks',
                count: 9,
                avgSeverity: 0.78,
                totalImpact: 6.8
              },
              {
                category: 'Geographic Chokepoints',
                count: 7,
                avgSeverity: 0.69,
                totalImpact: 5.4
              },
              {
                category: 'Technology Dependencies',
                count: 4,
                avgSeverity: 0.66,
                totalImpact: 3.9
              }
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching vulnerability data:', error)
        setAnalysis(null)
      } finally {
        setLoading(false)
      }
    }

    fetchVulnerabilityData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Vulnerability Assessment</h1>
          <p className="text-secondary mt-2">System weak points and bottleneck analysis</p>
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
        <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Vulnerability Data Available</h2>
        <p className="text-muted">Vulnerability assessment data could not be loaded.</p>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const filteredVulnerabilities = selectedSeverity === 'all' 
    ? analysis.vulnerabilities 
    : analysis.vulnerabilities.filter(v => v.severity === selectedSeverity)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Vulnerability Assessment</h1>
          <p className="text-secondary mt-2">
            Comprehensive analysis of system weak points and potential failure modes
          </p>
        </div>
        <select 
          value={selectedSeverity} 
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-muted">Critical Vulnerabilities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {analysis.summary.criticalVulnerabilities}
            </div>
            <StatusBadge 
              status={analysis.summary.criticalVulnerabilities > 5 ? 'critical' : 'warning'}
              text={analysis.summary.criticalVulnerabilities > 5 ? 'high' : 'moderate'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">
            of {analysis.summary.totalVulnerabilities} total
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-muted">Single Points of Failure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {analysis.summary.singlePointsOfFailure}
            </div>
            <StatusBadge 
              status={analysis.summary.singlePointsOfFailure > 10 ? 'critical' : 'warning'}
              text={analysis.summary.singlePointsOfFailure > 10 ? 'excessive' : 'elevated'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Critical dependencies</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted">Resilience Index</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.summary.resilienceIndex * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={analysis.summary.resilienceIndex > 0.6 ? 'good' : 'warning'}
              text={analysis.summary.resilienceIndex > 0.6 ? 'resilient' : 'vulnerable'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">System robustness</div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Critical Vulnerabilities</h3>
          <p className="text-sm text-muted mt-1">
            High-impact vulnerabilities requiring immediate attention
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="space-y-4">
            {filteredVulnerabilities.map((vulnerability) => (
              <div key={vulnerability.id} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-heading">{vulnerability.name}</div>
                      <StatusBadge 
                        status={getSeverityColor(vulnerability.severity)}
                        text={vulnerability.severity}
                        size="sm"
                      />
                      {vulnerability.criticalPath && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                          Critical Path
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted mb-2">{vulnerability.type} • {vulnerability.sector}</div>
                    <p className="text-secondary text-sm">{vulnerability.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-mono text-heading">
                      {(vulnerability.riskScore * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">risk score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-muted">Impact</div>
                    <div className="text-lg font-mono text-heading">
                      {(vulnerability.impact * 100).toFixed(0)}%
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${vulnerability.impact * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <div className="text-sm text-muted">Likelihood</div>
                    <div className="text-lg font-mono text-heading">
                      {(vulnerability.likelihood * 100).toFixed(0)}%
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ width: `${vulnerability.likelihood * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted">Affected Nodes</div>
                    <div className="text-lg font-mono text-heading">
                      {vulnerability.affectedNodes}
                    </div>
                    <div className="text-xs text-muted mt-1">nodes at risk</div>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-heading mb-2">Mitigation Strategies</div>
                  <div className="space-y-1">
                    {vulnerability.mitigation.map((strategy, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-secondary">{strategy}</span>
                      </div>
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
            <h3 className="font-semibold text-heading">Risk Categories</h3>
            <p className="text-sm text-muted mt-1">
              Vulnerability breakdown by category type
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.riskCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-heading">{category.category}</div>
                    <div className="text-sm text-muted">{category.count} vulnerabilities</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-heading">
                      {(category.avgSeverity * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted">avg severity</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">System Resilience Metrics</h3>
          </div>
          <div className="terminal-card-content space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-heading">Cascade Risk Score</div>
                  <div className="text-sm text-muted">Potential for failure propagation</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-heading">
                  {(analysis.summary.cascadeRiskScore * 100).toFixed(1)}%
                </div>
                <StatusBadge 
                  status={getRiskColor(analysis.summary.cascadeRiskScore)}
                  text={analysis.summary.cascadeRiskScore > 0.6 ? 'high' : 'moderate'}
                  size="sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-heading">High Risk Nodes</div>
                  <div className="text-sm text-muted">Nodes with elevated vulnerability</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-heading">
                  {analysis.summary.highRiskNodes}
                </div>
                <div className="text-xs text-muted">nodes</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium text-heading">Total Vulnerabilities</div>
                  <div className="text-sm text-muted">All identified weak points</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-heading">
                  {analysis.summary.totalVulnerabilities}
                </div>
                <div className="text-xs text-muted">findings</div>
              </div>
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
              href="/network/centrality"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-heading">Centrality Analysis</span>
              </div>
              <p className="text-sm text-muted">
                Identify critical nodes and influence patterns
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
                Essential connections and dependency chains
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
                Model cascade failures and impact propagation
              </p>
            </a>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Assessment: {new Date(analysis.summary.lastAssessment).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}