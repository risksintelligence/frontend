'use client'

import { useState, useEffect } from 'react'
import { Zap, Play, RotateCcw, TrendingDown, AlertTriangle, Activity, Target } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface SimulationNode {
  nodeId: string
  name: string
  sector: string
  initialState: string
  currentState: string
  impactTime: number
  cascadeLevel: number
  recoveryTime: number
}

interface SimulationResult {
  id: string
  name: string
  description: string
  initialShock: {
    nodeId: string
    nodeName: string
    shockType: string
    intensity: number
  }
  timeSteps: number
  totalAffectedNodes: number
  cascadeLevels: number
  peakImpactTime: number
  totalRecoveryTime: number
  systemicDamage: number
  resilienceScore: number
  affectedNodes: SimulationNode[]
  impactByLevel: { level: number; nodeCount: number; sectors: string[] }[]
  completed: boolean
  timestamp: string
}

interface ShockSimulation {
  availableShocks: {
    id: string
    name: string
    description: string
    targetNode: string
    intensity: number
    type: string
  }[]
  recentSimulations: SimulationResult[]
  systemMetrics: {
    averageCascadeDepth: number
    averageRecoveryTime: number
    systemFragility: number
    lastSimulation: string
  }
}

export default function ShockSimulationPage() {
  const [simulation, setSimulation] = useState<ShockSimulation | null>(null)
  const [loading, setLoading] = useState(true)
  const [runningSimulation, setRunningSimulation] = useState(false)
  const [selectedShock, setSelectedShock] = useState<string>('')
  const [selectedResult, setSelectedResult] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/network/simulation')
        
        if (response.ok) {
          const data = await response.json()
          setSimulation(data)
        } else {
          
          setSimulation({
            availableShocks: [
              {
                id: 'shock_fed_failure',
                name: 'Federal Reserve System Failure',
                description: 'Complete failure of Federal Reserve operations and monetary policy transmission',
                targetNode: 'fed_001',
                intensity: 0.95,
                type: 'Financial System Shock'
              },
              {
                id: 'shock_tsmc_disruption',
                name: 'TSMC Manufacturing Disruption',
                description: 'Major disruption to Taiwan Semiconductor manufacturing capacity',
                targetNode: 'tsmc_001',
                intensity: 0.87,
                type: 'Supply Chain Shock'
              },
              {
                id: 'shock_suez_blockage',
                name: 'Suez Canal Complete Blockage',
                description: 'Complete blockage of Suez Canal affecting global trade routes',
                targetNode: 'suez_001',
                intensity: 0.74,
                type: 'Trade Route Shock'
              },
              {
                id: 'shock_aws_outage',
                name: 'AWS Global Infrastructure Failure',
                description: 'Complete failure of Amazon Web Services global infrastructure',
                targetNode: 'aws_001',
                intensity: 0.68,
                type: 'Infrastructure Shock'
              },
              {
                id: 'shock_cyber_financial',
                name: 'Financial System Cyber Attack',
                description: 'Coordinated cyber attack on major financial institutions',
                targetNode: 'financial_network',
                intensity: 0.81,
                type: 'Cyber Security Shock'
              }
            ],
            recentSimulations: [
              {
                id: 'sim_001',
                name: 'Federal Reserve Failure Cascade',
                description: 'Analysis of systemic failure propagation from Federal Reserve disruption',
                initialShock: {
                  nodeId: 'fed_001',
                  nodeName: 'Federal Reserve System',
                  shockType: 'Financial System Shock',
                  intensity: 0.95
                },
                timeSteps: 48,
                totalAffectedNodes: 247,
                cascadeLevels: 6,
                peakImpactTime: 12,
                totalRecoveryTime: 168,
                systemicDamage: 0.89,
                resilienceScore: 0.23,
                affectedNodes: [
                  {
                    nodeId: 'fed_001',
                    name: 'Federal Reserve System',
                    sector: 'Banking',
                    initialState: 'failed',
                    currentState: 'failed',
                    impactTime: 0,
                    cascadeLevel: 0,
                    recoveryTime: 168
                  },
                  {
                    nodeId: 'primary_dealers',
                    name: 'Primary Dealers',
                    sector: 'Banking',
                    initialState: 'operational',
                    currentState: 'degraded',
                    impactTime: 2,
                    cascadeLevel: 1,
                    recoveryTime: 72
                  },
                  {
                    nodeId: 'major_banks',
                    name: 'Major Commercial Banks',
                    sector: 'Banking',
                    initialState: 'operational',
                    currentState: 'degraded',
                    impactTime: 4,
                    cascadeLevel: 2,
                    recoveryTime: 96
                  }
                ],
                impactByLevel: [
                  { level: 0, nodeCount: 1, sectors: ['Banking'] },
                  { level: 1, nodeCount: 12, sectors: ['Banking', 'Investment'] },
                  { level: 2, nodeCount: 45, sectors: ['Banking', 'Insurance', 'Credit'] },
                  { level: 3, nodeCount: 89, sectors: ['Real Estate', 'Corporate Finance'] },
                  { level: 4, nodeCount: 67, sectors: ['Consumer Finance', 'Small Business'] },
                  { level: 5, nodeCount: 33, sectors: ['International Trade', 'Commodities'] }
                ],
                completed: true,
                timestamp: new Date(Date.now() - 3600000).toISOString()
              },
              {
                id: 'sim_002',
                name: 'Semiconductor Supply Shock',
                description: 'Global technology disruption from Taiwan semiconductor shortage',
                initialShock: {
                  nodeId: 'tsmc_001',
                  nodeName: 'Taiwan Semiconductor',
                  shockType: 'Supply Chain Shock',
                  intensity: 0.87
                },
                timeSteps: 72,
                totalAffectedNodes: 167,
                cascadeLevels: 4,
                peakImpactTime: 24,
                totalRecoveryTime: 336,
                systemicDamage: 0.74,
                resilienceScore: 0.41,
                affectedNodes: [
                  {
                    nodeId: 'tsmc_001',
                    name: 'Taiwan Semiconductor',
                    sector: 'Technology',
                    initialState: 'disrupted',
                    currentState: 'recovering',
                    impactTime: 0,
                    cascadeLevel: 0,
                    recoveryTime: 336
                  }
                ],
                impactByLevel: [
                  { level: 0, nodeCount: 1, sectors: ['Technology'] },
                  { level: 1, nodeCount: 23, sectors: ['Technology', 'Electronics'] },
                  { level: 2, nodeCount: 67, sectors: ['Automotive', 'Data Centers'] },
                  { level: 3, nodeCount: 76, sectors: ['Consumer Goods', 'Telecommunications'] }
                ],
                completed: true,
                timestamp: new Date(Date.now() - 7200000).toISOString()
              }
            ],
            systemMetrics: {
              averageCascadeDepth: 4.8,
              averageRecoveryTime: 152,
              systemFragility: 0.67,
              lastSimulation: new Date().toISOString()
            }
          })
        }
      } catch (error) {
        console.error('Error fetching simulation data:', error)
        setSimulation(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSimulationData()
  }, [])

  const runSimulation = async () => {
    if (!selectedShock) return
    
    setRunningSimulation(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // In real implementation, would call:
      // const response = await fetch('/api/v1/network/simulation/run', {
      //   method: 'POST',
      //   body: JSON.stringify({ shockId: selectedShock })
      // })
      
      // Refresh simulation data
      // fetchSimulationData()
    } catch (error) {
      console.error('Error running simulation:', error)
    } finally {
      setRunningSimulation(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Shock Simulation</h1>
          <p className="text-secondary mt-2">Cascade failure impact modeling</p>
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

  if (!simulation) {
    return (
      <div className="terminal-card p-8 text-center">
        <Zap className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Simulation Data Available</h2>
        <p className="text-muted">Shock simulation data could not be loaded.</p>
      </div>
    )
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'failed': return 'critical'
      case 'degraded': return 'warning'
      case 'recovering': return 'good'
      case 'operational': return 'good'
      default: return 'good'
    }
  }

  const selectedSimResult = selectedResult 
    ? simulation.recentSimulations.find(sim => sim.id === selectedResult)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Shock Simulation</h1>
        <p className="text-secondary mt-2">
          Cascade failure impact modeling and systemic risk propagation analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-muted">Avg Cascade Depth</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {simulation.systemMetrics.averageCascadeDepth.toFixed(1)}
          </div>
          <div className="text-xs text-muted mt-1">failure propagation levels</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Avg Recovery Time</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {simulation.systemMetrics.averageRecoveryTime}h
          </div>
          <div className="text-xs text-muted mt-1">system restoration</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-muted">System Fragility</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(simulation.systemMetrics.systemFragility * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={simulation.systemMetrics.systemFragility > 0.6 ? 'warning' : 'good'}
              text={simulation.systemMetrics.systemFragility > 0.6 ? 'fragile' : 'robust'}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">cascade susceptibility</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Run New Simulation</h3>
            <p className="text-sm text-muted mt-1">
              Model cascade failure from initial shock scenarios
            </p>
          </div>
          <div className="terminal-card-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Select Shock Scenario
              </label>
              <select
                value={selectedShock}
                onChange={(e) => setSelectedShock(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a shock scenario...</option>
                {simulation.availableShocks.map(shock => (
                  <option key={shock.id} value={shock.id}>
                    {shock.name} ({(shock.intensity * 100).toFixed(0)}% intensity)
                  </option>
                ))}
              </select>
            </div>

            {selectedShock && (
              <div className="p-4 bg-blue-50 rounded-lg">
                {(() => {
                  const shock = simulation.availableShocks.find(s => s.id === selectedShock)
                  return shock ? (
                    <div>
                      <div className="font-medium text-heading mb-1">{shock.name}</div>
                      <div className="text-sm text-muted mb-2">{shock.type}</div>
                      <p className="text-sm text-secondary">{shock.description}</p>
                      <div className="mt-2 text-xs text-muted">
                        Target: {shock.targetNode} • Intensity: {(shock.intensity * 100).toFixed(0)}%
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <button
              onClick={runSimulation}
              disabled={!selectedShock || runningSimulation}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {runningSimulation ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Simulation
                </>
              )}
            </button>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Recent Simulations</h3>
            <p className="text-sm text-muted mt-1">
              Previously completed shock propagation analyses
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-3">
              {simulation.recentSimulations.map(result => (
                <div 
                  key={result.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedResult === result.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-heading">{result.name}</div>
                    <div className="text-xs text-muted">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-muted mb-2">{result.initialShock.shockType}</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted">Affected:</span>
                      <span className="font-mono text-heading ml-1">{result.totalAffectedNodes}</span>
                    </div>
                    <div>
                      <span className="text-muted">Levels:</span>
                      <span className="font-mono text-heading ml-1">{result.cascadeLevels}</span>
                    </div>
                    <div>
                      <span className="text-muted">Recovery:</span>
                      <span className="font-mono text-heading ml-1">{result.totalRecoveryTime}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedSimResult && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Simulation Results: {selectedSimResult.name}</h3>
            <p className="text-sm text-muted mt-1">
              {selectedSimResult.description}
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-sm text-muted">Systemic Damage</div>
                <div className="text-2xl font-mono text-heading">
                  {(selectedSimResult.systemicDamage * 100).toFixed(0)}%
                </div>
                <StatusBadge 
                  status={selectedSimResult.systemicDamage > 0.7 ? 'critical' : 'warning'}
                  text={selectedSimResult.systemicDamage > 0.7 ? 'severe' : 'moderate'}
                  size="sm"
                />
              </div>

              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-sm text-muted">Peak Impact Time</div>
                <div className="text-2xl font-mono text-heading">
                  {selectedSimResult.peakImpactTime}h
                </div>
                <div className="text-xs text-muted">maximum cascade</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-muted">Cascade Levels</div>
                <div className="text-2xl font-mono text-heading">
                  {selectedSimResult.cascadeLevels}
                </div>
                <div className="text-xs text-muted">propagation depth</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-muted">Resilience Score</div>
                <div className="text-2xl font-mono text-heading">
                  {(selectedSimResult.resilienceScore * 100).toFixed(0)}%
                </div>
                <StatusBadge 
                  status={selectedSimResult.resilienceScore > 0.5 ? 'good' : 'warning'}
                  text={selectedSimResult.resilienceScore > 0.5 ? 'resilient' : 'vulnerable'}
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-heading mb-3">Cascade Propagation by Level</h4>
                <div className="space-y-3">
                  {selectedSimResult.impactByLevel.map(level => (
                    <div key={level.level} className="flex items-center gap-4">
                      <div className="w-12 text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-800">{level.level}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-heading">{level.nodeCount} nodes affected</span>
                          <span className="text-xs text-muted">
                            {((level.nodeCount / selectedSimResult.totalAffectedNodes) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(level.nodeCount / selectedSimResult.totalAffectedNodes) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {level.sectors.map(sector => (
                            <span key={sector} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                              {sector}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-heading mb-3">Critical Node States</h4>
                <div className="space-y-2">
                  {selectedSimResult.affectedNodes.slice(0, 6).map(node => (
                    <div key={node.nodeId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-heading">{node.name}</div>
                        <div className="text-sm text-muted">{node.sector} • Level {node.cascadeLevel}</div>
                      </div>
                      <div className="text-right">
                        <StatusBadge 
                          status={getStateColor(node.currentState)}
                          text={node.currentState}
                          size="sm"
                        />
                        <div className="text-xs text-muted mt-1">
                          {node.recoveryTime}h recovery
                        </div>
                      </div>
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
          <h3 className="font-semibold text-heading">Related Network Analysis</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/network/vulnerabilities"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-heading">Vulnerability Assessment</span>
              </div>
              <p className="text-sm text-muted">
                Identify potential shock origins and weak points
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
                Analyze propagation routes and dependencies
              </p>
            </a>

            <a 
              href="/network/centrality"
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-heading">Centrality Analysis</span>
              </div>
              <p className="text-sm text-muted">
                Identify nodes with high cascade potential
              </p>
            </a>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Simulation: {new Date(simulation.systemMetrics.lastSimulation).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}