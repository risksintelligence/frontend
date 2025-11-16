import { semanticColors } from '../lib/theme';

interface RegimeProps {
  regime: { 
    regime?: string; 
    probabilities?: Record<string, number>;
    confidence?: number;
    shift_detected?: boolean;
    shift_timestamp?: string;
  } | undefined;
}

const transitionWatchlist = {
  Calm: 'Watch for volatility spikes in VIX and credit spreads',
  Inflationary_Stress: 'Monitor inflation releases and Treasury breakevens', 
  Supply_Shock: 'Track logistics indicators and diesel prices',
  Financial_Stress: 'Watch funding spreads and liquidity gauges',
};

const regimeColors = {
  Calm: semanticColors.minimalRisk,
  Inflationary_Stress: semanticColors.moderateRisk,
  Supply_Shock: semanticColors.highRisk,
  Financial_Stress: semanticColors.criticalRisk,
};

export default function RegimeCard({ regime }: RegimeProps) {
  if (!regime) return null;
  
  const regimeColor = regimeColors[regime.regime as keyof typeof regimeColors] || semanticColors.moderateRisk;
  
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4" aria-label="Regime analysis">
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase" style={{ color: 'var(--terminal-muted)' }}>Regime</h2>
        {regime.shift_detected && (
          <span className="text-xs px-2 py-1 rounded" style={{ 
            backgroundColor: semanticColors.anomaly + '20', 
            color: semanticColors.anomaly 
          }}>
            SHIFT DETECTED
          </span>
        )}
      </div>
      <p className="text-2xl font-bold" style={{ color: regimeColor }}>
        {regime.regime ?? '--'}
      </p>
      <p className="text-xs text-[#64748b]">
        Confidence: {((regime.confidence || 0) * 100).toFixed(1)}%
        {regime.shift_timestamp && ` | Shift: ${new Date(regime.shift_timestamp).toLocaleTimeString()}`}
      </p>
      <ul className="mt-2 text-xs text-[#475569]">
        {regime.probabilities &&
          Object.entries(regime.probabilities)
            .sort(([,a], [,b]) => b - a)
            .map(([name, prob]) => (
            <li key={name} className="flex justify-between">
              <span>{name}</span>
              <span>{(prob * 100).toFixed(1)}%</span>
            </li>
          ))}
      </ul>
      <p className="mt-2 text-xs text-[#94a3b8]">
        Transition watchlist: {transitionWatchlist[regime.regime as keyof typeof transitionWatchlist] || 'Monitor key indicators'}
      </p>
    </div>
  );
}
