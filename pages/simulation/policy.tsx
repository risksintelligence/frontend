import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import PolicySimulator from '../../components/simulation/PolicySimulator';

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

interface SimulationHistory {
  id: string;
  name: string;
  timestamp: string;
  results: SimulationResult[];
}

export default function PolicySimulationPage() {
  const [simulationHistory, setSimulationHistory] = useState<SimulationHistory[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationHistory | null>(null);

  const handleSimulationComplete = (results: SimulationResult[]) => {
    const newSimulation: SimulationHistory = {
      id: Date.now().toString(),
      name: `Policy Simulation ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      results,
    };
    
    setSimulationHistory(prev => [newSimulation, ...prev.slice(0, 9)]); // Keep last 10 simulations
    setSelectedSimulation(newSimulation);
  };

  const getOverallImpactScore = (results: SimulationResult[]) => {
    if (results.length === 0) return 0;
    
    const totalImpact = results.reduce((sum, result) => {
      const impactMagnitude = Math.abs(result.impact.gdpChange) + 
                             Math.abs(result.impact.inflationChange) + 
                             Math.abs(result.impact.unemploymentChange) + 
                             Math.abs(result.impact.marketStabilityChange);
      return sum + impactMagnitude;
    }, 0);
    
    return totalImpact / results.length;
  };

  const getImpactSeverity = (score: number) => {
    if (score < 2) return { label: 'Low Impact', color: 'text-green-600 bg-green-50' };
    if (score < 5) return { label: 'Moderate Impact', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'High Impact', color: 'text-red-600 bg-red-50' };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Policy Impact Simulation
            </h1>
            <p className="mt-2 text-gray-600">
              Analyze the economic impact of policy changes on systemic risk factors
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PolicySimulator onSimulationComplete={handleSimulationComplete} />
            </div>

            <div className="space-y-6">
              {simulationHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Simulation History
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Previous policy simulation results
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {simulationHistory.map((simulation) => {
                        const impactScore = getOverallImpactScore(simulation.results);
                        const severity = getImpactSeverity(impactScore);
                        
                        return (
                          <div
                            key={simulation.id}
                            onClick={() => setSelectedSimulation(simulation)}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedSimulation?.id === simulation.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(simulation.timestamp).toLocaleDateString()}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${severity.color}`}>
                                {severity.label}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(simulation.timestamp).toLocaleTimeString()} • {simulation.results.length} policies
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {selectedSimulation && (
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Simulation Details
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(selectedSimulation.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Policy Changes</h4>
                        <div className="space-y-2">
                          {selectedSimulation.results.map((result) => (
                            <div key={result.policyId} className="flex justify-between text-sm">
                              <span className="text-gray-600 capitalize">
                                {result.policyId.replace('_', ' ')}:
                              </span>
                              <span className="font-medium">
                                {result.originalValue} → {result.simulatedValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Economic Impact</h4>
                        <div className="space-y-2">
                          {['GDP', 'Inflation', 'Unemployment', 'Market Stability'].map((metric, index) => {
                            const keys = ['gdpChange', 'inflationChange', 'unemploymentChange', 'marketStabilityChange'];
                            const avgChange = selectedSimulation.results.length > 0
                              ? selectedSimulation.results.reduce((sum, result) => 
                                  sum + result.impact[keys[index] as keyof typeof result.impact], 0
                                ) / selectedSimulation.results.length
                              : 0;
                            
                            return (
                              <div key={metric} className="flex justify-between text-sm">
                                <span className="text-gray-600">{metric}:</span>
                                <span className={`font-medium ${avgChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {avgChange > 0 ? '+' : ''}{avgChange.toFixed(2)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                        <div className="space-y-1">
                          {selectedSimulation.results.flatMap(r => r.riskFactors).slice(0, 4).map((factor, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{factor.category}:</span>
                              <div className="flex items-center space-x-2">
                                <span className={`font-medium ${factor.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {factor.change > 0 ? '+' : ''}{factor.change.toFixed(1)}%
                                </span>
                                <span className={`text-xs px-1 py-0.5 rounded ${
                                  factor.significance === 'high' ? 'bg-red-100 text-red-700' :
                                  factor.significance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
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

              <div className="bg-white rounded-lg shadow border">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Simulation Guidelines
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <strong className="text-gray-900">Monetary Policy:</strong>
                      <p>Adjust interest rates and reserve requirements to influence money supply and credit conditions.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Fiscal Policy:</strong>
                      <p>Modify government spending and taxation to affect aggregate demand and economic activity.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Regulatory Policy:</strong>
                      <p>Change financial regulations to impact banking stability and systemic risk.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Trade Policy:</strong>
                      <p>Adjust tariffs and trade barriers to influence international commerce and competitiveness.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}