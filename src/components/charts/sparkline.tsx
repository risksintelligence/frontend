'use client';

import { useEffect, useState } from 'react';
import { semanticColors } from '../../lib/theme';

interface SparklineData {
  value: number;
  timestamp: string;
}

interface Props {
  data: SparklineData[];
  color?: string;
  height?: number;
  showValue?: boolean;
  label?: string;
}

export default function Sparkline({ 
  data, 
  color = semanticColors.supplyChainStress, 
  height = 40,
  showValue = true,
  label 
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [Chart, setChart] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import('recharts').then((recharts) => {
      setChart({
        LineChart: recharts.LineChart,
        Line: recharts.Line,
        ResponsiveContainer: recharts.ResponsiveContainer,
      });
    });
  }, []);

  if (!data?.length) return null;

  const currentValue = data[data.length - 1]?.value;
  const previousValue = data[data.length - 2]?.value;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs text-[#64748b] min-w-fit">{label}</span>
      )}
      
      <div style={{ width: '60px', height: `${height}px` }}>
        {mounted && Chart ? (
          <Chart.ResponsiveContainer width="100%" height="100%">
            <Chart.LineChart data={data}>
              <Chart.Line 
                type="monotone" 
                dataKey="value" 
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
              />
            </Chart.LineChart>
          </Chart.ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center bg-gray-50 rounded text-xs text-gray-500 w-full h-full">
            ⟳
          </div>
        )}
      </div>
      
      {showValue && (
        <div className="text-right min-w-fit">
          <div className="text-sm font-mono" style={{ color }}>
            {currentValue?.toFixed(1) || '--'}
          </div>
          {!isNaN(changePercent) && (
            <div className={`text-xs ${change >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {change >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}