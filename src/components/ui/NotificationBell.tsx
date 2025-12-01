"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, SlidersHorizontal } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { useAlerts } from "@/hooks/useAlerts";

interface Notification {
  id: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
}

export default function NotificationBell() {
  const { data: riskData } = useRiskOverview();
  const { data: alertsData } = useAlerts();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [deltaThreshold, setDeltaThreshold] = useState<number>(() => {
    try {
      if (typeof window !== "undefined") {
        const savedDelta = localStorage.getItem("rrio_notif_delta_threshold");
        if (savedDelta) return parseFloat(savedDelta);
      }
    } catch {
      //
    }
    return 5;
  });
  const [driftThreshold, setDriftThreshold] = useState<number>(() => {
    try {
      if (typeof window !== "undefined") {
        const savedDrift = localStorage.getItem("rrio_notif_drift_threshold");
        if (savedDrift) return parseFloat(savedDrift);
      }
    } catch {
      //
    }
    return 10;
  });
  const [readAllAt, setReadAllAt] = useState<number>(() => {
    try {
      if (typeof window !== "undefined") {
        const savedRead = sessionStorage.getItem("rrio_notif_read_all_at");
        if (savedRead) return parseFloat(savedRead);
      }
    } catch {
      //
    }
    return 0;
  });

  // Persist thresholds
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("rrio_notif_delta_threshold", String(deltaThreshold));
        localStorage.setItem("rrio_notif_drift_threshold", String(driftThreshold));
      }
    } catch {
      // ignore storage issues
    }
  }, [deltaThreshold, driftThreshold]);

  useEffect(() => {
    const nextNotifs: Notification[] = [];
    const delta = riskData?.overview?.change_24h ?? 0;
    if (Math.abs(delta) >= deltaThreshold) {
      nextNotifs.push({
        id: `delta-${Date.now()}`,
        message: `ΔGRII ${delta >= 0 ? "+" : ""}${delta.toFixed(2)} pts in 24h`,
        severity: Math.abs(delta) >= deltaThreshold * 1.5 ? "high" : "medium",
        timestamp: new Date().toISOString(),
      });
    }

    const drift = riskData?.overview?.drift ?? 0;
    if (Math.abs(drift) >= driftThreshold) {
      nextNotifs.push({
        id: `drift-${Date.now()}`,
        message: `Drift breach: ${drift.toFixed(2)} pts`,
        severity: Math.abs(drift) >= driftThreshold * 1.5 ? "high" : "medium",
        timestamp: new Date().toISOString(),
      });
    }

    const anomalies = alertsData?.anomalies || [];
    anomalies.slice(0, 3).forEach((a, idx) => {
      nextNotifs.push({
        id: `alert-${idx}-${a.timestamp}`,
        message: a.message || "New anomaly detected",
        severity: a.severity ?? "medium",
        timestamp: a.timestamp,
      });
    });

    const nextKey = JSON.stringify(nextNotifs);
    if (JSON.stringify(notifications) !== nextKey) {
      // microtask to avoid sync setState warning
      Promise.resolve().then(() => setNotifications(nextNotifs));
    }
  }, [riskData, alertsData, deltaThreshold, driftThreshold]);

  const unread = useMemo(() => {
    return notifications.filter((n) => new Date(n.timestamp).getTime() > readAllAt).length;
  }, [notifications, readAllAt]);

  const markAllRead = () => {
    const now = Date.now();
    setReadAllAt(now);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("rrio_notif_read_all_at", String(now));
      }
    } catch {
      // ignore storage issues
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 rounded border border-terminal-border px-3 py-2 text-xs font-mono text-terminal-text hover:bg-terminal-surface"
      >
        <Bell className="w-4 h-4" />
        <span>Alerts</span>
        {unread > 0 && <StatusBadge variant="warning">{unread}</StatusBadge>}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded border border-terminal-border bg-terminal-bg shadow-lg z-50">
          <div className="p-3 border-b border-terminal-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-wide text-terminal-muted">Notifications</p>
              <button
                onClick={() => setShowSettings((s) => !s)}
                className="text-terminal-muted hover:text-terminal-text"
                aria-label="Threshold settings"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={markAllRead}
              className="text-[11px] text-terminal-green hover:text-terminal-text font-mono"
            >
              Mark all read
            </button>
          </div>
          {showSettings && (
            <div className="p-3 border-b border-terminal-border space-y-2 bg-terminal-surface/60">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-terminal-muted font-mono">ΔGRII threshold</label>
                <input
                  type="number"
                  value={deltaThreshold}
                  onChange={(e) => setDeltaThreshold(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-terminal-bg border border-terminal-border text-xs px-2 py-1 rounded font-mono"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-terminal-muted font-mono">Drift threshold</label>
                <input
                  type="number"
                  value={driftThreshold}
                  onChange={(e) => setDriftThreshold(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-terminal-bg border border-terminal-border text-xs px-2 py-1 rounded font-mono"
                />
              </div>
              <p className="text-[11px] text-terminal-muted font-mono">
                Unread counter persists this session; thresholds persist in local storage.
              </p>
            </div>
          )}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-terminal-muted p-3">No alerts.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="border-b border-terminal-border p-3">
                  <div className="flex items-center justify-between">
                    <StatusBadge variant={n.severity === "critical" ? "critical" : n.severity === "high" ? "warning" : "info"}>
                      {n.severity.toUpperCase()}
                    </StatusBadge>
                    <span className="text-[10px] text-terminal-muted font-mono">
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-terminal-text font-mono mt-1">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
