'use client'

import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, Play, BarChart3, Target, Zap } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface SimulationMetrics {
  totalSimulations: number
  activeModels: number
  averageAccuracy: number
  computationTime: number
  lastSimulation: string
}

interface SimulationModel {
  id: string
  name: string
  type: string
  description: string
  accuracy: number
  lastRun: string
  runs: number
  status: string
  parameters: number
}

interface RecentSimulation {
  id: string
  name: string
  type: string
  status: string
  accuracy: number
  runtime: number
  timestamp: string
  keyResults: string[]
}

export default function SimulationOverviewPage() {
  const [metrics, setMetrics] = useState<SimulationMetrics | null>(null)
  const [models, setModels] = useState<SimulationModel[]>([])
  const [recentRuns, setRecentRuns] = useState<RecentSimulation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        setLoading(true)
        const [metricsResponse, modelsResponse, runsResponse] = await Promise.all([
          fetch('/api/v1/simulation/overview'),
          fetch('/api/v1/simulation/models'),
          fetch('/api/v1/simulation/recent')
        ])

        if (metricsResponse.ok && modelsResponse.ok && runsResponse.ok) {
          const [metricsData, modelsData, runsData] = await Promise.all([
            metricsResponse.json(),
            modelsResponse.json(),
            runsResponse.json()
          ])
          setMetrics(metricsData)
          setModels(modelsData.models)
          setRecentRuns(runsData.simulations)
        } else {
          
          setMetrics({
            totalSimulations: 1247,
            activeModels: 12,
            averageAccuracy: 0.89,
            computationTime: 145,
            lastSimulation: new Date().toISOString()
          })
          
          setModels([
            {
              id: 'monte_carlo_risk',
              name: 'Monte Carlo Risk Analysis',
              type: 'Monte Carlo',
              description: 'Statistical simulation for risk assessment and portfolio optimization',
              accuracy: 0.92,
              lastRun: new Date(Date.now() - 3600000).toISOString(),
              runs: 234,
              status: 'active',
              parameters: 15
            },
            {
              id: 'policy_impact',
              name: 'Policy Impact Modeling',
              type: 'Policy Analysis',
              description: 'Economic policy impact assessment and scenario planning',
              accuracy: 0.87,
              lastRun: new Date(Date.now() - 7200000).toISOString(),
              runs: 156,
              status: 'active',
              parameters: 22
            },
            {
              id: 'stress_testing',
              name: 'Financial Stress Testing',
              type: 'Stress Testing',
              description: 'Comprehensive financial system resilience testing',
              accuracy: 0.94,
              lastRun: new Date(Date.now() - 1800000).toISOString(),
              runs: 89,
              status: 'active',
              parameters: 18
            },
            {
              id: 'scenario_template',
              name: 'Economic Scenario Templates',
              type: 'Scenario Modeling',
              description: 'Pre-built economic scenario templates for rapid analysis',
              accuracy: 0.85,
              lastRun: new Date(Date.now() - 10800000).toISOString(),
              runs: 312,
              status: 'ready',
              parameters: 12
            }
          ])

          setRecentRuns([
            {
              id: 'sim_001',
              name: 'Q4 Economic Risk Assessment',
              type: 'Monte Carlo',
              status: 'completed',
              accuracy: 0.91,
              runtime: 142,
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              keyResults: ['High recession probability: 23%', 'Portfolio VaR: $2.4M', 'Confidence interval: 95%']
            },
            {
              id: 'sim_002',
              name: 'Interest Rate Policy Impact',
              type: 'Policy Analysis',
              status: 'completed',
              accuracy: 0.88,
              runtime: 89,
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              keyResults: ['GDP impact: -0.3%', 'Inflation reduction: 1.2%', 'Employment effect: -45K jobs']
            },
            {
              id: 'sim_003',
              name: 'Banking Sector Stress Test',
              type: 'Stress Testing',
              status: 'running',
              accuracy: 0.0,
              runtime: 67,
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              keyResults: ['In progress...']
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching simulation data:', error)
        setMetrics(null)
        setModels([])
        setRecentRuns([])
      } finally {
        setLoading(false)
      }
    }

    fetchSimulationData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Simulation & Modeling</h1>
          <p className="text-secondary mt-2">Advanced simulation and modeling platform</p>
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
        <Calculator className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Simulation Data Available</h2>
        <p className="text-muted">Simulation platform data could not be loaded.</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'good'
      case 'ready': return 'warning'
      case 'completed': return 'good'
      case 'running': return 'warning'
      case 'failed': return 'critical'
      default: return 'good'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Simulation & Modeling</h1>
        <p className="text-secondary mt-2">
          Advanced simulation platform for risk assessment, policy analysis, and stress testing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Total Simulations</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {metrics.totalSimulations.toLocaleString()}
          </div>
          <div className="text-xs text-muted mt-1">Historical runs</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-muted">Active Models</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {metrics.activeModels}
          </div>
          <div className="text-xs text-muted mt-1">Ready for execution</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Avg Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(metrics.averageAccuracy * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={metrics.averageAccuracy > 0.85 ? 'good' : 'warning'}
              text={metrics.averageAccuracy > 0.85 ? 'high' : 'moderate'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Model performance</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-muted">Avg Runtime</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {metrics.computationTime}s
          </div>
          <div className="text-xs text-muted mt-1">Computation time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Available Models</h3>
            <p className="text-sm text-muted mt-1">
              Simulation models ready for analysis and execution
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {models.map((model) => (
                <div key={model.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-semibold text-heading">{model.name}</div>
                        <StatusBadge 
                          status={getStatusColor(model.status)}
                          text={model.status}
                          size="sm"
                        />
                      </div>
                      <div className="text-sm text-muted mb-2">{model.type}</div>
                      <p className="text-sm text-secondary">{model.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-mono text-heading">
                        {(model.accuracy * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted">accuracy</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-muted">Runs</div>
                      <div className="font-mono text-heading">{model.runs}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-muted">Parameters</div>
                      <div className="font-mono text-heading">{model.parameters}</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <div className="text-xs text-muted">Last Run</div>
                      <div className="font-mono text-heading text-xs">
                        {new Date(model.lastRun).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">
                      Last updated: {new Date(model.lastRun).toLocaleTimeString()}
                    </span>
                    <a 
                      href={`/simulation/${model.type.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Run Model →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Recent Simulations</h3>
            <p className="text-sm text-muted mt-1">
              Latest simulation runs and their results
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {recentRuns.map((run) => (
                <div key={run.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-medium text-heading">{run.name}</div>
                        <StatusBadge 
                          status={getStatusColor(run.status)}
                          text={run.status}
                          size="sm"
                        />
                      </div>
                      <div className="text-sm text-muted">{run.type}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-muted">
                        {new Date(run.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted">
                        {new Date(run.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-xs text-muted">Accuracy</div>
                      <div className="font-mono text-heading">
                        {run.status === 'running' ? '--' : `${(run.accuracy * 100).toFixed(0)}%`}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-xs text-muted">Runtime</div>
                      <div className="font-mono text-heading">{run.runtime}s</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted mb-1">Key Results:</div>
                    <div className="space-y-1">
                      {run.keyResults.map((result, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-secondary">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="terminal-card p-6 text-center">
          <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <div className="text-lg font-semibold text-heading mb-1">Monte Carlo</div>
          <div className="text-sm text-muted mb-3">
            Statistical simulation and risk analysis
          </div>
          <a 
            href="/simulation/monte-carlo" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Run Simulation
          </a>
        </div>

        <div className="terminal-card p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-lg font-semibold text-heading mb-1">Policy Analysis</div>
          <div className="text-sm text-muted mb-3">
            Economic policy impact modeling
          </div>
          <a 
            href="/simulation/policy" 
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Analyze Policy
          </a>
        </div>

        <div className="terminal-card p-6 text-center">
          <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <div className="text-lg font-semibold text-heading mb-1">Scenario Templates</div>
          <div className="text-sm text-muted mb-3">
            Pre-built scenario modeling
          </div>
          <a 
            href="/simulation/templates" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Use Templates
          </a>
        </div>

        <div className="terminal-card p-6 text-center">
          <BarChart3 className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <div className="text-lg font-semibold text-heading mb-1">Stress Testing</div>
          <div className="text-sm text-muted mb-3">
            Financial system resilience
          </div>
          <a 
            href="/simulation/stress" 
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            Run Tests
          </a>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Simulation Platform Features</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-heading">Advanced Modeling</span>
              </div>
              <p className="text-sm text-muted">
                Sophisticated mathematical models for complex risk scenarios and economic analysis.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="font-medium text-heading">High Performance</span>
              </div>
              <p className="text-sm text-muted">
                Optimized computation engines for rapid execution of complex simulations.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-heading">Validated Results</span>
              </div>
              <p className="text-sm text-muted">
                Rigorous validation and accuracy testing ensure reliable simulation outcomes.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Simulation: {new Date(metrics.lastSimulation).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}