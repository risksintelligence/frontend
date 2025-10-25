'use client';

import { useState, useEffect } from 'react';
import { Shuffle, BarChart3, AlertTriangle, Target, TrendingUp, TrendingDown } from 'lucide-react';

interface ModelComparison {
  model1: {
    id: string;
    name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    lastTrained: string;
  };
  model2: {
    id: string;
    name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    lastTrained: string;
  };
  featureImportanceComparison: Array<{
    feature: string;
    model1Importance: number;
    model2Importance: number;
    difference: number;
    consensus: 'high' | 'medium' | 'low';
  }>;
  performanceMetrics: {
    accuracyDifference: number;
    precisionDifference: number;
    recallDifference: number;
    f1Difference: number;
    overallConsistency: number;
  };
  predictions: Array<{
    id: string;
    input: Record<string, number>;
    model1Prediction: number;
    model2Prediction: number;
    actualOutcome?: number;
    difference: number;
  }>;
}

export default function ModelComparisonPage() {
  const [comparison, setComparison] = useState<ModelComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [model1, setModel1] = useState('economic-risk');
  const [model2, setModel2] = useState('market-volatility');

  const models = [
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' }
  ];

  useEffect(() => {
    const fetchModelComparison = async () => {
      try {
        setLoading(true);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/v1/explainability/compare-models?model1=${model1}&model2=${model2}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.warn('Model comparison endpoint not found');
            setComparison(null);
            return;
          }
          throw new Error(`Failed to fetch model comparison: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          setComparison(data.data);
        } else if (data.status === 'loading') {
          console.info('Model comparison is being calculated:', data.message);
          setComparison(null);
        }
        
      } catch (error) {
        console.error('Error fetching model comparison:', error);
        setComparison(null);
      } finally {
        setLoading(false);
      }
    };

    if (model1 !== model2) {
      fetchModelComparison();
    }
  }, [model1, model2]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-96 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!comparison && model1 === model2) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shuffle className="w-8 h-8 text-purple-700" />
            <div>
              <h1 className="text-2xl font-mono font-bold text-slate-900">
                MODEL COMPARISON
              </h1>
              <p className="text-slate-700 font-mono text-sm">
                Compare performance and feature importance across models
              </p>
            </div>
          </div>
        </div>

        {/* Model Selection */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
          <h3 className="font-mono font-semibold text-slate-900 mb-4">SELECT MODELS TO COMPARE</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-mono text-slate-700 mb-2">Model 1</label>
              <select
                value={model1}
                onChange={(e) => setModel1(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-mono text-slate-700 mb-2">Model 2</label>
              <select
                value={model2}
                onChange={(e) => setModel2(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {model1 === model2 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 font-mono text-sm">
                Please select two different models to compare.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shuffle className="w-8 h-8 text-purple-700" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              MODEL COMPARISON
            </h1>
            <p className="text-slate-700 font-mono text-sm">
              Compare performance and feature importance across models
            </p>
          </div>
        </div>
        
        <div className="text-slate-500 font-mono text-sm">
          {comparison ? 'Comparison Complete' : 'Select Models'}
        </div>
      </div>

      {/* Model Selection */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
        <h3 className="font-mono font-semibold text-slate-900 mb-4">COMPARE MODELS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-mono text-slate-700 mb-2">Model 1</label>
            <select
              value={model1}
              onChange={(e) => setModel1(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-mono text-slate-700 mb-2">Model 2</label>
            <select
              value={model2}
              onChange={(e) => setModel2(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!comparison ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-mono font-semibold text-amber-800">No Comparison Data Available</h3>
          </div>
          <p className="text-amber-700 font-mono text-sm mb-4">
            Model comparison data is not currently available. This could mean:
          </p>
          <div className="text-amber-600 font-mono text-xs">
            • Models are still training or being evaluated
            <br />
            • Backend comparison service is initializing
            <br />
            • Selected models may not have comparable data yet
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance Comparison */}
          <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
            <h3 className="font-mono font-semibold text-slate-900 mb-4">
              PERFORMANCE COMPARISON
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-mono font-semibold text-slate-900 text-sm mb-3">
                  {comparison.model1.name}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">Accuracy:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model1.accuracy * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">Precision:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model1.precision * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">Recall:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model1.recall * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">F1 Score:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model1.f1Score * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-mono font-semibold text-slate-900 text-sm mb-3">
                  {comparison.model2.name}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">Accuracy:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model2.accuracy * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">Precision:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model2.precision * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">Recall:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model2.recall * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-slate-600">F1 Score:</span>
                    <span className="font-mono text-sm font-bold">{(comparison.model2.f1Score * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-mono font-semibold text-slate-900 text-sm mb-3">Overall Consistency</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${comparison.performanceMetrics.overallConsistency * 100}%` }}
                  ></div>
                </div>
                <span className="font-mono text-sm font-bold">
                  {(comparison.performanceMetrics.overallConsistency * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Feature Importance Comparison */}
          <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
            <h3 className="font-mono font-semibold text-slate-900 mb-4">
              FEATURE IMPORTANCE COMPARISON
            </h3>
            
            <div className="space-y-3">
              {comparison.featureImportanceComparison
                .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
                .map((feature, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      {feature.feature}
                    </span>
                    <div className="flex items-center gap-2">
                      {feature.difference > 0 ? (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                      )}
                      <span className={`font-mono text-xs ${
                        Math.abs(feature.difference) > 0.1 ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {feature.difference > 0 ? '+' : ''}{feature.difference.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-mono text-slate-500">
                        {comparison.model1.name}: 
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {feature.model1Importance.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-500">
                        {comparison.model2.name}: 
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {feature.model2Importance.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Comparison */}
          {comparison.predictions && comparison.predictions.length > 0 && (
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <h3 className="font-mono font-semibold text-slate-900 mb-4">
                PREDICTION COMPARISON (Sample)
              </h3>
              
              <div className="space-y-3">
                {comparison.predictions.slice(0, 5).map((pred, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded">
                    <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">{comparison.model1.name}: </span>
                        <span className="font-bold">{pred.model1Prediction.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">{comparison.model2.name}: </span>
                        <span className="font-bold">{pred.model2Prediction.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Difference: </span>
                        <span className={`font-bold ${
                          Math.abs(pred.difference) > 10 ? 'text-red-600' : 'text-slate-900'
                        }`}>
                          {pred.difference > 0 ? '+' : ''}{pred.difference.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}