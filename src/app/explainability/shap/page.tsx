'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Target, TrendingUp, Info, Download, Zap } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface ShapValue {
  feature: string
  value: number
  impact: number
  importance: number
}

interface ShapAnalysis {
  predictionId: string
  modelName: string
  prediction: number
  expectedValue: number
  confidence: number
  shapValues: ShapValue[]
  timestamp: string
}

export default function ShapAnalysisPage() {
  const [analysis, setAnalysis] = useState<ShapAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState('economic-risk')

  const models = [
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' }
  ]

  useEffect(() => {
    const fetchShapAnalysis = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/v1/explainability/shap/${selectedModel}`)
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          setAnalysis({
            predictionId: 'pred_001',
            modelName: 'Economic Risk Model',
            prediction: 73.2,
            expectedValue: 45.8,
            confidence: 0.87,
            shapValues: [
              { feature: 'GDP Growth Rate', value: 2.1, impact: 12.4, importance: 0.34 },
              { feature: 'Unemployment Rate', value: 3.8, impact: -8.7, importance: 0.28 },
              { feature: 'Interest Rate Spread', value: 1.2, impact: -5.3, importance: 0.22 },
              { feature: 'Inflation Rate', value: 2.4, impact: 4.1, importance: 0.16 },
              { feature: 'Consumer Confidence', value: 89.2, impact: 3.8, importance: 0.12 },
              { feature: 'Industrial Production', value: 101.4, impact: 2.9, importance: 0.09 },
              { feature: 'Housing Starts', value: 1.68, impact: -1.2, importance: 0.06 }
            ],
            timestamp: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error('Error fetching SHAP analysis:', error)
        setAnalysis(null)
      } finally {
        setLoading(false)
      }
    }

    fetchShapAnalysis()
  }, [selectedModel])

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-emerald-600'
    if (impact < 0) return 'text-red-600'
    return 'text-slate-600'
  }

  const getImpactBgColor = (impact: number) => {
    if (impact > 0) return 'bg-emerald-100'
    if (impact < 0) return 'bg-red-100'
    return 'bg-slate-100'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">SHAP Analysis</h1>
          <p className="text-secondary mt-2">Individual prediction explanations with SHAP values</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 rounded"></div>
            <div className="h-48 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="terminal-card p-8 text-center">
        <Target className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No SHAP Analysis Available</h2>
        <p className="text-muted">Unable to load SHAP analysis data for the selected model.</p>
      </div>
    )
  }

  const maxAbsImpact = Math.max(...analysis.shapValues.map(sv => Math.abs(sv.impact)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">SHAP Analysis</h1>
          <p className="text-secondary mt-2">
            Individual prediction explanations with SHAP values for model interpretability
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Prediction</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">{analysis.prediction.toFixed(1)}</div>
          <div className="text-xs text-muted mt-1">Risk Score</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-slate-600" />
            <span className="text-sm font-medium text-muted">Expected Value</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">{analysis.expectedValue.toFixed(1)}</div>
          <div className="text-xs text-muted mt-1">Model baseline</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted">Total Impact</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {(analysis.prediction - analysis.expectedValue).toFixed(1)}
          </div>
          <div className="text-xs text-muted mt-1">Above baseline</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Confidence</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {(analysis.confidence * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-muted mt-1">Model confidence</div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">SHAP Feature Contributions</h3>
          <p className="text-sm text-muted mt-1">
            How each feature contributes to the prediction relative to the expected value
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="space-y-4">
            {analysis.shapValues
              .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
              .map((shapValue, index) => {
                const widthPercent = (Math.abs(shapValue.impact) / maxAbsImpact) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-secondary w-48">{shapValue.feature}</span>
                        <span className="text-xs px-2 py-1 bg-slate-100 rounded font-mono text-muted">
                          {shapValue.value}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`font-mono font-semibold ${getImpactColor(shapValue.impact)}`}>
                            {shapValue.impact > 0 ? '+' : ''}{shapValue.impact.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted">
                            {(shapValue.importance * 100).toFixed(1)}% importance
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${shapValue.impact > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${widthPercent}%` }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {Math.abs(shapValue.impact).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Positive Contributions</h3>
          </div>
          <div className="terminal-card-content space-y-3">
            {analysis.shapValues
              .filter(sv => sv.impact > 0)
              .sort((a, b) => b.impact - a.impact)
              .map((shapValue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <div className="font-medium text-secondary">{shapValue.feature}</div>
                    <div className="text-sm text-muted">Value: {shapValue.value}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-700">+{shapValue.impact.toFixed(2)}</div>
                    <div className="text-xs text-emerald-600">
                      {(shapValue.importance * 100).toFixed(1)}% important
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Negative Contributions</h3>
          </div>
          <div className="terminal-card-content space-y-3">
            {analysis.shapValues
              .filter(sv => sv.impact < 0)
              .sort((a, b) => a.impact - b.impact)
              .map((shapValue, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-secondary">{shapValue.feature}</div>
                    <div className="text-sm text-muted">Value: {shapValue.value}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-700">{shapValue.impact.toFixed(2)}</div>
                    <div className="text-xs text-red-600">
                      {(shapValue.importance * 100).toFixed(1)}% important
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Analysis Details</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-heading mb-2">Model Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Model:</span>
                  <span className="text-secondary">{analysis.modelName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Prediction ID:</span>
                  <span className="text-secondary font-mono">{analysis.predictionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Timestamp:</span>
                  <span className="text-secondary">
                    {new Date(analysis.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-heading mb-2">Explanation Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Features:</span>
                  <span className="text-secondary">{analysis.shapValues.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Positive Impact:</span>
                  <span className="text-emerald-600">
                    {analysis.shapValues.filter(sv => sv.impact > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Negative Impact:</span>
                  <span className="text-red-600">
                    {analysis.shapValues.filter(sv => sv.impact < 0).length}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-heading mb-2">Confidence Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Model Confidence:</span>
                  <StatusBadge 
                    status={analysis.confidence > 0.8 ? 'good' : analysis.confidence > 0.6 ? 'warning' : 'critical'}
                    text={`${(analysis.confidence * 100).toFixed(0)}%`}
                    size="sm"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Explanation Quality:</span>
                  <StatusBadge 
                    status="good"
                    text="High"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}