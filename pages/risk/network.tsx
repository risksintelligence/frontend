import React from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { NetworkOverview } from '../../components/network/NetworkOverview';
import { NetworkVisualization } from '../../components/network/NetworkVisualization';

const RiskNetwork: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  return (
    <>
      <Head>
        <title>Risk Network Analysis - RiskX</title>
        <meta name="description" content="Systemic risk network analysis and economic interconnection mapping" />
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Systemic Risk Network Analysis</h1>
            <p className="text-gray-600">
              Interactive visualization and analysis of economic risk propagation networks
            </p>
          </div>

          {/* Network Overview Dashboard */}
          <NetworkOverview apiUrl={apiUrl} />

          {/* Interactive Network Visualization */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Interactive Network Visualization</h3>
              <p className="text-sm text-gray-600">
                Explore the economic risk network with interactive controls and detailed node information
              </p>
            </div>
            <div className="p-0">
              <NetworkVisualization 
                apiUrl={apiUrl} 
                height={500}
                showControls={true}
              />
            </div>
          </div>

          {/* Network Analysis Tools */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Network Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/network/centrality"
                className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Centrality Analysis</div>
                  <div className="text-xs text-gray-600">Node importance rankings</div>
                </div>
              </a>

              <a
                href="/network/vulnerability"
                className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Vulnerability Assessment</div>
                  <div className="text-xs text-gray-600">Network weakness analysis</div>
                </div>
              </a>

              <a
                href="/network/critical-paths"
                className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Critical Paths</div>
                  <div className="text-xs text-gray-600">Risk propagation routes</div>
                </div>
              </a>

              <a
                href="/network/simulation"
                className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Shock Simulation</div>
                  <div className="text-xs text-gray-600">Impact modeling</div>
                </div>
              </a>
            </div>
          </div>

          {/* Network Theory Background */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Network Theory in Risk Analysis</h3>
            <p className="text-blue-800 mb-4">
              Network analysis provides a mathematical framework for understanding how economic risks propagate 
              through interconnected systems, enabling identification of critical dependencies and vulnerable pathways.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Graph Theory Foundation</h4>
                <p className="text-blue-700">
                  Economic entities are represented as nodes, with edges representing relationships, 
                  dependencies, and potential contagion pathways.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Centrality Measures</h4>
                <p className="text-blue-700">
                  Multiple centrality algorithms identify systemically important institutions 
                  and critical points of control within the network.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Propagation Dynamics</h4>
                <p className="text-blue-700">
                  Mathematical models simulate how shocks spread through network connections, 
                  considering transmission delays and amplification effects.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Resilience Analysis</h4>
                <p className="text-blue-700">
                  Network robustness metrics assess system stability under various 
                  failure scenarios and stress conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RiskNetwork;