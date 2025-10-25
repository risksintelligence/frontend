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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/network/vulnerabilities`)
        
        if (response.ok) {
          const result = await response.json()
          if (result.status === 'success') {
            // Transform backend data to expected format
            const transformedData = {
              summary: {
                totalVulnerabilities: result.data.vulnerability_summary?.total_vulnerabilities || 0,
                criticalVulnerabilities: result.data.vulnerability_summary?.critical_vulnerabilities || 0,
                highRiskNodes: result.data.vulnerability_summary?.high_risk_nodes || 0,
                singlePointsOfFailure: result.data.vulnerability_summary?.single_points_failure || 0,
                cascadeRiskScore: result.data.vulnerability_summary?.cascade_risk_score || 0,
                resilienceIndex: result.data.vulnerability_summary?.resilience_index || 0,
                lastAssessment: new Date().toISOString()
              },
              vulnerabilities: result.data.vulnerabilities?.map((vuln: any) => ({
                id: vuln.vulnerability_id,
                name: vuln.vulnerability_name,
                type: vuln.vulnerability_type,
                severity: vuln.severity_level,
                impact: vuln.potential_impact,
                likelihood: vuln.likelihood,
                riskScore: vuln.risk_score,
                affectedNodes: vuln.affected_nodes || 0,
                criticalPath: vuln.is_critical_path || false,
                description: vuln.description,
                sector: vuln.sector || 'Unknown',
                mitigation: vuln.mitigation_strategies || []
              })) || [],
              riskCategories: result.data.risk_categories?.map((cat: any) => ({
                category: cat.category,
                count: cat.count,
                avgSeverity: cat.average_severity,
                totalImpact: cat.total_impact
              })) || []
            }
            setAnalysis(transformedData)
          } else {
            throw new Error(result.message || 'Failed to fetch vulnerability data')
          }
        } else {
          throw new Error(`HTTP error ${response.status}`)
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