import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import RiskOverview from '../components/dashboard/RiskOverview';
import MetricsPanel from '../components/dashboard/MetricsPanel';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import RiskScoreChart from '../components/dashboard/RiskScoreChart';
import { PageErrorBoundary, ComponentErrorBoundary } from '../components/common/ErrorBoundary';

interface SystemInfo {
  data_sources_count: number;
  total_indicators: number;
  update_frequency: string;
  methodology_version: string;
  data_sources: string[];
}

export default function Home() {
  // Use localhost:8000 where our API is running (matches FastAPI default port)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemInfoLoading, setSystemInfoLoading] = useState(true);
  const [systemInfoError, setSystemInfoError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemInfo();
  }, [apiUrl]);

  const fetchSystemInfo = async () => {
    try {
      setSystemInfoLoading(true);
      setSystemInfoError(null);
      
      // Fetch data from multiple endpoints to build system info
      const [analyticsResponse, methodologyResponse] = await Promise.all([
        fetch(`${apiUrl}/api/v1/analytics/aggregation`),
        fetch(`${apiUrl}/api/v1/risk/methodology`)
      ]);

      if (analyticsResponse.ok && methodologyResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        const methodologyData = await methodologyResponse.json();

        setSystemInfo({
          data_sources_count: analyticsData.aggregation_metadata.data_sources.length,
          total_indicators: analyticsData.aggregation_metadata.total_indicators,
          update_frequency: methodologyData.update_frequency,
          methodology_version: methodologyData.version,
          data_sources: methodologyData.data_sources
        });
      } else {
        throw new Error('Failed to fetch system information');
      }
    } catch (error) {
      console.error('Error fetching system info:', error);
      setSystemInfoError(error instanceof Error ? error.message : 'Failed to load system information');
      setSystemInfo(null);
    } finally {
      setSystemInfoLoading(false);
    }
  };

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
                {systemInfoLoading ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ) : systemInfoError ? (
                  <div className="text-center py-4">
                    <div className="text-sm text-red-600 mb-2">Unable to load system information</div>
                    <button 
                      onClick={fetchSystemInfo}
                      className="text-xs text-primary-600 hover:text-primary-800 underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : systemInfo ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Data Sources</span>
                      <span className="text-sm font-medium">{systemInfo.data_sources_count} Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Indicators Tracked</span>
                      <span className="text-sm font-medium">{systemInfo.total_indicators}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Update Frequency</span>
                      <span className="text-sm font-medium">{systemInfo.update_frequency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Methodology</span>
                      <span className="text-sm font-medium">v{systemInfo.methodology_version}</span>
                    </div>
                  </div>
                ) : null}
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-2">Data Sources</div>
                    {systemInfoLoading ? (
                      <div className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-4/5 mx-auto mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
                      </div>
                    ) : systemInfoError ? (
                      <div className="text-xs text-red-600">Unable to load data sources</div>
                    ) : systemInfo ? (
                      <div className="space-y-1">
                        {systemInfo.data_sources.map((source, index) => (
                          <div key={index} className="text-xs text-gray-600">{source}</div>
                        ))}
                      </div>
                    ) : null}
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