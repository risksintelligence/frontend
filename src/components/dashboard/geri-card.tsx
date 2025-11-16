import { GeriResponse } from '../../lib/api';
import { getRiskBandClass, getRiskBandColor } from '../../lib/theme';

export default function GERICard({ data, narrative }: { data: GeriResponse | undefined; narrative: string }) {
  const bandClass = data?.band ? getRiskBandClass(data.band) : 'text-risk-moderate';
  const bandColor = data?.band ? getRiskBandColor(data.band) : '#FFD600';
  
  return (
    <div className="risk-card" aria-label="GRII Risk Score">
      <h2 className="section-label">GRII Score</h2>
      <div className="flex items-baseline gap-2 mt-2">
        <p className={`geri-score ${bandClass}`}>
          {data?.score ?? '--'}
        </p>
        {data?.change_24h !== undefined && (
          <span className="text-sm font-medium text-slate-600">
            {data.change_24h > 0 ? '+' : ''}{data.change_24h.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm font-medium text-terminal-muted capitalize">
          {data?.band ?? 'loading...'}
        </p>
        {data?.confidence && (
          <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
            {typeof data.confidence === 'number' 
              ? `${data.confidence.toFixed(0)}% confidence`
              : `${(data.confidence * 100).toFixed(0)}% confidence`
            }
          </span>
        )}
      </div>
      
      {/* Visual indicator bar */}
      <div className="mt-3 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${data?.score ?? 0}%`, 
            backgroundColor: bandColor 
          }}
        />
      </div>
      
      <p className="mt-3 text-xs text-slate-500">
        Source: GERII API v1 | Updated: {data?.updated_at ? new Date(data.updated_at).toLocaleTimeString() : '--'}
      </p>
      
      {narrative && (
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: bandColor }}>
          <p className="text-sm text-slate-700 leading-relaxed">{narrative}</p>
        </div>
      )}
    </div>
  );
}
