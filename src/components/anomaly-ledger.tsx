import { semanticColors } from '../lib/theme';

interface AnomalyProps {
  anomaly: { 
    score?: number; 
    classification?: string;
    components?: Array<{ name: string; z_score: number }>;
  } | undefined;
}

export default function AnomalyLedger({ anomaly }: AnomalyProps) {
  const shouldPromptExplanation = (anomaly?.score ?? 0) > 0.5;
  
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4" aria-label="Anomaly feed">
      <h3 className="text-sm uppercase" style={{ color: 'var(--terminal-muted)' }}>
        Anomaly Feed
      </h3>
      <p className="text-3xl font-bold" style={{ color: semanticColors.anomaly }}>
        {anomaly?.score ?? '--'}
      </p>
      <p className="text-sm text-[#475569]">{anomaly?.classification ?? 'stable'}</p>
      
      {anomaly?.components && anomaly.components.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-[#64748b] mb-1">Component Z-Scores:</p>
          <ul className="text-xs text-[#475569] space-y-1">
            {anomaly.components
              .filter(c => Math.abs(c.z_score) > 1.5)
              .map(component => (
              <li key={component.name} className="flex justify-between">
                <span>{component.name}</span>
                <span style={{ 
                  color: Math.abs(component.z_score) > 2 ? semanticColors.anomaly : 'inherit' 
                }}>
                  {component.z_score.toFixed(1)}σ
                </span>
              </li>
            ))}
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
