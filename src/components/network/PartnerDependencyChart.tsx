"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { NetworkSnapshot } from "@/lib/types";
import MethodologyModal, { useMethodologyModal } from "@/components/ui/MethodologyModal";

interface PartnerDependencyChartProps {
  networkData: NetworkSnapshot;
  timestamp?: string;
}

export default function PartnerDependencyChart({ networkData, timestamp }: PartnerDependencyChartProps) {
  const dependencies = networkData.partnerDependencies || [];
  const { isOpen, openModal, closeModal, modalProps } = useMethodologyModal();

  const getStatusVariant = (status: "stable" | "watch" | "critical") => {
    switch (status) {
      case "stable": return "good";
      case "watch": return "warning";
      case "critical": return "critical";
      default: return "info";
    }
  };

  const getStatusColor = (status: "stable" | "watch" | "critical") => {
    switch (status) {
      case "stable": return "text-terminal-green";
      case "watch": return "text-terminal-orange";
      case "critical": return "text-terminal-red";
      default: return "text-terminal-muted";
    }
  };

  return (
    <section className="terminal-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Partner Network
          </p>
          <h3 className="text-sm font-semibold uppercase text-terminal-text">
            Dependency Status Monitor
          </h3>
        </div>
        <StatusBadge variant="info">
          {dependencies.length} TRACKED
        </StatusBadge>
      </div>

      <div className="space-y-3">
        {dependencies.map((dep, index) => (
          <div
            key={`${dep.partner}-${index}`}
            className="flex items-center justify-between rounded border border-terminal-border bg-terminal-bg px-3 py-2"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    dep.status === "stable"
                      ? "bg-terminal-green"
                      : dep.status === "watch"
                        ? "bg-terminal-orange"
                        : "bg-terminal-red"
                  }`}
                />
                <p className="text-sm font-semibold text-terminal-text font-mono">
                  {dep.partner}
                </p>
              </div>
              <p className="text-xs text-terminal-muted font-mono mt-1">
                {dep.dependency}
              </p>
            </div>
            <StatusBadge variant={getStatusVariant(dep.status)}>
              {dep.status.toUpperCase()}
            </StatusBadge>
          </div>
        ))}
        
        {dependencies.length === 0 && (
          <p className="text-sm text-terminal-muted font-mono">
            No partner dependencies currently tracked.
          </p>
        )}
      </div>

      {dependencies.length > 0 && (
        <div className="bg-terminal-surface rounded border border-terminal-border p-3">
          <p className="text-xs uppercase tracking-wide text-terminal-muted font-mono mb-2">
            Status Summary
          </p>
          <div className="grid grid-cols-3 gap-4">
            {["stable", "watch", "critical"].map(status => {
              const count = dependencies.filter(d => d.status === status).length;
              const color = getStatusColor(status as "stable" | "watch" | "critical");
              
              return (
                <div key={status} className="text-center">
                  <p className={`text-lg font-bold font-mono ${color}`}>
                    {count}
                  </p>
                  <p className="text-xs text-terminal-muted font-mono uppercase">
                    {status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-terminal-border pt-2">
        <p className="text-xs text-terminal-muted font-mono">
          Data: Live Data · Updated {timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()} UTC
        </p>
        <button
          className="text-xs text-terminal-green hover:text-terminal-text font-mono transition-colors"
          onClick={() =>
            openModal({
              title: "Dependency Drivers",
              subtitle: "Partner dependency risk context",
              sections: [
                {
                  title: "Stable/Watch/Critical",
                  content: (
                    <ul className="list-disc pl-4 space-y-1">
                      {["stable", "watch", "critical"].map((status) => (
                        <li key={status}>
                          {status.toUpperCase()}: {dependencies.filter((d) => d.status === status).length} partners
                        </li>
                      ))}
                    </ul>
                  ),
                  type: "definition",
                },
                {
                  title: "Top Dependencies",
                  content:
                    dependencies.length > 0
                      ? dependencies.slice(0, 5).map((d, idx) => (
                          <div key={idx}>
                            {d.partner} → {d.dependency} ({d.status})
                          </div>
                        ))
                      : "No partner dependencies reported.",
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
