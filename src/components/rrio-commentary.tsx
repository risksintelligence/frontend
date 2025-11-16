import { GeriResponse } from '../lib/api';

interface Props {
  geri: GeriResponse | undefined;
  regime: any;
  forecast: any;
}

function generateRRIOCommentary(geri: GeriResponse, regime: any, forecast: any): string {
  const bandText = geri.band?.charAt(0).toUpperCase() + geri.band?.slice(1);
  const changeDirection = (geri.change_24h || 0) >= 0 ? 'climbed' : 'declined';
  const changeAmount = Math.abs(geri.change_24h || 0).toFixed(1);
  
  const topDrivers = geri.drivers?.slice(0, 2);
  const driverNarrative = topDrivers?.length 
    ? topDrivers.map(d => {
        const verb = d.impact > 0 ? 'pressured upward by' : 'supported by';
        const component = d.component.toLowerCase();
        return `${component} ${verb} ${Math.abs(d.impact).toFixed(1)}bp`;
      }).join(' while ')
    : 'mixed component signals';

  const regimeContext = regime?.regime ? ` amid ${regime.regime.replace('_', ' ').toLowerCase()} conditions` : '';
  
  const forecastNote = forecast?.direction === 'rising' 
    ? 'Near-term trajectory suggests continued upward pressure.'
    : forecast?.direction === 'falling'
    ? 'Near-term indicators point to easing conditions.'
    : 'Mixed signals suggest range-bound conditions ahead.';

  return `GRII ${changeDirection} ${changeAmount} points to ${geri.score} (${bandText} Risk, ${geri.band_color}) as ${driverNarrative}${regimeContext}. ${forecastNote} Confidence: ${(geri.confidence * 100).toFixed(0)}%. Analysts recommend monitoring supply-chain congestion and credit spread dynamics for early regime shift signals.`;
}

export default function RRIOCommentary({ geri, regime, forecast }: Props) {
  if (!geri) return null;
  
  const commentary = generateRRIOCommentary(geri, regime, forecast);
  
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
          RRIO Analyst Brief
        </h3>
        <span className="text-xs px-2 py-1 rounded bg-[#1e3a8a] text-white">
          LIVE
        </span>
      </div>
      
      <p className="text-sm leading-relaxed text-[#0f172a] font-medium mb-3">
        {commentary}
      </p>
      
      <div className="border-t border-[#e2e8f0] pt-3">
        <div className="flex items-center justify-between text-xs text-[#64748b]">
          <span>
            Source: GRII v1 Analytics | {new Date().toLocaleString()}
          </span>
          <div className="flex gap-2">
            <button 
              className="underline hover:no-underline"
              onClick={() => window.open('/transparency/methodology', '_blank')}
            >
              Methodology
            </button>
            <button 
              className="underline hover:no-underline"
              onClick={() => window.open('/community/submit-analysis', '_blank')}
            >
              Submit Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}