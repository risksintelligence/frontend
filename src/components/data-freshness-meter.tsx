import { semanticColors } from '../lib/theme';

type FreshnessEntry = { 
  component: string; 
  status: string; 
  last_updated: string;
  cache_tier?: 'hot' | 'warm' | 'cold';
  ttl_remaining?: number;
};

const statusColor: Record<string, string> = {
  fresh: semanticColors.minimalRisk,
  warning: semanticColors.moderateRisk,
  stale: semanticColors.criticalRisk,
};

const tierColors = {
  hot: '#00C853',
  warm: '#FFD600', 
  cold: '#6200EA',
};

export default function DataFreshnessMeter({ entries }: { entries: FreshnessEntry[] }) {
  if (!entries?.length) return null;
  
  const freshCount = entries.filter(e => e.status === 'fresh').length;
  const totalCount = entries.length;
  const healthPercentage = (freshCount / totalCount) * 100;
  
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4" aria-label="Data Freshness">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase" style={{ color: 'var(--terminal-muted)' }}>
          Data Freshness Meter
        </h3>
        <div className="text-xs text-[#64748b]">
          Health: <span style={{ 
            color: healthPercentage >= 80 ? semanticColors.minimalRisk : 
                   healthPercentage >= 60 ? semanticColors.moderateRisk : 
                   semanticColors.criticalRisk 
          }}>
            {healthPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
      
      <ul className="mt-2 text-sm space-y-1">
        {entries.map((entry) => (
          <li key={entry.component} className="flex items-center justify-between border-b border-[#e2e8f0] py-2">
            <div className="flex items-center gap-2">
              <span>{entry.component}</span>
              {entry.cache_tier && (
                <span 
                  className="text-xs px-1.5 py-0.5 rounded text-white font-mono"
                  style={{ backgroundColor: tierColors[entry.cache_tier] }}
                >
                  {entry.cache_tier.toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-right">
              <span style={{ color: statusColor[entry.status] || semanticColors.moderateRisk }}>
                {entry.status}
              </span>
              <br />
              <span className="text-xs text-[#94a3b8]">
                {entry.last_updated}
                {entry.ttl_remaining && ` (TTL: ${Math.round(entry.ttl_remaining / 60)}m)`}
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      <p className="mt-3 text-xs text-[#94a3b8]">
        Cache tiers: HOT (real-time) · WARM (5min) · COLD (1hr) | 
        Source: Multi-tier caching architecture
      </p>
    </div>
  );
}
