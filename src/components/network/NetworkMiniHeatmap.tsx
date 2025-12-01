"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { getAccessibilityPattern, getRiskTextColor } from "@/lib/risk-colors";
import { NetworkSnapshot } from "@/lib/types";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";

interface NetworkMiniHeatmapProps {
  networkData: NetworkSnapshot;
  timestamp?: string;
}

export default function NetworkMiniHeatmap({ networkData, timestamp }: NetworkMiniHeatmapProps) {
  const nodes = networkData.nodes || [];
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();
  
  // Group nodes by sector for visualization
  const nodesBySector = nodes.reduce((acc, node) => {
    if (!acc[node.sector]) {
      acc[node.sector] = [];
    }
    acc[node.sector].push(node);
    return acc;
  }, {} as Record<string, typeof nodes>);

  const getSectorColor = (sector: string) => {
    // Following visualization rules: supply chain nodes use blue outlines, 
    // financial nodes use emerald, macro/policy nodes use amber/orange
    switch (sector.toLowerCase()) {
      case "supply chain":
      case "energy":
        return "border-sky-700";
      case "finance":
        return "border-emerald-700";
      case "macro":
      case "policy":
        return "border-orange-700";
      default:
        return "border-terminal-border";
    }
  };

  const getSectorBgColor = (sector: string) => {
    switch (sector.toLowerCase()) {
      case "supply chain":
      case "energy":
        return "bg-sky-50";
      case "finance":
        return "bg-emerald-50";
      case "macro":
      case "policy":
        return "bg-orange-50";
      default:
        return "bg-terminal-surface";
    }
  };

  const averageRisk = nodes.length > 0 ? 
    nodes.reduce((sum, node) => sum + node.risk, 0) / nodes.length : 0;

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Network Topology
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Risk Heatmap Overview
          </h3>
        </div>
        <StatusBadge variant={averageRisk >= 60 ? "critical" : averageRisk >= 40 ? "warning" : "good"}>
          ∅ {averageRisk.toFixed(1)} AVG
        </StatusBadge>
      </div>

      <div className="space-y-3">
        {Object.entries(nodesBySector).map(([sector, sectorNodes]) => {
          const sectorAvgRisk = sectorNodes.reduce((sum, node) => sum + node.risk, 0) / sectorNodes.length;
          const sectorColor = getSectorColor(sector);
          const sectorBgColor = getSectorBgColor(sector);

          return (
            <div key={sector} className={`${sectorBgColor} rounded border-2 ${sectorColor} p-3`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-terminal-text font-mono uppercase">
                  {sector}
                </p>
                <p className={`text-sm font-bold font-mono ${getRiskTextColor(sectorAvgRisk)}`}>
                  {sectorAvgRisk.toFixed(1)}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {sectorNodes.map((node) => {
                  const riskColor = getRiskTextColor(node.risk);
                  const accessibilityPattern = getAccessibilityPattern(node.risk);

                  return (
                    <div
                      key={node.id}
                      className="bg-terminal-bg border border-terminal-border rounded p-2 hover:bg-terminal-surface transition-colors"
                      title={`${node.name}: ${node.risk} risk score`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-mono ${riskColor}`}>
                          {accessibilityPattern}
                        </span>
                        <p className="text-xs font-mono text-terminal-text truncate">
                          {node.name.split(' ')[0]}
                        </p>
                      </div>
                      <p className={`text-sm font-bold font-mono ${riskColor}`}>
                        {node.risk}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {networkData.criticalPaths && networkData.criticalPaths.length > 0 && (
        <div className="bg-terminal-surface rounded border border-terminal-border p-3">
          <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono mb-2">
            Critical Paths
          </p>
          {networkData.criticalPaths.map((path, index) => (
            <p key={index} className="text-xs text-terminal-text font-mono">
              • {path}
            </p>
          ))}
        </div>
      )}

      <div className="border-t border-terminal-border pt-2">
        <p className="text-xs text-terminal-muted font-mono mb-1">
          {networkData.summary}
        </p>
        <p className="text-xs text-terminal-muted font-mono">
          Data: Live Data · Updated {timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
        </p>
        <button
          className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors"
          onClick={() =>
            openModal({
              title: "Network Drivers",
              subtitle: "Critical paths and vulnerabilities",
              sections: [
                {
                  title: "Critical Paths",
                  content:
                    networkData.criticalPaths?.length
                      ? networkData.criticalPaths.map((p, idx) => <div key={idx}>• {p}</div>)
                      : "No critical paths reported.",
                  type: "process",
                },
                {
                  title: "Vulnerabilities",
                  content:
                    networkData.vulnerabilities?.length
                      ? networkData.vulnerabilities.slice(0, 5).map((v, idx) => (
                          <div key={idx}>
                            {v.node}: {v.description} (risk {v.risk})
                          </div>
                        ))
                      : "No vulnerabilities detected.",
                  type: "outputs",
                },
              ],
            })
          }
        >
          Explain Drivers →
        </button>
      </div>
      <MethodologyModal {...modalProps} isOpen={isOpen} onClose={closeModal} />
    </section>
  );
}
