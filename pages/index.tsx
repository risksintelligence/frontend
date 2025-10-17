import Head from 'next/head';
import Layout from '../components/common/Layout';
import RiskOverview from '../components/dashboard/RiskOverview';
import MetricsPanel from '../components/dashboard/MetricsPanel';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import RiskScoreChart from '../components/dashboard/RiskScoreChart';
import { PageErrorBoundary, ComponentErrorBoundary } from '../components/common/ErrorBoundary';

export default function Home() {
  // Use localhost:8000 where our API is running (matches FastAPI default port)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  return (
    <PageErrorBoundary>
      <Head>
        <title>RiskX - Risk Intelligence Observatory</title>
        <meta name="description" content="Professional risk intelligence and economic stability monitoring system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout apiUrl={apiUrl}>
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-4">
              Risk Intelligence Observatory
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional economic risk assessment and monitoring system providing 
              real-time insights for informed decision-making and financial stability analysis
            </p>
          </div>

          {/* Main Dashboard Components */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Risk Overview - Takes 2 columns on large screens */}
            <div className="xl:col-span-2">
              <ComponentErrorBoundary>
                <RiskOverview apiUrl={apiUrl} />
              </ComponentErrorBoundary>
            </div>
            
            {/* Quick Metrics Sidebar */}
            <div className="xl:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">
                  System Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Sources</span>
                    <span className="text-sm font-medium">3 Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Indicators Tracked</span>
                    <span className="text-sm font-medium">20+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Update Frequency</span>
                    <span className="text-sm font-medium">Real-time</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Methodology</span>
                    <span className="text-sm font-medium">v1.0</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-2">Data Sources</div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">Federal Reserve Economic Data</div>
                      <div className="text-xs text-gray-600">Bureau of Economic Analysis</div>
                      <div className="text-xs text-gray-600">Bureau of Labor Statistics</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Score Analysis Charts */}
          <div>
            <ComponentErrorBoundary>
              <RiskScoreChart apiUrl={apiUrl} />
            </ComponentErrorBoundary>
          </div>

          {/* Economic Analytics Dashboard */}
          <div>
            <ComponentErrorBoundary>
              <AnalyticsDashboard apiUrl={apiUrl} />
            </ComponentErrorBoundary>
          </div>

          {/* Detailed Metrics Panel */}
          <div>
            <ComponentErrorBoundary>
              <MetricsPanel apiUrl={apiUrl} />
            </ComponentErrorBoundary>
          </div>

          {/* Information Panel */}
          <div className="card bg-primary-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Professional Risk Intelligence
              </h3>
              <p className="text-sm text-primary-800 max-w-4xl mx-auto">
                This system provides transparent, explainable risk assessment using economic indicators 
                from authoritative government sources. All methodologies are open and auditable, 
                supporting evidence-based decision-making for financial institutions and policy makers.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </PageErrorBoundary>
  );
}