"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useNetworkSnapshot } from "@/hooks/useNetworkSnapshot";
import { getRiskLevel, getRiskTextColor, getAccessibilityPattern } from "@/lib/risk-colors";
import StatusBadge from "@/components/ui/StatusBadge";
import { ShieldAlert, Activity } from "lucide-react";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";

function NetworkTopologyContent() {
  const { data: networkData, isLoading } = useNetworkSnapshot();
  const { isOpen, closeModal, modalProps } = useMethodologyModal();

  if (isLoading) {
    return <SkeletonLoader variant="table" rows={4} />;
  }

  if (!networkData) {
    return (
      <div className="terminal-card">
        <p className="text-terminal-muted font-mono">No network data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <SummaryCard
          title="Providers"
          value={`${networkData.summaryStats?.total_providers ?? 0}`}
          subtitle={`Healthy: ${networkData.summaryStats?.healthy_providers ?? 0} / Unhealthy: ${networkData.summaryStats?.unhealthy_providers ?? 0}`}
        />
        <SummaryCard
          title="Average Reliability"
          value={`${Math.round((networkData.summaryStats?.average_reliability ?? 0) * 100)}%`}
          subtitle="Weighted across providers"
        />
        <SummaryCard
          title="Overall Health"
          value={networkData.summaryStats?.overall_health ?? "unknown"}
          badgeVariant={networkData.summaryStats?.overall_health === "good" ? "good" : "warning"}
        />
        <SummaryCard
          title="Updated"
          value={networkData.updatedAt ? new Date(networkData.updatedAt).toLocaleTimeString() : ""}
          subtitle="Live provider health snapshot"
        />
      </div>

      {/* Network Nodes Grid */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            NETWORK NODES
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Critical infrastructure components and risk levels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {networkData.nodes.map((node) => {
            const riskLevel = getRiskLevel(node.risk);
            const riskColor = getRiskTextColor(node.risk);
            const pattern = getAccessibilityPattern(node.risk);
            const provider = networkData.providerHealth?.[node.id];

            return (
              <div key={node.id} className="border border-terminal-border rounded p-4 bg-terminal-surface space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono text-sm font-semibold text-terminal-text">
                    {node.name}
                  </h4>
                  <StatusBadge variant={node.risk >= 70 ? "critical" : node.risk >= 40 ? "warning" : "good"}>
                    {pattern}
                  </StatusBadge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-terminal-muted">Sector</span>
                    <span className="text-terminal-text">{node.sector}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-terminal-muted">Risk Score</span>
                    <span className={`font-bold ${riskColor}`}>{node.risk.toFixed(1)}</span>
                  </div>
                  {provider && (
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-terminal-muted">Reliability</span>
                      <span className="text-terminal-text">{Math.round((provider.reliability_score || 0) * 100)}%</span>
                    </div>
                  )}
                  
                  <div className="w-full bg-terminal-border rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${riskLevel.semanticColor === 'red' ? 'bg-terminal-red' : riskLevel.semanticColor === 'amber' ? 'bg-terminal-orange' : 'bg-terminal-green'}`}
                      style={{ width: `${node.risk}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-terminal-muted font-mono">
                    Status: {riskLevel.name}
                  </div>
                  {provider && typeof provider.failure_count === "number" && (
                    <div className="text-xs text-terminal-muted font-mono">
                      Failures: {provider.failure_count}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Paths */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            CRITICAL PATHS
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            High-risk dependency chains requiring monitoring
          </p>
        </div>

        <div className="space-y-3">
          {networkData.criticalPaths.map((path, index) => {
            // approximate risk from node entries
            const nodesInPath = path.split("→").map((p) => p.trim());
            const risks: number[] = [];
            nodesInPath.forEach((name) => {
              const node = networkData.nodes.find((n) => n.name === name);
              if (node) risks.push(node.risk);
            });
            const avgRisk = risks.length ? risks.reduce((a, b) => a + b, 0) / risks.length : 0;
            const variant = avgRisk >= 70 ? "critical" : avgRisk >= 40 ? "warning" : "good";

            return (
              <div key={index} className="flex items-center gap-4 p-3 bg-terminal-surface rounded border border-terminal-border">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-terminal-red rounded-full animate-pulse"></span>
                  <span className="text-xs text-terminal-muted font-mono">Path {index + 1}</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-terminal-text font-mono">{path}</span>
                </div>
                <StatusBadge variant={variant}>{Math.round(avgRisk)}% risk</StatusBadge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topology Summary */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            TOPOLOGY SUMMARY
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            {networkData.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Total Nodes</div>
            <div className="text-2xl text-terminal-text font-mono font-bold">{networkData.nodes.length}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Critical Paths</div>
            <div className="text-2xl text-terminal-red font-mono font-bold">{networkData.criticalPaths.length}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Avg Risk Score</div>
            <div className="text-2xl text-terminal-orange font-mono font-bold">
              {(networkData.nodes.reduce((sum, node) => sum + node.risk, 0) / networkData.nodes.length).toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities & Dependencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="terminal-card space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-terminal-red" />
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">Vulnerabilities</h3>
          </div>
          {networkData.vulnerabilities?.length ? (
            <div className="space-y-2">
              {networkData.vulnerabilities.map((vuln, idx) => (
                <div key={idx} className="p-3 bg-terminal-surface border border-terminal-border rounded">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-terminal-text">{vuln.node}</span>
                    <StatusBadge variant={vuln.risk >= 70 ? "critical" : vuln.risk >= 40 ? "warning" : "good"}>
                      {vuln.risk.toFixed(1)}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-terminal-muted font-mono mt-1">{vuln.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-terminal-muted font-mono">No vulnerabilities reported</p>
          )}
        </div>

        <div className="terminal-card space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-terminal-accent" />
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">Partner Dependencies</h3>
          </div>
          {networkData.partnerDependencies?.length ? (
            <div className="space-y-2">
              {networkData.partnerDependencies.map((dep, idx) => (
                <div key={idx} className="p-3 bg-terminal-surface border border-terminal-border rounded flex items-center justify-between text-xs font-mono">
                  <div>
                    <p className="text-terminal-text">{dep.partner}</p>
                    <p className="text-terminal-muted">{dep.dependency}</p>
                  </div>
                  <StatusBadge variant={dep.status === "critical" ? "critical" : dep.status === "watch" ? "warning" : "good"}>
                    {dep.status?.toUpperCase() || "UNKNOWN"}
                  </StatusBadge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-terminal-muted font-mono">No dependencies listed</p>
          )}
        </div>
      </div>

      <MethodologyModal {...modalProps} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}

export default function NetworkTopologyPage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Network Analysis
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Network Topology
          </h1>
          <p className="text-sm text-terminal-muted">
            Detailed view of network nodes, critical paths, and systemic vulnerabilities.
          </p>
        </header>
        <NetworkTopologyContent />
      </div>
    </MainLayout>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  badgeVariant,
}: {
  title: string;
  value: string;
  subtitle?: string;
  badgeVariant?: "good" | "warning" | "critical";
}) {
  return (
    <div className="terminal-card p-3 space-y-1">
      <p className="text-xs text-terminal-muted font-mono uppercase">{title}</p>
      <div className="flex items-center gap-2">
        <p className="text-lg text-terminal-text font-mono font-bold">{value}</p>
        {badgeVariant && <StatusBadge variant={badgeVariant}>{title}</StatusBadge>}
      </div>
      {subtitle && <p className="text-xs text-terminal-muted font-mono">{subtitle}</p>}
    </div>
  );
}
