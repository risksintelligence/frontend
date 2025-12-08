 "use client";

import MainLayout from "@/components/layout/MainLayout";
import { useRasSummary } from "@/hooks/useRasSummary";
import { useMissionHighlights } from "@/hooks/useMissionHighlights";
import { usePartnersData } from "@/hooks/usePartnersData";
import { MissionHighlight } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import StatusBadge from "@/components/ui/StatusBadge";

type PartnerStatus = "active" | "watch" | "maintenance";
type ProjectStatus = "active" | "in_progress" | "completed" | "planning";

interface PartnerProject {
  name: string;
  status: ProjectStatus;
  priority: "critical" | "high" | "medium";
}

interface PartnerDetail {
  id: string;
  name: string;
  type: string;
  status: PartnerStatus;
  engagement: number;
  lastActivity: string;
  projects: PartnerProject[];
  capabilities: string[];
}


const toTitle = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function transformPartnerData(missions?: MissionHighlight[]): PartnerDetail[] {
  if (!missions?.length) return [];

  return missions.map((mission) => ({
    id: mission.id,
    name: mission.title,
    type: "Mission Partnership",
    status: mission.status === "completed" ? "active" : "watch",
    engagement: Math.min(95, Math.max(20, (mission.metric?.length || 0) * 8 + 45)),
    lastActivity: mission.updatedAt,
    projects: [
      {
        name: mission.metric,
        status: mission.status === "completed" ? "completed" : "in_progress",
        priority: mission.status === "completed" ? "medium" : "high",
      },
    ],
    capabilities: [toTitle(mission.metric)],
  }));
}

function PartnerLabsContent() {
  const { data: rasData, isLoading } = useRasSummary();
  const { data: partnerData, isLoading: partnerLoading } = useMissionHighlights();
  const { data: realPartnersData, isLoading: realPartnersLoading } = usePartnersData();
  
  // Use real partner data if available, otherwise fall back to transformed mission data
  const partners = (realPartnersData?.length || 0) > 0 ? realPartnersData : transformPartnerData(partnerData);

  if (isLoading || partnerLoading || realPartnersLoading) {
    return (
      <div className="terminal-card">
        <SkeletonLoader />
      </div>
    );
  }

  const metrics = rasData?.metrics || [];

  return (
    <div className="space-y-6">
      {/* Partner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Active Partners</div>
          <div className="text-2xl text-terminal-green font-mono font-bold">
            {(partners || []).filter((p) => p.status === "active").length}
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Avg Engagement</div>
          <div className="text-2xl text-terminal-text font-mono font-bold">
            {Math.round(
              (partners?.length || 0) > 0 ? (partners || []).reduce((sum, p) => sum + p.engagement, 0) / (partners || []).length : 0,
            )}
            %
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Active Projects</div>
          <div className="text-2xl text-terminal-orange font-mono font-bold">
            {(partners || []).reduce(
              (sum, p) =>
                sum +
                p.projects.filter(
                  (proj) => proj.status === "active" || proj.status === "in_progress",
                ).length,
              0,
            )}
          </div>
        </div>
      </div>

      {/* Partner Details */}
      {(partners || []).map((partner) => (
        <div key={partner.id} className="terminal-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
                  {partner.name}
                </h3>
                <StatusBadge 
                  variant={
                    partner.status === 'active' ? "good" : 
                    partner.status === 'watch' ? "warning" : "critical"
                  }
                >
                  {partner.status.toUpperCase()}
                </StatusBadge>
              </div>
              <p className="text-xs text-terminal-muted font-mono mb-1">
                {partner.type}
              </p>
              <p className="text-xs text-terminal-muted font-mono">
                Last Activity: {new Date(partner.lastActivity).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Engagement</div>
              <div className="text-2xl text-terminal-text font-mono font-bold">
                {partner.engagement}%
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="mb-4">
            <h4 className="text-xs text-terminal-muted font-mono uppercase mb-2">Core Capabilities</h4>
            <div className="flex flex-wrap gap-2">
              {partner.capabilities.map((capability, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 text-xs font-mono bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h4 className="text-xs text-terminal-muted font-mono uppercase mb-2">Active Projects</h4>
            <div className="space-y-2">
              {partner.projects.map((project, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-terminal-surface rounded border border-terminal-border">
                  <div className="flex-1">
                    <span className="font-mono text-sm text-terminal-text">{project.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge 
                        variant={
                          project.status === 'completed' ? "good" :
                          project.status === 'active' || project.status === 'in_progress' ? "warning" : "good"
                        }
                      >
                        {project.status.replace('_', ' ').toUpperCase()}
                      </StatusBadge>
                      <span className={`text-xs font-mono ${
                        project.priority === 'critical' ? 'text-terminal-red' :
                        project.priority === 'high' ? 'text-terminal-orange' : 'text-terminal-text'
                      }`}>
                        {project.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* RAS Metrics Integration */}
      {metrics.length > 0 && (
        <div className="terminal-card">
          <div className="mb-4">
            <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
              PARTNER IMPACT METRICS
            </h3>
            <p className="text-xs text-terminal-muted font-mono">
              Quantified partner contributions to RAS objectives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-terminal-text">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-terminal-text">{metric.value}</span>
                    <span className={`font-mono text-xs ${
                      metric.change > 0 ? 'text-terminal-green' : 'text-terminal-red'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-terminal-border rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${
                      metric.status === 'good' ? 'bg-terminal-green' :
                      metric.status === 'warning' ? 'bg-terminal-orange' : 'bg-terminal-red'
                    }`}
                    style={{ width: `${Math.min((metric.value / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors">
          Export Partner Report →
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors">
          Schedule Review
        </button>
      </div>
    </div>
  );
}

export default function PartnerLabsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Missions & Partners
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Partner Labs
          </h1>
          <p className="text-sm text-terminal-muted">
            Strategic partnerships, capability mapping, and collaborative project management.
          </p>
        </header>
        <PartnerLabsContent />
      </div>
    </MainLayout>
  );
}
