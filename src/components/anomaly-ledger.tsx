import { semanticColors } from '../lib/theme';

interface AnomalyProps {
  anomaly: {
    anomalies?: Array<{
      score: number;
      classification: string;
      drivers?: Array<{component: string; impact: number}>;
      timestamp: string;
    }>;
    summary?: {
      total_anomalies: number;
      max_severity: number;
      updated_at: string;
    };
    // Legacy format support
    score?: number; 
    classification?: string;
    components?: Array<{ name: string; z_score: number }>;
  } | undefined;
}

export default function AnomalyLedger({ anomaly }: AnomalyProps) {
  // Support both new and legacy API formats
  const currentAnom = anomaly?.anomalies?.[0] || anomaly;
  const score = currentAnom?.score ?? anomaly?.summary?.max_severity ?? 0;
  const classification = currentAnom?.classification ?? 'stable';
  const shouldPromptExplanation = score > 0.5;
  
  return (
    <div className="risk-card" aria-label="Anomaly feed">
      <h3 className="section-label">
        Anomaly Feed
      </h3>
      <p className="text-3xl font-bold text-anomaly mt-2">
        {score?.toFixed(2) ?? '--'}
      </p>
      <p className="text-sm text-slate-700 font-medium capitalize">{classification}</p>
      
      {/* Show drivers from new format or components from legacy format */}
      {((currentAnom as any)?.drivers || anomaly?.components) && (
        <div className="mt-2">
          <p className="text-xs text-[#64748b] mb-1">
            {(currentAnom as any)?.drivers ? 'Key Drivers:' : 'Component Z-Scores:'}
          </p>
          <ul className="text-xs text-[#475569] space-y-1">
            {(currentAnom as any)?.drivers ? (
              (currentAnom as any).drivers
                .filter((d: any) => Math.abs(d.impact) > 0.5)
                .map((driver: any) => (
                  <li key={driver.component} className="flex justify-between">
                    <span>{driver.component}</span>
                    <span style={{ 
                      color: Math.abs(driver.impact) > 2 ? semanticColors.anomaly : 'inherit' 
                    }}>
                      {driver.impact > 0 ? '+' : ''}{driver.impact.toFixed(1)}
                    </span>
                  </li>
                ))
            ) : (
              anomaly?.components
                ?.filter(c => Math.abs(c.z_score) > 1.5)
                .map(component => (
                  <li key={component.name} className="flex justify-between">
                    <span>{component.name}</span>
                    <span style={{ 
                      color: Math.abs(component.z_score) > 2 ? semanticColors.anomaly : 'inherit' 
                    }}>
                      {component.z_score.toFixed(1)}σ
                    </span>
                  </li>
                ))
            )}
          </ul>
        </div>
      )}
      
      {shouldPromptExplanation && (
        <div className="mt-3 p-2 rounded" style={{ 
          backgroundColor: semanticColors.anomaly + '10',
          border: `1px solid ${semanticColors.anomaly}40`
        }}>
          <p className="text-xs" style={{ color: semanticColors.anomaly }}>
            <strong>Action Required:</strong> High anomaly detected. 
            <button 
              className="ml-1 underline hover:no-underline focus:bg-white focus:px-1 focus:py-0.5 focus:rounded"
              onClick={() => window.open('/scenario-studio', '_blank')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/scenario-studio', '_blank');
                }
              }}
              aria-label="Open Scenario Studio to explain this anomaly"
            >
              Explain via Scenario Studio →
            </button>
          </p>
        </div>
      )}
      
      <p className="mt-2 text-xs text-[#94a3b8]">
        Analysts prompted when score &gt; 0.5 | Updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
