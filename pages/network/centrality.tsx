import React from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { CentralityAnalysis } from '../../components/network/CentralityAnalysis';

const NetworkCentrality: React.FC = () => {
  // API URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  return (
    <>
      <Head>
        <title>Network Centrality - RiskX</title>
        <meta name="description" content="Network centrality analysis and node importance rankings" />
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Network Centrality Analysis</h1>
            <p className="text-gray-600">
              Analysis of node importance and influence within the economic risk network
            </p>
          </div>

          {/* Centrality Analysis Component */}
          <CentralityAnalysis apiUrl={apiUrl} />

          {/* Educational Content */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Understanding Network Centrality</h3>
            <p className="text-blue-800 mb-4">
              Network centrality measures help identify the most important nodes in the economic risk network, 
              revealing which entities have the greatest influence or vulnerability to systemic disruptions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Centrality Applications</h4>
                <p className="text-blue-700">
                  Centrality analysis helps identify key economic actors, critical infrastructure, 
                  and potential points of systemic failure or contagion.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Risk Management</h4>
                <p className="text-blue-700">
                  Understanding node centrality allows for targeted monitoring and intervention 
                  strategies to maintain network stability and resilience.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Policy Implications</h4>
                <p className="text-blue-700">
                  Centrality metrics inform regulatory priorities and help design policies 
                  that address the most systemically important entities.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Network Evolution</h4>
                <p className="text-blue-700">
                  Tracking centrality changes over time reveals shifts in network structure 
                  and emerging risks or opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Centrality Calculation Methods</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Betweenness Centrality</h4>
                <p className="text-gray-600 text-sm">
                  Calculated as the fraction of shortest paths between all pairs of nodes that pass through a given node. 
                  High betweenness indicates control over information or resource flows.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Closeness Centrality</h4>
                <p className="text-gray-600 text-sm">
                  Measured as the inverse of the average shortest path distance to all other nodes. 
                  High closeness indicates efficiency in reaching other network participants.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Degree Centrality</h4>
                <p className="text-gray-600 text-sm">
                  Simply the number of direct connections a node has. 
                  High degree indicates extensive direct relationships and potential for rapid contagion.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-gray-900">Eigenvector Centrality</h4>
                <p className="text-gray-600 text-sm">
                  Measures influence based on connections to other influential nodes. 
                  High eigenvector centrality indicates connections to other important network participants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NetworkCentrality;