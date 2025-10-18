import React from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { CriticalPaths } from '../../components/network/CriticalPaths';

const NetworkCriticalPaths: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  return (
    <>
      <Head>
        <title>Critical Paths Analysis - RiskX</title>
        <meta name="description" content="Analysis of critical dependency paths, bottlenecks, and alternative routes in the economic risk network" />
      </Head>

      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Critical Paths Analysis</h1>
            <p className="text-gray-600">
              Identification and analysis of critical dependency paths, bottlenecks, and alternative routes
            </p>
          </div>

          <CriticalPaths apiUrl={apiUrl} />

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-purple-900 mb-2">Understanding Critical Paths</h3>
            <p className="text-purple-800 mb-4">
              Critical paths represent essential routes through the network that are vital for maintaining 
              economic stability and operational continuity. These paths often represent key supply chains, 
              financial flows, or information channels that, if disrupted, could have cascading effects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Path Dependencies</h4>
                <p className="text-purple-700">
                  Sequential relationships between network entities that create dependencies 
                  and potential points of failure in economic processes.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Bottleneck Detection</h4>
                <p className="text-purple-700">
                  Identification of capacity constraints and choke points that could limit 
                  flow efficiency and create systemic vulnerabilities.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Alternative Routes</h4>
                <p className="text-purple-700">
                  Analysis of backup pathways and redundant connections that provide 
                  resilience and continuity options during disruptions.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-900 mb-1">Path Optimization</h4>
                <p className="text-purple-700">
                  Strategies for improving path efficiency, reducing dependencies, 
                  and enhancing overall network resilience.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Critical Path Analysis Methods</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">Shortest Path Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Identification of the most efficient routes between key economic entities using 
                  graph algorithms like Dijkstra's algorithm, considering weights for various factors.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Capacity Constraint Modeling</h4>
                <p className="text-gray-600 text-sm">
                  Analysis of throughput limitations and capacity utilization along critical paths 
                  to identify potential bottlenecks and expansion needs.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Redundancy Assessment</h4>
                <p className="text-gray-600 text-sm">
                  Evaluation of alternative pathways and backup routes to ensure system resilience 
                  and continued operation during primary path disruptions.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-gray-900">Flow Optimization</h4>
                <p className="text-gray-600 text-sm">
                  Mathematical optimization techniques to maximize flow efficiency while minimizing 
                  risk exposure and maintaining system stability.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Strategic Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Supply Chain Resilience</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Identify critical supplier dependencies</li>
                  <li>• Assess geographic concentration risks</li>
                  <li>• Develop diversification strategies</li>
                  <li>• Plan for alternative sourcing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Financial System Stability</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Map critical payment pathways</li>
                  <li>• Identify systemic risk concentrations</li>
                  <li>• Assess counterparty dependencies</li>
                  <li>• Design circuit breaker mechanisms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Infrastructure Planning</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Prioritize critical infrastructure</li>
                  <li>• Plan redundant capacity</li>
                  <li>• Optimize resource allocation</li>
                  <li>• Enhance emergency preparedness</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Management Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Monitoring Protocols</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Continuous monitoring of critical path performance and health indicators 
                  to enable early detection of potential disruptions.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time flow monitoring</li>
                  <li>• Capacity utilization tracking</li>
                  <li>• Performance degradation alerts</li>
                  <li>• Predictive maintenance scheduling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contingency Planning</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Development of comprehensive response plans for critical path disruptions 
                  and activation of alternative routes.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Emergency rerouting procedures</li>
                  <li>• Stakeholder notification systems</li>
                  <li>• Resource reallocation protocols</li>
                  <li>• Recovery time optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NetworkCriticalPaths;