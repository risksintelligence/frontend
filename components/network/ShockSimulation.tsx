import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, RefreshCw, Play, BarChart3, Settings } from 'lucide-react';
import { useNetworkAnalysis } from '../../hooks/useNetworkAnalysis';

interface ShockSimulationProps {
  apiUrl: string;
}

export const ShockSimulation: React.FC<ShockSimulationProps> = ({
  apiUrl
}) => {
  const { 
    shockSimulation, 
    networkAnalysis, 
    loading, 
    error, 
    runShockSimulation, 
    fetchNetworkAnalysis,
    clearError 
  } = useNetworkAnalysis(apiUrl);

  const [simulationConfig, setSimulationConfig] = useState({
    shockType: 'node_failure',
    targetNodes: [] as string[],
    magnitude: 50
  });
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetchNetworkAnalysis();
  }, [fetchNetworkAnalysis]);

  const shockTypes = [
    { value: 'node_failure', label: 'Node Failure', description: 'Complete failure of a network node' },
    { value: 'edge_disruption', label: 'Connection Disruption', description: 'Breaking of network connections' },
    { value: 'cascading_failure', label: 'Cascading Failure', description: 'Sequential failure propagation' },
    { value: 'external_shock', label: 'External Shock', description: 'External economic disruption' }
  ];

  const handleRunSimulation = async () => {
    if (!selectedNode) {
      alert('Please select a target node for the shock simulation');
      return;
    }

    setIsRunning(true);
    try {
      await runShockSimulation({
        shockType: simulationConfig.shockType,
        targetNodes: [selectedNode],
        magnitude: simulationConfig.magnitude
      });
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 80) return 'text-red-600 bg-red-100';
    if (magnitude >= 60) return 'text-orange-600 bg-orange-100';
    if (magnitude >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 15) return 'text-red-600';
    if (impact >= 10) return 'text-orange-600';
    if (impact >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading && !networkAnalysis) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading network data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 mb-2">Error loading simulation</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableNodes = networkAnalysis?.nodes || [];

  return (
    <div className="space-y-6">
      {/* Simulation Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Shock Simulation Configuration</h3>
              <p className="text-sm text-gray-600">
                Configure and run network shock simulations
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shock Type
                </label>
                <select
                  value={simulationConfig.shockType}
                  onChange={(e) => setSimulationConfig(prev => ({ ...prev, shockType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {shockTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  {shockTypes.find(t => t.value === simulationConfig.shockType)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Node
                </label>
                <select
                  value={selectedNode}
                  onChange={(e) => setSelectedNode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a node...</option>
                  {availableNodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.name} ({node.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shock Magnitude: {simulationConfig.magnitude}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={simulationConfig.magnitude}
                  onChange={(e) => setSimulationConfig(prev => ({ ...prev, magnitude: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low Impact</span>
                  <span>High Impact</span>
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={!selectedNode || isRunning}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isRunning ? 'Running Simulation...' : 'Run Simulation'}</span>
              </button>
            </div>

            {/* Configuration Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Simulation Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shock Type:</span>
                  <span className="font-medium">
                    {shockTypes.find(t => t.value === simulationConfig.shockType)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Node:</span>
                  <span className="font-medium">
                    {selectedNode ? availableNodes.find(n => n.id === selectedNode)?.name : 'None selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Magnitude:</span>
                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${getMagnitudeColor(simulationConfig.magnitude)}`}>
                    {simulationConfig.magnitude}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {shockSimulation && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Simulation Results</h3>
                <p className="text-sm text-gray-600">
                  Impact analysis and network response to the shock
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Simulation ID</div>
                <div className="text-lg font-bold text-blue-900">
                  {shockSimulation.simulation_id || 'N/A'}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600">Total Impact</div>
                <div className="text-lg font-bold text-orange-900">
                  {shockSimulation.results?.total_system_impact?.toFixed(1) || 'N/A'}%
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600">Affected Nodes</div>
                <div className="text-lg font-bold text-red-900">
                  {shockSimulation.results?.affected_nodes?.length || 0}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Resilience Score</div>
                <div className="text-lg font-bold text-green-900">
                  {shockSimulation.results?.network_resilience?.toFixed(1) || 'N/A'}%
                </div>
              </div>
            </div>

            {/* Affected Nodes Analysis */}
            {shockSimulation.results?.affected_nodes && shockSimulation.results.affected_nodes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Most Affected Nodes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {shockSimulation.results.affected_nodes
                    .sort((a, b) => b.impact_score - a.impact_score)
                    .slice(0, 6)
                    .map((node) => (
                      <div key={node.node_id} className="border border-gray-200 rounded-lg p-3">
                        <div className="font-medium text-gray-900">
                          {availableNodes.find(n => n.id === node.node_id)?.name || node.node_id}
                        </div>
                        <div className="text-sm text-gray-600">
                          Impact: <span className={`font-medium ${getImpactColor(node.impact_score)}`}>
                            {node.impact_score.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Recovery: {node.recovery_time}h
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recovery Strategies */}
            {shockSimulation.results?.recovery_strategies && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Recommended Recovery Strategies</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {shockSimulation.results.recovery_strategies.map((strategy, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-green-800">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Simulation Metadata */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Shock Type:</span> {simulationConfig.shockType}
                </div>
                <div>
                  <span className="font-medium">Target Node:</span> {selectedNode}
                </div>
                <div>
                  <span className="font-medium">Magnitude:</span> {simulationConfig.magnitude}%
                </div>
                <div>
                  <span className="font-medium">Simulation Time:</span> {new Date(shockSimulation.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help and Guidelines */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Simulation Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Shock Configuration</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Select nodes with high systemic importance for maximum impact</li>
              <li>• Start with moderate magnitudes (40-60%) for realistic scenarios</li>
              <li>• Consider the shock type based on your analysis objectives</li>
              <li>• Monitor cascade depth and network resilience metrics</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Results Interpretation</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• High total system impact indicates systemic vulnerability</li>
              <li>• Short recovery times suggest network resilience</li>
              <li>• Monitor affected nodes for cascade pattern analysis</li>
              <li>• Use recovery strategies to enhance system stability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};