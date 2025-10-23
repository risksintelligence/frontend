'use client';

import { useState, useEffect } from 'react';
import { analyticsApi, economicApi, systemApi } from '@/lib/api';
import { DashboardData, EconomicIndicators, ApiResponse } from '@/types';
import MetricCard from '@/components/ui/MetricCard';
import StatusBadge from '@/components/ui/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [economicData, setEconomicData] = useState<EconomicIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch dashboard data
        const dashboardResponse = await analyticsApi.getDashboard();
        if (dashboardResponse.status === 'success' && dashboardResponse.data) {
          setDashboardData(dashboardResponse.data);
        }

        // Fetch economic indicators
        const economicResponse = await economicApi.getIndicators();
        if (economicResponse.status === 'success' && economicResponse.data) {
          setEconomicData(economicResponse.data);
        }

        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getRiskScoreStatus = (score?: number) => {
    if (!score) return 'warning';
    if (score >= 80) return 'critical';
    if (score >= 60) return 'warning';
    return 'good';
  };

  const formatRiskScore = (score?: number) => {
    return score ? score.toFixed(1) : 'N/A';
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Risk Intelligence Dashboard
          </h1>
          <p className="text-slate-700">
            Real-time risk assessment and economic monitoring
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <StatusBadge 
            status={loading ? 'warning' : 'online'} 
            text={loading ? 'Updating...' : 'Live'} 
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Risk Score */}
        <MetricCard
          title="Overall Risk Score"
          value={formatRiskScore(dashboardData?.current_risk?.overall_score)}
          unit="/100"
          status={getRiskScoreStatus(dashboardData?.current_risk?.overall_score)}
          trend={dashboardData?.current_risk?.trend === 'rising' ? 'up' : 
                 dashboardData?.current_risk?.trend === 'falling' ? 'down' : 'stable'}
          loading={loading}
        />

        {/* Confidence Level */}
        <MetricCard
          title="Confidence Level"
          value={dashboardData?.current_risk?.confidence ? 
                 `${(dashboardData.current_risk.confidence * 100).toFixed(1)}` : 'N/A'}
          unit="%"
          status="good"
          loading={loading}
        />

        {/* Active Alerts */}
        <MetricCard
          title="Active Alerts"
          value={dashboardData?.alert_summary?.total_active || 0}
          status={
            (dashboardData?.alert_summary?.by_severity?.critical || 0) > 0 ? 'critical' :
            (dashboardData?.alert_summary?.by_severity?.high || 0) > 0 ? 'warning' : 'good'
          }
          loading={loading}
        />

        {/* System Status */}
        <MetricCard
          title="System Status"
          value={dashboardData?.system_status || 'Unknown'}
          status={dashboardData?.system_status === 'operational' ? 'good' : 'warning'}
          loading={loading}
        />
      </div>

      {/* Risk Components */}
      {dashboardData?.current_risk?.components && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Risk Components Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(dashboardData.current_risk.components).map(([key, value]) => (
              <div key={key} className="bg-slate-50 p-4 rounded border border-slate-200">
                <div className="text-sm text-slate-500 uppercase tracking-wide mb-1">
                  {key}
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {value.toFixed(1)}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      value >= 80 ? 'bg-red-700' :
                      value >= 60 ? 'bg-amber-700' : 'bg-emerald-700'
                    }`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Economic Indicators */}
      {economicData && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Economic Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(economicData).map(([key, indicator]) => (
              <div key={key} className="bg-slate-50 p-4 rounded border border-slate-200">
                <div className="text-sm text-slate-500 uppercase tracking-wide mb-1">
                  {key.replace('_', ' ')}
                </div>
                <div className="text-lg font-bold font-mono text-slate-900">
                  {typeof indicator.value === 'number' ? 
                    indicator.value.toLocaleString() : indicator.value}
                </div>
                <div className="text-xs text-slate-500">
                  {indicator.units}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {indicator.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Risk Factors */}
      {dashboardData?.top_risk_factors && dashboardData.top_risk_factors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Top Risk Factors
          </h2>
          <div className="space-y-3">
            {dashboardData.top_risk_factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-sm font-mono text-slate-700 border border-slate-200">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {factor.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {factor.category} • {factor.impact} impact
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-slate-900">
                    {factor.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-500">
                    risk score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Summary */}
      {dashboardData?.alert_summary && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Alert Summary
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(dashboardData.alert_summary.by_severity).map(([severity, count]) => (
              <div key={severity} className="text-center p-4 bg-slate-50 rounded border border-slate-200">
                <div className={`text-2xl font-bold font-mono ${
                  severity === 'critical' ? 'text-red-700' :
                  severity === 'high' ? 'text-amber-700' :
                  severity === 'medium' ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  {count}
                </div>
                <div className="text-sm text-slate-500 capitalize">
                  {severity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}