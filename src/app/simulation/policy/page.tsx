'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Play, Settings, BarChart3, Target, AlertTriangle } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface PolicyParameters {
  policyType: string
  targetVariable: string
  magnitude: number
  duration: number
  implementationDelay: number
  sectors: string[]
  scenarios: string[]
}

interface PolicyImpact {
  variable: string
  baselineValue: number
  projectedValue: number
  impact: number
  impactPercent: number
  confidence: number
}

interface PolicyAnalysis {
  id: string
  name: string
  description: string
  parameters: PolicyParameters
  impacts: PolicyImpact[]
  timeSeriesData: {
    period: number
    baseline: number
    withPolicy: number
    impact: number
  }[]
  sectoralImpacts: {
    sector: string
    gdpImpact: number
    employmentImpact: number
    investmentImpact: number
    confidence: number
  }[]
  macroeconomicEffects: {
    gdp: number
    inflation: number
    employment: number
    investment: number
    tradeBalance: number
    publicDebt: number
  }
  risks: {
    risk: string
    probability: number
    severity: string
    mitigation: string
  }[]
  completed: boolean
  accuracy: number
  runtime: number
  timestamp: string
}

export default function PolicyAnalysisPage() {
  const [parameters, setParameters] = useState<PolicyParameters>({
    policyType: 'fiscal',
    targetVariable: 'government_spending',
    magnitude: 1.5,
    duration: 8,
    implementationDelay: 2,
    sectors: ['technology', 'healthcare', 'infrastructure'],
    scenarios: ['baseline', 'optimistic', 'pessimistic']
  })

  const [analysis, setAnalysis] = useState<PolicyAnalysis | null>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<PolicyAnalysis[]>([])
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/simulation/policy/recent')
        
        if (response.ok) {
          const data = await response.json()
          setRecentAnalyses(data.analyses || [])
          if (data.analyses && data.analyses.length > 0) {
            setAnalysis(data.analyses[0])
          }
        } else {
          // No data available from API
          setRecentAnalyses([])
          setAnalysis(null)
        }
      } catch (error) {
        console.error('Error fetching policy analysis data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPolicyData()
  }, [parameters])

  const runAnalysis = async () => {
    setRunning(true)
    try {
      const response = await fetch('/api/v1/simulation/policy/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameters)
      })
      
      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
        setRecentAnalyses(prev => [result, ...prev])
      } else {
        throw new Error('Failed to run policy analysis')
      }
    } catch (error) {
      console.error('Error running policy analysis:', error)
    } finally {
      setRunning(false)
    }
  }

  const updateParameter = (field: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Policy Analysis</h1>
          <p className="text-secondary mt-2">Economic policy impact modeling</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getImpactColor = (value: number) => {
    if (Math.abs(value) < 0.5) return 'good'
    if (Math.abs(value) < 1.5) return 'warning'
    return 'critical'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Policy Analysis</h1>
        <p className="text-secondary mt-2">
          Economic policy impact assessment and scenario modeling
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Policy Configuration</h3>
            <p className="text-sm text-muted mt-1">
              Define policy parameters and implementation details
            </p>
          </div>
          <div className="terminal-card-content space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Policy Type
                </label>
                <select
                  value={parameters.policyType}
                  onChange={(e) => updateParameter('policyType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fiscal">Fiscal Policy</option>
                  <option value="monetary">Monetary Policy</option>
                  <option value="trade">Trade Policy</option>
                  <option value="regulatory">Regulatory Policy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Target Variable
                </label>
                <select
                  value={parameters.targetVariable}
                  onChange={(e) => updateParameter('targetVariable', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="government_spending">Government Spending</option>
                  <option value="tax_rates">Tax Rates</option>
                  <option value="interest_rates">Interest Rates</option>
                  <option value="tariffs">Tariffs</option>
                  <option value="regulations">Regulations</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Magnitude (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={parameters.magnitude}
                  onChange={(e) => updateParameter('magnitude', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Duration (quarters)
                </label>
                <input
                  type="number"
                  value={parameters.duration}
                  onChange={(e) => updateParameter('duration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Delay (quarters)
                </label>
                <input
                  type="number"
                  value={parameters.implementationDelay}
                  onChange={(e) => updateParameter('implementationDelay', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Target Sectors
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['technology', 'healthcare', 'infrastructure', 'manufacturing', 'energy', 'finance'].map(sector => (
                  <label key={sector} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={parameters.sectors.includes(sector)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateParameter('sectors', [...parameters.sectors, sector])
                        } else {
                          updateParameter('sectors', parameters.sectors.filter(s => s !== sector))
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-secondary capitalize">{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={runAnalysis}
              disabled={running}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {running ? (
                <>
                  <TrendingUp className="h-4 w-4 animate-spin" />
                  Running Analysis...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Policy Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="terminal-card">
            <div className="terminal-card-header">
              <h3 className="font-semibold text-heading">Analysis Results</h3>
              <p className="text-sm text-muted mt-1">
                {analysis.name} - Policy impact assessment
              </p>
            </div>
            <div className="terminal-card-content space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-muted">GDP Impact</div>
                  <div className="text-lg font-mono text-heading">
                    {formatPercentage(analysis.macroeconomicEffects.gdp)}
                  </div>
                  <StatusBadge 
                    status={analysis.macroeconomicEffects.gdp > 0 ? 'good' : 'warning'}
                    text={analysis.macroeconomicEffects.gdp > 0 ? 'positive' : 'negative'}
                    size="sm"
                  />
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-muted">Employment Impact</div>
                  <div className="text-lg font-mono text-heading">
                    {formatPercentage(analysis.macroeconomicEffects.employment)}
                  </div>
                  <StatusBadge 
                    status={analysis.macroeconomicEffects.employment > 0 ? 'good' : 'warning'}
                    text={analysis.macroeconomicEffects.employment > 0 ? 'positive' : 'negative'}
                    size="sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Inflation Impact</span>
                  <span className="font-mono text-secondary">{formatPercentage(analysis.macroeconomicEffects.inflation)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Investment Impact</span>
                  <span className="font-mono text-secondary">{formatPercentage(analysis.macroeconomicEffects.investment)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Trade Balance</span>
                  <span className="font-mono text-secondary">{formatPercentage(analysis.macroeconomicEffects.tradeBalance)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Public Debt Impact</span>
                  <span className="font-mono text-secondary">{formatPercentage(analysis.macroeconomicEffects.publicDebt)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Analysis Accuracy:</span>
                  <StatusBadge 
                    status={analysis.accuracy > 0.8 ? 'good' : 'warning'}
                    text={`${(analysis.accuracy * 100).toFixed(0)}%`}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted">Runtime:</span>
                  <span className="font-mono text-secondary">{analysis.runtime}s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <>
          <div className="terminal-card">
            <div className="terminal-card-header">
              <h3 className="font-semibold text-heading">Sectoral Impact Analysis</h3>
              <p className="text-sm text-muted mt-1">
                Industry-specific effects of the policy implementation
              </p>
            </div>
            <div className="terminal-card-content">
              <div className="space-y-4">
                {analysis.sectoralImpacts.map((sector, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-heading">{sector.sector}</div>
                      <StatusBadge 
                        status={sector.confidence > 0.8 ? 'good' : 'warning'}
                        text={`${(sector.confidence * 100).toFixed(0)}% confidence`}
                        size="sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-xs text-muted">GDP Impact</div>
                        <div className="font-mono text-heading">{formatPercentage(sector.gdpImpact)}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-xs text-muted">Employment</div>
                        <div className="font-mono text-heading">{formatPercentage(sector.employmentImpact)}</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-xs text-muted">Investment</div>
                        <div className="font-mono text-heading">{formatPercentage(sector.investmentImpact)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="terminal-card">
            <div className="terminal-card-header">
              <h3 className="font-semibold text-heading">Risk Assessment</h3>
              <p className="text-sm text-muted mt-1">
                Potential risks and mitigation strategies for policy implementation
              </p>
            </div>
            <div className="terminal-card-content">
              <div className="space-y-4">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-heading">{risk.risk}</div>
                        <div className="text-sm text-muted mt-1">
                          Probability: {(risk.probability * 100).toFixed(0)}%
                        </div>
                      </div>
                      <StatusBadge 
                        status={risk.severity === 'high' ? 'critical' : risk.severity === 'medium' ? 'warning' : 'good'}
                        text={risk.severity}
                        size="sm"
                      />
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-heading mb-1">Mitigation Strategy:</div>
                      <div className="text-sm text-secondary">{risk.mitigation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Related Analysis Tools</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/simulation/monte-carlo"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-heading">Monte Carlo</span>
              </div>
              <p className="text-sm text-muted">
                Statistical simulation and risk analysis
              </p>
            </a>

            <a 
              href="/simulation/stress"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-heading">Stress Testing</span>
              </div>
              <p className="text-sm text-muted">
                Financial system resilience testing
              </p>
            </a>

            <a 
              href="/simulation/templates"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-heading">Scenario Templates</span>
              </div>
              <p className="text-sm text-muted">
                Pre-built scenario modeling templates
              </p>
            </a>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Analysis: {new Date(analysis?.timestamp || Date.now()).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}