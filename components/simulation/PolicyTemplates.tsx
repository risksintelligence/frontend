import React, { useState, useEffect } from 'react';
import { FileText, Search, TrendingUp } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { PolicyTemplate } from '../../types/simulation';

interface PolicyTemplatesProps {
  apiUrl: string;
  onApplyTemplate?: (template: PolicyTemplate) => void;
}

export const PolicyTemplates: React.FC<PolicyTemplatesProps> = ({
  apiUrl,
  onApplyTemplate
}) => {
  const { policyTemplates, loadPolicyTemplates, loading, error, clearError } = useSimulation(apiUrl);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [templates, setTemplates] = useState<any[]>([]);
  
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/simulation/templates/policies`);
        if (!response.ok) {
          throw new Error('Failed to load templates');
        }
        const data = await response.json();
        
        // Convert backend format to frontend format
        if (data.policy_parameters) {
          const convertedTemplates = data.policy_parameters.map((param: any) => ({
            id: param.id,
            name: param.name,
            description: param.description,
            category: param.category === 'monetary' ? 'stability_measures' : 
                     param.category === 'fiscal' ? 'growth_stimulus' :
                     param.category === 'regulatory' ? 'crisis_response' : 'inflation_control',
            parameters: [{
              id: param.id,
              name: param.name,
              description: param.description,
              currentValue: param.currentValue,
              minValue: param.minValue,
              maxValue: param.maxValue,
              unit: param.unit,
              category: param.category,
              defaultValue: param.defaultValue
            }],
            expectedOutcomes: param.expected_impacts || [],
            historicalUsage: [],
            tags: [param.category, param.unit]
          }));
          setTemplates(convertedTemplates);
        }
      } catch (err) {
        console.error('Failed to load policy templates:', err);
      }
    };
    
    loadTemplates();
  }, [apiUrl]);

  const filteredTemplates = templates
    .filter(template => 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(template => 
      selectedCategory === 'all' || template.category === selectedCategory
    );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crisis_response':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'growth_stimulus':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'inflation_control':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'stability_measures':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return 'text-green-600';
    if (effectiveness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCategoryName = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleApplyTemplate = (template: PolicyTemplate) => {
    onApplyTemplate?.(template);
    setShowDetails(false);
    setSelectedTemplate(null);
  };

  const viewTemplateDetails = (template: PolicyTemplate) => {
    setSelectedTemplate(template);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading policy templates...</span>
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
            <div className="text-red-600 mb-2">Error loading templates</div>
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

  return (
    <div className="space-y-6">
      {/* Templates Library */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Policy Templates</h3>
                <p className="text-sm text-gray-600">
                  Pre-configured policy scenarios based on historical analysis
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search templates, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="crisis_response">Crisis Response</option>
                <option value="growth_stimulus">Growth Stimulus</option>
                <option value="inflation_control">Inflation Control</option>
                <option value="stability_measures">Stability Measures</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No policy templates available'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(template.category)}`}>
                      {formatCategoryName(template.category)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.description}
                  </p>

                  {/* Template Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Parameters:</span>
                      <span className="font-medium">{template.parameters.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Historical Usage:</span>
                      <span className="font-medium">{template.historicalUsage.length}</span>
                    </div>
                    {template.historicalUsage.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Avg. Effectiveness:</span>
                        <span className={`font-medium ${getEffectivenessColor(
                          template.historicalUsage.reduce((sum, usage) => sum + usage.effectiveness, 0) / template.historicalUsage.length
                        )}`}>
                          {Math.round(template.historicalUsage.reduce((sum, usage) => sum + usage.effectiveness, 0) / template.historicalUsage.length)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewTemplateDetails(template)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApplyTemplate(template)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Apply Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Details Modal */}
      {showDetails && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedTemplate.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm rounded-full border ${getCategoryColor(selectedTemplate.category)}`}>
                    {formatCategoryName(selectedTemplate.category)}
                  </span>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Parameters */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Policy Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.parameters.map((param) => (
                    <div key={param.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{param.name}</h5>
                        <span className="text-sm text-gray-600">{param.currentValue}{param.unit}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{param.description}</p>
                      <div className="text-xs text-gray-500">
                        Range: {param.minValue} - {param.maxValue} {param.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Expected Outcomes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedTemplate.expectedOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Historical Usage */}
              {selectedTemplate.historicalUsage.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Historical Usage</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Context
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Effectiveness
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTemplate.historicalUsage.map((usage, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(usage.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {usage.context}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`font-medium ${getEffectivenessColor(usage.effectiveness)}`}>
                                {usage.effectiveness}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApplyTemplate(selectedTemplate)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};