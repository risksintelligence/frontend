'use client';

import { useState, useEffect } from 'react';
import { Brain, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

interface PredictionExplanation {
  id: string;
  modelName: string;
  prediction: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  inputFeatures: Record<string, number>;
  shapValues: Array<{
    feature: string;
    value: number;
    contribution: 'positive' | 'negative';
  }>;
  featureContributions: Array<{
    feature: string;
    contribution: number;
    impact: 'high' | 'medium' | 'low';
  }>;
  counterfactuals: Array<{
    feature: string;
    originalValue: number;
    suggestedValue: number;
    impactOnPrediction: number;
  }>;
}

export default function PredictionExplanationsPage() {
  const [predictions, setPredictions] = useState<PredictionExplanation[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionExplanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const models = [
    { id: 'economic-risk', name: 'Economic Risk Model' },
    { id: 'market-volatility', name: 'Market Volatility Model' },
    { id: 'supply-chain', name: 'Supply Chain Risk Model' }
  ];

  const riskLevels = [
    { id: 'low', name: 'Low Risk', color: 'text-emerald-700' },
    { id: 'medium', name: 'Medium Risk', color: 'text-amber-700' },
    { id: 'high', name: 'High Risk', color: 'text-red-700' },
    { id: 'critical', name: 'Critical Risk', color: 'text-red-900' }
  ];

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/explainability/predictions`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Predictions endpoint not found');
          setPredictions([]);
          return;
        }
        throw new Error(`Failed to fetch predictions: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.predictions) {
        setPredictions(data.data.predictions);
        if (data.data.predictions.length > 0) {
          setSelectedPrediction(data.data.predictions[0]);
        }
      } else if (data.status === 'loading') {
        console.info('Predictions are being generated:', data.message);
        setPredictions([]);
      }
      
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(pred => {
    const matchesSearch = pred.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pred.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = filterModel === 'all' || pred.modelName.includes(filterModel);
    const matchesRisk = filterRisk === 'all' || pred.riskLevel === filterRisk;
    return matchesSearch && matchesModel && matchesRisk;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'high': return 'text-red-700 bg-red-50 border-red-200';
      case 'critical': return 'text-red-900 bg-red-100 border-red-300';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getRiskBadgeStatus = (level: string): 'good' | 'warning' | 'error' | 'critical' | 'info' => {
    switch (level) {
      case 'low': return 'good';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'critical';
      default: return 'info';
    }
  };

  const getContributionColor = (contribution: number) => {
    if (contribution > 0.1) return 'text-red-700 bg-red-50';
    if (contribution > 0) return 'text-amber-700 bg-amber-50';
    if (contribution > -0.1) return 'text-emerald-700 bg-emerald-50';
    return 'text-emerald-800 bg-emerald-100';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-96 bg-slate-200 rounded animate-pulse"></div>
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-700" />
          <div>
            <h1 className="text-2xl font-mono font-bold text-slate-900">
              PREDICTION EXPLANATIONS
            </h1>
            <p className="text-slate-700 font-mono text-sm">
              SHAP-powered explainable AI for model predictions
            </p>
          </div>
        </div>
        
        <div className="text-slate-500 font-mono text-sm">
          {filteredPredictions.length} predictions analyzed
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
            />
          </div>
          
          <select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
          >
            <option value="all">All Models</option>
            {models.map(model => (
              <option key={model.id} value={model.name}>{model.name}</option>
            ))}
          </select>
          
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
          >
            <option value="all">All Risk Levels</option>
            {riskLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
      </div>

      {predictions.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-mono font-semibold text-amber-800">No Predictions Available</h3>
          </div>
          <p className="text-amber-700 font-mono text-sm mb-4">
            No model predictions are currently available. This could mean:
          </p>
          <div className="text-amber-600 font-mono text-xs">
            • Models are still processing new data
            <br />
            • Backend services are initializing
            <br />
            • Check back in a few moments for updated predictions
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Predictions List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-mono font-semibold text-slate-900">RECENT PREDICTIONS</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPredictions.map((prediction) => (
                <div
                  key={prediction.id}
                  onClick={() => setSelectedPrediction(prediction)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPrediction?.id === prediction.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      {prediction.modelName}
                    </span>
                    <StatusBadge 
                      status={getRiskBadgeStatus(prediction.riskLevel)}
                      text={prediction.riskLevel.toUpperCase()}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-bold text-slate-900">
                      {prediction.prediction.toFixed(1)}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {(prediction.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                  
                  <div className="mt-2 text-xs font-mono text-slate-500">
                    {new Date(prediction.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Details */}
          <div className="lg:col-span-2">
            {selectedPrediction ? (
              <div className="space-y-6">
                {/* Prediction Overview */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                  <h3 className="font-mono font-semibold text-slate-900 mb-4">
                    PREDICTION OVERVIEW
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-slate-500 font-mono text-xs mb-1">PREDICTION</div>
                      <div className="text-2xl font-mono font-bold text-slate-900">
                        {selectedPrediction.prediction.toFixed(1)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-slate-500 font-mono text-xs mb-1">CONFIDENCE</div>
                      <div className="text-2xl font-mono font-bold text-slate-900">
                        {(selectedPrediction.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-slate-500 font-mono text-xs mb-1">RISK LEVEL</div>
                      <StatusBadge 
                        status={getRiskBadgeStatus(selectedPrediction.riskLevel)}
                        text={selectedPrediction.riskLevel.toUpperCase()}
                      />
                    </div>
                    
                    <div>
                      <div className="text-slate-500 font-mono text-xs mb-1">MODEL</div>
                      <div className="font-mono text-sm text-slate-900">
                        {selectedPrediction.modelName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Contributions */}
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                  <h3 className="font-mono font-semibold text-slate-900 mb-4">
                    FEATURE CONTRIBUTIONS (SHAP VALUES)
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedPrediction.featureContributions
                      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
                      .map((contrib, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                        <span className="font-mono text-sm text-slate-900">
                          {contrib.feature}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-mono ${getContributionColor(contrib.contribution)}`}>
                            {contrib.contribution > 0 ? '+' : ''}{contrib.contribution.toFixed(3)}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {contrib.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Counterfactuals */}
                {selectedPrediction.counterfactuals && selectedPrediction.counterfactuals.length > 0 && (
                  <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <h3 className="font-mono font-semibold text-slate-900 mb-4">
                      COUNTERFACTUAL ANALYSIS
                    </h3>
                    
                    <div className="space-y-3">
                      {selectedPrediction.counterfactuals.map((counter, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded">
                          <div className="font-mono text-sm font-semibold text-slate-900 mb-2">
                            {counter.feature}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                            <div>
                              <span className="text-slate-500">Current: </span>
                              <span className="text-slate-900">{counter.originalValue}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Suggested: </span>
                              <span className="text-slate-900">{counter.suggestedValue}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Impact: </span>
                              <span className={counter.impactOnPrediction > 0 ? 'text-red-700' : 'text-emerald-700'}>
                                {counter.impactOnPrediction > 0 ? '+' : ''}{counter.impactOnPrediction.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <p className="text-slate-500 font-mono text-sm">
                  Select a prediction from the list to view detailed explanations
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}