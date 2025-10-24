'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, 
  Play, 
  Pause, 
  Square, 
  TrendingUp,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Zap,
  Settings,
  Download,
  Upload,
  Info
} from 'lucide-react';

interface Model {
  id: string;
  name: string;
  type: 'risk_scorer' | 'recession_predictor' | 'market_volatility' | 'geopolitical_risk' | 'supply_chain_risk' | 'network_analyzer';
  status: 'training' | 'trained' | 'deployed' | 'error' | 'idle';
  version: string;
  accuracy: number;
  last_trained: string;
  training_duration: number;
  dataset_size: number;
  features_count: number;
  hyperparameters: Record<string, any>;
  performance_metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    auc_roc: number;
  };
}

interface TrainingJob {
  id: string;
  model_id: string;
  model_name: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  started_at: string;
  estimated_completion: string;
  logs: string[];
  current_epoch: number;
  total_epochs: number;
  loss: number;
  validation_accuracy: number;
}

export default function ModelTrainingPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showTrainingConfig, setShowTrainingConfig] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const loadModelData = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/models`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.models) {
        setModels(data.data.models);
        if (data.data.training_jobs) {
          setTrainingJobs(data.data.training_jobs);
        }
        setLastRefresh(new Date().toLocaleTimeString());
      } else {
        throw new Error('Model data not available from backend');
      }
    } catch (error) {
      console.error('Error loading model data:', error);
      setModels([]);
      setTrainingJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModelData();
    
    // Refresh every 10 seconds during training
    const interval = setInterval(loadModelData, 10000);
    return () => clearInterval(interval);
  }, []);

  const startTraining = async (modelId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/models/${modelId}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.status === 'success') {
        await loadModelData();
        setShowTrainingConfig(false);
      }
    } catch (error) {
      console.error('Error starting training:', error);
    }
  };

  const stopTraining = async (jobId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/models/training/${jobId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.status === 'success') {
        await loadModelData();
      }
    } catch (error) {
      console.error('Error stopping training:', error);
    }
  };

  const deployModel = async (modelId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/models/${modelId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.status === 'success') {
        await loadModelData();
      }
    } catch (error) {
      console.error('Error deploying model:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'training': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'trained': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'idle': return <Clock className="w-5 h-5 text-gray-500" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'training': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'trained': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'idle': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'queued': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'cancelled': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (isLoading && models.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-[#374151]">Loading model training data...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && models.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <div className="text-slate-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Model Training Data Available</h3>
              <p>Backend API must be fully functional to display machine learning models.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Machine Learning Models</h1>
              <p className="text-[#374151]">Train, deploy, and monitor AI models for risk assessment</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTrainingConfig(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Training</span>
              </button>
              <button
                onClick={loadModelData}
                disabled={isLoading}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2">Last updated: {lastRefresh}</p>
          )}
        </div>

        {/* Model Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Total Models</h3>
                <p className="text-3xl font-bold text-[#374151]">{models.length}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Registered ML models</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Deployed</h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {models.filter(m => m.status === 'deployed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Active in production</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Training</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {trainingJobs.filter(j => j.status === 'running').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Currently training</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Avg Accuracy</h3>
                <p className="text-3xl font-bold text-[#374151]">
                  {models.length > 0 ? (models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Model performance</p>
          </div>
        </div>

        {/* Models Table */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e3a8a]">Model Registry</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your machine learning models</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Model</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Version</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Accuracy</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Dataset</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Last Trained</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-[#374151]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {models.map((model) => (
                  <tr key={model.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Brain className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-[#374151]">{model.name}</p>
                          <p className="text-xs text-gray-500">{model.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(model.status)}
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(model.status)}`}>
                          {model.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{model.version}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-[#374151]">{model.accuracy.toFixed(1)}%</span>
                        {model.accuracy >= 90 && <span className="text-emerald-500">⭐</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {model.dataset_size.toLocaleString()} samples, {model.features_count} features
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(model.last_trained).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {model.status !== 'deployed' && (
                          <button
                            onClick={() => deployModel(model.id)}
                            className="text-emerald-600 hover:text-emerald-800 p-1"
                            title="Deploy Model"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => startTraining(model.id)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Retrain Model"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 p-1" title="Model Settings">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Training Jobs */}
        {trainingJobs.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#1e3a8a]">Training Jobs</h2>
              <p className="text-sm text-gray-600 mt-1">Monitor active and recent training sessions</p>
            </div>
            
            <div className="p-6 space-y-4">
              {trainingJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-[#374151]">{job.model_name}</h3>
                        <p className="text-sm text-gray-500">Job ID: {job.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getJobStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      {job.status === 'running' && (
                        <button
                          onClick={() => stopTraining(job.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Stop Training"
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Progress</p>
                      <div className="mt-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-[#374151]">{job.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Epoch</p>
                      <p className="text-sm font-medium text-[#374151]">{job.current_epoch}/{job.total_epochs}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loss</p>
                      <p className="text-sm font-medium text-[#374151]">{job.loss.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Validation Accuracy</p>
                      <p className="text-sm font-medium text-[#374151]">{(job.validation_accuracy * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {job.logs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-[#374151] mb-2">Training Logs</h4>
                      <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                        {job.logs.slice(-5).map((log, index) => (
                          <p key={index} className="text-xs font-mono text-gray-600 mb-1">{log}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}