import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Activity, Shield } from 'lucide-react';

interface RiskFactor {
  name: string;
  category: string;
  value: number;
  weight: number;
  normalized_value: number;
  description: string;
  confidence: number;
}

interface RiskScore {
  overall_score: number;
  risk_level: string;
  confidence: number;
  factors: RiskFactor[];
  timestamp: string;
  methodology_version: string;
}

interface RiskOverviewProps {
  apiUrl?: string;
}

export default function RiskOverview({ apiUrl = 'http://localhost:8000' }: RiskOverviewProps) {
  const [riskData, setRiskData] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchRiskData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchRiskData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/risk/score`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch risk data: ${response.status}`);
      }
      
      const data = await response.json();
      setRiskData(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching risk data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return <Shield className="w-5 h-5" />;
      case 'medium': return <Activity className="w-5 h-5" />;
      case 'high': return <TrendingUp className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading && !riskData) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading risk data
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchRiskData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className="card">
        <p className="text-gray-500">No risk data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Risk Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary-900">
            Current Risk Assessment
          </h2>
          <button
            onClick={fetchRiskData}
            disabled={loading}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Risk Score */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-900 mb-2">
              {riskData.overall_score.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Overall Risk Score</div>
            <div className="text-xs text-gray-500 mt-1">Scale: 0-100</div>
          </div>

          {/* Risk Level */}
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getRiskLevelColor(riskData.risk_level)}`}>
              {getRiskIcon(riskData.risk_level)}
              <span className="font-medium capitalize">{riskData.risk_level} Risk</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">Risk Level</div>
          </div>

          {/* Confidence */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-primary-900 mb-2">
              {(riskData.confidence * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Confidence</div>
            <div className="text-xs text-gray-500 mt-1">Model certainty</div>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Last updated: {formatTimestamp(riskData.timestamp)}</span>
            <span>Methodology v{riskData.methodology_version}</span>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">
          Contributing Risk Factors
        </h3>

        <div className="space-y-4">
          {riskData.factors.map((factor, index) => {
            const contribution = factor.normalized_value * factor.weight * 100;
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-primary-900 capitalize">
                      {factor.name.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {factor.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary-900">
                      {factor.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(factor.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                      Category: <span className="font-medium capitalize">{factor.category.replace(/_/g, ' ')}</span>
                    </span>
                    <span className="text-gray-600">
                      Weight: {(factor.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary-900">
                      {contribution.toFixed(1)}% contribution
                    </div>
                  </div>
                </div>

                {/* Risk contribution bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(contribution * 2, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="card bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Risk Intelligence System Operational
            </span>
          </div>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Data refreshed: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}