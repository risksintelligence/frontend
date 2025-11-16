import { GeriResponse } from '../../lib/api';
import { semanticColors } from '../../lib/theme';

const bandColorMap: Record<string, string> = {
  minimal: 'var(--minimal-risk)',
  low: 'var(--low-risk)',
  moderate: 'var(--moderate-risk)',
  high: 'var(--high-risk)',
  critical: 'var(--critical-risk)',
};

export default function GERICard({ data, narrative }: { data: GeriResponse | undefined; narrative: string }) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4" aria-label="GRII Risk Score">
      <h2 className="text-sm uppercase tracking-wide" style={{ color: 'var(--terminal-muted)' }}>GRII Score</h2>
      <div className="flex items-baseline gap-2">
        <p
          className="text-4xl font-bold"
          style={{ color: bandColorMap[data?.band ?? ''] || bandColorMap.moderate }}
        >
          {data?.score ?? '--'}
        </p>
        {data?.confidence_interval && (
          <span className="text-sm text-[#64748b]">
            ±{((data.confidence_interval[1] - data.confidence_interval[0]) / 2).toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--terminal-muted)' }}>
          {data?.band ?? 'loading...'}
        </p>
        {data?.confidence && (
          <span className="text-xs px-2 py-1 rounded bg-[#f1f5f9] text-[#475569]">
            {(data.confidence * 100).toFixed(0)}% confidence
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-[#94a3b8]">
        Source: GRII API v1 | Updated: {data?.updated_at}
        {data?.confidence_interval && (
          <> | CI: [{data.confidence_interval[0].toFixed(1)}, {data.confidence_interval[1].toFixed(1)}]</>
        )}
      </p>
      <p className="mt-3 text-xs text-[#475569]">{narrative}</p>
    </div>
  );
}
