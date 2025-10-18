import React from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { RiskMethodology } from '../../components/risk/RiskMethodology';

const MethodologyPage: React.FC = () => {
  // API URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';

  return (
    <>
      <Head>
        <title>Risk Methodology - RiskX</title>
        <meta name="description" content="Risk assessment methodology, framework, and validation details" />
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk Assessment Methodology</h1>
            <p className="text-gray-600">
              Comprehensive overview of the risk assessment framework, components, and validation methods
            </p>
          </div>

          {/* Methodology Component */}
          <RiskMethodology apiUrl={apiUrl} />

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Background */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Foundation</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Theoretical Framework</h4>
                  <p className="text-gray-600">
                    Based on modern portfolio theory, systemic risk analysis, and behavioral finance principles 
                    developed by leading academic institutions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Research Papers</h4>
                  <p className="text-gray-600">
                    Methodology incorporates findings from peer-reviewed research on financial stability, 
                    economic forecasting, and risk modeling.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Industry Standards</h4>
                  <p className="text-gray-600">
                    Aligns with Basel III frameworks, Federal Reserve stress testing methodologies, 
                    and international risk management standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Implementation Details */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Implementation Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Real-time Processing</h4>
                  <p className="text-gray-600">
                    Risk calculations are performed in real-time using distributed computing systems 
                    with sub-second latency for critical indicators.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Machine Learning Integration</h4>
                  <p className="text-gray-600">
                    Advanced ML models complement traditional statistical methods to identify 
                    patterns and anomalies in risk factor behavior.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Scalability</h4>
                  <p className="text-gray-600">
                    Architecture supports analysis of thousands of risk factors across multiple 
                    time horizons and geographical regions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Methodology Evolution */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Methodology Evolution</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Foundation (2023)</h4>
                  <p className="text-gray-600 text-sm">
                    Initial framework development based on traditional risk models and regulatory requirements.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Enhancement (2024)</h4>
                  <p className="text-gray-600 text-sm">
                    Integration of machine learning models and alternative data sources for improved accuracy.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Current (2024)</h4>
                  <p className="text-gray-600 text-sm">
                    Real-time processing capabilities and comprehensive validation framework implementation.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-400">Future (2025)</h4>
                  <p className="text-gray-500 text-sm">
                    Planned integration of climate risk factors and advanced behavioral modeling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact and Support */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Methodology Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
                <p className="text-gray-600">
                  Comprehensive technical documentation available for researchers and practitioners.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Training</h4>
                <p className="text-gray-600">
                  Training programs available for organizations implementing similar risk frameworks.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Collaboration</h4>
                <p className="text-gray-600">
                  Open to collaboration with academic institutions and regulatory bodies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default MethodologyPage;