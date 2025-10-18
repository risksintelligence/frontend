import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { FactorAnalysis } from '../../components/risk/FactorAnalysis';
import { FactorDetails } from '../../components/risk/FactorDetails';
import { RiskFactor } from '../../hooks/useRiskFactors';

const RiskFactors: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFactor, setSelectedFactor] = useState<RiskFactor | null>(null);
  
  // API URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleFactorSelect = (factor: RiskFactor) => {
    setSelectedFactor(factor);
  };

  const handleCloseDetails = () => {
    setSelectedFactor(null);
  };

  const categories = [
    { id: 'all', label: 'All Categories', description: 'All risk factors' },
    { id: 'economic', label: 'Economic', description: 'GDP, inflation, employment indicators' },
    { id: 'financial', label: 'Financial', description: 'Market conditions and financial stress' },
    { id: 'supply_chain', label: 'Supply Chain', description: 'Logistics and production disruptions' },
    { id: 'geopolitical', label: 'Geopolitical', description: 'Political and regulatory risks' },
    { id: 'environmental', label: 'Environmental', description: 'Climate and natural disaster risks' }
  ] as const;

  return (
    <>
      <Head>
        <title>Risk Factors - RiskX</title>
        <meta name="description" content="Individual risk factor analysis and monitoring" />
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk Factor Analysis</h1>
            <p className="text-gray-600">
              Detailed analysis of individual risk factors contributing to overall risk assessment
            </p>
          </div>

          {/* Category Filter */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{category.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Factor Analysis */}
            <div className="lg:col-span-1">
              <FactorAnalysis
                apiUrl={apiUrl}
                selectedCategory={selectedCategory}
                onFactorSelect={handleFactorSelect}
              />
            </div>

            {/* Factor Details */}
            <div className="lg:col-span-1">
              {selectedFactor ? (
                <FactorDetails
                  apiUrl={apiUrl}
                  factorId={selectedFactor.id}
                  onClose={handleCloseDetails}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 text-gray-400">[CHART]</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Risk Factor</h3>
                      <p className="text-gray-600">
                        Click on any risk factor from the left panel to view detailed analysis including 
                        historical data, correlations, and forecasts.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Risk Factor Summary */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Factor Categories Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {categories.slice(1).map((category) => (
                <div
                  key={category.id}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-gray-900 mb-1">--</div>
                  <div className="text-sm font-medium text-gray-700">{category.label}</div>
                  <div className="text-xs text-gray-500 mt-1">Factors</div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Understanding Risk Factors</h3>
            <p className="text-blue-800 mb-4">
              Risk factors are individual indicators that contribute to the overall risk assessment. 
              Each factor is continuously monitored and analyzed for its contribution to systemic risk.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Factor Categories</h4>
                <p className="text-blue-700">
                  Risk factors are grouped into categories based on their nature and impact on the economy.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Contribution Analysis</h4>
                <p className="text-blue-700">
                  Each factor's contribution to overall risk is calculated based on statistical models and historical analysis.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Alert Levels</h4>
                <p className="text-blue-700">
                  Factors are assigned alert levels based on current values relative to historical norms and thresholds.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Real-time Updates</h4>
                <p className="text-blue-700">
                  Factor values are updated in real-time from authoritative data sources and validated for accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RiskFactors;