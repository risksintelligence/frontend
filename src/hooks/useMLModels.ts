import { useCallback, useEffect, useState } from 'react';
import { getMLModelStatus, predictCascadeLikelihood, predictRiskScore } from '@/services/realTimeDataService';
import { rrio } from '@/lib/monitoring';

interface ModelMetadata {
  version: string;
  trained_at: string | null;
  training_window_start: string | null;
  training_window_end: string | null;
  performance_metrics: Record<string, any>;
  file_path: string;
  is_active: boolean;
}

interface MLModelStatusData {
  model_availability: {
    cascade_prediction: boolean;
    risk_scoring: boolean;
    total_models: number;
  };
  models: Record<string, ModelMetadata>;
  recommendations: string[];
  timestamp: string;
}

interface CascadePrediction {
  likelihood_probability: number;
  risk_category: string;
  confidence_score: number;
  key_drivers: Record<string, number>;
  features_used: Record<string, any>;
  model_version: string;
  prediction_timestamp: string;
}

interface RiskScorePrediction {
  entity_id: string;
  entity_type: string;
  risk_score: number;
  risk_level: string;
  volatility_score: number;
  key_risk_factors: Record<string, number>;
  features_analyzed: Record<string, any>;
  model_version: string;
  assessment_timestamp: string;
}

interface MLModelsState {
  statusData: MLModelStatusData | null;
  cascadePrediction: CascadePrediction | null;
  riskPrediction: RiskScorePrediction | null;
  loading: boolean;
  predictionLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export const useMLModels = () => {
  const [state, setState] = useState<MLModelsState>({
    statusData: null,
    cascadePrediction: null,
    riskPrediction: null,
    loading: false,
    predictionLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchModelStatus = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const statusData = await getMLModelStatus();
      
      if (statusData?.model_availability) {
        setState(prev => ({
          ...prev,
          statusData,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
        }));
        
        rrio.trackDataFetch('MLModelStatus', 'success', {
          total_models: statusData.model_availability.total_models,
          cascade_available: statusData.model_availability.cascade_prediction,
          risk_available: statusData.model_availability.risk_scoring,
        });
      } else {
        throw new Error('Invalid ML model status data structure');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      rrio.trackDataFetch('MLModelStatus', 'error', {
        error: errorMessage
      });
    }
  }, []);

  const predictCascade = useCallback(async (features: Record<string, any>) => {
    setState(prev => ({ ...prev, predictionLoading: true }));
    
    try {
      const predictionData = await predictCascadeLikelihood(features);
      
      if (predictionData?.cascade_prediction) {
        setState(prev => ({
          ...prev,
          cascadePrediction: predictionData.cascade_prediction,
          predictionLoading: false,
        }));
        
        rrio.trackDataFetch('CascadePrediction', 'success', {
          probability: predictionData.cascade_prediction.likelihood_probability,
          risk_category: predictionData.cascade_prediction.risk_category,
          confidence: predictionData.cascade_prediction.confidence_score,
        });
        
        return predictionData.cascade_prediction;
      } else {
        throw new Error('Invalid cascade prediction response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ 
        ...prev, 
        predictionLoading: false,
        error: errorMessage 
      }));
      
      rrio.trackDataFetch('CascadePrediction', 'error', {
        error: errorMessage
      });
      throw error;
    }
  }, []);

  const predictRisk = useCallback(async (
    entityId: string, 
    entityType: string, 
    features?: Record<string, any>
  ) => {
    setState(prev => ({ ...prev, predictionLoading: true }));
    
    try {
      const predictionData = await predictRiskScore(entityId, entityType, features);
      
      if (predictionData?.risk_scoring) {
        setState(prev => ({
          ...prev,
          riskPrediction: predictionData.risk_scoring,
          predictionLoading: false,
        }));
        
        rrio.trackDataFetch('RiskScorePrediction', 'success', {
          entity_type: entityType,
          risk_score: predictionData.risk_scoring.risk_score,
          risk_level: predictionData.risk_scoring.risk_level,
          volatility: predictionData.risk_scoring.volatility_score,
        });
        
        return predictionData.risk_scoring;
      } else {
        throw new Error('Invalid risk prediction response');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ 
        ...prev, 
        predictionLoading: false,
        error: errorMessage 
      }));
      
      rrio.trackDataFetch('RiskScorePrediction', 'error', {
        error: errorMessage,
        entity_type: entityType
      });
      throw error;
    }
  }, []);

  const refreshStatus = useCallback(() => {
    fetchModelStatus();
  }, [fetchModelStatus]);

  const clearPredictions = useCallback(() => {
    setState(prev => ({
      ...prev,
      cascadePrediction: null,
      riskPrediction: null,
    }));
  }, []);

  useEffect(() => {
    fetchModelStatus();
  }, [fetchModelStatus]);

  return {
    ...state,
    predictCascade,
    predictRisk,
    refreshStatus,
    clearPredictions,
    isStale: state.lastUpdated && 
      (Date.now() - new Date(state.lastUpdated).getTime()) > 900000, // 15 minutes for model status
    modelsAvailable: state.statusData?.model_availability?.cascade_prediction || 
                    state.statusData?.model_availability?.risk_scoring || false,
    totalModels: state.statusData?.model_availability?.total_models || 0,
  };
};

export default useMLModels;
