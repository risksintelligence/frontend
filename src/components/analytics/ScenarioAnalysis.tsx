'use client';

import { useState, useEffect } from 'react';
import { Play, Save, RefreshCw, Settings, BarChart3, AlertTriangle } from 'lucide-react';

interface ScenarioParameter {
  id: string;
  name: string;
  currentValue: number;
  scenarioValue: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  category: 'economic' | 'market' | 'policy' | 'external';
}

interface ScenarioResult {
  parameter: string;
  baselineValue: number;
  scenarioValue: number;
  impact: number;
  impactPercent: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: ScenarioParameter[];
  results?: ScenarioResult[];
  lastRun?: string;
}

export default function ScenarioAnalysis() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadPresetScenarios();
  }, []);

  const loadPresetScenarios = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/analytics/scenarios`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.scenarios) {
        setScenarios(data.data.scenarios);
        if (data.data.scenarios.length > 0) {
          setSelectedScenario(data.data.scenarios[0]);
        }
      } else {
        throw new Error('Scenario data not available from backend');
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
      setScenarios([]);
      setSelectedScenario(null);
    }
  };

  const runScenario = async () => {
    if (!selectedScenario) return;
    
    setIsRunning(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/analytics/scenarios/${selectedScenario.id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parameters: selectedScenario.parameters
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.results) {
        const updatedScenario = {
          ...selectedScenario,
          results: data.data.results,
          lastRun: new Date().toISOString()
        };
        
        setSelectedScenario(updatedScenario);
        setScenarios(prev => 
          prev.map(s => s.id === selectedScenario.id ? updatedScenario : s)
        );
        
        setShowResults(true);
      } else {
        throw new Error('Scenario analysis failed');
      }
    } catch (error) {
      console.error('Error running scenario:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const updateParameter = (parameterId: string, value: number) => {
    if (!selectedScenario) return;
    
    const updatedScenario = {
      ...selectedScenario,
      parameters: selectedScenario.parameters.map(param =>
        param.id === parameterId ? { ...param, scenarioValue: value } : param
      )
    };
    
    setSelectedScenario(updatedScenario);
  };

  const resetScenario = () => {
    if (!selectedScenario) return;
    
    const resetScenario = {
      ...selectedScenario,
      parameters: selectedScenario.parameters.map(param => ({
        ...param,
        scenarioValue: param.currentValue
      })),
      results: undefined
    };
    
    setSelectedScenario(resetScenario);
    setShowResults(false);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-amber-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-emerald-700';
      default: return 'text-slate-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic': return 'text-emerald-700';
      case 'market': return 'text-blue-700';
      case 'policy': return 'text-amber-700';
      case 'external': return 'text-purple-700';
      default: return 'text-slate-500';
    }
  };

  if (!scenarios.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Scenario Analysis Available</h3>
          <p>Backend API must be fully functional to display scenario analysis tools.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-emerald-700" />
          <h2 className="text-xl font-semibold text-slate-900">
            Scenario Analysis
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetScenario}
            disabled={!selectedScenario}
            className="flex items-center gap-2 px-3 py-1 text-sm rounded border border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
          
          <button
            onClick={runScenario}
            disabled={!selectedScenario || isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Running...' : 'Run Scenario'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">
              Scenario Templates
            </h3>
            
            <div className="space-y-2">
              {scenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedScenario?.id === scenario.id
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="text-sm font-semibold">
                    {scenario.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {scenario.description}
                  </div>
                  {scenario.lastRun && (
                    <div className="text-xs text-slate-500 mt-1">
                      Last run: {new Date(scenario.lastRun).toLocaleString()}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parameter Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-900">
                Scenario Parameters
              </h3>
              <Settings className="w-5 h-5 text-slate-500" />
            </div>
            
            {selectedScenario ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">
                    {selectedScenario.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedScenario.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {selectedScenario.parameters.map(param => {
                    const change = param.scenarioValue - param.currentValue;
                    const changePercent = (change / param.currentValue) * 100;
                    
                    return (
                      <div key={param.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">
                              {param.name}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(param.category)} bg-white border border-slate-200`}>
                              {param.category.charAt(0).toUpperCase() + param.category.slice(1)}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-slate-900">
                              {param.scenarioValue.toFixed(2)} {param.unit}
                            </div>
                            <div className={`text-xs ${
                              change > 0 ? 'text-red-700' : 
                              change < 0 ? 'text-emerald-700' : 
                              'text-slate-500'
                            }`}>
                              {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={param.scenarioValue}
                            onChange={(e) => updateParameter(param.id, parseFloat(e.target.value))}
                            className="w-full h-2 bg-terminal-bg rounded-lg appearance-none cursor-pointer"
                          />
                          
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>{param.min} {param.unit}</span>
                            <span>Current: {param.currentValue} {param.unit}</span>
                            <span>{param.max} {param.unit}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500">
                Select a scenario template to configure parameters
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && selectedScenario?.results && (
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-700" />
            <h3 className="font-semibold text-slate-900">
              Scenario Impact Analysis
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedScenario.results.map((result, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 text-sm mb-3">
                  {result.parameter}
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs">Baseline</span>
                    <span className="text-slate-900 text-xs">{result.baselineValue.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs">Scenario</span>
                    <span className="text-slate-900 text-xs">{result.scenarioValue.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs">Impact</span>
                    <span className={`text-xs ${
                      result.impact > 0 ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                      {result.impact > 0 ? '+' : ''}{result.impact.toFixed(1)} ({result.impactPercent > 0 ? '+' : ''}{result.impactPercent.toFixed(1)}%)
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-xs">Risk Level</span>
                    <span className={`text-xs font-semibold ${getRiskLevelColor(result.riskLevel)}`}>
                      {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}