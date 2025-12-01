"use client";

import { useIsClient } from "@/hooks/useIsClient";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface CascadeChartProps {
  data: Array<{ step: string; risk: number }>;
}

export default function CascadeChart({ data }: CascadeChartProps) {
  const isClient = useIsClient();
  const chartData = data.length ? data : [
    { step: "Provider Failure", risk: 75 },
    { step: "Cache Fallback", risk: 55 },
    { step: "GRII Impact", risk: 35 },
  ];

  return (
    <div className="terminal-card space-y-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-terminal-muted">Cascade Impact</p>
        <h3 className="text-sm font-semibold uppercase text-terminal-text">Failure Simulation</h3>
      </div>
      <div className="h-48 w-full">
        {isClient ? (
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="step" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                formatter={(val: number) => `${val.toFixed(1)} risk`}
              />
              <Area type="monotone" dataKey="risk" stroke="#dc2626" fill="#fecdd3" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-48" />
        )}
      </div>
    </div>
  );
}
