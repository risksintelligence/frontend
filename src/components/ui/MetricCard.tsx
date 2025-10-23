'use client';

import { MetricCardProps } from '@/types';
import LoadingSpinner from './LoadingSpinner';

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  status = 'good',
  icon: Icon,
  loading = false
}: MetricCardProps) {
  const statusClasses = {
    good: 'border-emerald-200 bg-emerald-50',
    warning: 'border-amber-200 bg-amber-50', 
    critical: 'border-red-200 bg-red-50'
  };

  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendColor = trend === 'up' ? 'text-emerald-700' : 
                    trend === 'down' ? 'text-red-700' : 
                    'text-slate-500';

  return (
    <div className={`metric-card ${statusClasses[status]}`}>
      <div className="flex items-center justify-between">
        <h3 className="metric-title">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-slate-500" />}
      </div>
      
      <div className="flex items-baseline gap-2">
        {loading ? (
          <LoadingSpinner size="md" />
        ) : (
          <>
            <span className="metric-value">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && (
              <span className="text-sm text-slate-500 font-medium">
                {unit}
              </span>
            )}
          </>
        )}
      </div>
      
      {trend && trendValue !== undefined && !loading && (
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <span className="font-mono">{trendIcon}</span>
          <span>
            {trendValue > 0 ? '+' : ''}{trendValue}%
          </span>
          <span className="text-slate-500">vs prev</span>
        </div>
      )}
    </div>
  );
}