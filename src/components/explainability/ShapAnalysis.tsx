'use client';

import React from 'react';
import { bloombergClasses, formatNumber } from '@/lib/bloomberg-theme';

interface ShapValue {
  feature: string;
  value: number;
  contribution: number;
  importance: number;
}

interface ShapAnalysisProps {
  prediction_id: string;
  shapValues: ShapValue[];
  baseValue: number;
  expectedValue: number;
  modelOutput: number;
}

export function ShapAnalysis({ 
  prediction_id,
  shapValues, 
  baseValue, 
  expectedValue, 
  modelOutput 
}: ShapAnalysisProps) {
  const positiveValues = shapValues.filter(sv => sv.contribution > 0);
  const negativeValues = shapValues.filter(sv => sv.contribution < 0);

  return (
    <div className={`${bloombergClasses.container.primary} space-y-6`}>
      {/* Header */}
      <div className={bloombergClasses.container.secondary}>
        <h1 className={`${bloombergClasses.text.heading} text-2xl mb-2`}>
          SHAP Analysis
        </h1>
        <p className={`${bloombergClasses.text.secondary} text-sm`}>
          Model Explanation for Prediction {prediction_id}
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            Base Value
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
            {formatNumber(baseValue)}
          </div>
        </div>
        
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            Expected Value
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
            {formatNumber(expectedValue)}
          </div>
        </div>
        
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            Model Output
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
            {formatNumber(modelOutput)}
          </div>
        </div>
        
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            Total Features
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
            {shapValues.length}
          </div>
        </div>
      </div>

      {/* SHAP Values Table */}
      <div className={bloombergClasses.container.secondary}>
        <h2 className={`${bloombergClasses.text.heading} text-lg mb-4`}>
          Feature Contributions
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${bloombergClasses.border.primary} border-b`}>
                <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-left py-2`}>
                  Feature
                </th>
                <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-right py-2`}>
                  Value
                </th>
                <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-right py-2`}>
                  Contribution
                </th>
                <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-right py-2`}>
                  Importance
                </th>
                <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-center py-2`}>
                  Impact
                </th>
              </tr>
            </thead>
            <tbody>
              {shapValues
                .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
                .map((shapValue, index) => (
                <tr 
                  key={shapValue.feature}
                  className={`${index % 2 === 0 ? bloombergClasses.background.secondary : 'bg-transparent'} hover:${bloombergClasses.background.hover} transition-colors`}
                >
                  <td className={`${bloombergClasses.text.primary} font-mono py-3 px-2`}>
                    {shapValue.feature}
                  </td>
                  <td className={`${bloombergClasses.text.primary} font-mono text-right py-3 px-2`}>
                    {formatNumber(shapValue.value)}
                  </td>
                  <td className={`font-mono text-right py-3 px-2 ${
                    shapValue.contribution > 0 
                      ? 'text-green-400' 
                      : shapValue.contribution < 0 
                        ? 'text-red-400' 
                        : bloombergClasses.text.primary
                  }`}>
                    {shapValue.contribution > 0 ? '+' : ''}{formatNumber(shapValue.contribution)}
                  </td>
                  <td className={`${bloombergClasses.text.primary} font-mono text-right py-3 px-2`}>
                    {formatNumber(shapValue.importance)}
                  </td>
                  <td className="text-center py-3 px-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          shapValue.contribution > 0 ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        style={{ 
                          width: `${Math.min(100, Math.abs(shapValue.contribution) / Math.max(...shapValues.map(sv => Math.abs(sv.contribution))) * 100)}%` 
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Positive vs Negative Contributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positive Contributions */}
        <div className={bloombergClasses.container.secondary}>
          <h3 className={`${bloombergClasses.text.primary} text-lg font-semibold uppercase tracking-wide mb-4`}>
            Positive Contributions ({positiveValues.length})
          </h3>
          <div className="space-y-2">
            {positiveValues
              .sort((a, b) => b.contribution - a.contribution)
              .slice(0, 10)
              .map((value) => (
              <div key={value.feature} className="flex justify-between items-center">
                <span className={`${bloombergClasses.text.primary} font-mono text-sm`}>
                  {value.feature}
                </span>
                <span className="text-green-400 font-mono text-sm font-bold">
                  +{formatNumber(value.contribution)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Negative Contributions */}
        <div className={bloombergClasses.container.secondary}>
          <h3 className={`${bloombergClasses.text.primary} text-lg font-semibold uppercase tracking-wide mb-4`}>
            Negative Contributions ({negativeValues.length})
          </h3>
          <div className="space-y-2">
            {negativeValues
              .sort((a, b) => a.contribution - b.contribution)
              .slice(0, 10)
              .map((value) => (
              <div key={value.feature} className="flex justify-between items-center">
                <span className={`${bloombergClasses.text.primary} font-mono text-sm`}>
                  {value.feature}
                </span>
                <span className="text-red-400 font-mono text-sm font-bold">
                  {formatNumber(value.contribution)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className={bloombergClasses.container.secondary}>
        <h3 className={`${bloombergClasses.text.primary} text-lg font-semibold uppercase tracking-wide mb-4`}>
          Interpretation Guide
        </h3>
        <div className="space-y-3 text-sm">
          <div className={`${bloombergClasses.text.secondary} font-mono`}>
            <strong className={bloombergClasses.text.primary}>Base Value:</strong> Average model prediction across all training data
          </div>
          <div className={`${bloombergClasses.text.secondary} font-mono`}>
            <strong className={bloombergClasses.text.primary}>Feature Contribution:</strong> How much each feature pushes the prediction above or below the base value
          </div>
          <div className={`${bloombergClasses.text.secondary} font-mono`}>
            <strong className="text-green-400">Positive Values:</strong> Features that increase the predicted risk score
          </div>
          <div className={`${bloombergClasses.text.secondary} font-mono`}>
            <strong className="text-red-400">Negative Values:</strong> Features that decrease the predicted risk score
          </div>
        </div>
      </div>
    </div>
  );
}