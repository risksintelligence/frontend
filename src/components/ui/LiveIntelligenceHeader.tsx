"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { HelpCircle } from "lucide-react";

interface LiveIntelligenceHeaderProps {
  onShowTour?: () => void;
}

export default function LiveIntelligenceHeader({ onShowTour }: LiveIntelligenceHeaderProps) {
  const { data } = useRiskOverview();

  return (
    <div className="border-b border-terminal-border bg-terminal-bg px-6 py-4">
      {/* Live Intelligence Frame */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-terminal-muted">
            Live Intelligence
          </p>
          <h2 className="text-xl font-bold text-terminal-text">
            GRII + RRIO Situational Awareness
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {onShowTour && (
            <button
              onClick={onShowTour}
              className="flex items-center gap-2 rounded px-3 py-1 text-xs text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
              title="Take guided tour"
            >
              <HelpCircle className="w-4 h-4" />
              Take Tour
            </button>
          )}
          <StatusBadge variant="info">
            {data?.overview?.updated_at
              ? `Updated ${new Date(data.overview.updated_at).toLocaleTimeString()} UTC`
              : "Awaiting data"}
          </StatusBadge>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 text-xs text-terminal-muted mt-3">
        <span>Live Data Feed</span>
        <span>Updates Every 30 Seconds</span>
        <span>Global Economic Resilience Monitor</span>
      </div>
    </div>
  );
}