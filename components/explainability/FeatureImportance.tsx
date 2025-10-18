import React, { useState, useEffect } from 'react';
import { BarChart, Info, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface FeatureImportanceData {
  feature: string;
  importance: number;
  direction: 'positive' | 'negative';
  category: 'economic' | 'financial' | 'supply_chain' | 'disruption';
  description: string;
  confidence: number;
}

interface ModelMetadata {
  modelName: string;
  modelVersion: string;
  trainingDate: string;
  accuracy: number;
  dataPoints: number;
}

interface FeatureImportanceProps {
  apiUrl?: string;
  modelType?: 'risk_prediction' | 'disruption_forecast' | 'financial_stress';
  maxFeatures?: number;
  onFeatureClick?: (feature: FeatureImportanceData) => void;
}

export default function FeatureImportance({ 
  modelType = 'risk_prediction',
  maxFeatures = 10,
  onFeatureClick 
}: FeatureImportanceProps) {
  const [features, setFeatures] = useState<FeatureImportanceData[]>([]);
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');


  useEffect(() => {
    fetchFeatureImportance();
  }, [modelType]);

  const fetchFeatureImportance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from real API endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';
      const response = await fetch(`${apiUrl}/api/v1/prediction/models/feature-importance?model_type=${modelType}&max_features=${maxFeatures}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform API response to match component interface
      const transformedFeatures: FeatureImportanceData[] = data.features.map((f: any) => ({
        feature: f.feature,
        importance: f.importance,
        direction: f.direction,
        category: f.category,
        description: f.description,
        confidence: f.confidence
      }));
      
      const transformedMetadata: ModelMetadata = {
        modelName: data.model_metadata.model_name,
        modelVersion: data.model_metadata.model_version,
        trainingDate: data.model_metadata.training_date,
        accuracy: data.model_metadata.accuracy,
        dataPoints: data.model_metadata.data_points
      };
      
      setFeatures(transformedFeatures);
      setMetadata(transformedMetadata);
    } catch (err) {
      console.error('Failed to fetch feature importance:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feature importance data');
    } finally {
      setLoading(false);
    }
  };

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      economic: 'text-blue-700 bg-blue-50 border-blue-200',
      financial: 'text-purple-700 bg-purple-50 border-purple-200',
      supply_chain: 'text-green-700 bg-green-50 border-green-200',
      disruption: 'text-red-700 bg-red-50 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'positive' 
      ? <TrendingUp className="w-4 h-4 text-red-500" />
      : <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading feature importance...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <div className="flex items-center justify-center h-64 text-red-600">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Feature Importance Analysis
              </h3>
              <p className="text-sm text-gray-600">
                Key factors driving risk predictions with explainable AI
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">SHAP Values</span>
          </div>
        </div>
        
        {metadata && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Model:</span>
              <div className="font-medium">{metadata.modelName}</div>
            </div>
            <div>
              <span className="text-gray-500">Accuracy:</span>
              <div className="font-medium">{(metadata.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-gray-500">Training Date:</span>
              <div className="font-medium">{new Date(metadata.trainingDate).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-gray-500">Data Points:</span>
              <div className="font-medium">{metadata.dataPoints.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="economic">Economic Indicators</option>
            <option value="financial">Financial Markets</option>
            <option value="supply_chain">Supply Chain</option>
            <option value="disruption">Disruption Signals</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredFeatures.map((feature, index) => (
            <div
              key={feature.feature}
              onClick={() => onFeatureClick?.(feature)}
              className={`p-4 border rounded-lg transition-colors ${
                onFeatureClick ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <h4 className="font-medium text-gray-900">{feature.feature}</h4>
                  {getDirectionIcon(feature.direction)}
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(feature.category)}`}>
                    {feature.category.replace('_', ' ')}
                  </span>
                  <span className={`text-sm font-medium ${getConfidenceColor(feature.confidence)}`}>
                    {(feature.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Importance Score</span>
                  <span className="font-medium">{(feature.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${feature.importance * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">{feature.description}</p>
              
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span>
                  Impact: {feature.direction === 'positive' ? 'Increases' : 'Decreases'} risk when value rises
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Understanding Feature Importance</h4>
              <p className="text-sm text-blue-800 mt-1">
                Feature importance scores show how much each variable contributes to the model's predictions. 
                Higher scores indicate greater influence on risk assessments. Direction shows whether 
                increases in the feature raise or lower predicted risk levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}