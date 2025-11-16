import { useMemo } from 'react';
import { GeriResponse } from '../../lib/api';

interface AlertData {
  level: 'critical' | 'high' | 'moderate';
  message: string;
  action: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export default function AlertBanner({ 
  geri, 
  anomalyScore, 
  forecastDelta 
}: { 
  geri: GeriResponse | undefined;
  anomalyScore?: number;
  forecastDelta?: number;
}) {
  const alert = useMemo((): AlertData | null => {
    if (!geri) return null;
    
    // Critical alerts
    if (geri.band === 'critical') {
      return {
        level: 'critical',
        message: `Critical Risk Alert: GRII at ${geri.score} (${geri.band.toUpperCase()})`,
        action: 'Escalate to risk committee immediately. Issue emergency RRIO brief.',
        bgColor: '#FFEBEE',
        borderColor: '#D50000',
        textColor: '#B71C1C'
      };
    }
    
    // High risk with significant change
    if (geri.band === 'high' && Math.abs(geri.change_24h || 0) > 5) {
      return {
        level: 'high',
        message: `High Risk: GRII ${geri.change_24h && geri.change_24h > 0 ? 'surged' : 'dropped'} ${Math.abs(geri.change_24h || 0).toFixed(1)} points`,
        action: 'Monitor alerts closely. Prepare RRIO commentary.',
        bgColor: '#FFF3E0',
        borderColor: '#FFAB00',
        textColor: '#E65100'
      };
    }
    
    // High anomaly score
    if (anomalyScore && anomalyScore > 0.8) {
      return {
        level: 'moderate',
        message: `Anomaly Alert: Unusual market conditions detected (${(anomalyScore * 100).toFixed(0)}% confidence)`,
        action: 'Review data sources and validate component behavior.',
        bgColor: '#F3E5F5',
        borderColor: '#6200EA',
        textColor: '#4A148C'
      };
    }
    
    // Forecast warning
    if (forecastDelta && Math.abs(forecastDelta) > 8) {
      return {
        level: 'moderate',
        message: `Forecast Warning: Significant risk shift expected (${forecastDelta > 0 ? '+' : ''}${forecastDelta.toFixed(1)} points)`,
        action: 'Prepare scenario analysis and stakeholder communications.',
        bgColor: '#FFF8E1',
        borderColor: '#FFC400',
        textColor: '#F57F17'
      };
    }
    
    return null;
  }, [geri, anomalyScore, forecastDelta]);

  if (!alert) return null;
  
  return (
    <div 
      className="rounded-xl border p-4 mb-6" 
      style={{ 
        backgroundColor: alert.bgColor, 
        borderColor: alert.borderColor,
        color: alert.textColor 
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {alert.level === 'critical' && (
            <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {alert.level === 'high' && (
            <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
          {alert.level === 'moderate' && (
            <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">
            {alert.message}
          </h3>
          <p className="text-sm opacity-90">
            {alert.action}
          </p>
          <p className="text-xs mt-2 opacity-75">
            Alert triggered at {new Date().toLocaleTimeString()} | Level: {alert.level.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
