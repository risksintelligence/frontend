import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import NetworkGraph from '../../components/visualizations/NetworkGraph';

interface NetworkNode {
  id: string;
  name: string;
  category: 'financial' | 'supply_chain' | 'economic' | 'government';
  riskLevel: number;
  systemicImportance: number;
  description: string;
}

interface NetworkLink {
  source: string;
  target: string;
  strength: number;
  riskPropagation: number;
  type: 'trade' | 'financial' | 'supply' | 'regulatory';
  description: string;
}

interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  timestamp: string;
}

interface ShockSimulationRequest {
  shockedNode: string;
  shockMagnitude: number;
}

interface ShockSimulationResponse {
  originalRisks: Record<string, number>;
  simulatedRisks: Record<string, number>;
  riskChanges: Record<string, number>;
  shockedNode: string;
  shockMagnitude: number;
  timestamp: string;
}

export default function NetworkPage() {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [shockSimulation, setShockSimulation] = useState<ShockSimulationResponse | null>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/network/analysis`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNetworkData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch network data');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
  };

  const runShockSimulation = async (shockedNode: string, magnitude: number) => {
    try {
      setSimulationLoading(true);
      
      const requestData: ShockSimulationRequest = {
        shockedNode,
        shockMagnitude: magnitude,
      };
      
      const response = await fetch(`${apiUrl}/api/v1/network/simulate-shock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shocked_node: requestData.shockedNode,
          shock_magnitude: requestData.shockMagnitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const simulationResult = await response.json();
      setShockSimulation(simulationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run shock simulation');
    } finally {
      setSimulationLoading(false);
    }
  };

  const handleShockSimulation = () => {
    if (selectedNode) {
      runShockSimulation(selectedNode.id, 25.0);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading network analysis...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium">Error loading network data</div>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={fetchNetworkData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Systemic Risk Network Analysis
            </h1>
            <p className="mt-2 text-gray-600">
              Interactive visualization of systemic risk propagation across economic entities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6">
                  {networkData && (
                    <NetworkGraph
                      data={{
                        nodes: networkData.nodes.map(node => ({
                          id: node.id,
                          name: node.name,
                          category: node.category,
                          riskLevel: node.riskLevel,
                          systemicImportance: node.systemicImportance,
                          description: node.description,
                        })),
                        links: networkData.links.map(link => ({
                          source: link.source,
                          target: link.target,
                          strength: link.strength,
                          riskPropagation: link.riskPropagation,
                          type: link.type,
                        })),
                        timestamp: networkData.timestamp,
                      }}
                      width={800}
                      height={600}
                      onNodeClick={handleNodeClick}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {selectedNode && (
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Selected Entity
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <p className="text-gray-900">{selectedNode.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Category:</span>
                        <p className="text-gray-900 capitalize">{selectedNode.category.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Risk Level:</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                selectedNode.riskLevel < 30 ? 'bg-green-500' :
                                selectedNode.riskLevel < 60 ? 'bg-yellow-500' :
                                selectedNode.riskLevel < 80 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${selectedNode.riskLevel}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{selectedNode.riskLevel}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Systemic Importance:</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${selectedNode.systemicImportance * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{(selectedNode.systemicImportance * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Description:</span>
                        <p className="text-gray-900 text-sm">{selectedNode.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleShockSimulation}
                      disabled={simulationLoading}
                      className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {simulationLoading ? 'Running Simulation...' : 'Simulate Risk Shock'}
                    </button>
                  </div>
                </div>
              )}

              {shockSimulation && (
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Shock Simulation Results
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Shocked Entity:</span>
                        <p className="text-gray-900">{shockSimulation.shockedNode}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Shock Magnitude:</span>
                        <p className="text-gray-900">{shockSimulation.shockMagnitude}%</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-2">Risk Changes:</span>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {Object.entries(shockSimulation.riskChanges)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 5)
                            .map(([nodeId, change]) => (
                              <div key={nodeId} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{nodeId}:</span>
                                <span className={`font-medium ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {networkData && (
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Network Metrics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Entities:</span>
                        <span className="text-sm font-medium">{networkData.nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Connections:</span>
                        <span className="text-sm font-medium">{networkData.links.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Network Density:</span>
                        <span className="text-sm font-medium">
                          {((networkData.links.length / (networkData.nodes.length * (networkData.nodes.length - 1))) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Average Risk Level:</span>
                        <span className="text-sm font-medium">
                          {(networkData.nodes.reduce((sum, node) => sum + node.riskLevel, 0) / networkData.nodes.length).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}