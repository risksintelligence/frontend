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

  const loadPresetScenarios = () => {
    const presetScenarios: Scenario[] = [
      {
        id: 'recession-scenario',
        name: 'Economic Recession Scenario',
        description: 'Simulates a moderate economic recession with declining GDP and rising unemployment',
        parameters: [
          {
            id: 'gdp-growth',
            name: 'GDP Growth Rate',
            currentValue: 2.1,
            scenarioValue: -1.5,
            unit: '%',
            min: -5.0,
            max: 5.0,
            step: 0.1,
            category: 'economic'
          },
          {
            id: 'unemployment',
            name: 'Unemployment Rate',
            currentValue: 3.7,
            scenarioValue: 6.2,
            unit: '%',
            min: 0.0,
            max: 15.0,
            step: 0.1,
            category: 'economic'
          },
          {
            id: 'inflation',
            name: 'Inflation Rate',
            currentValue: 3.2,
            scenarioValue: 1.8,
            unit: '%',
            min: -2.0,
            max: 10.0,
            step: 0.1,
            category: 'economic'
          },
          {
            id: 'fed-funds-rate',
            name: 'Federal Funds Rate',
            currentValue: 5.25,
            scenarioValue: 3.75,
            unit: '%',
            min: 0.0,
            max: 10.0,
            step: 0.25,
            category: 'policy'
          }
        ]
      },
      {
        id: 'inflation-spike',
        name: 'High Inflation Scenario',
        description: 'Persistent high inflation driving aggressive monetary policy response',
        parameters: [
          {
            id: 'inflation',
            name: 'Inflation Rate',
            currentValue: 3.2,
            scenarioValue: 6.5,
            unit: '%',
            min: -2.0,
            max: 10.0,
            step: 0.1,
            category: 'economic'
          },
          {
            id: 'fed-funds-rate',
            name: 'Federal Funds Rate',
            currentValue: 5.25,
            scenarioValue: 7.50,
            unit: '%',
            min: 0.0,
            max: 10.0,
            step: 0.25,
            category: 'policy'
          },
          {
            id: 'market-volatility',
            name: 'Market Volatility (VIX)',
            currentValue: 18.3,
            scenarioValue: 35.0,
            unit: 'index',
            min: 10.0,
            max: 80.0,
            step: 1.0,
            category: 'market'
          }
        ]
      },
      {
        id: 'geopolitical-crisis',
        name: 'Geopolitical Crisis',
        description: 'Major geopolitical tensions affecting global trade and energy markets',
        parameters: [
          {
            id: 'oil-price',
            name: 'Oil Price Shock',
            currentValue: 75.0,
            scenarioValue: 120.0,
            unit: '$/barrel',
            min: 30.0,
            max: 200.0,
            step: 5.0,
            category: 'external'
          },
          {
            id: 'trade-disruption',
            name: 'Trade Volume Decline',
            currentValue: 0.0,
            scenarioValue: -25.0,
            unit: '%',
            min: -50.0,
            max: 20.0,
            step: 1.0,
            category: 'external'
          },
          {
            id: 'market-volatility',
            name: 'Market Volatility (VIX)',
            currentValue: 18.3,
            scenarioValue: 42.0,
            unit: 'index',
            min: 10.0,
            max: 80.0,
            step: 1.0,
            category: 'market'
          }
        ]
      }
    ];
    
    setScenarios(presetScenarios);
    setSelectedScenario(presetScenarios[0]);
  };

  const runScenario = async () => {
    if (!selectedScenario) return;
    
    setIsRunning(true);
    
    // Simulate scenario calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate sample results
    const results: ScenarioResult[] = [
      {
        parameter: 'Overall Risk Score',
        baselineValue: 75.5,
        scenarioValue: 89.2,
        impact: 13.7,
        impactPercent: 18.1,
        riskLevel: 'high'
      },
      {
        parameter: 'Economic Risk',
        baselineValue: 78.2,
        scenarioValue: 92.4,
        impact: 14.2,
        impactPercent: 18.2,
        riskLevel: 'critical'
      },
      {
        parameter: 'Market Risk',
        baselineValue: 72.1,
        scenarioValue: 86.8,
        impact: 14.7,
        impactPercent: 20.4,
        riskLevel: 'high'
      },
      {
        parameter: 'Liquidity Risk',
        baselineValue: 45.3,
        scenarioValue: 68.9,
        impact: 23.6,
        impactPercent: 52.1,
        riskLevel: 'high'
      },
      {
        parameter: 'Credit Risk',
        baselineValue: 52.7,
        scenarioValue: 71.2,
        impact: 18.5,
        impactPercent: 35.1,
        riskLevel: 'medium'
      }
    ];
    
    const updatedScenario = {
      ...selectedScenario,
      results,
      lastRun: new Date().toISOString()
    };
    
    setSelectedScenario(updatedScenario);
    setScenarios(prev => 
      prev.map(s => s.id === selectedScenario.id ? updatedScenario : s)
    );
    
    setIsRunning(false);
    setShowResults(true);
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
      case 'critical': return 'text-terminal-red';
      case 'high': return 'text-terminal-orange';
      case 'medium': return 'text-terminal-yellow';
      case 'low': return 'text-terminal-green';
      default: return 'text-terminal-muted';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic': return 'text-terminal-green';
      case 'market': return 'text-terminal-blue';
      case 'policy': return 'text-terminal-orange';
      case 'external': return 'text-terminal-purple';
      default: return 'text-terminal-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-terminal-green" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            SCENARIO ANALYSIS
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetScenario}
            disabled={!selectedScenario}
            className="flex items-center gap-2 px-3 py-1 text-sm font-mono rounded border border-terminal-border text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            RESET
          </button>
          
          <button
            onClick={runScenario}
            disabled={!selectedScenario || isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'RUNNING...' : 'RUN SCENARIO'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection */}
        <div className="lg:col-span-1">
          <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
            <h3 className="font-mono font-semibold text-terminal-text mb-4">
              SCENARIO TEMPLATES
            </h3>
            
            <div className="space-y-2">
              {scenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedScenario?.id === scenario.id
                      ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30'
                      : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-terminal-border'
                  }`}
                >
                  <div className="font-mono text-sm font-semibold">
                    {scenario.name}
                  </div>
                  <div className="font-mono text-xs text-terminal-muted mt-1">
                    {scenario.description}
                  </div>
                  {scenario.lastRun && (
                    <div className="font-mono text-xs text-terminal-muted mt-1">
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
          <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono font-semibold text-terminal-text">
                SCENARIO PARAMETERS
              </h3>
              <Settings className="w-5 h-5 text-terminal-muted" />
            </div>
            
            {selectedScenario ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono font-semibold text-terminal-text text-lg">
                    {selectedScenario.name.toUpperCase()}
                  </h4>
                  <p className="font-mono text-sm text-terminal-muted mt-1">
                    {selectedScenario.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {selectedScenario.parameters.map(param => {
                    const change = param.scenarioValue - param.currentValue;
                    const changePercent = (change / param.currentValue) * 100;
                    
                    return (
                      <div key={param.id} className="bg-terminal-bg border border-terminal-border p-4 rounded">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-terminal-text text-sm">
                              {param.name.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-mono ${getCategoryColor(param.category)} bg-terminal-surface border border-terminal-border`}>
                              {param.category.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-mono text-sm text-terminal-text">
                              {param.scenarioValue.toFixed(2)} {param.unit}
                            </div>
                            <div className={`font-mono text-xs ${
                              change > 0 ? 'text-terminal-red' : 
                              change < 0 ? 'text-terminal-green' : 
                              'text-terminal-muted'
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
                          
                          <div className="flex justify-between text-xs font-mono text-terminal-muted">
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
              <div className="text-center text-terminal-muted font-mono">
                Select a scenario template to configure parameters
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && selectedScenario?.results && (
        <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-terminal-orange" />
            <h3 className="font-mono font-semibold text-terminal-text">
              SCENARIO IMPACT ANALYSIS
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedScenario.results.map((result, index) => (
              <div key={index} className="bg-terminal-bg border border-terminal-border p-4 rounded">
                <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
                  {result.parameter.toUpperCase()}
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-terminal-muted font-mono text-xs">Baseline</span>
                    <span className="text-terminal-text font-mono text-xs">{result.baselineValue.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-terminal-muted font-mono text-xs">Scenario</span>
                    <span className="text-terminal-text font-mono text-xs">{result.scenarioValue.toFixed(1)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-terminal-muted font-mono text-xs">Impact</span>
                    <span className={`font-mono text-xs ${
                      result.impact > 0 ? 'text-terminal-red' : 'text-terminal-green'
                    }`}>
                      {result.impact > 0 ? '+' : ''}{result.impact.toFixed(1)} ({result.impactPercent > 0 ? '+' : ''}{result.impactPercent.toFixed(1)}%)
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-terminal-muted font-mono text-xs">Risk Level</span>
                    <span className={`font-mono text-xs font-semibold ${getRiskLevelColor(result.riskLevel)}`}>
                      {result.riskLevel.toUpperCase()}
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