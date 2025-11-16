'use client';

import { useEffect, useState } from 'react';
import { semanticColors } from '../../lib/theme';

interface ZScoreData {
  timestamp: string;
  z_score: number;
  component: string;
}

interface Props {
  data: ZScoreData[];
  component: string;
}

export default function ZScoreChart({ data, component }: Props) {
  const [mounted, setMounted] = useState(false);
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import('recharts').then((recharts) => {
      setChart({
        LineChart: recharts.LineChart,
        Line: recharts.Line,
        XAxis: recharts.XAxis,
        YAxis: recharts.YAxis,
        ResponsiveContainer: recharts.ResponsiveContainer,
        ReferenceLine: recharts.ReferenceLine,
      });
    });
  }, []);

  if (!data?.length) return null;

  const getZScoreColor = (value: number) => {
    if (Math.abs(value) > 2.5) return semanticColors.criticalRisk;
    if (Math.abs(value) > 2) return semanticColors.highRisk;
    if (Math.abs(value) > 1.5) return semanticColors.moderateRisk;
    return semanticColors.minimalRisk;
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
          {component} Z-Score
        </h4>
        <span className="text-xs px-2 py-1 rounded bg-[#f1f5f9] text-[#475569]">
          5Y Rolling Window
        </span>
      </div>
      
      <div style={{ width: '100%', height: '200px' }}>
        {mounted && Chart ? (
          <Chart.ResponsiveContainer width="100%" height="100%">
            <Chart.LineChart data={data}>
              <Chart.XAxis 
                dataKey="timestamp" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
              />
              <Chart.YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(value: number) => `${value.toFixed(1)}σ`}
              />
              <Chart.ReferenceLine y={0} stroke="#64748b" strokeDasharray="2 2" />
              <Chart.ReferenceLine y={2} stroke={semanticColors.highRisk} strokeDasharray="1 1" opacity={0.5} />
              <Chart.ReferenceLine y={-2} stroke={semanticColors.highRisk} strokeDasharray="1 1" opacity={0.5} />
              <Chart.Line 
                type="monotone" 
                dataKey="z_score" 
                stroke={semanticColors.supplyChainStress}
                strokeWidth={2}
                dot={{ r: 2, fill: semanticColors.supplyChainStress }}
                activeDot={{ r: 4, fill: semanticColors.anomaly }}
              />
            </Chart.LineChart>
          </Chart.ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center bg-gray-50 rounded text-sm text-gray-500 w-full h-full">
            Loading chart...
          </div>
        )}
      </div>
      
      <div className="mt-3 text-xs text-[#64748b] space-y-1">
        <p>Current: <span style={{ color: getZScoreColor(data[data.length - 1]?.z_score || 0) }}>
          {data[data.length - 1]?.z_score?.toFixed(2) || '--'}σ
        </span></p>
        <p className="text-[#94a3b8]">
          Source: GERI v1 Analytics | Dotted lines: ±2σ thresholds | 
          Updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}