'use client'

import { useState, useEffect } from 'react'
import { Search, BarChart3, GitBranch, TrendingUp, Info, Layers } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface FeatureImportance {
  feature: string
  globalImportance: number
  meanShapValue: number
  interactionStrength: number
  category: string
  dataType: string
  description: string
}

interface FeatureInteraction {
  feature1: string
  feature2: string
  interactionStrength: number
  correlationCoeff: number
  jointImportance: number
}

interface FeatureAnalysis {
  modelName: string
  totalFeatures: number
  importantFeatures: number
  featureImportances: FeatureImportance[]
  featureInteractions: FeatureInteraction[]
  partialDependence: {
    [feature: string]: {
      values: number[]
      predictions: number[]
      importance: number
    }
  }
  lastUpdated: string
}

export default function FeatureAnalysisPage() {
  const [analysis, setAnalysis] = useState<FeatureAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState('economic-risk')
  const [viewMode, setViewMode] = useState<'importance' | 'interactions' | 'dependence'>('importance')

  const models = [
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' }
  ]

  useEffect(() => {
    const fetchFeatureAnalysis = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'
        
        const response = await fetch(`${baseUrl}/api/v1/explainability/feature-importance/${selectedModel}`)

        if (!response.ok) {
          throw new Error('Failed to fetch feature analysis')
        }

        const result = await response.json()
        
        if (result.status !== 'success') {
          throw new Error('API returned invalid data format')
        }

        const data = result.data
        
        if (!data.feature_importances) {
          throw new Error('Invalid API response - missing required feature importance data')
        }

        setAnalysis(data)
      } catch (error) {
        console.error('Error fetching feature analysis:', error);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureAnalysis()
  }, [selectedModel])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Feature Analysis</h1>
          <p className="text-secondary mt-2">Feature importance and interactions</p>
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
        <Search className="h-12 w-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-heading mb-2">No Feature Analysis Available</h2>
        <p className="text-muted">Feature analysis data could not be loaded.</p>
      </div>
    )
  }

  const getImportanceColor = (importance: number) => {
    if (importance >= 0.2) return 'text-red-600'
    if (importance >= 0.1) return 'text-amber-600'
    if (importance >= 0.05) return 'text-blue-600'
    return 'text-slate-600'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Economic': 'bg-blue-100 text-blue-800',
      'Financial': 'bg-emerald-100 text-emerald-800',
      'Sentiment': 'bg-purple-100 text-purple-800',
      'Technical': 'bg-amber-100 text-amber-800'
    }
    return colors[category] || 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Feature Analysis</h1>
          <p className="text-secondary mt-2">
            Global and local feature importance, interactions, and dependency analysis
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted">Total Features</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">{analysis.totalFeatures}</div>
          <div className="text-xs text-muted mt-1">In model</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted">Important Features</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">{analysis.importantFeatures}</div>
          <div className="text-xs text-muted mt-1">Above threshold</div>
        </div>

        <div className="terminal-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted">Interactions</span>
          </div>
          <div className="text-2xl font-bold font-mono text-heading">{analysis.featureInteractions.length}</div>
          <div className="text-xs text-muted mt-1">Significant pairs</div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setViewMode('importance')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'importance'
              ? 'bg-white text-heading shadow-sm'
              : 'text-muted hover:text-secondary'
          }`}
        >
          Feature Importance
        </button>
        <button
          onClick={() => setViewMode('interactions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'interactions'
              ? 'bg-white text-heading shadow-sm'
              : 'text-muted hover:text-secondary'
          }`}
        >
          Feature Interactions
        </button>
        <button
          onClick={() => setViewMode('dependence')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'dependence'
              ? 'bg-white text-heading shadow-sm'
              : 'text-muted hover:text-secondary'
          }`}
        >
          Partial Dependence
        </button>
      </div>

      {viewMode === 'importance' && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Global Feature Importance</h3>
            <p className="text-sm text-muted mt-1">
              Features ranked by their global importance in model predictions
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.featureImportances
                .sort((a, b) => b.globalImportance - a.globalImportance)
                .map((feature, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-secondary">{feature.feature}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feature.category)}`}>
                          {feature.category}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-muted">
                          {feature.dataType}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getImportanceColor(feature.globalImportance)}`}>
                          {(feature.globalImportance * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted">
                          SHAP: {feature.meanShapValue > 0 ? '+' : ''}{feature.meanShapValue.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ width: `${feature.globalImportance * 100}%` }}
                        ></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <span className="text-xs font-medium text-white">
                          Interaction: {(feature.interactionStrength * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted">{feature.description}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'interactions' && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Feature Interactions</h3>
            <p className="text-sm text-muted mt-1">
              Significant interactions between feature pairs that influence predictions
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="space-y-4">
              {analysis.featureInteractions
                .sort((a, b) => b.interactionStrength - a.interactionStrength)
                .map((interaction, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-secondary">{interaction.feature1}</span>
                        <GitBranch className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-secondary">{interaction.feature2}</span>
                      </div>
                      <StatusBadge 
                        status={interaction.interactionStrength > 0.6 ? 'critical' : interaction.interactionStrength > 0.4 ? 'warning' : 'info'}
                        text={`${(interaction.interactionStrength * 100).toFixed(0)}% strength`}
                        size="sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted">Interaction Strength:</span>
                        <div className="font-semibold text-heading">
                          {(interaction.interactionStrength * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-muted">Correlation:</span>
                        <div className={`font-semibold ${
                          Math.abs(interaction.correlationCoeff) > 0.7 ? 'text-red-600' :
                          Math.abs(interaction.correlationCoeff) > 0.4 ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                          {interaction.correlationCoeff.toFixed(3)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted">Joint Importance:</span>
                        <div className="font-semibold text-heading">
                          {(interaction.jointImportance * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${interaction.interactionStrength * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'dependence' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(analysis.partialDependence).map(([feature, data]) => (
            <div key={feature} className="terminal-card">
              <div className="terminal-card-header">
                <h3 className="font-semibold text-heading">{feature}</h3>
                <p className="text-xs text-muted mt-1">
                  Importance: {(data.importance * 100).toFixed(1)}%
                </p>
              </div>
              <div className="terminal-card-content">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center font-medium text-muted">Feature Value</div>
                    <div className="text-center font-medium text-muted">Prediction</div>
                  </div>
                  {data.values.map((value, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center font-mono text-secondary">
                        {value.toFixed(1)}
                      </div>
                      <div className="text-center font-mono text-heading">
                        {data.predictions[index].toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-xs text-muted text-center">
                    Partial dependence shows how predictions change with this feature
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Analysis Summary</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-heading mb-3">Feature Categories</h4>
              <div className="space-y-2">
                {['Economic', 'Financial', 'Sentiment', 'Technical'].map(category => {
                  const count = analysis.featureImportances.filter(f => f.category === category).length
                  const totalImportance = analysis.featureImportances
                    .filter(f => f.category === category)
                    .reduce((sum, f) => sum + f.globalImportance, 0)
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-heading">{count} features</div>
                        <div className="text-xs text-muted">
                          {(totalImportance * 100).toFixed(1)}% total importance
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-heading mb-3">Key Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary">
                    Top 3 features account for {((analysis.featureImportances.slice(0, 3).reduce((sum, f) => sum + f.globalImportance, 0)) * 100).toFixed(1)}% of model importance
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary">
                    Strongest feature interaction: {analysis.featureInteractions[0]?.feature1} ↔ {analysis.featureInteractions[0]?.feature2}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-secondary">
                    Model uses {analysis.totalFeatures} features with {analysis.importantFeatures} above significance threshold
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200 text-sm text-muted">
            Last Updated: {new Date(analysis.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}