'use client';

import { useMemo } from 'react';
import { useMemoizedApi } from '../../hooks/use-memo-api';
import { api } from '../../lib/api';

type HeatmapProps = {
  componentId: string;
  days?: number;
};

export default function ComponentHeatmap({ componentId, days = 30 }: HeatmapProps) {
  const { data } = useMemoizedApi(`component-history-${componentId}-${days}`, () =>
    api.getComponentHistory(componentId, days)
  );

  const rows = useMemo(() => data?.history ?? [], [data]);

  return (
    <div className="panel" aria-label={`${componentId} history`}>
      <h3 className="section-label mb-2">{componentId} Z-score History</h3>
      <div className="grid grid-cols-6 gap-1 text-xs text-center" role="presentation">
        {rows.slice(-24).map((entry) => (
          <div
            key={entry.date}
            className="p-2 rounded"
            style={{
              backgroundColor: entry.z_score > 1 ? 'var(--risk-high)'
                : entry.z_score < -1 ? 'var(--risk-minimal)'
                : 'var(--risk-moderate)',
              color: '#fff'
            }}
          >
            <div>{new Date(entry.date).getDate()}</div>
            <div>{entry.z_score.toFixed(1)}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-terminal-muted">
        Data from `/api/v1/analytics/components/{componentId}/history`.
      </p>
    </div>
  );
}
