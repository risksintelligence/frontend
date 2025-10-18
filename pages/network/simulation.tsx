import React from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { ShockSimulation } from '../../components/network/ShockSimulation';

const NetworkSimulation: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  return (
    <>
      <Head>
        <title>Network Shock Simulation - RiskX</title>
        <meta name="description" content="Network shock simulation and risk propagation modeling to assess systemic resilience" />
      </Head>

      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Network Shock Simulation</h1>
            <p className="text-gray-600">
              Model and analyze the propagation of economic shocks through the network
            </p>
          </div>

          <ShockSimulation apiUrl={apiUrl} />

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-orange-900 mb-2">Understanding Shock Simulation</h3>
            <p className="text-orange-800 mb-4">
              Shock simulation models how disturbances propagate through the economic network, 
              helping assess systemic risk and network resilience under various stress scenarios.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-orange-900 mb-1">Shock Propagation</h4>
                <p className="text-orange-700">
                  Analysis of how initial disturbances spread through network connections, 
                  considering transmission mechanisms and amplification effects.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-900 mb-1">Cascade Effects</h4>
                <p className="text-orange-700">
                  Identification of potential cascade failures where initial shocks 
                  trigger secondary and tertiary effects throughout the system.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-900 mb-1">Resilience Testing</h4>
                <p className="text-orange-700">
                  Stress testing of network components to evaluate their ability 
                  to withstand and recover from various types of disruptions.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-900 mb-1">Impact Assessment</h4>
                <p className="text-orange-700">
                  Quantitative assessment of the total system impact and identification 
                  of the most vulnerable network segments.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Simulation Methodology</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-gray-900">Initial Shock Definition</h4>
                <p className="text-gray-600 text-sm">
                  Specification of shock parameters including magnitude, duration, and affected nodes. 
                  Shocks can represent economic downturns, policy changes, or external disruptions.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900">Propagation Modeling</h4>
                <p className="text-gray-600 text-sm">
                  Mathematical models that simulate how shocks spread through network connections, 
                  considering connection strengths, node capacities, and transmission delays.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-gray-900">Dynamic Response</h4>
                <p className="text-gray-600 text-sm">
                  Time-series analysis of how the network responds over multiple periods, 
                  including adaptive behaviors and feedback mechanisms.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Recovery Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Assessment of recovery patterns and time horizons, identifying factors 
                  that enhance or impede system restoration to baseline conditions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Simulation Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Policy Impact Assessment</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Monetary policy transmission effects</li>
                  <li>• Regulatory change implications</li>
                  <li>• Fiscal intervention outcomes</li>
                  <li>• Trade policy consequences</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Crisis Scenario Planning</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Financial crisis propagation</li>
                  <li>• Supply chain disruptions</li>
                  <li>• Cybersecurity incidents</li>
                  <li>• Natural disaster impacts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Risk Management</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Systemic risk identification</li>
                  <li>• Vulnerability assessment</li>
                  <li>• Mitigation strategy testing</li>
                  <li>• Contingency plan validation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NetworkSimulation;