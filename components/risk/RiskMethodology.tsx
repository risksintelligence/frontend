import React, { useState, useEffect } from 'react';
import { FileText, Info, CheckCircle, AlertTriangle, Clock, Database } from 'lucide-react';
import { useRiskFactors } from '../../hooks/useRiskFactors';

interface RiskMethodologyProps {
  apiUrl: string;
}

export const RiskMethodology: React.FC<RiskMethodologyProps> = ({
  apiUrl
}) => {
  const { methodology, loading, error, fetchMethodology, clearError } = useRiskFactors(apiUrl);
  const [activeSection, setActiveSection] = useState<'framework' | 'components' | 'sources' | 'validation'>('framework');

  useEffect(() => {
    fetchMethodology();
  }, [fetchMethodology]);

  const formatWeight = (weight: number) => {
    return `${(weight * 100).toFixed(1)}%`;
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.8) return 'text-yellow-600 bg-yellow-100';
    if (score >= 0.7) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading methodology...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 mb-2">Error loading methodology</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!methodology) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Methodology Data</h3>
            <p className="text-gray-600">Methodology information is not available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Risk Assessment Methodology</h3>
            <p className="text-sm text-gray-600">
              {methodology.framework} v{methodology.version} - Last updated {new Date(methodology.last_updated).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'framework', label: 'Framework Overview', icon: Info },
            { id: 'components', label: 'Risk Components', icon: CheckCircle },
            { id: 'sources', label: 'Data Sources', icon: Database },
            { id: 'validation', label: 'Validation & Limits', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeSection === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeSection === 'framework' && (
          <div className="space-y-6">
            {/* Framework Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Framework</div>
                <div className="font-medium text-gray-900">{methodology.framework}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Version</div>
                <div className="font-medium text-gray-900">{methodology.version}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Update Frequency</div>
                <div className="font-medium text-gray-900">{methodology.update_frequency}</div>
              </div>
            </div>

            {/* Risk Levels */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Risk Level Classification</h4>
              <div className="space-y-3">
                {methodology.risk_levels.map((level, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className={`w-4 h-4 rounded-full ${getRiskLevelColor(level.level)}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900 capitalize">{level.level}</span>
                        <span className="text-sm text-gray-600">
                          {level.range.min.toFixed(1)} - {level.range.max.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Scale Visualization */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Risk Scale</h4>
              <div className="relative">
                <div className="flex h-8 rounded-lg overflow-hidden">
                  {methodology.risk_levels.map((level, index) => {
                    const width = ((level.range.max - level.range.min) / methodology.risk_levels[methodology.risk_levels.length - 1].range.max) * 100;
                    return (
                      <div
                        key={index}
                        className={`${getRiskLevelColor(level.level)} flex items-center justify-center text-white text-xs font-medium`}
                        style={{ width: `${width}%` }}
                      >
                        {level.level.toUpperCase()}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{methodology.risk_levels[methodology.risk_levels.length - 1].range.max}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'components' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Risk Components</h4>
              <div className="text-sm text-gray-600">
                {methodology.components.length} components
              </div>
            </div>

            <div className="space-y-4">
              {methodology.components.map((component, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{component.name}</h5>
                    <span className="text-sm font-medium text-blue-600">
                      {formatWeight(component.weight)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{component.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Weight Contribution</span>
                      <span>{formatWeight(component.weight)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${component.weight * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <strong>Calculation Method:</strong> {component.calculation_method}
                  </div>
                </div>
              ))}
            </div>

            {/* Component Distribution Chart */}
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Weight Distribution</h5>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">Component weight chart would render here</div>
                  <div className="text-sm text-gray-500">
                    Showing relative weights of {methodology.components.length} components
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'sources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Data Sources</h4>
              <div className="text-sm text-gray-600">
                {methodology.data_sources.length} sources
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {methodology.data_sources.map((source, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{source.name}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${getReliabilityColor(source.reliability_score)}`}>
                      {(source.reliability_score * 100).toFixed(0)}% reliable
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Update Frequency:</span>
                      <span className="font-medium">{source.update_frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Update:</span>
                      <span className="font-medium">{new Date(source.last_update).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reliability Score:</span>
                      <span className="font-medium">{(source.reliability_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Reliability</span>
                      <span>{(source.reliability_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          source.reliability_score >= 0.9 ? 'bg-green-500' :
                          source.reliability_score >= 0.8 ? 'bg-yellow-500' :
                          source.reliability_score >= 0.7 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${source.reliability_score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'validation' && (
          <div className="space-y-6">
            {/* Validation Methods */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Validation Methods</h4>
              <div className="space-y-2">
                {methodology.validation_methods.map((method, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{method}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Methodology Limitations</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="space-y-3">
                  {methodology.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-800">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Update Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Update Schedule</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Methodology Updates: {methodology.update_frequency}</div>
                    <div className="text-sm text-blue-700">
                      Last methodology update: {new Date(methodology.last_updated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Assurance */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Quality Assurance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Backtesting</h5>
                  <p className="text-sm text-gray-600">
                    Historical validation against known events and outcomes to ensure accuracy.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Cross-validation</h5>
                  <p className="text-sm text-gray-600">
                    Multiple validation techniques to ensure robustness across different scenarios.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Peer Review</h5>
                  <p className="text-sm text-gray-600">
                    Regular review by domain experts and validation against industry standards.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Continuous Monitoring</h5>
                  <p className="text-sm text-gray-600">
                    Real-time performance monitoring and automatic alerts for anomalies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};