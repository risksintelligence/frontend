import React from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { NetworkOverview } from '../../components/network/NetworkOverview';

const NetworkAnalysis: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  return (
    <>
      <Head>
        <title>Network Analysis - RiskX</title>
        <meta name="description" content="Comprehensive network analysis of economic risk propagation and systemic interconnections" />
      </Head>

      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Systemic Risk Network Analysis</h1>
            <p className="text-gray-600">
              Comprehensive analysis of economic interconnections, risk propagation, and network vulnerabilities
            </p>
          </div>

          <NetworkOverview apiUrl={apiUrl} />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Network Analysis Framework</h3>
            <p className="text-blue-800 mb-4">
              Our systemic risk network analysis provides a comprehensive view of economic interconnections, 
              enabling identification of critical dependencies, vulnerability assessments, and shock propagation modeling.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Network Structure</h4>
                <p className="text-blue-700">
                  Mathematical representation of economic entities and their relationships, 
                  capturing both direct and indirect dependencies across sectors.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Risk Propagation</h4>
                <p className="text-blue-700">
                  Analysis of how economic shocks spread through network connections, 
                  identifying amplification mechanisms and contagion pathways.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Centrality Analysis</h4>
                <p className="text-blue-700">
                  Identification of systemically important nodes based on network position, 
                  influence, and critical role in maintaining system stability.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Vulnerability Assessment</h4>
                <p className="text-blue-700">
                  Systematic evaluation of network weaknesses, single points of failure, 
                  and resilience factors that affect overall system robustness.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a 
                href="/network/centrality"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-purple-600 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Centrality Analysis</h4>
                <p className="text-sm text-gray-600">
                  Node importance rankings and influence metrics
                </p>
              </a>

              <a 
                href="/network/vulnerability"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-red-600 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Vulnerability Assessment</h4>
                <p className="text-sm text-gray-600">
                  Network weaknesses and resilience evaluation
                </p>
              </a>

              <a 
                href="/network/critical-paths"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-purple-600 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Critical Paths</h4>
                <p className="text-sm text-gray-600">
                  Risk transmission pathways and dependencies
                </p>
              </a>

              <a 
                href="/network/simulation"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-orange-600 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Shock Simulation</h4>
                <p className="text-sm text-gray-600">
                  Network shock modeling and impact analysis
                </p>
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Methodological Foundation</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Graph Theory</h4>
                <p className="text-gray-600 text-sm">
                  Mathematical framework using directed and weighted graphs to represent economic relationships, 
                  enabling rigorous analysis of network properties and dynamics.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Centrality Measures</h4>
                <p className="text-gray-600 text-sm">
                  Multiple centrality algorithms (betweenness, closeness, degree, eigenvector) to identify 
                  critical nodes from different perspectives of network importance and influence.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-gray-900">Shock Propagation Models</h4>
                <p className="text-gray-600 text-sm">
                  Dynamic simulation models that trace how economic shocks propagate through network connections, 
                  considering transmission delays, amplification effects, and feedback mechanisms.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900">Vulnerability Metrics</h4>
                <p className="text-gray-600 text-sm">
                  Comprehensive vulnerability assessment combining structural network properties, 
                  operational capacity constraints, and systemic risk exposure factors.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Applications and Use Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Financial Stability</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Systemic risk identification</li>
                  <li>• Too-big-to-fail institution analysis</li>
                  <li>• Contagion pathway mapping</li>
                  <li>• Regulatory impact assessment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Supply Chain Resilience</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Critical supplier identification</li>
                  <li>• Bottleneck analysis</li>
                  <li>• Alternative pathway planning</li>
                  <li>• Disruption impact modeling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Policy Analysis</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Monetary policy transmission</li>
                  <li>• Regulatory intervention effects</li>
                  <li>• Economic stimulus targeting</li>
                  <li>• Crisis response optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NetworkAnalysis;