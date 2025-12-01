"use client";

import { useNetworkSnapshot } from "@/hooks/useNetworkSnapshot";
import StatusBadge from "@/components/ui/StatusBadge";
import NetworkMiniHeatmap from "./NetworkMiniHeatmap";
import VulnerabilityTable from "./VulnerabilityTable";
import PartnerDependencyChart from "./PartnerDependencyChart";
import { getRiskTextColor } from "@/lib/risk-colors";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";

export default function NetworkOverview() {
  const { data, isLoading } = useNetworkSnapshot();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonLoader key={idx} variant="card" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <section className="terminal-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-terminal-muted">
              Network Analysis
            </p>
            <h3 className="text-sm font-semibold uppercase text-terminal-text">
              Systemic Topology Overview
            </h3>
          </div>
        </div>
        <p className="text-sm text-terminal-muted font-mono">
          Network topology data will appear here when available.
        </p>
      </section>
    );
  }

  const nodes = data.nodes || [];
  const criticalCount = nodes.filter(node => node.risk >= 70).length;
  const maxRisk = nodes.length > 0 ? Math.max(...nodes.map(node => node.risk)) : 0;
  const averageRisk = nodes.length > 0 ? 
    nodes.reduce((sum, node) => sum + node.risk, 0) / nodes.length : 0;

  const statusCounts = {
    critical: nodes.filter(n => n.risk >= 70).length,
    watch: nodes.filter(n => n.risk >= 40 && n.risk < 70).length,
    stable: nodes.filter(n => n.risk < 40).length,
  };
  const donutData = [
    { name: "Critical", value: statusCounts.critical, color: "#dc2626" },
    { name: "Watch", value: statusCounts.watch, color: "#f59e0b" },
    { name: "Stable", value: statusCounts.stable, color: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
              Total Nodes
            </p>
            <div className="w-2 h-2 rounded-full bg-sky-700" />
          </div>
          <p className="text-2xl font-bold text-terminal-text font-mono">
            {nodes.length}
          </p>
          <p className="text-xs text-terminal-muted font-mono">
            Active topology endpoints
          </p>
        </div>

        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
              Critical Paths
            </p>
            <div className="w-2 h-2 rounded-full bg-orange-700" />
          </div>
          <p className="text-2xl font-bold text-terminal-text font-mono">
            {data.criticalPaths?.length || 0}
          </p>
          <p className="text-xs text-terminal-muted font-mono">
            High-priority connections
          </p>
        </div>

        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
              Critical Nodes
            </p>
            <div className="w-2 h-2 rounded-full bg-terminal-red" />
          </div>
          <p className={`text-2xl font-bold font-mono ${getRiskTextColor(criticalCount > 0 ? 70 : 30)}`}>
            {criticalCount}
          </p>
          <p className="text-xs text-terminal-muted font-mono">
            Risk ≥70 threshold
          </p>
        </div>

        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono">
              Max Risk
            </p>
            <div className={`w-2 h-2 rounded-full ${maxRisk >= 70 ? 'bg-terminal-red' : maxRisk >= 40 ? 'bg-terminal-orange' : 'bg-terminal-green'}`} />
          </div>
          <p className={`text-2xl font-bold font-mono ${getRiskTextColor(maxRisk)}`}>
            {maxRisk}
          </p>
          <p className="text-xs text-terminal-muted font-mono">
            Highest node score
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <NetworkMiniHeatmap 
          networkData={data} 
          timestamp={data.updatedAt}
        />
        <div className="space-y-4">
          <VulnerabilityTable 
            networkData={data} 
            timestamp={data.updatedAt}
          />
          <div className="terminal-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-terminal-muted">
                Status Mix
              </p>
              <StatusBadge variant={averageRisk >= 60 ? "critical" : averageRisk >= 40 ? "warning" : "good"}>
                LIVE
              </StatusBadge>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{ fontFamily: "JetBrains Mono", fontSize: 12, borderColor: "#e2e8f0" }}
                    formatter={(val: number, name: string) => [`${val} nodes`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-terminal-muted font-mono">
              <span>Critical: {statusCounts.critical}</span>
              <span>Watch: {statusCounts.watch}</span>
              <span>Stable: {statusCounts.stable}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Dependencies */}
      <PartnerDependencyChart 
        networkData={data} 
        timestamp={data.updatedAt}
      />

      {/* Network Summary */}
      {data.summary && (
        <section className="terminal-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-terminal-muted">
                Network Intelligence
              </p>
              <h3 className="text-sm font-semibold uppercase text-terminal-text">
                Systemic Assessment Summary
              </h3>
            </div>
            <StatusBadge variant={averageRisk >= 60 ? "critical" : averageRisk >= 40 ? "warning" : "good"}>
              ∅ {averageRisk.toFixed(1)} NETWORK
            </StatusBadge>
          </div>
          
          <div className="bg-terminal-surface rounded border border-terminal-border p-4">
            <p className="text-sm text-terminal-text font-mono leading-relaxed">
              {data.summary}
            </p>
          </div>

          <div className="border-t border-terminal-border pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-sky-700 hover:bg-sky-600 text-white px-4 py-2 rounded font-mono text-sm transition-colors">
                Launch Scenario Templates →
              </button>
              <button className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded font-mono text-sm transition-colors">
                Enroll Supply Chain Mission →
              </button>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-terminal-muted font-mono">
                Data: Live Data · Updated {data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
              </p>
              <button className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors">
                Explain Network Drivers →
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
