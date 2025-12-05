"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useIsClient } from "@/hooks/useIsClient";

interface RasHistorySparklineProps {
  history: Array<{ date: string; value: number }>;
  title?: string;
}

export default function RasHistorySparkline({ history, title = "RAS History" }: RasHistorySparklineProps) {
  const isClient = useIsClient();

  if (!history.length) {
    return <SkeletonLoader variant="chart" className="h-32" />;
  }

  return (
    <div className="terminal-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Impact History
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            {title}
          </h3>
        </div>
      </div>
      <div className="h-32 w-full">
        {isClient ? (
          <ResponsiveContainer>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="ras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  try {
                    return new Date(value).toLocaleDateString();
                  } catch {
                    return value;
                  }
                }}
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                labelStyle={{ fontSize: 12 }}
                formatter={(value: number) => `${value.toFixed(1)} pts`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1e3a8a"
                fillOpacity={1}
                fill="url(#ras)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <SkeletonLoader variant="chart" className="h-32" />
        )}
      </div>
    </div>
  );
}
