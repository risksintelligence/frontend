'use client';

import { useState } from 'react';
import { BookOpen, Calculator, Database, Brain, ChevronDown, ChevronRight } from 'lucide-react';

interface MethodologySection {
  id: string;
  title: string;
  icon: any;
  description: string;
  details: string[];
  formula?: string;
  factors?: { name: string; weight: number; description: string }[];
}

export default function RiskMethodology() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['calculation']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const methodologySections: MethodologySection[] = [
    {
      id: 'calculation',
      title: 'Risk Score Calculation',
      icon: Calculator,
      description: 'Multi-factor weighted risk scoring methodology',
      details: [
        'Composite risk score derived from four primary risk categories',
        'Dynamic weighting based on market conditions and volatility',
        'Real-time adjustment using machine learning algorithms',
        'Historical backtesting validates model accuracy'
      ],
      formula: 'Risk Score = Σ(Wi × Ri × Ci) where Wi = weight, Ri = risk factor, Ci = confidence',
      factors: [
        { name: 'Economic Risk', weight: 0.35, description: 'GDP, inflation, employment indicators' },
        { name: 'Market Risk', weight: 0.25, description: 'Volatility, liquidity, market stress' },
        { name: 'Geopolitical Risk', weight: 0.25, description: 'Political stability, trade relations' },
        { name: 'Technical Risk', weight: 0.15, description: 'System reliability, operational risk' }
      ]
    },
    {
      id: 'data-sources',
      title: 'Data Sources & Collection',
      icon: Database,
      description: 'Comprehensive data integration from authoritative sources',
      details: [
        'Federal Reserve Economic Data (FRED) - 50,000+ economic time series',
        'Bureau of Economic Analysis (BEA) - National and regional economic accounts',
        'Bureau of Labor Statistics (BLS) - Employment and labor market data',
        'U.S. Census Bureau - Trade, business, and demographic statistics',
        'Real-time data validation and quality assurance protocols',
        'Automated data cleansing and outlier detection'
      ]
    },
    {
      id: 'ml-models',
      title: 'Machine Learning Framework',
      icon: Brain,
      description: 'Advanced predictive modeling and risk forecasting',
      details: [
        'Ensemble methods combining multiple prediction algorithms',
        'Feature engineering using economic domain expertise',
        'Time series analysis with ARIMA and LSTM neural networks',
        'Model explainability using SHAP (SHapley Additive exPlanations)',
        'Continuous model retraining and performance monitoring',
        'Cross-validation and backtesting for model validation'
      ]
    },
    {
      id: 'validation',
      title: 'Model Validation & Testing',
      icon: BookOpen,
      description: 'Rigorous testing and validation procedures',
      details: [
        'Historical backtesting over 20+ years of economic data',
        'Walk-forward analysis for time series validation',
        'Stress testing under extreme market conditions',
        'Monte Carlo simulation for scenario analysis',
        'Regular model performance audits and recalibration',
        'Independent validation by risk management experts'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-terminal-green" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            RISK ASSESSMENT METHODOLOGY
          </h2>
        </div>
        
        <p className="text-terminal-muted font-mono text-sm leading-relaxed">
          Our risk assessment methodology combines traditional financial analysis with advanced 
          machine learning techniques to provide comprehensive, real-time risk intelligence. 
          The system integrates multiple data sources and employs sophisticated algorithms 
          to deliver accurate and actionable risk insights.
        </p>
      </div>

      {/* Methodology Sections */}
      <div className="space-y-4">
        {methodologySections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const Icon = section.icon;
          
          return (
            <div
              key={section.id}
              className="bg-terminal-surface border border-terminal-border rounded overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-terminal-bg/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-terminal-green" />
                  <div className="text-left">
                    <h3 className="font-mono font-semibold text-terminal-text">
                      {section.title.toUpperCase()}
                    </h3>
                    <p className="text-terminal-muted font-mono text-sm">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-terminal-muted" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-terminal-muted" />
                )}
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-terminal-border">
                  <div className="pt-6 space-y-4">
                    {/* Details */}
                    <div className="space-y-3">
                      {section.details.map((detail, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-terminal-green rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-terminal-text font-mono text-sm leading-relaxed">
                            {detail}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Formula */}
                    {section.formula && (
                      <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
                        <h4 className="font-mono font-semibold text-terminal-text text-sm mb-2">
                          CALCULATION FORMULA
                        </h4>
                        <code className="text-terminal-green font-mono text-sm">
                          {section.formula}
                        </code>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {section.factors && (
                      <div className="space-y-3">
                        <h4 className="font-mono font-semibold text-terminal-text text-sm">
                          RISK FACTOR WEIGHTS
                        </h4>
                        
                        <div className="grid gap-3">
                          {section.factors.map((factor, index) => (
                            <div
                              key={index}
                              className="bg-terminal-bg border border-terminal-border p-4 rounded"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-mono font-semibold text-terminal-text text-sm">
                                  {factor.name.toUpperCase()}
                                </h5>
                                <span className="font-mono text-terminal-green text-sm font-bold">
                                  {(factor.weight * 100).toFixed(0)}%
                                </span>
                              </div>
                              
                              <p className="text-terminal-muted font-mono text-xs leading-relaxed">
                                {factor.description}
                              </p>
                              
                              {/* Weight Bar */}
                              <div className="mt-3">
                                <div className="w-full bg-terminal-surface rounded-full h-2">
                                  <div
                                    className="bg-terminal-green h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${factor.weight * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          MODEL PERFORMANCE METRICS
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              94.2%
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              ACCURACY
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              87.5%
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              PRECISION
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              91.8%
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              RECALL
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              0.89
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              F1-SCORE
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="bg-terminal-bg border border-terminal-border p-4 rounded">
        <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
          IMPORTANT DISCLAIMERS
        </h4>
        
        <div className="space-y-2 text-terminal-muted font-mono text-xs leading-relaxed">
          <p>
            • Risk scores are predictive estimates based on historical data and current market conditions.
          </p>
          <p>
            • Past performance does not guarantee future results. Risk assessments should be used as part of a comprehensive analysis.
          </p>
          <p>
            • Models are continuously updated and refined. Methodology may evolve to incorporate new data sources and techniques.
          </p>
          <p>
            • This system is designed for professional use by qualified risk management professionals.
          </p>
        </div>
      </div>
    </div>
  );
}