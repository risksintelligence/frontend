import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { PolicyParameter, SimulationResult, PolicyTemplate } from '../../types/simulation';


interface PolicySimulatorProps {
  onSimulationComplete?: (results: SimulationResult[]) => void;
  apiUrl?: string;
  appliedTemplate?: PolicyTemplate | null;
}

export default function PolicySimulator({ 
  onSimulationComplete, 
  apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com'
}: PolicySimulatorProps) {
  const { runPolicySimulation, loadPolicyTemplates, loading, error, clearError } = useSimulation(apiUrl);
  
  const [parameters, setParameters] = useState<PolicyParameter[]>([]);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Load real policy templates from API on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplatesLoading(true);
        const templates = await loadPolicyTemplates() as any;
        
        // Handle different response formats from API
        let policyParams: PolicyParameter[] = [];
        
        if (templates.policy_parameters && Array.isArray(templates.policy_parameters)) {
          // New format with policy_parameters array
          policyParams = templates.policy_parameters;
        } else if (templates.templates) {
          // Old format with templates object - convert to array
          policyParams = Object.values(templates.templates).map((template: any) => ({
            id: template.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
            name: template.name || 'Unknown Policy',
            description: template.description || '',
            currentValue: template.parameters?.intensity?.default || 1.0,
            minValue: template.parameters?.intensity?.range?.[0] || 0,
            maxValue: template.parameters?.intensity?.range?.[1] || 10,
            unit: template.parameters?.intensity?.unit || '',
            category: template.type || 'general',
            defaultValue: template.parameters?.intensity?.default || 1.0,
          }));
        }
        
        if (policyParams.length > 0) {
          setParameters(policyParams);
        }
      } catch (err) {
        console.error('Failed to load policy templates:', err);
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, [loadPolicyTemplates]);

  const handleParameterChange = (id: string, value: number) => {
    setParameters(prev => 
      prev.map(param => 
        param.id === id ? { ...param, currentValue: value } : param
      )
    );
  };

  const resetToDefaults = () => {
    setParameters(prev => prev.map(param => ({
      ...param,
      currentValue: param.defaultValue
    })));
    setResults([]);
  };

  const runSimulation = async () => {
    try {
      clearError();
      const simulationResults = await runPolicySimulation(parameters);
      setResults(simulationResults);
      onSimulationComplete?.(simulationResults);
    } catch (err) {
      console.error('Policy simulation failed:', err);
    }
  };

  const filteredParameters = selectedCategory === 'all' 
    ? parameters 
    : parameters.filter(p => p.category === selectedCategory);

  const getImpactIcon = (value: number) => {
    if (Math.abs(value) < 0.5) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (Math.abs(value) < 1.5) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return value > 0 ? <TrendingUp className="w-4 h-4 text-red-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Show loading state while templates are being fetched
  if (templatesLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 text-center">
            <div className="text-gray-500 mb-2">Loading policy templates...</div>
            <div className="text-sm text-gray-400">Fetching real economic data from API</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no parameters loaded
  if (!templatesLoading && parameters.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 text-center">
            <div className="text-red-500 mb-2">Failed to load policy templates</div>
            <div className="text-sm text-gray-400">Please ensure backend API is connected</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Policy Simulation Engine</h3>
              <p className="text-sm text-gray-600 mt-1">
                Analyze the impact of policy changes on economic risk factors
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={resetToDefaults}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={runSimulation}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>{loading ? 'Simulating...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Policy Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="monetary">Monetary Policy</option>
              <option value="fiscal">Fiscal Policy</option>
              <option value="regulatory">Regulatory Policy</option>
              <option value="trade">Trade Policy</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredParameters.map((param) => (
              <div key={param.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{param.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize`}>
                    {param.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{param.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Current Value:</span>
                    <span className="font-medium">{param.currentValue}{param.unit}</span>
                  </div>
                  
                  <div>
                    <input
                      type="range"
                      min={param.minValue}
                      max={param.maxValue}
                      step={param.unit === '%' ? 0.25 : 0.1}
                      value={param.currentValue}
                      onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{param.minValue}{param.unit}</span>
                      <span>{param.maxValue}{param.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Simulation Results</h3>
            <p className="text-sm text-gray-600 mt-1">
              Economic impact analysis of policy changes
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Economic Impact Summary</h4>
                <div className="space-y-3">
                  {['gdpChange', 'inflationChange', 'unemploymentChange', 'marketStabilityChange'].map((metric) => {
                    const avgChange = results.length > 0 
                      ? results.reduce((sum, result) => sum + result.impact[metric as keyof typeof result.impact], 0) / results.length
                      : 0;
                    const metricName = metric.replace('Change', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    
                    return (
                      <div key={metric} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-2">
                          {getImpactIcon(avgChange)}
                          <span className="text-sm text-gray-600">{metricName}:</span>
                        </div>
                        <span className={`text-sm font-medium ${avgChange > 0 ? 'text-red-600' : avgChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {avgChange > 0 ? '+' : ''}{avgChange.toFixed(2)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Risk Factor Changes</h4>
                <div className="space-y-2">
                  {results.flatMap(result => result.riskFactors).map((factor, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 rounded-md border ${getSignificanceColor(factor.significance)}`}>
                      <span className="text-sm font-medium">{factor.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {factor.change > 0 ? '+' : ''}{factor.change.toFixed(1)}%
                        </span>
                        <span className="text-xs uppercase tracking-wide">
                          {factor.significance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}