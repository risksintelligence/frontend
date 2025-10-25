'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Target, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface PerformanceMetrics {
  modelName: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  auc: number
  mse: number
  mae: number
  validationHistory: Array<{
    epoch: number
    trainLoss: number
    valLoss: number
    accuracy: number
  }>
  confusionMatrix: {
    truePositive: number
    falsePositive: number
    trueNegative: number
    falseNegative: number
  }
  crossValidationScores: number[]
  lastEvaluated: string
}

export default function ModelPerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState('economic-risk')

  const models = [
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' }
  ]

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'
        const response = await fetch(`${baseUrl}/api/v1/explainability/model-performance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model_id: selectedModel,
            model_type: "tree",
            feature_names: ['market_volatility', 'credit_rating', 'economic_indicators', 'sector_exposure', 'liquidity_ratio']
          })
        })

        if (!response.ok) {
          throw new Error('Failed to fetch performance metrics')
        }

        const result = await response.json()
        
        if (result.status !== 'success') {
          throw new Error('API returned invalid data format')
        }

        const data = result.data
        
        if (!data.accuracy || !data.confusionMatrix) {
          throw new Error('Invalid API response - missing required performance data')
        }
        
        setMetrics(data)
      } catch (error) {
        console.error('Error fetching performance metrics:', error)
        setMetrics(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPerformanceMetrics()
  }, [selectedModel])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Model Performance</h1>
          <p className="text-secondary mt-2">Accuracy and validation metrics</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Model Performance Data Available</h3>
          <p>Backend API must be fully functional to display model performance metrics.</p>
        </div>
      </div>
    )
  }

  const getMetricStatus = (value: number, threshold: number = 0.8) => {
    if (value >= threshold) return 'good'
    if (value >= threshold - 0.1) return 'warning'
    return 'critical'
  }

  const totalPredictions = metrics.confusionMatrix.truePositive + 
                          metrics.confusionMatrix.falsePositive + 
                          metrics.confusionMatrix.trueNegative + 
                          metrics.confusionMatrix.falseNegative

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Model Performance</h1>
          <p className="text-secondary mt-2">
            Comprehensive model accuracy and validation metrics
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted">Accuracy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(metrics.accuracy * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={getMetricStatus(metrics.accuracy)}
              text={metrics.accuracy >= 0.9 ? 'Excellent' : metrics.accuracy >= 0.8 ? 'Good' : 'Fair'}
              size="sm"
            />
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Precision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(metrics.precision * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={getMetricStatus(metrics.precision)}
              text={metrics.precision >= 0.9 ? 'High' : 'Medium'}
              size="sm"
            />
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Recall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(metrics.recall * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={getMetricStatus(metrics.recall)}
              text={metrics.recall >= 0.9 ? 'High' : 'Medium'}
              size="sm"
            />
          </div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-medium text-muted">F1 Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(metrics.f1Score * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={getMetricStatus(metrics.f1Score)}
              text={metrics.f1Score >= 0.9 ? 'Excellent' : 'Good'}
              size="sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Confusion Matrix</h3>
          </div>
          <div className="terminal-card-content">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-muted mb-2">Predicted Positive</div>
                <div className="space-y-2">
                  <div className="bg-emerald-100 p-4 rounded">
                    <div className="text-sm text-muted">True Positive</div>
                    <div className="text-xl font-bold text-emerald-700">
                      {metrics.confusionMatrix.truePositive}
                    </div>
                  </div>
                  <div className="bg-red-100 p-4 rounded">
                    <div className="text-sm text-muted">False Positive</div>
                    <div className="text-xl font-bold text-red-700">
                      {metrics.confusionMatrix.falsePositive}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted mb-2">Predicted Negative</div>
                <div className="space-y-2">
                  <div className="bg-red-100 p-4 rounded">
                    <div className="text-sm text-muted">False Negative</div>
                    <div className="text-xl font-bold text-red-700">
                      {metrics.confusionMatrix.falseNegative}
                    </div>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded">
                    <div className="text-sm text-muted">True Negative</div>
                    <div className="text-xl font-bold text-emerald-700">
                      {metrics.confusionMatrix.trueNegative}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted">Total Predictions</div>
                  <div className="font-semibold text-heading">{totalPredictions}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Correct</div>
                  <div className="font-semibold text-emerald-600">
                    {metrics.confusionMatrix.truePositive + metrics.confusionMatrix.trueNegative}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted">Incorrect</div>
                  <div className="font-semibold text-red-600">
                    {metrics.confusionMatrix.falsePositive + metrics.confusionMatrix.falseNegative}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Cross-Validation Scores</h3>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {metrics.crossValidationScores.map((score, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-secondary">Fold {index + 1}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${score * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-heading w-12 text-right">
                      {(score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-heading">Average</span>
                  <span className="font-bold text-heading">
                    {((metrics.crossValidationScores.reduce((a, b) => a + b) / metrics.crossValidationScores.length) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted">Std Deviation</span>
                  <span className="text-sm text-muted">
                    {(Math.sqrt(metrics.crossValidationScores.reduce((sq, n) => {
                      const avg = metrics.crossValidationScores.reduce((a, b) => a + b) / metrics.crossValidationScores.length
                      return sq + Math.pow(n - avg, 2)
                    }, 0) / metrics.crossValidationScores.length) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Training History</h3>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center border-b border-slate-200 pb-2">
                <div className="text-xs text-muted font-medium">Epoch</div>
                <div className="text-xs text-muted font-medium">Train Loss</div>
                <div className="text-xs text-muted font-medium">Val Loss</div>
                <div className="text-xs text-muted font-medium">Accuracy</div>
              </div>
              {metrics.validationHistory.map((entry, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 text-center">
                  <div className="font-mono text-heading">{entry.epoch}</div>
                  <div className="font-mono text-secondary">{entry.trainLoss.toFixed(3)}</div>
                  <div className="font-mono text-secondary">{entry.valLoss.toFixed(3)}</div>
                  <div className="font-mono text-heading">{(entry.accuracy * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Additional Metrics</h3>
          </div>
          <div className="terminal-card-content space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-heading">AUC-ROC</div>
                <div className="text-sm text-muted">Area Under Curve</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-700">{metrics.auc.toFixed(3)}</div>
                <StatusBadge 
                  status={getMetricStatus(metrics.auc, 0.9)}
                  text={metrics.auc >= 0.95 ? 'Excellent' : 'Good'}
                  size="sm"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium text-heading">Mean Squared Error</div>
                <div className="text-sm text-muted">Lower is better</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-purple-700">{metrics.mse.toFixed(4)}</div>
                <StatusBadge 
                  status={metrics.mse <= 0.05 ? 'good' : metrics.mse <= 0.1 ? 'warning' : 'critical'}
                  text={metrics.mse <= 0.05 ? 'Low' : 'Medium'}
                  size="sm"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
              <div>
                <div className="font-medium text-heading">Mean Absolute Error</div>
                <div className="text-sm text-muted">Lower is better</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-cyan-700">{metrics.mae.toFixed(3)}</div>
                <StatusBadge 
                  status={metrics.mae <= 0.15 ? 'good' : metrics.mae <= 0.25 ? 'warning' : 'critical'}
                  text={metrics.mae <= 0.15 ? 'Low' : 'Medium'}
                  size="sm"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <div className="text-sm text-muted">Last Evaluated</div>
              <div className="text-secondary">
                {new Date(metrics.lastEvaluated).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}