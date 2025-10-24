'use client'

import { useState, useEffect } from 'react'
import { Activity, Search, Filter, Download, RefreshCw, Target } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface PredictionExplanation {
  id: string
  modelName: string
  prediction: number
  confidence: number
  riskLevel: string
  timestamp: string
  inputFeatures: { [feature: string]: number }
  shapContributions: { [feature: string]: number }
  topContributors: Array<{
    feature: string
    contribution: number
    impact: 'positive' | 'negative' | 'neutral'
  }>
  counterfactuals: Array<{
    feature: string
    originalValue: number
    suggestedValue: number
    impactOnPrediction: number
  }>
}

export default function PredictionExplorerPage() {
  const [predictions, setPredictions] = useState<PredictionExplanation[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionExplanation | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModel, setFilterModel] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')

  const models = [
    { id: 'all', name: 'All Models' },
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' }
  ]

  const riskLevels = [
    { id: 'all', name: 'All Risk Levels' },
    { id: 'low', name: 'Low Risk' },
    { id: 'medium', name: 'Medium Risk' },
    { id: 'high', name: 'High Risk' },
    { id: 'critical', name: 'Critical Risk' }
  ]

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/v1/explainability/predictions')
        if (response.ok) {
          const data = await response.json()
          setPredictions(data.predictions)
          if (data.predictions.length > 0) {
            setSelectedPrediction(data.predictions[0])
          }
        } else {
          const samplePredictions: PredictionExplanation[] = [
            {
              id: 'pred_001',
              modelName: 'Economic Risk Model',
              prediction: 73.2,
              confidence: 0.87,
              riskLevel: 'high',
              timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
              inputFeatures: {
                'GDP Growth Rate': 2.1,
                'Unemployment Rate': 3.8,
                'Interest Rate Spread': 1.2,
                'Inflation Rate': 2.4,
                'Consumer Confidence': 89.2,
                'Industrial Production': 101.4
              },
              shapContributions: {
                'GDP Growth Rate': 12.4,
                'Unemployment Rate': -8.7,
                'Interest Rate Spread': -5.3,
                'Inflation Rate': 4.1,
                'Consumer Confidence': 3.8,
                'Industrial Production': 2.9
              },
              topContributors: [
                { feature: 'GDP Growth Rate', contribution: 12.4, impact: 'positive' },
                { feature: 'Unemployment Rate', contribution: -8.7, impact: 'negative' },
                { feature: 'Interest Rate Spread', contribution: -5.3, impact: 'negative' }
              ],
              counterfactuals: [
                { feature: 'Unemployment Rate', originalValue: 3.8, suggestedValue: 4.5, impactOnPrediction: -5.2 },
                { feature: 'GDP Growth Rate', originalValue: 2.1, suggestedValue: 1.5, impactOnPrediction: 8.3 }
              ]
            },
            {
              id: 'pred_002',
              modelName: 'Market Volatility Model',
              prediction: 45.6,
              confidence: 0.92,
              riskLevel: 'medium',
              timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
              inputFeatures: {
                'Market Volatility': 18.5,
                'Interest Rate Spread': 1.2,
                'GDP Growth Rate': 2.1,
                'Currency Exchange Rate': 1.08,
                'Commodity Prices': 112.4
              },
              shapContributions: {
                'Market Volatility': 8.9,
                'Interest Rate Spread': -3.2,
                'GDP Growth Rate': -2.1,
                'Currency Exchange Rate': 1.8,
                'Commodity Prices': 2.4
              },
              topContributors: [
                { feature: 'Market Volatility', contribution: 8.9, impact: 'positive' },
                { feature: 'Interest Rate Spread', contribution: -3.2, impact: 'negative' },
                { feature: 'Commodity Prices', contribution: 2.4, impact: 'positive' }
              ],
              counterfactuals: [
                { feature: 'Market Volatility', originalValue: 18.5, suggestedValue: 15.0, impactOnPrediction: -6.2 },
                { feature: 'GDP Growth Rate', originalValue: 2.1, suggestedValue: 2.8, impactOnPrediction: -3.4 }
              ]
            },
            {
              id: 'pred_003',
              modelName: 'Supply Chain Risk Model',
              prediction: 28.3,
              confidence: 0.78,
              riskLevel: 'low',
              timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
              inputFeatures: {
                'Transportation Cost': 95.2,
                'Supplier Diversity': 7.8,
                'Inventory Levels': 89.4,
                'Lead Times': 12.5,
                'Geographic Concentration': 0.34
              },
              shapContributions: {
                'Transportation Cost': -4.2,
                'Supplier Diversity': -6.8,
                'Inventory Levels': -2.1,
                'Lead Times': 3.4,
                'Geographic Concentration': 2.9
              },
              topContributors: [
                { feature: 'Supplier Diversity', contribution: -6.8, impact: 'negative' },
                { feature: 'Transportation Cost', contribution: -4.2, impact: 'negative' },
                { feature: 'Lead Times', contribution: 3.4, impact: 'positive' }
              ],
              counterfactuals: [
                { feature: 'Supplier Diversity', originalValue: 7.8, suggestedValue: 6.2, impactOnPrediction: 4.5 },
                { feature: 'Lead Times', originalValue: 12.5, suggestedValue: 10.8, impactOnPrediction: -2.1 }
              ]
            }
          ]
          setPredictions(samplePredictions)
          setSelectedPrediction(samplePredictions[0])
        }
      } catch (error) {
        console.error('Error fetching predictions:', error)
        setPredictions([])
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  const filteredPredictions = predictions.filter(pred => {
    const matchesSearch = pred.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pred.modelName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModel = filterModel === 'all' || pred.modelName.toLowerCase().includes(filterModel.replace('-', ' '))
    const matchesRisk = filterRisk === 'all' || pred.riskLevel === filterRisk
    
    return matchesSearch && matchesModel && matchesRisk
  })

  const getRiskColor = (level: string) => {
    const colors = {
      'low': 'text-emerald-600',
      'medium': 'text-amber-600',
      'high': 'text-red-600',
      'critical': 'text-red-800'
    }
    return colors[level as keyof typeof colors] || 'text-slate-600'
  }

  const getRiskBadgeStatus = (level: string): 'online' | 'offline' | 'warning' | 'error' | 'good' | 'critical' | 'info' => {
    const statuses: Record<string, 'online' | 'offline' | 'warning' | 'error' | 'good' | 'critical' | 'info'> = {
      'low': 'good',
      'medium': 'warning',
      'high': 'critical',
      'critical': 'critical'
    }
    return statuses[level] || 'info'
  }

  const getContributionColor = (impact: string) => {
    if (impact === 'positive') return 'text-emerald-600'
    if (impact === 'negative') return 'text-red-600'
    return 'text-slate-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Prediction Explorer</h1>
          <p className="text-secondary mt-2">Interactive prediction analysis</p>
        </div>
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Prediction Explorer</h1>
          <p className="text-secondary mt-2">
            Interactive exploration of individual predictions and their explanations
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search predictions by ID or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filterModel} 
          onChange={(e) => setFilterModel(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
        <select 
          value={filterRisk} 
          onChange={(e) => setFilterRisk(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {riskLevels.map(level => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="terminal-card">
            <div className="terminal-card-header">
              <h3 className="font-semibold text-heading">Recent Predictions</h3>
              <p className="text-sm text-muted mt-1">{filteredPredictions.length} predictions found</p>
            </div>
            <div className="terminal-card-content">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPredictions.map(prediction => (
                  <div 
                    key={prediction.id}
                    onClick={() => setSelectedPrediction(prediction)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedPrediction?.id === prediction.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-heading">{prediction.id}</span>
                      <StatusBadge 
                        status={getRiskBadgeStatus(prediction.riskLevel)}
                        text={prediction.riskLevel}
                        size="sm"
                      />
                    </div>
                    <div className="text-xs text-muted mb-1">{prediction.modelName}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-heading">
                        {prediction.prediction.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted">
                        {(prediction.confidence * 100).toFixed(0)}% conf
                      </div>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {new Date(prediction.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedPrediction ? (
            <div className="space-y-6">
              <div className="terminal-card">
                <div className="terminal-card-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-heading">Prediction Details</h3>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded transition-colors">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
                <div className="terminal-card-content">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm text-muted">Prediction ID</div>
                      <div className="font-mono text-heading">{selectedPrediction.id}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted">Model</div>
                      <div className="text-secondary">{selectedPrediction.modelName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted">Risk Score</div>
                      <div className={`text-2xl font-bold ${getRiskColor(selectedPrediction.riskLevel)}`}>
                        {selectedPrediction.prediction.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted">Confidence</div>
                      <div className="text-2xl font-bold text-heading">
                        {(selectedPrediction.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="terminal-card">
                  <div className="terminal-card-header">
                    <h3 className="font-semibold text-heading">Input Features</h3>
                  </div>
                  <div className="terminal-card-content">
                    <div className="space-y-3">
                      {Object.entries(selectedPrediction.inputFeatures).map(([feature, value]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="text-sm text-secondary">{feature}</span>
                          <span className="font-mono text-heading">{value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="terminal-card">
                  <div className="terminal-card-header">
                    <h3 className="font-semibold text-heading">Top Contributors</h3>
                  </div>
                  <div className="terminal-card-content">
                    <div className="space-y-3">
                      {selectedPrediction.topContributors.map((contributor, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-secondary">{contributor.feature}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono font-semibold ${getContributionColor(contributor.impact)}`}>
                              {contributor.contribution > 0 ? '+' : ''}{contributor.contribution.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="terminal-card">
                <div className="terminal-card-header">
                  <h3 className="font-semibold text-heading">SHAP Contributions</h3>
                  <p className="text-sm text-muted mt-1">
                    How each feature contributes to this specific prediction
                  </p>
                </div>
                <div className="terminal-card-content">
                  <div className="space-y-4">
                    {Object.entries(selectedPrediction.shapContributions)
                      .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                      .map(([feature, contribution]) => {
                        const maxContrib = Math.max(...Object.values(selectedPrediction.shapContributions).map(Math.abs))
                        const widthPercent = (Math.abs(contribution) / maxContrib) * 100
                        
                        return (
                          <div key={feature} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-secondary">{feature}</span>
                              <span className={`font-mono font-semibold ${
                                contribution > 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                {contribution > 0 ? '+' : ''}{contribution.toFixed(2)}
                              </span>
                            </div>
                            <div className="relative">
                              <div className="w-full bg-slate-200 rounded-full h-3">
                                <div 
                                  className={`h-3 rounded-full ${
                                    contribution > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${widthPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              <div className="terminal-card">
                <div className="terminal-card-header">
                  <h3 className="font-semibold text-heading">Counterfactual Analysis</h3>
                  <p className="text-sm text-muted mt-1">
                    How changing feature values would affect the prediction
                  </p>
                </div>
                <div className="terminal-card-content">
                  <div className="space-y-4">
                    {selectedPrediction.counterfactuals.map((counterfactual, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg">
                        <div className="font-medium text-heading mb-2">{counterfactual.feature}</div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted">Current Value</div>
                            <div className="font-mono text-heading">{counterfactual.originalValue.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted">Suggested Value</div>
                            <div className="font-mono text-heading">{counterfactual.suggestedValue.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-muted">Impact on Prediction</div>
                            <div className={`font-mono font-semibold ${
                              counterfactual.impactOnPrediction > 0 ? 'text-red-600' : 'text-emerald-600'
                            }`}>
                              {counterfactual.impactOnPrediction > 0 ? '+' : ''}{counterfactual.impactOnPrediction.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="terminal-card p-8 text-center">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-heading mb-2">Select a Prediction</h3>
              <p className="text-muted">Choose a prediction from the list to view detailed explanations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}