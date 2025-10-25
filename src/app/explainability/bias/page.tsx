'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Users, Scale, Shield, TrendingDown, TrendingUp } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface BiasAnalysis {
  modelName: string
  overallBiasScore: number
  riskLevel: string
  demographicParity: {
    [key: string]: {
      parityDifference: number
      parityRatio: number
      groups: { [key: string]: number }
    }
  }
  equalizedOdds: {
    [key: string]: {
      tprDifference: number
      fprDifference: number
    }
  }
  fairnessMetrics: {
    [key: string]: {
      [group: string]: {
        accuracy: number
        precision: number
        recall: number
        sampleSize: number
      }
    }
  }
  recommendations: string[]
  lastAnalysis: string
}

export default function BiasDetectionPage() {
  const [analysis, setAnalysis] = useState<BiasAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState('economic-risk')

  const models = [
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' }
  ]

  useEffect(() => {
    const fetchBiasAnalysis = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'
        
        const response = await fetch(`${baseUrl}/api/v1/explainability/bias-analysis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model_id: selectedModel,
            validation_data: [[0.75, 0.85, 0.68, 0.54, 0.42]],
            test_labels: [0.75],
            protected_attributes: {
              'gender': ['male', 'female'],
              'age_group': ['young', 'middle', 'senior'],
              'geographic_region': ['north', 'south', 'east', 'west']
            }
          })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch bias analysis')
        }

        const result = await response.json()
        
        if (result.status !== 'success') {
          throw new Error('API returned invalid data format')
        }

        const data = result.data
        
        if (!data.demographic_parity || !data.equalized_odds || !data.group_fairness_metrics) {
          throw new Error('Invalid API response - missing required bias analysis data')
        }

        const analysis: BiasAnalysis = {
          modelName: selectedModel,
          overallBiasScore: data.bias_score,
          riskLevel: data.bias_score > 0.2 ? 'High' : data.bias_score > 0.1 ? 'Medium' : 'Low',
          demographicParity: data.demographic_parity,
          equalizedOdds: data.equalized_odds,
          fairnessMetrics: data.group_fairness_metrics,
          recommendations: data.fairness_recommendations || [],
          lastAnalysis: data.timestamp || new Date().toISOString()
        }

        setAnalysis(analysis)
      } catch (error) {
        console.error('Error fetching bias analysis:', error)
        setAnalysis(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBiasAnalysis()
  }, [selectedModel])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Bias Detection</h1>
          <p className="text-secondary mt-2">Fairness and bias analysis</p>
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
        <h2 className="text-xl font-semibold text-heading mb-2">No Bias Analysis Available</h2>
        <p className="text-muted">Bias analysis data could not be loaded.</p>
      </div>
    )
  }

  const getBiasRiskColor = (score: number) => {
    if (score <= 0.1) return 'good'
    if (score <= 0.2) return 'warning'
    return 'critical'
  }

  const getParityStatus = (difference: number) => {
    if (difference <= 0.05) return 'good'
    if (difference <= 0.1) return 'warning'
    return 'critical'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Bias Detection</h1>
          <p className="text-secondary mt-2">
            Comprehensive fairness and bias analysis for model predictions
          </p>
        </div>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Overall Bias Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(analysis.overallBiasScore * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={getBiasRiskColor(analysis.overallBiasScore)}
              text={analysis.riskLevel}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Lower is better</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Protected Groups</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {Object.keys(analysis.demographicParity).length}
          </div>
          <div className="text-xs text-muted mt-1">Attributes analyzed</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted">Fairness Level</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {analysis.overallBiasScore <= 0.1 ? 'High' : analysis.overallBiasScore <= 0.2 ? 'Medium' : 'Low'}
          </div>
          <div className="text-xs text-muted mt-1">Overall assessment</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Demographic Parity Analysis</h3>
            <p className="text-sm text-muted mt-1">
              Measures if positive prediction rates are similar across groups
            </p>
          </div>
          <div className="terminal-card-content space-y-6">
            {Object.entries(analysis.demographicParity).map(([attribute, data]) => (
              <div key={attribute}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-heading capitalize">{attribute}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Parity Difference:</span>
                    <StatusBadge 
                      status={getParityStatus(data.parityDifference)}
                      text={`${(data.parityDifference * 100).toFixed(1)}%`}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(data.groups)
                    .sort(([,a], [,b]) => b - a)
                    .map(([group, rate]) => (
                    <div key={group} className="flex items-center justify-between">
                      <span className="text-secondary text-sm">{group}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${rate * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-heading w-12 text-right text-sm">
                          {(rate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-muted">
                  Parity Ratio: {data.parityRatio.toFixed(2)} (ideal: 1.0)
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Equalized Odds Analysis</h3>
            <p className="text-sm text-muted mt-1">
              Measures if true/false positive rates are similar across groups
            </p>
          </div>
          <div className="terminal-card-content space-y-6">
            {Object.entries(analysis.equalizedOdds).map(([attribute, data]) => (
              <div key={attribute}>
                <h4 className="font-medium text-heading capitalize mb-3">{attribute}</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">True Positive Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-600">Difference:</span>
                      <StatusBadge 
                        status={getParityStatus(data.tprDifference)}
                        text={`${(data.tprDifference * 100).toFixed(1)}%`}
                        size="sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">False Positive Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-600">Difference:</span>
                      <StatusBadge 
                        status={getParityStatus(data.fprDifference)}
                        text={`${(data.fprDifference * 100).toFixed(1)}%`}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Group Performance Metrics</h3>
        </div>
        <div className="terminal-card-content">
          <div className="space-y-6">
            {Object.entries(analysis.fairnessMetrics).map(([attribute, groups]) => (
              <div key={attribute}>
                <h4 className="font-medium text-heading capitalize mb-3">{attribute}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left text-xs text-muted font-medium py-2">Group</th>
                        <th className="text-center text-xs text-muted font-medium py-2">Accuracy</th>
                        <th className="text-center text-xs text-muted font-medium py-2">Precision</th>
                        <th className="text-center text-xs text-muted font-medium py-2">Recall</th>
                        <th className="text-center text-xs text-muted font-medium py-2">Sample Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groups).map(([group, metrics]) => (
                        <tr key={group} className="border-b border-slate-100">
                          <td className="py-3 text-secondary">{group}</td>
                          <td className="py-3 text-center">
                            <span className="font-mono text-heading">
                              {(metrics.accuracy * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="font-mono text-heading">
                              {(metrics.precision * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="font-mono text-heading">
                              {(metrics.recall * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="font-mono text-muted">{metrics.sampleSize}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Fairness Recommendations</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-800">{index + 1}</span>
                </div>
                <span className="text-sm text-blue-900">{recommendation}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Last Analysis: {new Date(analysis.lastAnalysis).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}