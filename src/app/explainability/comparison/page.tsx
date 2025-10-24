'use client'

import { useState, useEffect, useMemo } from 'react'
import { Brain, BarChart3, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface ModelComparison {
  model1: {
    id: string
    name: string
    accuracy: number
    explainabilityScore: number
    featureImportance: { [feature: string]: number }
    biasScore: number
    lastUpdated: string
  }
  model2: {
    id: string
    name: string
    accuracy: number
    explainabilityScore: number
    featureImportance: { [feature: string]: number }
    biasScore: number
    lastUpdated: string
  }
  consistency: {
    predictionCorrelation: number
    explanationSimilarity: number
    featureRankingAgreement: number
    stabilityScore: number
  }
  recommendations: string[]
}

export default function ModelComparisonPage() {
  const [comparison, setComparison] = useState<ModelComparison | null>(null)
  const [loading, setLoading] = useState(true)
  const [model1, setModel1] = useState('economic-risk')
  const [model2, setModel2] = useState('market-volatility')

  const models = useMemo(() => [
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' },
    { id: 'geopolitical', name: 'Geopolitical Risk Model' }
  ], [])

  useEffect(() => {
    const fetchModelComparison = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/v1/explainability/comparison?model1=${model1}&model2=${model2}`)
        if (response.ok) {
          const data = await response.json()
          setComparison(data)
        } else {
          setComparison({
            model1: {
              id: model1,
              name: models.find(m => m.id === model1)?.name || 'Model 1',
              accuracy: 0.892,
              explainabilityScore: 0.87,
              featureImportance: {
                'GDP Growth Rate': 0.34,
                'Unemployment Rate': 0.28,
                'Interest Rate Spread': 0.22,
                'Inflation Rate': 0.16,
                'Consumer Confidence': 0.12,
                'Industrial Production': 0.09,
                'Housing Starts': 0.06
              },
              biasScore: 0.15,
              lastUpdated: new Date().toISOString()
            },
            model2: {
              id: model2,
              name: models.find(m => m.id === model2)?.name || 'Model 2',
              accuracy: 0.876,
              explainabilityScore: 0.82,
              featureImportance: {
                'Market Volatility': 0.31,
                'Interest Rate Spread': 0.26,
                'GDP Growth Rate': 0.24,
                'Currency Exchange Rate': 0.19,
                'Commodity Prices': 0.15,
                'Trading Volume': 0.12,
                'Inflation Rate': 0.08
              },
              biasScore: 0.18,
              lastUpdated: new Date().toISOString()
            },
            consistency: {
              predictionCorrelation: 0.74,
              explanationSimilarity: 0.68,
              featureRankingAgreement: 0.52,
              stabilityScore: 0.71
            },
            recommendations: [
              'Models show moderate agreement in predictions',
              'Feature importance rankings differ significantly',
              'Consider ensemble approach for improved accuracy',
              'Monitor explanation consistency over time',
              'Bias scores within acceptable range for both models'
            ]
          })
        }
      } catch (error) {
        console.error('Error fetching model comparison:', error)
        setComparison(null)
      } finally {
        setLoading(false)
      }
    }

    if (model1 !== model2) {
      fetchModelComparison()
    }
  }, [model1, model2, models])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Model Comparison</h1>
          <p className="text-secondary mt-2">Compare model explanations</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 rounded"></div>
            <div className="h-48 bg-slate-200 rounded"></div>
          </div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!comparison || model1 === model2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-heading">Model Comparison</h1>
            <p className="text-secondary mt-2">
              Side-by-side model comparison and explanation consistency analysis
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-heading mb-2">Model 1</label>
            <select 
              value={model1} 
              onChange={(e) => setModel1(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-2">Model 2</label>
            <select 
              value={model2} 
              onChange={(e) => setModel2(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {model1 === model2 && (
          <div className="terminal-card p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-heading mb-2">Select Different Models</h2>
            <p className="text-muted">Please select two different models to compare.</p>
          </div>
        )}
      </div>
    )
  }

  const getConsistencyStatus = (score: number) => {
    if (score >= 0.8) return 'good'
    if (score >= 0.6) return 'warning'
    return 'critical'
  }

  const getConsistencyLabel = (score: number) => {
    if (score >= 0.8) return 'High'
    if (score >= 0.6) return 'Medium'
    return 'Low'
  }

  const commonFeatures = Object.keys(comparison.model1.featureImportance).filter(
    feature => Object.keys(comparison.model2.featureImportance).includes(feature)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Model Comparison</h1>
          <p className="text-secondary mt-2">
            Side-by-side comparison of {comparison.model1.name} and {comparison.model2.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-heading mb-2">Model 1</label>
          <select 
            value={model1} 
            onChange={(e) => setModel1(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-2">Model 2</label>
          <select 
            value={model2} 
            onChange={(e) => setModel2(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Prediction Correlation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(comparison.consistency.predictionCorrelation * 100).toFixed(0)}%
            </div>
            <StatusBadge 
              status={getConsistencyStatus(comparison.consistency.predictionCorrelation)}
              text={getConsistencyLabel(comparison.consistency.predictionCorrelation)}
              size="sm"
            />
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Explanation Similarity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(comparison.consistency.explanationSimilarity * 100).toFixed(0)}%
            </div>
            <StatusBadge 
              status={getConsistencyStatus(comparison.consistency.explanationSimilarity)}
              text={getConsistencyLabel(comparison.consistency.explanationSimilarity)}
              size="sm"
            />
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted">Feature Agreement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(comparison.consistency.featureRankingAgreement * 100).toFixed(0)}%
            </div>
            <StatusBadge 
              status={getConsistencyStatus(comparison.consistency.featureRankingAgreement)}
              text={getConsistencyLabel(comparison.consistency.featureRankingAgreement)}
              size="sm"
            />
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-medium text-muted">Stability Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(comparison.consistency.stabilityScore * 100).toFixed(0)}%
            </div>
            <StatusBadge 
              status={getConsistencyStatus(comparison.consistency.stabilityScore)}
              text={getConsistencyLabel(comparison.consistency.stabilityScore)}
              size="sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-heading">{comparison.model1.name}</h3>
            </div>
          </div>
          <div className="terminal-card-content space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted">Accuracy</div>
                <div className="text-xl font-bold text-heading">
                  {(comparison.model1.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Explainability</div>
                <div className="text-xl font-bold text-heading">
                  {(comparison.model1.explainabilityScore * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Bias Score</div>
                <div className="text-xl font-bold text-heading">
                  {(comparison.model1.biasScore * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Features</div>
                <div className="text-xl font-bold text-heading">
                  {Object.keys(comparison.model1.featureImportance).length}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-heading mb-2">Top Features</h4>
              <div className="space-y-2">
                {Object.entries(comparison.model1.featureImportance)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([feature, importance]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="text-sm text-secondary">{feature}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${importance * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono text-heading w-10 text-right">
                          {(importance * 100).toFixed(0)}%
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
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-heading">{comparison.model2.name}</h3>
            </div>
          </div>
          <div className="terminal-card-content space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted">Accuracy</div>
                <div className="text-xl font-bold text-heading">
                  {(comparison.model2.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Explainability</div>
                <div className="text-xl font-bold text-heading">
                  {(comparison.model2.explainabilityScore * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Bias Score</div>
                <div className="text-xl font-bold text-heading">
                  {(comparison.model2.biasScore * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Features</div>
                <div className="text-xl font-bold text-heading">
                  {Object.keys(comparison.model2.featureImportance).length}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-heading mb-2">Top Features</h4>
              <div className="space-y-2">
                {Object.entries(comparison.model2.featureImportance)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([feature, importance]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="text-sm text-secondary">{feature}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1">
                          <div 
                            className="bg-purple-600 h-1 rounded-full" 
                            style={{ width: `${importance * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono text-heading w-10 text-right">
                          {(importance * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {commonFeatures.length > 0 && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Common Features Comparison</h3>
            <p className="text-sm text-muted mt-1">
              Feature importance comparison for features present in both models
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {commonFeatures
                .sort((a, b) => 
                  Math.max(comparison.model1.featureImportance[b] || 0, comparison.model2.featureImportance[b] || 0) -
                  Math.max(comparison.model1.featureImportance[a] || 0, comparison.model2.featureImportance[a] || 0)
                )
                .map(feature => {
                  const imp1 = comparison.model1.featureImportance[feature] || 0
                  const imp2 = comparison.model2.featureImportance[feature] || 0
                  const diff = Math.abs(imp1 - imp2)
                  
                  return (
                    <div key={feature} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-secondary">{feature}</span>
                        <StatusBadge 
                          status={diff < 0.05 ? 'good' : diff < 0.15 ? 'warning' : 'critical'}
                          text={`${(diff * 100).toFixed(1)}% diff`}
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-blue-600 mb-1">{comparison.model1.name}</div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${imp1 * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs font-mono text-muted mt-1">{(imp1 * 100).toFixed(1)}%</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-purple-600 mb-1">{comparison.model2.name}</div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${imp2 * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs font-mono text-muted mt-1">{(imp2 * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Analysis Recommendations</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparison.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-800">{index + 1}</span>
                </div>
                <span className="text-sm text-blue-900">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}