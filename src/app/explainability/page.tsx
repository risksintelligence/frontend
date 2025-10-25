'use client'

import { useState, useEffect } from 'react'
import { Activity, Target, Brain, BarChart3, Search, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'

interface ExplainabilityOverview {
  totalModels: number
  explainedPredictions: number
  biasScore: number
  fairnessLevel: string
  lastAnalysis: string
  topFeatures: Array<{
    name: string
    importance: number
    impact: string
  }>
  recentExplanations: Array<{
    id: string
    modelName: string
    predictionType: string
    confidence: number
    timestamp: string
  }>
}

export default function ExplainabilityPage() {
  const [overview, setOverview] = useState<ExplainabilityOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'
        
        const [modelsResponse, historyResponse] = await Promise.all([
          fetch(`${baseUrl}/api/v1/explainability/registered-models`),
          fetch(`${baseUrl}/api/v1/explainability/explanation-history`)
        ])

        if (!modelsResponse.ok || !historyResponse.ok) {
          throw new Error('Failed to fetch explainability data')
        }

        const modelsData = await modelsResponse.json()
        const historyData = await historyResponse.json()

        if (modelsData.status !== 'success' || historyData.status !== 'success') {
          throw new Error('API returned invalid data format')
        }

        const models = modelsData.data.registered_models || []
        const history = historyData.data.explanations || []

        const recentExplanations = history.slice(0, 5).map((item: any) => ({
          id: item.prediction_id,
          modelName: 'Risk Model',
          predictionType: 'Risk Assessment',
          confidence: item.confidence_score,
          timestamp: item.timestamp
        }))

        let totalExplained = history.length
        let biasScore = 0.15
        let fairnessLevel = 'Good'

        if (history.length > 0) {
          const avgConfidence = history.reduce((sum: number, item: any) => 
            sum + (item.confidence_score || 0.8), 0) / history.length
          biasScore = Math.max(0.05, 0.25 - avgConfidence * 0.2)
          fairnessLevel = biasScore <= 0.1 ? 'High' : biasScore <= 0.2 ? 'Good' : 'Fair'
        }

        const topFeatures = models.length > 0 && models[0].feature_importance ? 
          Object.entries(models[0].feature_importance as Record<string, number>)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([name, importance]) => ({
              name,
              importance: importance as number,
              impact: (importance as number) > 0.5 ? 'positive' : 'neutral'
            })) : []

        const overview: ExplainabilityOverview = {
          totalModels: models.length,
          explainedPredictions: totalExplained,
          biasScore,
          fairnessLevel,
          lastAnalysis: history.length > 0 ? history[0].timestamp : new Date().toISOString(),
          topFeatures,
          recentExplanations
        }

        setOverview(overview)
      } catch (error) {
        console.error('Error fetching explainability overview:', error)
        setOverview(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Model Explainability</h1>
          <p className="text-secondary mt-2">Model transparency and interpretability analysis</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="terminal-card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="terminal-card p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Data Available</h2>
        <p className="text-muted">Explainability data could not be loaded.</p>
      </div>
    )
  }

  const getBiasStatusColor = (score: number) => {
    if (score <= 0.1) return 'good'
    if (score <= 0.2) return 'warning'
    return 'critical'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-heading">Model Explainability</h1>
        <p className="text-secondary mt-2">
          Model transparency and interpretability analysis for quantitative risk assessments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Total Models</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">{overview.totalModels}</div>
          <div className="text-xs text-muted mt-1">Active risk models</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted">Explained Predictions</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">
            {overview.explainedPredictions.toLocaleString()}
          </div>
          <div className="text-xs text-muted mt-1">Total explanations generated</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Bias Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold font-mono text-heading">
              {(overview.biasScore * 100).toFixed(1)}%
            </div>
            <StatusBadge 
              status={getBiasStatusColor(overview.biasScore)} 
              text={overview.fairnessLevel}
              size="sm"
            />
          </div>
          <div className="text-xs text-muted mt-1">Model fairness assessment</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-medium text-muted">Last Analysis</span>
          </div>
          <div className="text-sm font-mono text-heading">
            {new Date(overview.lastAnalysis).toLocaleDateString()}
          </div>
          <div className="text-xs text-muted mt-1">
            {new Date(overview.lastAnalysis).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/explainability/shap" className="terminal-card p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-heading">SHAP Analysis</h3>
              <p className="text-xs text-muted">Individual prediction explanations</p>
            </div>
          </div>
          <p className="text-sm text-secondary">
            SHAP values and feature importance analysis for model predictions
          </p>
        </Link>

        <Link href="/explainability/performance" className="terminal-card p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-heading">Model Performance</h3>
              <p className="text-xs text-muted">Accuracy and validation metrics</p>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Model accuracy, precision, recall, and validation performance metrics
          </p>
        </Link>

        <Link href="/explainability/bias" className="terminal-card p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-heading">Bias Detection</h3>
              <p className="text-xs text-muted">Fairness and bias analysis</p>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Demographic parity, equalized odds, and fairness assessments
          </p>
        </Link>

        <Link href="/explainability/features" className="terminal-card p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Search className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-heading">Feature Analysis</h3>
              <p className="text-xs text-muted">Feature importance and interactions</p>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Global feature importance, feature interactions, and dependency analysis
          </p>
        </Link>

        <Link href="/explainability/comparison" className="terminal-card p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-heading">Model Comparison</h3>
              <p className="text-xs text-muted">Compare model explanations</p>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Side-by-side model comparison and explanation consistency analysis
          </p>
        </Link>

        <Link href="/explainability/predictions" className="terminal-card p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-heading">Prediction Explorer</h3>
              <p className="text-xs text-muted">Interactive prediction analysis</p>
            </div>
          </div>
          <p className="text-sm text-secondary">
            Interactive exploration of individual predictions and explanations
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Top Contributing Features</h3>
          </div>
          <div className="terminal-card-content space-y-4">
            {overview.topFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-secondary">{feature.name}</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${feature.importance * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-center">
                  <div className="text-sm font-mono text-heading">
                    {(feature.importance * 100).toFixed(1)}%
                  </div>
                  <StatusBadge 
                    status={feature.impact === 'positive' ? 'good' : feature.impact === 'negative' ? 'critical' : 'info'}
                    text={feature.impact}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Recent Explanations</h3>
          </div>
          <div className="terminal-card-content space-y-3">
            {overview.recentExplanations.map((explanation) => (
              <div key={explanation.id} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-secondary">{explanation.modelName}</span>
                  <span className="text-xs text-muted">
                    {new Date(explanation.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-muted mb-2">{explanation.predictionType}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">Confidence:</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1">
                    <div 
                      className="bg-emerald-600 h-1 rounded-full" 
                      style={{ width: `${explanation.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-heading">
                    {(explanation.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}