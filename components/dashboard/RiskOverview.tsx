import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Activity, Shield, HelpCircle, Info } from 'lucide-react';

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
  const [showHelp, setShowHelp] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    fetchRiskData();
    // Refresh data every 5 minutes
    const interval = setInterval(() => fetchRiskData(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const fetchRiskData = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
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
      if (showLoading) {
        setLoading(false);
      }
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

  // Tooltip content for key metrics
  const tooltipContent = {
    riskScore: {
      title: "Overall Risk Score",
      description: "A composite score (0-100) that combines multiple economic indicators. Scores above 75 indicate high risk, 50-75 moderate risk, 25-50 low risk, and below 25 minimal risk.",
      calculation: "Weighted average of unemployment, inflation, interest rates, and financial stress indicators"
    },
    riskLevel: {
      title: "Risk Level",
      description: "Categorical assessment of current economic risk based on the overall score and trend analysis.",
      levels: {
        low: "Stable economic conditions with minimal risk indicators",
        medium: "Some elevated indicators but overall stable",
        high: "Multiple risk factors elevated, requires monitoring",
        critical: "Significant risk across multiple economic sectors"
      }
    },
    confidence: {
      title: "Model Confidence",
      description: "Statistical confidence in the risk assessment based on data quality, model performance, and historical accuracy.",
      interpretation: "Higher confidence means more reliable predictions. Confidence below 60% suggests increased uncertainty."
    }
  };

  const InfoTooltip = ({ content, trigger }: { content: any; trigger: React.ReactNode }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setActiveTooltip(content.title)}
        onMouseLeave={() => setActiveTooltip(null)}
        className="cursor-help"
      >
        {trigger}
      </div>
      {activeTooltip === content.title && (
        <div className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg -top-2 left-full ml-2">
          <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{content.description}</p>
          {content.calculation && (
            <p className="text-xs text-gray-500 italic">Calculation: {content.calculation}</p>
          )}
          {content.interpretation && (
            <p className="text-xs text-gray-500 italic">{content.interpretation}</p>
          )}
        </div>
      )}
    </div>
  );

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
              onClick={() => fetchRiskData(true)}
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
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-primary-900">
              Current Risk Assessment
            </h2>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Show explanation"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Live economic risk monitoring
            </span>
            <button
              onClick={() => fetchRiskData(true)}
              disabled={loading}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Help Panel */}
        {showHelp && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-900 mb-2">Understanding Risk Assessment</h4>
                <p className="text-blue-800 mb-3">
                  This dashboard provides real-time analysis of U.S. economic risk by monitoring key indicators 
                  including employment, inflation, interest rates, and financial stress levels.
                </p>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Risk Score (0-100):</strong> Higher scores indicate greater economic risk</p>
                  <p><strong>Risk Level:</strong> Categorical assessment from Low to Critical</p>
                  <p><strong>Confidence:</strong> How reliable our prediction is based on data quality</p>
                  <p><strong>Risk Factors:</strong> Individual economic indicators contributing to overall score</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Risk Score */}
          <div className="text-center">
            <InfoTooltip
              content={tooltipContent.riskScore}
              trigger={
                <div className="cursor-help">
                  <div className="text-3xl font-bold text-primary-900 mb-2">
                    {riskData.overall_score.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                    <span>Overall Risk Score</span>
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Scale: 0-100</div>
                </div>
              }
            />
          </div>

          {/* Risk Level */}
          <div className="text-center">
            <InfoTooltip
              content={tooltipContent.riskLevel}
              trigger={
                <div className="cursor-help">
                  <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getRiskLevelColor(riskData.risk_level)}`}>
                    {getRiskIcon(riskData.risk_level)}
                    <span className="font-medium capitalize">{riskData.risk_level} Risk</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 flex items-center justify-center space-x-1">
                    <span>Risk Level</span>
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              }
            />
          </div>

          {/* Confidence */}
          <div className="text-center">
            <InfoTooltip
              content={tooltipContent.confidence}
              trigger={
                <div className="cursor-help">
                  <div className="text-2xl font-semibold text-primary-900 mb-2">
                    {(riskData.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                    <span>Confidence</span>
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Model certainty</div>
                </div>
              }
            />
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary-900">
            Contributing Risk Factors
          </h3>
          <div className="text-sm text-gray-500">
            {riskData.factors.length} indicators analyzed
          </div>
        </div>
        
        {/* Risk Factors Summary Bar */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Risk Contribution Distribution</div>
          <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
            {riskData.factors.map((factor, index) => {
              const contribution = factor.normalized_value * factor.weight * 100;
              const width = Math.max(contribution * 2, 2); // Minimum 2% width for visibility
              return (
                <div
                  key={index}
                  className={`h-full ${index % 2 === 0 ? 'bg-primary-500' : 'bg-primary-400'}`}
                  style={{ width: `${width}%` }}
                  title={`${factor.name.replace(/_/g, ' ')}: ${contribution.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {riskData.factors.map((factor, index) => {
            const contribution = factor.normalized_value * factor.weight * 100;
            // Get risk level color based on contribution
            const getRiskContributionColor = (contrib: number) => {
              if (contrib > 15) return 'border-red-300 bg-red-50';
              if (contrib > 10) return 'border-orange-300 bg-orange-50';
              if (contrib > 5) return 'border-yellow-300 bg-yellow-50';
              return 'border-green-300 bg-green-50';
            };

            const categoryMapping: Record<string, string> = {
              'employment': 'Employment Conditions',
              'inflation': 'Inflation Indicators', 
              'interest_rates': 'Interest Rate Environment',
              'financial_stress': 'Financial Stress',
              'economic_growth': 'Economic Growth',
              'gdp': 'GDP & Economic Output'
            };

            return (
              <div key={index} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getRiskContributionColor(contribution)}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-primary-900 capitalize">
                        {factor.name.replace(/_/g, ' ')}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        contribution > 10 ? 'bg-red-100 text-red-700' :
                        contribution > 5 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {contribution.toFixed(1)}% risk
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {factor.description}
                    </p>
                    <div className="text-xs text-gray-500">
                      Category: {categoryMapping[factor.category] || factor.category.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-primary-900 mb-1">
                      {typeof factor.value === 'number' ? factor.value.toFixed(2) : factor.value}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>{(factor.confidence * 100).toFixed(0)}% confidence</div>
                      <div>{(factor.weight * 100).toFixed(0)}% weight</div>
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