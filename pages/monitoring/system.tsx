import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { SystemMetricsPanel } from '../../components/monitoring/SystemMetricsPanel';
import { AlertsManagement } from '../../components/monitoring/AlertsManagement';
import { ServiceStatusPanel } from '../../components/monitoring/ServiceStatusPanel';
import { useSystemMonitoring } from '../../hooks/useSystemMonitoring';

const SystemMonitoring: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const {
    loading,
    error,
    systemMetrics,
    alerts,
    serviceStatuses,
    alertConfigurations,
    acknowledgeAlert,
    resolveAlert,
    createAlertConfiguration,
    updateAlertConfiguration,
    deleteAlertConfiguration,
    refreshAllData,
    clearError
  } = useSystemMonitoring(apiUrl, {
    refreshInterval: 30000,
    enableRealTimeUpdates: true
  });

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-red-600 mb-2">Error loading monitoring data</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>System Monitoring - RiskX</title>
        <meta name="description" content="Real-time system monitoring, alerts management, and service health tracking" />
      </Head>

      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
            <p className="text-gray-600">
              Real-time monitoring of system resources, service health, and operational metrics
            </p>
          </div>

          {systemMetrics && (
            <SystemMetricsPanel 
              metrics={systemMetrics} 
              loading={loading} 
            />
          )}

          <ServiceStatusPanel 
            services={serviceStatuses} 
            loading={loading} 
          />

          <AlertsManagement
            alerts={alerts}
            alertConfigurations={alertConfigurations}
            onAcknowledgeAlert={acknowledgeAlert}
            onResolveAlert={resolveAlert}
            onCreateConfiguration={createAlertConfiguration}
            onUpdateConfiguration={updateAlertConfiguration}
            onDeleteConfiguration={deleteAlertConfiguration}
            loading={loading}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">System Monitoring Overview</h3>
            <p className="text-blue-800 mb-4">
              Comprehensive monitoring provides real-time visibility into system performance, 
              service health, and operational metrics to ensure platform reliability and optimal performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Resource Monitoring</h4>
                <p className="text-blue-700">
                  Track CPU, memory, disk usage, and network I/O in real-time with 
                  automated alerting for threshold breaches and performance degradation.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Service Health</h4>
                <p className="text-blue-700">
                  Monitor service availability, response times, and dependency health 
                  with automated health checks and failover detection.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Performance Metrics</h4>
                <p className="text-blue-700">
                  Database query performance, cache hit rates, API response times, 
                  and error rates with historical trending and capacity planning.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Alert Management</h4>
                <p className="text-blue-700">
                  Configurable alerting with multiple severity levels, notification 
                  channels, and automated escalation for critical issues.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monitoring Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Proactive Monitoring</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Set appropriate thresholds for early warning</li>
                  <li>• Monitor trends and patterns for capacity planning</li>
                  <li>• Implement health checks for all critical services</li>
                  <li>• Use synthetic transactions for end-to-end monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Incident Response</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Acknowledge alerts promptly to prevent escalation</li>
                  <li>• Document resolution steps for knowledge sharing</li>
                  <li>• Conduct post-incident reviews for improvement</li>
                  <li>• Maintain escalation procedures for critical issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600">Target Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">&lt; 200ms</div>
                <div className="text-sm text-gray-600">API Response Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">&lt; 1%</div>
                <div className="text-sm text-gray-600">Error Rate Threshold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">&lt; 5min</div>
                <div className="text-sm text-gray-600">Alert Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SystemMonitoring;