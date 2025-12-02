"use client";

import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRiskOverview } from "@/hooks/useRiskOverview";
import { HelpCircle } from "lucide-react";
import NotificationBell from "@/components/ui/NotificationBell";
import AboutRRIOButtons from "@/components/ui/AboutRRIOButtons";

interface HeaderProps {
  onShowTour?: () => void;
}

export default function Header({ onShowTour }: HeaderProps) {
  const { data } = useRiskOverview();
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-terminal-border bg-terminal-bg/90 px-6 py-4 backdrop-blur">
      {/* Top branding bar */}
      <div className="flex items-center justify-between">
        <Link href="/risk" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-6 h-6 text-terminal-accent">
              <g clipPath="url(#a)">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h16v16H0z"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-terminal-text font-mono">
              RiskSX
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-terminal-muted">
              Observatory Intelligence
            </p>
          </div>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <AboutRRIOButtons />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/my-desk"
            className="flex items-center gap-1 rounded border border-terminal-border px-2 py-1 text-xs font-mono text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="hidden sm:inline">My Desk</span>
          </Link>
          <NotificationBell />
        </div>
      </div>

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
      
      <div className="flex flex-wrap gap-3 text-xs text-terminal-muted">
        <span>Live Data Feed</span>
        <span>Updates Every 30 Seconds</span>
        <span>Global Economic Resilience Monitor</span>
      </div>
    </header>
  );
}
