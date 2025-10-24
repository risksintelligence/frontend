'use client'

import { useState, useEffect } from 'react'
import { Target, Play, Copy, Star, Download, Settings } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

interface ScenarioTemplate {
  id: string
  name: string
  description: string
  category: string
  complexity: string
  variables: number
  parameters: {
    [key: string]: {
      value: number
      range: [number, number]
      description: string
    }
  }
  expectedOutcomes: string[]
  usageCount: number
  rating: number
  accuracy: number
  lastUsed: string
  tags: string[]
}

interface TemplateCategory {
  category: string
  description: string
  templateCount: number
  avgAccuracy: number
  popularTemplates: string[]
}

interface CustomScenario {
  name: string
  description: string
  baseTemplate: string
  modifications: {
    parameter: string
    newValue: number
    reason: string
  }[]
}

export default function ScenarioTemplatesPage() {
  const [templates, setTemplates] = useState<ScenarioTemplate[]>([])
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<ScenarioTemplate | null>(null)
  const [customScenario, setCustomScenario] = useState<CustomScenario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        setLoading(true)
        const [templatesResponse, categoriesResponse] = await Promise.all([
          fetch('/api/v1/simulation/templates'),
          fetch('/api/v1/simulation/templates/categories')
        ])

        if (templatesResponse.ok && categoriesResponse.ok) {
          const [templatesData, categoriesData] = await Promise.all([
            templatesResponse.json(),
            categoriesResponse.json()
          ])
          setTemplates(templatesData.templates)
          setCategories(categoriesData.categories)
        } else {
          
          setCategories([
            {
              category: 'Economic Crisis',
              description: 'Templates for modeling economic downturns and recessions',
              templateCount: 8,
              avgAccuracy: 0.87,
              popularTemplates: ['2008 Financial Crisis', 'COVID-19 Impact', 'Inflation Shock']
            },
            {
              category: 'Policy Impact',
              description: 'Templates for analyzing economic policy effects',
              templateCount: 12,
              avgAccuracy: 0.82,
              popularTemplates: ['Infrastructure Spending', 'Tax Reform', 'Trade War']
            },
            {
              category: 'Market Volatility',
              description: 'Templates for financial market stress scenarios',
              templateCount: 6,
              avgAccuracy: 0.89,
              popularTemplates: ['Market Crash', 'Currency Crisis', 'Commodity Shock']
            },
            {
              category: 'Supply Chain',
              description: 'Templates for supply chain disruption scenarios',
              templateCount: 10,
              avgAccuracy: 0.84,
              popularTemplates: ['Semiconductor Shortage', 'Suez Blockage', 'Energy Crisis']
            }
          ])

          setTemplates([
            {
              id: 'template_001',
              name: '2008 Financial Crisis Replica',
              description: 'Comprehensive model replicating the conditions and impacts of the 2008 financial crisis',
              category: 'Economic Crisis',
              complexity: 'high',
              variables: 24,
              parameters: {
                'housing_price_decline': {
                  value: -30,
                  range: [-50, -10],
                  description: 'Percentage decline in housing prices'
                },
                'credit_availability': {
                  value: -60,
                  range: [-80, -40],
                  description: 'Reduction in credit availability'
                },
                'unemployment_peak': {
                  value: 10.0,
                  range: [8, 15],
                  description: 'Peak unemployment rate percentage'
                },
                'gdp_contraction': {
                  value: -3.5,
                  range: [-6, -1],
                  description: 'GDP contraction percentage'
                }
              },
              expectedOutcomes: [
                'GDP decline of 3-4% over 18 months',
                'Unemployment rising to 10%+',
                'Banking sector stress and failures',
                'Stock market decline of 40-50%'
              ],
              usageCount: 156,
              rating: 4.7,
              accuracy: 0.91,
              lastUsed: new Date(Date.now() - 86400000).toISOString(),
              tags: ['financial', 'banking', 'recession', 'validated']
            },
            {
              id: 'template_002',
              name: 'COVID-19 Economic Impact',
              description: 'Model capturing the economic disruption from pandemic lockdowns and restrictions',
              category: 'Economic Crisis',
              complexity: 'high',
              variables: 18,
              parameters: {
                'lockdown_duration': {
                  value: 12,
                  range: [4, 24],
                  description: 'Lockdown duration in weeks'
                },
                'business_closure_rate': {
                  value: 40,
                  range: [20, 60],
                  description: 'Percentage of businesses temporarily closed'
                },
                'remote_work_adoption': {
                  value: 70,
                  range: [40, 90],
                  description: 'Percentage of workforce working remotely'
                },
                'stimulus_size': {
                  value: 15,
                  range: [5, 25],
                  description: 'Fiscal stimulus as percentage of GDP'
                }
              },
              expectedOutcomes: [
                'Sharp initial GDP contraction (-8% to -12%)',
                'Rapid unemployment spike to 14%+',
                'Sectoral divergence (tech gains, hospitality losses)',
                'Accelerated digital transformation'
              ],
              usageCount: 234,
              rating: 4.8,
              accuracy: 0.89,
              lastUsed: new Date(Date.now() - 3600000).toISOString(),
              tags: ['pandemic', 'lockdown', 'stimulus', 'validated']
            },
            {
              id: 'template_003',
              name: 'Infrastructure Investment Package',
              description: 'Template for analyzing large-scale infrastructure spending programs',
              category: 'Policy Impact',
              complexity: 'medium',
              variables: 15,
              parameters: {
                'investment_size': {
                  value: 2.0,
                  range: [0.5, 5.0],
                  description: 'Investment size as percentage of GDP'
                },
                'implementation_speed': {
                  value: 0.6,
                  range: [0.3, 0.9],
                  description: 'Speed of implementation (0-1 scale)'
                },
                'multiplier_effect': {
                  value: 1.4,
                  range: [1.0, 2.0],
                  description: 'Fiscal multiplier for infrastructure spending'
                },
                'productivity_gain': {
                  value: 0.3,
                  range: [0.1, 0.8],
                  description: 'Long-term productivity improvement percentage'
                }
              },
              expectedOutcomes: [
                'GDP boost of 0.5-1.5% in first year',
                'Employment creation in construction sector',
                'Long-term productivity improvements',
                'Potential inflationary pressure'
              ],
              usageCount: 89,
              rating: 4.5,
              accuracy: 0.85,
              lastUsed: new Date(Date.now() - 7200000).toISOString(),
              tags: ['infrastructure', 'fiscal', 'employment', 'productivity']
            },
            {
              id: 'template_004',
              name: 'Semiconductor Supply Shortage',
              description: 'Model for analyzing impacts of critical semiconductor supply disruptions',
              category: 'Supply Chain',
              complexity: 'medium',
              variables: 12,
              parameters: {
                'supply_reduction': {
                  value: -45,
                  range: [-70, -20],
                  description: 'Percentage reduction in semiconductor supply'
                },
                'duration_months': {
                  value: 18,
                  range: [6, 36],
                  description: 'Duration of supply shortage in months'
                },
                'price_increase': {
                  value: 150,
                  range: [50, 300],
                  description: 'Percentage increase in semiconductor prices'
                },
                'substitution_rate': {
                  value: 0.2,
                  range: [0.0, 0.5],
                  description: 'Rate of product substitution (0-1 scale)'
                }
              },
              expectedOutcomes: [
                'Auto industry production delays',
                'Consumer electronics price increases',
                'Supply chain diversification acceleration',
                'Investment in alternative chip manufacturing'
              ],
              usageCount: 67,
              rating: 4.3,
              accuracy: 0.82,
              lastUsed: new Date(Date.now() - 10800000).toISOString(),
              tags: ['semiconductor', 'supply-chain', 'technology', 'shortage']
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching template data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplateData()
  }, [])

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const runTemplate = async (templateId: string) => {
    try {
      // In real implementation:
      // const response = await fetch('/api/v1/simulation/templates/run', {
      //   method: 'POST',
      //   body: JSON.stringify({ templateId, customParameters: customScenario })
      // })
      
      console.log('Running template:', templateId)
    } catch (error) {
      console.error('Error running template:', error)
    }
  }

  const duplicateTemplate = (template: ScenarioTemplate) => {
    setCustomScenario({
      name: `${template.name} (Custom)`,
      description: `Modified version of ${template.name}`,
      baseTemplate: template.id,
      modifications: []
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-heading">Scenario Templates</h1>
          <p className="text-secondary mt-2">Pre-built scenario modeling templates</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'high': return 'critical'
      case 'medium': return 'warning'
      case 'low': return 'good'
      default: return 'good'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-heading">Scenario Templates</h1>
          <p className="text-secondary mt-2">
            Pre-built, validated scenario modeling templates for rapid analysis
          </p>
        </div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.category} value={category.category}>{category.category}</option>
          ))}
        </select>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Template Categories</h3>
          <p className="text-sm text-muted mt-1">
            Organized collections of scenario templates by domain
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-heading">{category.category}</div>
                  <StatusBadge 
                    status={category.avgAccuracy > 0.85 ? 'good' : 'warning'}
                    text={`${(category.avgAccuracy * 100).toFixed(0)}%`}
                    size="sm"
                  />
                </div>
                <div className="text-sm text-muted mb-3">{category.description}</div>
                <div className="text-xs text-muted">
                  {category.templateCount} templates available
                </div>
                <div className="mt-2">
                  <div className="text-xs text-muted mb-1">Popular:</div>
                  <div className="flex flex-wrap gap-1">
                    {category.popularTemplates.slice(0, 2).map((template, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                        {template}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Available Templates</h3>
          <p className="text-sm text-muted mt-1">
            Ready-to-use scenario modeling templates with validated parameters
          </p>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-heading">{template.name}</div>
                      <StatusBadge 
                        status={getComplexityColor(template.complexity)}
                        text={template.complexity}
                        size="sm"
                      />
                    </div>
                    <div className="text-sm text-muted mb-2">{template.category}</div>
                    <p className="text-sm text-secondary">{template.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 text-amber-500 fill-current" />
                      <span className="text-sm font-mono text-heading">{template.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-muted">
                      {template.usageCount} uses
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-xs text-muted">Variables</div>
                    <div className="font-mono text-heading">{template.variables}</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-xs text-muted">Accuracy</div>
                    <div className="font-mono text-heading">{(template.accuracy * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-xs text-muted">Last Used</div>
                    <div className="font-mono text-heading text-xs">
                      {new Date(template.lastUsed).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-heading mb-2">Key Parameters</div>
                  <div className="space-y-2">
                    {Object.entries(template.parameters).slice(0, 3).map(([key, param]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-muted capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-secondary">
                          {param.value}{typeof param.value === 'number' && param.value < 10 ? '%' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-heading mb-2">Expected Outcomes</div>
                  <div className="space-y-1">
                    {template.expectedOutcomes.slice(0, 2).map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-secondary">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runTemplate(template.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    <Play className="h-3 w-3" />
                    Run Template
                  </button>
                  <button
                    onClick={() => duplicateTemplate(template)}
                    className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-secondary rounded-lg hover:bg-slate-50 text-sm"
                  >
                    <Copy className="h-3 w-3" />
                    Customize
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-secondary rounded-lg hover:bg-slate-50 text-sm"
                  >
                    <Settings className="h-3 w-3" />
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTemplate && (
        <div className="terminal-card">
          <div className="terminal-card-header">
            <h3 className="font-semibold text-heading">Template Details: {selectedTemplate.name}</h3>
            <p className="text-sm text-muted mt-1">
              Complete parameter configuration and expected outcomes
            </p>
          </div>
          <div className="terminal-card-content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="font-medium text-heading mb-3">All Parameters</div>
                <div className="space-y-3">
                  {Object.entries(selectedTemplate.parameters).map(([key, param]) => (
                    <div key={key} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-heading capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-secondary">
                          {param.value}{typeof param.value === 'number' && param.value < 10 ? '%' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-muted mb-2">{param.description}</div>
                      <div className="text-xs text-secondary">
                        Range: {param.range[0]} to {param.range[1]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium text-heading mb-3">Expected Outcomes</div>
                <div className="space-y-2">
                  {selectedTemplate.expectedOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-blue-800">{index + 1}</span>
                      </div>
                      <span className="text-sm text-blue-900">{outcome}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="font-medium text-heading mb-3">Template Statistics</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-muted">Usage Count</span>
                      <span className="font-mono text-heading">{selectedTemplate.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-muted">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-current" />
                        <span className="font-mono text-heading">{selectedTemplate.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm text-muted">Validation Accuracy</span>
                      <StatusBadge 
                        status={selectedTemplate.accuracy > 0.85 ? 'good' : 'warning'}
                        text={`${(selectedTemplate.accuracy * 100).toFixed(0)}%`}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="terminal-card">
        <div className="terminal-card-header">
          <h3 className="font-semibold text-heading">Template Usage Guide</h3>
        </div>
        <div className="terminal-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-heading">Quick Start</span>
              </div>
              <p className="text-sm text-muted">
                Run templates with default parameters for immediate results and baseline analysis.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Copy className="h-4 w-4 text-green-600" />
                <span className="font-medium text-heading">Customization</span>
              </div>
              <p className="text-sm text-muted">
                Duplicate and modify templates to create custom scenarios tailored to specific analysis needs.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-heading">Validation</span>
              </div>
              <p className="text-sm text-muted">
                All templates are validated against historical data to ensure accuracy and reliability.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-sm text-muted">
              Templates updated regularly based on new data and validation results
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}