"use client";

import { useState, useEffect, useRef } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useAlerts } from "@/hooks/useAlerts";
import { useMissionHighlights } from "@/hooks/useMissionHighlights";
import { useNewsroomBriefs } from "@/hooks/useNewsroomBriefs";
import { Alert, MissionHighlight, NewsroomBrief } from "@/lib/types";

export default function RightRail() {
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: missions, isLoading: missionsLoading } = useMissionHighlights();
  const { data: briefs, isLoading: briefsLoading } = useNewsroomBriefs();

  // State for collapsible behavior; hydrate from localStorage after mount to avoid SSR mismatch
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastAlertCountRef = useRef(0);

  useEffect(() => {
    // Use a microtask to avoid synchronous setState within effect
    Promise.resolve().then(() => {
      const saved = typeof window !== "undefined" ? localStorage.getItem("rightRailCollapsed") : null;
      if (saved) {
        setIsCollapsed(JSON.parse(saved));
      }
    });
  }, []);

  // Auto-show when new alerts arrive
  useEffect(() => {
    if (Array.isArray(alerts?.anomalies)) {
      const currentAlertCount = alerts.anomalies.length;
      if (currentAlertCount > lastAlertCountRef.current && lastAlertCountRef.current > 0 && isCollapsed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsCollapsed(false);
        localStorage.setItem("rightRailCollapsed", "false");
      }
      lastAlertCountRef.current = currentAlertCount;
    }
  }, [alerts?.anomalies, isCollapsed]);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('rightRailCollapsed', JSON.stringify(newCollapsedState));
  };

  return (
    <aside className={`hidden border-l border-terminal-border bg-terminal-surface/50 lg:flex lg:flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      {isCollapsed ? (
        <div className="p-2">
          <button
            onClick={toggleCollapse}
            className="flex w-full items-center justify-center rounded p-2 text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
            title="Expand alert ticker"
          >
            <span className="text-lg">←</span>
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <section className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-terminal-muted">
              <span>Alert Ticker</span>
              <div className="flex items-center gap-2">
                <StatusBadge variant="warning">Live Feed</StatusBadge>
                <button
                  onClick={toggleCollapse}
                  className="rounded p-1 text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
                  title="Collapse alert ticker"
                >
                  →
                </button>
              </div>
            </div>
        <div className="space-y-3">
          {alertsLoading ? (
            <SkeletonLoader variant="card" className="h-16" />
          ) : Array.isArray(alerts?.anomalies) ? alerts.anomalies.slice(0, 3).map((alert: Alert, idx: number) => (
            <article key={alert.id || alert.timestamp || idx} className="rounded border border-terminal-border bg-terminal-bg p-3">
              <p className="text-[11px] uppercase tracking-wide text-terminal-muted">
                {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : "N/A"} · {alert.classification?.toUpperCase() || 'ANOMALY'}
              </p>
              <p className="text-sm font-semibold text-terminal-text">
                Score: {alert.score?.toFixed(1)} - {alert.drivers?.join(', ') || 'Risk anomaly detected'}
              </p>
            </article>
          )) : null}
          {!alertsLoading && (!Array.isArray(alerts?.anomalies) || alerts.anomalies.length === 0) && (
            <p className="text-xs text-terminal-muted">
              No current anomalies detected. Real-time anomaly feed will appear here.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-terminal-muted">
          <span>Mission Activation</span>
          <StatusBadge variant="good">RRIO</StatusBadge>
        </div>
        <div className="space-y-3">
          {missionsLoading ? (
            <SkeletonLoader variant="card" className="h-20" />
          ) : missions?.map((mission: MissionHighlight) => (
            <article key={mission.id} className="rounded border border-terminal-border bg-terminal-bg p-3">
              <p className="text-xs font-semibold text-terminal-text">
                {mission.title}
              </p>
              <p className="text-xs text-terminal-muted">
                Status: {mission.status?.toUpperCase() || "UNKNOWN"} · {mission.metric}
              </p>
              <p className="text-[11px] text-terminal-muted">
                {new Date(mission.updatedAt).toLocaleTimeString()} UTC
              </p>
            </article>
          ))}
          {!missionsLoading && !missions?.length && (
            <p className="text-xs text-terminal-muted">
              No active missions. Mission highlights will appear here when available.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-terminal-muted">
          Newsroom Briefs
        </p>
        <div className="space-y-2">
          {briefsLoading ? (
            <SkeletonLoader variant="card" className="h-24" />
          ) : briefs?.briefs?.map((brief: NewsroomBrief) => (
            <article key={brief.id} className="rounded border border-terminal-border bg-terminal-bg p-3">
              <p className="text-sm font-semibold text-terminal-text">
                {brief.headline}
              </p>
              <p className="text-[11px] text-terminal-muted">
                {brief.author} · {new Date(brief.timestamp).toLocaleTimeString()}
              </p>
              {brief.link && (
                <a
                  href={brief.link}
                  className="text-xs font-semibold text-terminal-text underline"
                >
                  Open brief
                </a>
              )}
            </article>
          ))}
          {!briefsLoading && !briefs?.briefs?.length && (
            <p className="text-xs text-terminal-muted">
              No newsroom briefs available. Newsletter updates will appear here.
            </p>
          )}
        </div>
      </section>
        </div>
      )}
    </aside>
  );
}
