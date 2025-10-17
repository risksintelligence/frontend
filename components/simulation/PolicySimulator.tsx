import React, { useState } from 'react';
import { Play, RotateCcw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface PolicyParameter {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  category: 'monetary' | 'fiscal' | 'regulatory' | 'trade';
}

interface SimulationResult {
  policyId: string;
  originalValue: number;
  simulatedValue: number;
  impact: {
    gdpChange: number;
    inflationChange: number;
    unemploymentChange: number;
    marketStabilityChange: number;
  };
  riskFactors: {
    category: string;
    change: number;
    significance: 'low' | 'medium' | 'high';
  }[];
  timestamp: string;
}

const mockPolicyParameters: PolicyParameter[] = [
  {
    id: 'fed_rate',
    name: 'Federal Funds Rate',
    description: 'Target federal funds rate set by the Federal Reserve',
    currentValue: 5.25,
    minValue: 0,
    maxValue: 10,
    unit: '%',
    category: 'monetary',
  },
  {
    id: 'government_spending',
    name: 'Government Spending',
    description: 'Federal government expenditure as percentage of GDP',
    currentValue: 23.5,
    minValue: 15,
    maxValue: 35,
    unit: '% of GDP',
    category: 'fiscal',
  },
  {
    id: 'corporate_tax',
    name: 'Corporate Tax Rate',
    description: 'Federal corporate income tax rate',
    currentValue: 21,
    minValue: 10,
    maxValue: 35,
    unit: '%',
    category: 'fiscal',
  },
  {
    id: 'reserve_requirement',
    name: 'Bank Reserve Requirement',
    description: 'Minimum reserves banks must hold against deposits',
    currentValue: 10,
    minValue: 5,
    maxValue: 20,
    unit: '%',
    category: 'regulatory',
  },
  {
    id: 'tariff_rate',
    name: 'Average Tariff Rate',
    description: 'Average tariff rate on imported goods',
    currentValue: 7.5,
    minValue: 0,
    maxValue: 25,
    unit: '%',
    category: 'trade',
  },
];

interface PolicySimulatorProps {
  onSimulationComplete?: (results: SimulationResult[]) => void;
}

export default function PolicySimulator({ onSimulationComplete }: PolicySimulatorProps) {
  const [parameters, setParameters] = useState<PolicyParameter[]>(mockPolicyParameters);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleParameterChange = (id: string, value: number) => {
    setParameters(prev => 
      prev.map(param => 
        param.id === id ? { ...param, currentValue: value } : param
      )
    );
  };

  const resetToDefaults = () => {
    setParameters(mockPolicyParameters);
    setResults([]);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock simulation results
    const simulationResults: SimulationResult[] = parameters.map(param => {
      const changeFromDefault = param.currentValue - mockPolicyParameters.find(p => p.id === param.id)!.currentValue;
      const relativeChange = changeFromDefault / param.currentValue;
      
      return {
        policyId: param.id,
        originalValue: mockPolicyParameters.find(p => p.id === param.id)!.currentValue,
        simulatedValue: param.currentValue,
        impact: {
          gdpChange: relativeChange * (Math.random() * 4 - 2),
          inflationChange: relativeChange * (Math.random() * 2 - 1),
          unemploymentChange: relativeChange * (Math.random() * 1.5 - 0.75),
          marketStabilityChange: relativeChange * (Math.random() * 3 - 1.5),
        },
        riskFactors: [
          {
            category: 'Financial Stability',
            change: relativeChange * (Math.random() * 20 - 10),
            significance: Math.abs(relativeChange) > 0.1 ? 'high' : Math.abs(relativeChange) > 0.05 ? 'medium' : 'low',
          },
          {
            category: 'Market Volatility',
            change: relativeChange * (Math.random() * 15 - 7.5),
            significance: Math.abs(relativeChange) > 0.15 ? 'high' : Math.abs(relativeChange) > 0.08 ? 'medium' : 'low',
          },
        ],
        timestamp: new Date().toISOString(),
      };
    });
    
    setResults(simulationResults);
    onSimulationComplete?.(simulationResults);
    setIsSimulating(false);
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
                disabled={isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
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
                    const avgChange = results.reduce((sum, result) => sum + result.impact[metric as keyof typeof result.impact], 0) / results.length;
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