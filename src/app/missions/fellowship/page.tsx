 "use client";

import MainLayout from "@/components/layout/MainLayout";
import { useMissionHighlights } from "@/hooks/useMissionHighlights";
import { usePartnersData } from "@/hooks/usePartnersData";
import StatusBadge from "@/components/ui/StatusBadge";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

function InsightFellowshipContent() {
  const { data: missionsData, isLoading } = useMissionHighlights();
  const { data: partnersData, isLoading: partnersLoading } = usePartnersData();

  if (isLoading || partnersLoading) {
    return <SkeletonLoader variant="table" rows={4} />;
  }

  // Transform partner data to fellowship timeline format
  const fellowshipTimeline = partnersData && partnersData.length > 0 
    ? partnersData.map((partner) => ({
        id: partner.id,
        title: `${partner.name} Program`,
        date: partner.lastActivity,
        status: partner.status === 'active' ? 'active' : 'completed',
        description: `Partnership delivering ${partner.projects?.length || 0} active projects in ${partner.capabilities?.join(', ') || 'research collaboration'}.`,
        participants: Math.round(partner.engagement / 5), // Convert engagement % to participant count
        deliverables: partner.capabilities || []
      }))
    : missionsData?.map((mission) => ({
        id: mission.id,
        title: mission.title,
        date: mission.updatedAt,
        status: mission.status,
        description: mission.metric,
        participants: Math.min(15, Math.max(3, mission.metric?.split(' ').length || 5)), // Based on metric complexity
        deliverables: mission.metric ? [mission.metric] : ["Research Framework"]
      })) || [];

  // Transform partner projects to fellowship project format
  const fellowProjects = partnersData?.flatMap((partner) =>
    partner.projects?.map((project, projIndex) => ({
      id: `${partner.id}-${projIndex}`,
      title: project.name,
      fellow: `${partner.name} Team`,
      institution: partner.type.replace(' Partnership', ''),
      track: partner.capabilities?.[0] || 'Research',
      status: project.status,
      progress: project.status === 'completed' ? 100 : 
               project.status === 'active' || project.status === 'in_progress' ? 75 : 25,
      description: `${partner.name} project focused on ${project.name.toLowerCase()} with ${project.priority} priority level.`,
      timeline: project.status === 'completed' ? 'Completed' :
                project.status === 'planning' ? '6 months remaining' : '3 months remaining',
      impact: project.priority === 'critical' ? 'High - Core GRII enhancement' :
              project.priority === 'high' ? 'High - Financial stability insights' : 'Medium - Operational efficiency'
    })) || []
  ) || [];

  return (
    <div className="space-y-6">
      {/* Fellowship Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Active Fellows</div>
          <div className="text-2xl text-terminal-green font-mono font-bold">
            {fellowProjects.filter(p => p.status === 'active' || p.status === 'in_progress').length}
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Completed Projects</div>
          <div className="text-2xl text-terminal-text font-mono font-bold">
            {fellowProjects.filter(p => p.status === 'completed').length}
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">Avg Progress</div>
          <div className="text-2xl text-terminal-orange font-mono font-bold">
            {Math.round(fellowProjects.reduce((sum, p) => sum + p.progress, 0) / fellowProjects.length)}%
          </div>
        </div>
        <div className="terminal-card">
          <div className="text-xs text-terminal-muted font-mono uppercase mb-1">High Impact</div>
          <div className="text-2xl text-terminal-red font-mono font-bold">
            {fellowProjects.filter(p => p.impact.startsWith('High')).length}
          </div>
        </div>
      </div>

      {/* Fellowship Timeline */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            FELLOWSHIP TIMELINE
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Cohort milestones and program evolution
          </p>
        </div>

        <div className="space-y-4">
          {fellowshipTimeline.map((milestone, index) => (
            <div key={milestone.id} className="relative">
              {index < fellowshipTimeline.length - 1 && (
                <div className="absolute left-3 top-8 w-px h-16 bg-terminal-border"></div>
              )}
              
              <div className="flex gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  milestone.status === 'completed' ? 'bg-terminal-green border-terminal-green' :
                  milestone.status === 'active' ? 'bg-terminal-orange border-terminal-orange' :
                  'bg-terminal-border border-terminal-border'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-terminal-text">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-terminal-muted font-mono">
                        {new Date(milestone.date).toLocaleDateString()} • {milestone.participants} participants
                      </p>
                    </div>
                    <StatusBadge 
                      variant={
                        milestone.status === 'completed' ? "good" :
                        milestone.status === 'active' ? "warning" : "good"
                      }
                    >
                      {milestone.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                  
                  <p className="text-xs text-terminal-text font-mono mb-2">
                    {milestone.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {milestone.deliverables.map((deliverable, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs font-mono bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded"
                      >
                        {deliverable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Fellow Projects */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            FELLOW PROJECTS
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Individual research initiatives and deliverables
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {fellowProjects.map((project) => (
            <div key={project.id} className="border border-terminal-border rounded p-4 bg-terminal-surface">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-mono text-sm font-semibold text-terminal-text">
                      {project.title}
                    </h4>
                    <StatusBadge 
                      variant={
                        project.status === 'completed' ? "good" :
                        project.status === 'active' || project.status === 'in_progress' ? "warning" : "good"
                      }
                    >
                      {project.status.replace('_', ' ').toUpperCase()}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-terminal-muted font-mono mb-1">
                    {project.fellow} • {project.institution}
                  </p>
                  <p className="text-xs text-terminal-muted font-mono">
                    Track: {project.track}
                  </p>
                </div>
              </div>

              <p className="text-xs text-terminal-text font-mono mb-3">
                {project.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-terminal-muted font-mono">Progress</span>
                  <span className="text-xs text-terminal-text font-mono">{project.progress}%</span>
                </div>
                <div className="w-full bg-terminal-border rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${
                      project.progress === 100 ? 'bg-terminal-green' :
                      project.progress >= 60 ? 'bg-terminal-orange' : 'bg-terminal-red'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-terminal-muted font-mono">{project.timeline}</span>
                  <span className={`text-xs font-mono ${
                    project.impact.startsWith('High') ? 'text-terminal-red' :
                    project.impact.startsWith('Medium') ? 'text-terminal-orange' : 'text-terminal-text'
                  }`}>
                    {project.impact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Metrics */}
      <div className="terminal-card">
        <div className="mb-4">
          <h3 className="font-semibold text-terminal-text font-mono text-sm uppercase">
            PROGRAM IMPACT METRICS
          </h3>
          <p className="text-xs text-terminal-muted font-mono">
            Quantified outcomes and research contributions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Research Papers</div>
            <div className="text-2xl text-terminal-text font-mono font-bold">7</div>
            <div className="text-xs text-terminal-green font-mono">+2 this quarter</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Model Improvements</div>
            <div className="text-2xl text-terminal-text font-mono font-bold">12</div>
            <div className="text-xs text-terminal-green font-mono">+4 deployed</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Academic Partners</div>
            <div className="text-2xl text-terminal-text font-mono font-bold">8</div>
            <div className="text-xs text-terminal-orange font-mono">2 new this year</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-terminal-muted font-mono uppercase">Alumni Network</div>
            <div className="text-2xl text-terminal-text font-mono font-bold">23</div>
            <div className="text-xs text-terminal-text font-mono">across 3 cohorts</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-sm hover:bg-terminal-green/30 transition-colors">
          Export Program Report →
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-terminal-muted border border-terminal-border rounded font-mono text-sm hover:bg-terminal-surface transition-colors">
          View Alumni Network
        </button>
      </div>
    </div>
  );
}

export default function InsightFellowshipPage() {
  return (
    <MainLayout>
      <main className="space-y-6 px-6 py-6">
        <header>
          <p className="text-xs uppercase tracking-wide text-terminal-muted">
            Missions & Partners
          </p>
          <h1 className="text-2xl font-bold uppercase text-terminal-text">
            Insight Fellowship
          </h1>
          <p className="text-sm text-terminal-muted">
            Academic research program timelines, fellow progress tracking, and program impact metrics.
          </p>
        </header>
        <InsightFellowshipContent />
      </main>
    </MainLayout>
  );
}
