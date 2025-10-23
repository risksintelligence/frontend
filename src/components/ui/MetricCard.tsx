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
    good: 'border-terminal-green/20 bg-terminal-green/5',
    warning: 'border-terminal-orange/20 bg-terminal-orange/5',
    critical: 'border-terminal-red/20 bg-terminal-red/5'
  };

  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  const trendColor = trend === 'up' ? 'text-terminal-green' : 
                    trend === 'down' ? 'text-terminal-red' : 
                    'text-terminal-muted';

  return (
    <div className={`metric-card ${statusClasses[status]}`}>
      <div className="flex items-center justify-between">
        <h3 className="metric-title">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-terminal-muted" />}
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
              <span className="text-sm text-terminal-muted font-medium">
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
          <span className="text-terminal-muted">vs prev</span>
        </div>
      )}
    </div>
  );
}