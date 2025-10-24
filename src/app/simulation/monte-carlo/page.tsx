'use client'

import { useState, useEffect } from 'react'
import { Calculator, Play, RotateCcw, TrendingUp, BarChart3, Target } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface MonteCarloParameters {
  portfolioValue: number
  timeHorizon: number
  iterations: number
  confidenceLevel: number
  variables: {
    name: string
    distribution: string
    mean: number
    stdDev: number
    min?: number
    max?: number
  }[]
}

interface MonteCarloResults {
  id: string
  name: string
  parameters: MonteCarloParameters
  statistics: {
    mean: number
    median: number
    stdDev: number
    var95: number
    var99: number
    expectedShortfall: number
    maxDrawdown: number
    probabilityOfLoss: number
  }
  distribution: {
    percentile: number
    value: number
  }[]
  scenarios: {
    scenario: number
    outcome: number
    probability: number
  }[]
  convergence: {
    iteration: number
    runningMean: number
    runningStdDev: number
  }[]
  completed: boolean
  accuracy: number
  runtime: number
  timestamp: string
}

export default function MonteCarloPage() {
  const [parameters, setParameters] = useState<MonteCarloParameters>({
    portfolioValue: 10000000,
    timeHorizon: 252,
    iterations: 100000,
    confidenceLevel: 0.95,
    variables: [
      {
        name: 'Stock Returns',
        distribution: 'normal',
        mean: 0.08,
        stdDev: 0.15
      },
      {
        name: 'Bond Returns',
        distribution: 'normal',
        mean: 0.04,
        stdDev: 0.05
      },
      {
        name: 'Commodity Returns',
        distribution: 'normal',
        mean: 0.06,
        stdDev: 0.25
      }
    ]
  })
  
  const [results, setResults] = useState<MonteCarloResults | null>(null)
  const [recentRuns, setRecentRuns] = useState<MonteCarloResults[]>([])
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMonteCarloData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/simulation/monte-carlo/recent')
        
        if (response.ok) {
          const data = await response.json()
          setRecentRuns(data.simulations || [])
          if (data.simulations && data.simulations.length > 0) {
            setResults(data.simulations[0])
          }
        } else {
          // No data available from API
          setRecentRuns([])
          setResults(null)
        }
      } catch (error) {
        console.error('Error fetching Monte Carlo data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMonteCarloData()
  }, [parameters])

  const runSimulation = async () => {
    setRunning(true)
    try {
      const response = await fetch('/api/v1/simulation/monte-carlo/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameters)
      })
      
      if (response.ok) {
        const result = await response.json()
        setResults(result)
        setRecentRuns(prev => [result, ...prev])
      } else {
        throw new Error('Failed to run Monte Carlo simulation')
      }
    } catch (error) {
      console.error('Error running Monte Carlo simulation:', error)
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

  const updateVariable = (index: number, field: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      variables: prev.variables.map((variable, i) => 
        i === index ? { ...variable, [field]: value } : variable
      )
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Monte Carlo Simulation</h1>
          <p className="text-secondary mt-2">Statistical simulation and risk analysis</p>
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Monte Carlo Simulation</h1>
        <p className="text-secondary mt-2">
          Advanced statistical simulation for risk assessment and portfolio optimization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Simulation Parameters</h3>
            <p className="text-sm text-muted mt-1">
              Configure variables and constraints for Monte Carlo analysis
            </p>
          </div>
          <div className="terminal-card-content space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Portfolio Value ($)
                </label>
                <input
                  type="number"
                  value={parameters.portfolioValue}
                  onChange={(e) => updateParameter('portfolioValue', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Time Horizon (days)
                </label>
                <input
                  type="number"
                  value={parameters.timeHorizon}
                  onChange={(e) => updateParameter('timeHorizon', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Iterations
                </label>
                <select
                  value={parameters.iterations}
                  onChange={(e) => updateParameter('iterations', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10000}>10,000</option>
                  <option value={50000}>50,000</option>
                  <option value={100000}>100,000</option>
                  <option value={500000}>500,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Confidence Level
                </label>
                <select
                  value={parameters.confidenceLevel}
                  onChange={(e) => updateParameter('confidenceLevel', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0.90}>90%</option>
                  <option value={0.95}>95%</option>
                  <option value={0.99}>99%</option>
                </select>
              </div>
            </div>

            <div>
              <div className="font-medium text-heading mb-3">Random Variables</div>
              <div className="space-y-4">
                {parameters.variables.map((variable, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">Variable Name</label>
                        <input
                          type="text"
                          value={variable.name}
                          onChange={(e) => updateVariable(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded text-secondary focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Distribution</label>
                        <select
                          value={variable.distribution}
                          onChange={(e) => updateVariable(index, 'distribution', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded text-secondary focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="lognormal">Log Normal</option>
                          <option value="uniform">Uniform</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">Mean</label>
                        <input
                          type="number"
                          step="0.01"
                          value={variable.mean}
                          onChange={(e) => updateVariable(index, 'mean', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded text-secondary focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Std Dev</label>
                        <input
                          type="number"
                          step="0.01"
                          value={variable.stdDev}
                          onChange={(e) => updateVariable(index, 'stdDev', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-slate-300 rounded text-secondary focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={running}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {running ? (
                <>
                  <Calculator className="h-4 w-4 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Monte Carlo
                </>
              )}
            </button>
          </div>
        </div>

        {results && (
          <div className="terminal-card">
            <div className="terminal-card-header">
              <h3 className="font-semibold text-heading">Simulation Results</h3>
              <p className="text-sm text-muted mt-1">
                Statistical analysis of {parameters.iterations.toLocaleString()} scenarios
              </p>
            </div>
            <div className="terminal-card-content space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-muted">Expected Value</div>
                  <div className="text-lg font-mono text-heading">
                    {formatCurrency(results.statistics.mean)}
                  </div>
                  <StatusBadge 
                    status={results.statistics.mean > parameters.portfolioValue ? 'good' : 'warning'}
                    text={results.statistics.mean > parameters.portfolioValue ? 'positive' : 'negative'}
                    size="sm"
                  />
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-muted">VaR ({formatPercentage(parameters.confidenceLevel)})</div>
                  <div className="text-lg font-mono text-heading">
                    {formatCurrency(Math.abs(results.statistics.var95))}
                  </div>
                  <div className="text-xs text-muted">maximum loss</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Median</span>
                  <span className="font-mono text-secondary">{formatCurrency(results.statistics.median)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Standard Deviation</span>
                  <span className="font-mono text-secondary">{formatCurrency(results.statistics.stdDev)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Expected Shortfall</span>
                  <span className="font-mono text-secondary">{formatCurrency(Math.abs(results.statistics.expectedShortfall))}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-heading">Probability of Loss</span>
                  <span className="font-mono text-secondary">{formatPercentage(results.statistics.probabilityOfLoss)}</span>
                </div>
              </div>

              <div>
                <div className="font-medium text-heading mb-3">Key Percentiles</div>
                <div className="space-y-2">
                  {[1, 5, 10, 25, 50, 75, 90, 95, 99].map(percentile => {
                    const point = results.distribution.find(d => d.percentile === percentile)
                    return point ? (
                      <div key={percentile} className="flex items-center justify-between">
                        <span className="text-sm text-muted">{percentile}th percentile</span>
                        <span className="font-mono text-secondary text-sm">
                          {formatCurrency(point.value)}
                        </span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Simulation Accuracy:</span>
                  <StatusBadge 
                    status={results.accuracy > 0.9 ? 'good' : 'warning'}
                    text={formatPercentage(results.accuracy)}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted">Runtime:</span>
                  <span className="font-mono text-secondary">{results.runtime}s</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {results && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Scenario Analysis</h3>
            <p className="text-sm text-muted mt-1">
              Key scenarios and their probability distributions
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="font-medium text-heading mb-3">Top Scenarios</div>
                <div className="space-y-3">
                  {results.scenarios.map((scenario, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div>
                        <div className="font-medium text-heading">Scenario {scenario.scenario}</div>
                        <div className="text-sm text-muted">
                          Probability: {formatPercentage(scenario.probability)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-heading">
                          {formatCurrency(scenario.outcome)}
                        </div>
                        <StatusBadge 
                          status={scenario.outcome > parameters.portfolioValue ? 'good' : 'warning'}
                          text={scenario.outcome > parameters.portfolioValue ? 'gain' : 'loss'}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium text-heading mb-3">Convergence Analysis</div>
                <div className="space-y-2">
                  {results.convergence.map((point, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-muted">
                        {point.iteration.toLocaleString()} iterations
                      </span>
                      <span className="font-mono text-secondary text-sm">
                        μ: {formatCurrency(point.runningMean)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Related Simulation Tools</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/simulation/policy"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-heading">Policy Analysis</span>
              </div>
              <p className="text-sm text-muted">
                Economic policy impact modeling and assessment
              </p>
            </a>

            <a 
              href="/simulation/stress"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-heading">Stress Testing</span>
              </div>
              <p className="text-sm text-muted">
                Financial system resilience and stress testing
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
                Pre-built scenario templates for rapid analysis
              </p>
            </a>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Simulation: {new Date(results?.timestamp || Date.now()).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}