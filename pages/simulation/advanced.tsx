import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { MonteCarloRunner } from '../../components/simulation/MonteCarloRunner';
import { SimulationHistory } from '../../components/simulation/SimulationHistory';
import { PolicyTemplates } from '../../components/simulation/PolicyTemplates';
import { SimulationComparison } from '../../components/simulation/SimulationComparison';
import PolicySimulator from '../../components/simulation/PolicySimulator';
import { 
  SimulationHistory as SimulationHistoryType, 
  PolicyTemplate, 
  MonteCarloResult,
  SimulationResult
} from '../../types/simulation';

const AdvancedSimulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'policy' | 'monte_carlo' | 'templates' | 'history' | 'comparison'>('policy');
  const [simulationHistory] = useState<SimulationHistoryType[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  
  // API URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  const handlePolicySimulationComplete = (results: SimulationResult[]) => {
    console.log('Policy simulation completed:', results);
    // Here you would typically save the simulation to history
  };

  const handleMonteCarloComplete = (results: MonteCarloResult) => {
    console.log('Monte Carlo simulation completed:', results);
    // Here you would typically save the simulation to history
  };

  const handleTemplateApply = (template: PolicyTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('policy');
  };

  const handleLoadSimulation = (simulation: SimulationHistoryType) => {
    console.log('Loading simulation:', simulation);
    // Here you would typically load the simulation parameters
    // and switch to the appropriate tab
    if (simulation.type === 'policy') {
      setActiveTab('policy');
    } else if (simulation.type === 'monte_carlo') {
      setActiveTab('monte_carlo');
    }
  };

  const tabs = [
    {
      id: 'policy',
      label: 'Policy Simulation',
      description: 'Analyze policy impacts on economic indicators'
    },
    {
      id: 'monte_carlo',
      label: 'Monte Carlo',
      description: 'Statistical risk scenario modeling'
    },
    {
      id: 'templates',
      label: 'Policy Templates',
      description: 'Pre-configured policy scenarios'
    },
    {
      id: 'history',
      label: 'Simulation History',
      description: 'Review past simulation runs'
    },
    {
      id: 'comparison',
      label: 'Compare Simulations',
      description: 'Side-by-side scenario analysis'
    }
  ];

  return (
    <>
      <Head>
        <title>Advanced Simulation - RiskX</title>
        <meta name="description" content="Advanced policy simulation and Monte Carlo analysis tools" />
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Simulation Suite</h1>
            <p className="text-gray-600">
              Comprehensive policy simulation, Monte Carlo analysis, and scenario comparison tools
            </p>
          </div>

          {/* Performance Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Simulations</p>
                  <p className="text-2xl font-bold text-gray-900">{simulationHistory.length}</p>
                </div>
                <div className="text-blue-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Policy Simulations</p>
                  <p className="text-2xl font-bold text-green-600">
                    {simulationHistory.filter(sim => sim.type === 'policy').length}
                  </p>
                </div>
                <div className="text-green-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monte Carlo Runs</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {simulationHistory.filter(sim => sim.type === 'monte_carlo').length}
                  </p>
                </div>
                <div className="text-purple-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {simulationHistory.length > 0 
                      ? Math.round((simulationHistory.filter(sim => sim.status === 'completed').length / simulationHistory.length) * 100)
                      : 0
                    }%
                  </p>
                </div>
                <div className="text-blue-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div>{tab.label}</div>
                    <div className="text-xs font-normal text-gray-400">{tab.description}</div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'policy' && (
                <div>
                  {selectedTemplate && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-blue-900">Applied Template: {selectedTemplate.name}</h4>
                          <p className="text-sm text-blue-700">{selectedTemplate.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedTemplate(null)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Clear Template
                        </button>
                      </div>
                    </div>
                  )}
                  <PolicySimulator onSimulationComplete={handlePolicySimulationComplete} />
                </div>
              )}

              {activeTab === 'monte_carlo' && (
                <MonteCarloRunner
                  apiUrl={apiUrl}
                  onResultsReady={handleMonteCarloComplete}
                />
              )}

              {activeTab === 'templates' && (
                <PolicyTemplates
                  apiUrl={apiUrl}
                  onApplyTemplate={handleTemplateApply}
                />
              )}

              {activeTab === 'history' && (
                <SimulationHistory
                  apiUrl={apiUrl}
                  onLoadSimulation={handleLoadSimulation}
                />
              )}

              {activeTab === 'comparison' && (
                <SimulationComparison
                  apiUrl={apiUrl}
                  availableSimulations={simulationHistory}
                />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveTab('policy')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-2xl mb-2 text-gray-400">[GOV]</div>
                <div className="font-medium">New Policy Simulation</div>
                <div className="text-sm text-gray-600">Analyze policy impacts</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('monte_carlo')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-2xl mb-2 text-gray-400">[CHART]</div>
                <div className="font-medium">Monte Carlo Analysis</div>
                <div className="text-sm text-gray-600">Statistical modeling</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('templates')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-2xl mb-2 text-gray-400">[LIST]</div>
                <div className="font-medium">Browse Templates</div>
                <div className="text-sm text-gray-600">Pre-built scenarios</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('comparison')}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="text-2xl mb-2 text-gray-400">[SCALE]</div>
                <div className="font-medium">Compare Results</div>
                <div className="text-sm text-gray-600">Side-by-side analysis</div>
              </button>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Simulation Capabilities</h3>
            <p className="text-blue-800 mb-4">
              Advanced simulation tools for comprehensive policy analysis and risk assessment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Policy Simulation</h4>
                <p className="text-blue-700">
                  Model the economic impact of policy changes across multiple indicators including GDP, inflation, and employment.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Monte Carlo Analysis</h4>
                <p className="text-blue-700">
                  Run thousands of scenarios to understand risk distributions and probability outcomes.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Policy Templates</h4>
                <p className="text-blue-700">
                  Access pre-configured policy scenarios based on historical analysis and expert knowledge.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Scenario Comparison</h4>
                <p className="text-blue-700">
                  Compare multiple simulation results to identify optimal policy configurations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdvancedSimulation;