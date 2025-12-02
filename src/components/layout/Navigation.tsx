"use client";

import Link from "next/link";
import React, { useState } from "react";
import { 
  TrendingUp, 
  Network, 
  BarChart3, 
  Lightbulb, 
  Activity, 
  Shield, 
  Users
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Risk Intelligence",
    icon: TrendingUp,
    links: [
      { label: "Overview", href: "/risk" },
      { label: "Risk Factors", href: "/risk/factors" },
      { label: "Market Intelligence", href: "/risk/intelligence" },
    ],
  },
  {
    title: "Network Analysis",
    icon: Network,
    links: [
      { label: "Overview", href: "/network" },
      { label: "Topology", href: "/network/topology" },
      { label: "Dependencies", href: "/network/dependencies" },
      { label: "Supply Chain Cascade", href: "/network/supply-cascade" },
      { label: "Critical Path Analysis", href: "/network/critical-paths" },
      { label: "Sector Vulnerability", href: "/network/sector-vulnerability" },
      { label: "Resilience Metrics", href: "/network/resilience-metrics" },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    links: [
      { label: "Overview", href: "/analytics" },
      { label: "Economic Intelligence", href: "/analytics/economic" },
      { label: "Forecasts", href: "/analytics/forecasts" },
      { label: "Scenario Studio", href: "/analytics/scenarios" },
      { label: "Correlations", href: "/analytics/correlations" },
    ],
  },
  {
    title: "Explainability",
    icon: Lightbulb,
    links: [
      { label: "SHAP Analysis", href: "/explainability/shap" },
      { label: "LIME Analysis", href: "/explainability/lime" },
    ],
  },
  {
    title: "Simulation & Modeling",
    icon: Activity,
    links: [
      { label: "Overview", href: "/simulation" },
      { label: "Monte Carlo", href: "/simulation/monte-carlo" },
      { label: "Stress Testing", href: "/simulation/stress" },
    ],
  },
  {
    title: "Transparency",
    icon: Shield,
    links: [
      { label: "Data Quality", href: "/transparency" },
      { label: "Data Sources", href: "/transparency/lineage" },
      { label: "Governance & Compliance", href: "/transparency/governance" },
      { label: "Research Downloads", href: "/transparency/downloads" },
    ],
  },
  {
    title: "Community",
    icon: Users,
    links: [
      { label: "Risk Intelligence", href: "/community" },
    ],
  },
];

export default function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroupExpansion = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isGroupExpanded = (groupTitle: string) => expandedGroups.includes(groupTitle);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex items-center justify-between border-b border-terminal-border bg-terminal-bg p-4 lg:hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-terminal-muted">RRIO</p>
          <h1 className="text-sm font-bold text-terminal-text">Observatory</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded p-2 text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed left-0 top-0 h-full w-64 border-r border-terminal-border bg-terminal-bg p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-terminal-muted">RRIO</p>
                  <h1 className="text-lg font-bold text-terminal-text">Observatory Dashboard</h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded p-1 text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <button
                    onClick={() => toggleGroupExpansion(group.title)}
                    className="flex w-full items-center justify-between rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
                  >
                    <span>{group.title}</span>
                    <span className="text-sm">
                      {isGroupExpanded(group.title) ? "▼" : "▶"}
                    </span>
                  </button>
                  {isGroupExpanded(group.title) && (
                    <div className="mt-2 space-y-1">
                      {group.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block rounded px-3 py-2 text-sm font-semibold text-terminal-text transition hover:bg-terminal-surface"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className={`hidden flex-none border-r border-terminal-border bg-terminal-bg p-6 lg:block transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-terminal-muted">
                  RRIO
                </p>
                <h1 className="text-lg font-bold text-terminal-text">
                  Observatory Dashboard
                </h1>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded p-1 text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
              title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {isCollapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        <div className={isCollapsed ? "space-y-2" : "space-y-6"}>
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              {isCollapsed ? (
                <div className="flex justify-center">
                  <Link
                    href={group.links[0].href}
                    className="flex items-center justify-center rounded p-2 text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors w-8 h-8"
                    title={group.title}
                  >
                    {React.createElement(group.icon, { className: "w-4 h-4" })}
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => toggleGroupExpansion(group.title)}
                    className="flex w-full items-center justify-between rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide text-terminal-muted hover:bg-terminal-surface hover:text-terminal-text transition-colors"
                  >
                    <span>{group.title}</span>
                    <span className="text-sm">
                      {isGroupExpanded(group.title) ? "▼" : "▶"}
                    </span>
                  </button>
                  {isGroupExpanded(group.title) && (
                    <div className="mt-2 space-y-1">
                      {group.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block rounded px-3 py-2 text-sm font-semibold text-terminal-text transition hover:bg-terminal-surface"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
