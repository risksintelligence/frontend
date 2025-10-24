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

  useEffect(() => {
    const loadModelData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call to backend model management endpoints
        const mockModels: Model[] = [
          {
            id: 'risk_scorer_v1',
            name: 'Risk Scoring Model',
            type: 'risk_scorer',
            status: 'deployed',
            version: '1.2.3',
            accuracy: 89.4,
            last_trained: new Date(Date.now() - 86400000).toISOString(),
            training_duration: 3600,
            dataset_size: 125000,
            features_count: 47,
            hyperparameters: {
              learning_rate: 0.001,
              batch_size: 32,
              epochs: 100,
              dropout: 0.2,
              optimizer: 'adam'
            },
            performance_metrics: {
              precision: 0.891,
              recall: 0.876,
              f1_score: 0.883,
              auc_roc: 0.924
            }
          },
          {
            id: 'recession_predictor_v1',
            name: 'Recession Prediction Model',
            type: 'recession_predictor',
            status: 'training',
            version: '2.1.0',
            accuracy: 76.8,
            last_trained: new Date(Date.now() - 172800000).toISOString(),
            training_duration: 7200,
            dataset_size: 89000,
            features_count: 34,
            hyperparameters: {
              learning_rate: 0.005,
              batch_size: 64,
              epochs: 150,
              dropout: 0.3,
              optimizer: 'sgd'
            },
            performance_metrics: {
              precision: 0.768,
              recall: 0.794,
              f1_score: 0.781,
              auc_roc: 0.856
            }
          },
          {
            id: 'volatility_model_v1',
            name: 'Market Volatility Model',
            type: 'market_volatility',
            status: 'deployed',
            version: '1.5.1',
            accuracy: 82.3,
            last_trained: new Date(Date.now() - 259200000).toISOString(),
            training_duration: 5400,
            dataset_size: 156000,
            features_count: 52,
            hyperparameters: {
              learning_rate: 0.002,
              batch_size: 128,
              epochs: 80,
              dropout: 0.25,
              optimizer: 'adam'
            },
            performance_metrics: {
              precision: 0.823,
              recall: 0.819,
              f1_score: 0.821,
              auc_roc: 0.887
            }
          },
          {
            id: 'geopolitical_risk_v1',
            name: 'Geopolitical Risk Model',
            type: 'geopolitical_risk',
            status: 'error',
            version: '1.0.2',
            accuracy: 71.2,
            last_trained: new Date(Date.now() - 432000000).toISOString(),
            training_duration: 4800,
            dataset_size: 67000,
            features_count: 29,
            hyperparameters: {
              learning_rate: 0.003,
              batch_size: 32,
              epochs: 120,
              dropout: 0.15,
              optimizer: 'rmsprop'
            },
            performance_metrics: {
              precision: 0.712,
              recall: 0.698,
              f1_score: 0.705,
              auc_roc: 0.789
            }
          },
          {
            id: 'supply_chain_v1',
            name: 'Supply Chain Risk Model',
            type: 'supply_chain_risk',
            status: 'trained',
            version: '1.1.0',
            accuracy: 85.7,
            last_trained: new Date(Date.now() - 345600000).toISOString(),
            training_duration: 2700,
            dataset_size: 98000,
            features_count: 41,
            hyperparameters: {
              learning_rate: 0.0015,
              batch_size: 64,
              epochs: 90,
              dropout: 0.2,
              optimizer: 'adam'
            },
            performance_metrics: {
              precision: 0.857,
              recall: 0.849,
              f1_score: 0.853,
              auc_roc: 0.901
            }
          },
          {
            id: 'network_analyzer_v1',
            name: 'Network Analysis Model',
            type: 'network_analyzer',
            status: 'idle',
            version: '0.9.1',
            accuracy: 78.9,
            last_trained: new Date(Date.now() - 604800000).toISOString(),
            training_duration: 9600,
            dataset_size: 234000,
            features_count: 63,
            hyperparameters: {
              learning_rate: 0.001,
              batch_size: 256,
              epochs: 200,
              dropout: 0.35,
              optimizer: 'adam'
            },
            performance_metrics: {
              precision: 0.789,
              recall: 0.784,
              f1_score: 0.786,
              auc_roc: 0.834
            }
          }
        ];

        const mockJobs: TrainingJob[] = [
          {
            id: 'job_001',
            model_id: 'recession_predictor_v1',
            model_name: 'Recession Prediction Model',
            status: 'running',
            progress: 67,
            started_at: new Date(Date.now() - 3600000).toISOString(),
            estimated_completion: new Date(Date.now() + 1800000).toISOString(),
            logs: [
              'Training started with 89,000 samples',
              'Epoch 1/150 - Loss: 0.847, Accuracy: 0.623',
              'Epoch 25/150 - Loss: 0.542, Accuracy: 0.734',
              'Epoch 50/150 - Loss: 0.423, Accuracy: 0.768',
              'Epoch 75/150 - Loss: 0.389, Accuracy: 0.781',
              'Epoch 100/150 - Loss: 0.365, Accuracy: 0.794'
            ],
            current_epoch: 100,
            total_epochs: 150,
            loss: 0.365,
            validation_accuracy: 0.794
          },
          {
            id: 'job_002',
            model_id: 'supply_chain_v1',
            model_name: 'Supply Chain Risk Model',
            status: 'completed',
            progress: 100,
            started_at: new Date(Date.now() - 7200000).toISOString(),
            estimated_completion: new Date(Date.now() - 1800000).toISOString(),
            logs: [
              'Training completed successfully',
              'Final validation accuracy: 85.7%',
              'Model saved to production'
            ],
            current_epoch: 90,
            total_epochs: 90,
            loss: 0.287,
            validation_accuracy: 0.857
          },
          {
            id: 'job_003',
            model_id: 'geopolitical_risk_v1',
            model_name: 'Geopolitical Risk Model',
            status: 'failed',
            progress: 45,
            started_at: new Date(Date.now() - 10800000).toISOString(),
            estimated_completion: '',
            logs: [
              'Training started with 67,000 samples',
              'Epoch 1/120 - Loss: 0.934, Accuracy: 0.512',
              'Epoch 25/120 - Loss: 0.678, Accuracy: 0.687',
              'Epoch 54/120 - Loss: diverging, stopping training',
              'ERROR: Training failed due to gradient explosion'
            ],
            current_epoch: 54,
            total_epochs: 120,
            loss: 999.99,
            validation_accuracy: 0.456
          }
        ];

        setModels(mockModels);
        setTrainingJobs(mockJobs);
        setLastRefresh(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Error loading model data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModelData();
    
    // Refresh every 10 seconds during training
    const interval = setInterval(loadModelData, 10000);
    return () => clearInterval(interval);
  }, []);

  const startTraining = async (modelId: string) => {
    try {
      console.log(`Starting training for model: ${modelId}`);
      // Simulate API call to start training
      setShowTrainingConfig(false);
    } catch (error) {
      console.error('Error starting training:', error);
    }
  };

  const stopTraining = async (jobId: string) => {
    try {
      console.log(`Stopping training job: ${jobId}`);
      // Simulate API call to stop training
    } catch (error) {
      console.error('Error stopping training:', error);
    }
  };

  const deployModel = async (modelId: string) => {
    try {
      console.log(`Deploying model: ${modelId}`);
      // Simulate API call to deploy model
    } catch (error) {
      console.error('Error deploying model:', error);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'training': return <Activity className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'trained': return <Zap className="w-5 h-5 text-purple-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'idle': return <Clock className="w-5 h-5 text-gray-600" />;
      default: return <Brain className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'trained': return 'bg-purple-100 text-purple-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'risk_scorer': return <TrendingUp className="w-6 h-6 text-red-600" />;
      case 'recession_predictor': return <BarChart3 className="w-6 h-6 text-orange-600" />;
      case 'market_volatility': return <Activity className="w-6 h-6 text-purple-600" />;
      case 'geopolitical_risk': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'supply_chain_risk': return <Settings className="w-6 h-6 text-blue-600" />;
      case 'network_analyzer': return <Brain className="w-6 h-6 text-green-600" />;
      default: return <Brain className="w-6 h-6 text-gray-600" />;
    }
  };

  const deployedModels = models.filter(m => m.status === 'deployed').length;
  const trainingModels = models.filter(m => m.status === 'training').length;
  const avgAccuracy = models.reduce((sum, model) => sum + model.accuracy, 0) / models.length;
  const activeJobs = trainingJobs.filter(j => j.status === 'running').length;

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Risk Intelligence Model Training</h1>
              <p className="text-[#374151]">Train, monitor, and deploy risk models for risk intelligence</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTrainingConfig(true)}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Training</span>
              </button>
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Deployed Models</h3>
                <p className="text-3xl font-bold text-green-600">{deployedModels}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Production ready models</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Training Active</h3>
                <p className="text-3xl font-bold text-blue-600">{trainingModels}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Currently training</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Avg Accuracy</h3>
                <p className="text-3xl font-bold text-[#374151]">{avgAccuracy.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Across all models</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">Active Jobs</h3>
                <p className="text-3xl font-bold text-[#374151]">{activeJobs}</p>
              </div>
              <Brain className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Training in progress</p>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {models.map((model) => (
            <div key={model.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getModelTypeIcon(model.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e3a8a] mb-1">{model.name}</h3>
                    <p className="text-sm text-gray-600">Version {model.version}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(model.status)}`}>
                    {getStatusIcon(model.status)}
                    <span className="ml-1">{model.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-[#374151]">Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">{model.accuracy.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">F1 Score</p>
                  <p className="text-2xl font-bold text-[#374151]">{model.performance_metrics.f1_score.toFixed(3)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-[#374151]">Dataset Size</p>
                  <p className="text-sm text-gray-600">{model.dataset_size.toLocaleString()} samples</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">Features</p>
                  <p className="text-sm text-gray-600">{model.features_count} features</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-[#374151]">Last Trained</p>
                  <p className="text-sm text-gray-600">{new Date(model.last_trained).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#374151]">Training Duration</p>
                  <p className="text-sm text-gray-600">{Math.floor(model.training_duration / 60)}m</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-[#374151] mb-2">Performance Metrics</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Precision:</span>
                    <span>{model.performance_metrics.precision.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recall:</span>
                    <span>{model.performance_metrics.recall.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AUC-ROC:</span>
                    <span>{model.performance_metrics.auc_roc.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                {model.status === 'trained' && (
                  <button
                    onClick={() => deployModel(model.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Deploy
                  </button>
                )}
                {model.status !== 'training' && (
                  <button
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowTrainingConfig(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Retrain
                  </button>
                )}
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Training Jobs */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1e3a8a]">Training Jobs</h2>
            <p className="text-sm text-gray-600 mt-1">Monitor active and recent training sessions</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {trainingJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-[#1e3a8a]">{job.model_name}</h3>
                      <p className="text-sm text-gray-600">Job ID: {job.id}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getJobStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      {job.status === 'running' && (
                        <button
                          onClick={() => stopTraining(job.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          <Square className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {job.status === 'running' && (
                    <>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-[#374151]">Epoch</p>
                          <p className="text-sm text-gray-600">{job.current_epoch}/{job.total_epochs}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#374151]">Loss</p>
                          <p className="text-sm text-gray-600">{job.loss.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#374151]">Validation Accuracy</p>
                          <p className="text-sm text-gray-600">{(job.validation_accuracy * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#374151]">ETA</p>
                          <p className="text-sm text-gray-600">
                            {new Date(job.estimated_completion).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <p className="text-sm font-medium text-[#374151] mb-2">Training Logs</p>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs max-h-32 overflow-y-auto">
                      {job.logs.map((log, index) => (
                        <div key={index}>{log}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Configuration Modal */}
        {showTrainingConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Configure Training</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Model</label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select a model</option>
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">Epochs</label>
                    <input 
                      type="number" 
                      defaultValue={100}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">Batch Size</label>
                    <input 
                      type="number" 
                      defaultValue={32}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Learning Rate</label>
                  <input 
                    type="number" 
                    step="0.001"
                    defaultValue={0.001}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => startTraining(selectedModel)}
                  disabled={!selectedModel}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Start Training
                </button>
                <button
                  onClick={() => setShowTrainingConfig(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Technical Information */}
        <div className="bg-slate-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Model Training Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Available Models</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Risk Scoring:</strong> Overall risk assessment for portfolios</li>
                <li>• <strong>Recession Prediction:</strong> Economic downturn forecasting</li>
                <li>• <strong>Market Volatility:</strong> Price volatility predictions</li>
                <li>• <strong>Geopolitical Risk:</strong> Political event impact assessment</li>
                <li>• <strong>Supply Chain Risk:</strong> Supply disruption analysis</li>
                <li>• <strong>Network Analysis:</strong> System connectivity and vulnerability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#374151] mb-2">Training Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time training progress monitoring</li>
                <li>• Hyperparameter tuning and optimization</li>
                <li>• Automated model versioning and deployment</li>
                <li>• Performance metrics tracking</li>
                <li>• Training job scheduling and queuing</li>
                <li>• Model comparison and A/B testing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}