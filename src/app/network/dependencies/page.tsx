"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useNetworkSnapshot } from "@/hooks/useNetworkSnapshot";
import { NetworkSnapshot, NetworkNode } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import DependencyHeatmap from "@/components/network/DependencyHeatmap";
import CascadeChart from "@/components/network/CascadeChart";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";

function NetworkDependenciesContent() {
  const { data: networkData, isLoading } = useNetworkSnapshot();
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();

  if (isLoading) {
    return <SkeletonLoader variant="table" rows={4} />;
  }

  const typedNetworkData = networkData as NetworkSnapshot | undefined;

  if (!typedNetworkData) {
    return (
      <div className="terminal-card">
        <p className="text-terminal-muted font-mono">No network data available</p>
      </div>
    );
  }

  const vulnerabilities = typedNetworkData.vulnerabilities || [];
  const dependencies = typedNetworkData.partnerDependencies || [];
  const cascadeData = dependencies.slice(0, 3).map(dep => ({
    step: dep.partner,
    risk: dep.status === "critical" ? 80 : dep.status === "watch" ? 55 : 30,
  }));

  return (
    <div className="space-y-6">
      {/* Vulnerabilities */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            SYSTEM VULNERABILITIES
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Critical weaknesses and single points of failure
          </p>
        </div>

        <div className="space-y-4">
          {vulnerabilities.map((vuln, index) => (
            <div key={`${vuln.node}-${index}`} className="border border-terminal-border rounded p-4 bg-terminal-surface">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-mono text-sm font-semibold text-terminal-text">
                      {vuln.node}
                    </h4>
                    <StatusBadge 
                      variant={vuln.risk >= 70 ? "critical" : "warning"}
                    >
                      Risk: {vuln.risk}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-terminal-muted font-mono">
                    {vuln.description}
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-16 h-2 bg-terminal-border rounded">
                    <div 
                      className={`h-full rounded ${vuln.risk >= 70 ? 'bg-terminal-red' : 'bg-terminal-orange'}`}
                      style={{ width: `${vuln.risk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Dependencies */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            PARTNER DEPENDENCIES
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            External partnerships and dependency chains
          </p>
        </div>

        <div className="space-y-4">
          {dependencies.map((dep, index) => (
            <div key={`${dep.partner}-${index}`} className="border border-terminal-border rounded p-4 bg-terminal-surface">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-mono text-sm font-semibold text-terminal-text">
                      {dep.partner}
                    </h4>
                    <StatusBadge 
                      variant={
                        dep.status === 'critical' ? "critical" : 
                        dep.status === 'watch' ? "warning" : "good"
                      }
                    >
                      {dep.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-terminal-muted font-mono">
                    Dependency: {dep.dependency}
                  </p>
                </div>
                <div className="ml-4 text-xs text-terminal-muted font-mono">
                  {dep.status === 'critical' && '⚠️ High Impact'}
                  {dep.status === 'watch' && '👁️ Monitoring'}  
                  {dep.status === 'stable' && '✅ Operational'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {typedNetworkData.partnerDependencies && typedNetworkData.partnerDependencies.length > 0 && (
        <DependencyHeatmap snapshot={typedNetworkData} />
      )}

      <CascadeChart data={cascadeData} />

      {/* Dependency Matrix */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            DEPENDENCY MATRIX
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Cross-impact analysis between network components
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-terminal-border">
                <th className="text-left p-2 text-terminal-muted">Source</th>
                <th className="text-left p-2 text-terminal-muted">Target</th>
                <th className="text-left p-2 text-terminal-muted">Impact</th>
                <th className="text-left p-2 text-terminal-muted">Probability</th>
                <th className="text-left p-2 text-terminal-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {typedNetworkData.nodes.slice(0, 3).map((node: NetworkNode, i: number) => 
                typedNetworkData.nodes.slice(i + 1).map((target: NetworkNode) => (
                  <tr key={`${node.id}-${target.id}`} className="border-b border-terminal-border/30">
                    <td className="p-2 text-terminal-text">{node.name}</td>
                    <td className="p-2 text-terminal-text">{target.name}</td>
                    <td className="p-2">
                      <span className={`${node.risk > 65 ? 'text-terminal-red' : 'text-terminal-orange'}`}>
                        {node.risk.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-2 text-terminal-text">
                      {(target.risk / 100).toFixed(2)}
                    </td>
                    <td className="p-2">
                      <StatusBadge variant={node.risk > 70 ? "warning" : "good"}>
                        {node.risk > 70 ? "WATCH" : "STABLE"}
                      </StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Critical Vulns</div>
          <div className="text-2xl text-terminal-red font-mono font-bold">
            {vulnerabilities.filter((v) => v.risk >= 70).length}
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Watch Status</div>
          <div className="text-2xl text-terminal-orange font-mono font-bold">
            {dependencies.filter((d) => d.status === 'watch').length}
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Stable Deps</div>
          <div className="text-2xl text-terminal-green font-mono font-bold">
            {dependencies.filter((d) => d.status === 'stable').length}
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Total Partners</div>
          <div className="text-2xl text-terminal-text font-mono font-bold">
            {dependencies.length}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors"
          onClick={() =>
            openModal({
              title: "Export Dependencies",
              subtitle: "Partner dependency snapshot",
              sections: [
                { title: "Coverage", content: `${dependencies.length} dependencies across ${vulnerabilities.length} vulnerabilities.`, type: "definition" },
                { title: "Data Source", content: "Live provider health + partner dependency telemetry.", type: "inputs" },
                { title: "Export Payload", content: "Partner, dependency, status, timestamp for audit/export.", type: "outputs" },
              ],
            })
          }
        >
          Export Dependencies →
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors">
          View Risk Cascade
        </button>
      </div>

      <MethodologyModal {...modalProps} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}

export default function NetworkDependenciesPage() {
  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Network Analysis
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Network Dependencies
          </h1>
          <p className="text-sm text-terminal-muted">
            Partner relationships, vulnerabilities, and cross-impact dependency analysis.
          </p>
        </header>
        <NetworkDependenciesContent />
      </main>
    </MainLayout>
  );
}
