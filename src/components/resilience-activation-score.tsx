import { semanticColors } from '../lib/theme';

interface RASComponent {
  policy_citations: number;
  mission_enrollments: number;
  partner_deployments: number;
  media_mentions: number;
}

interface SectorBreakdown {
  sector: string;
  activation: number;
  delta: number;
}

interface Props {
  composite?: number;
  components?: RASComponent;
  priorPeriod?: number;
  sectorBreakdowns?: SectorBreakdown[];
  fellowshipCohorts?: { name: string; participants: number }[];
}

const defaultSectors: SectorBreakdown[] = [
  { sector: 'AI for Education', activation: 0.72, delta: 0.05 },
  { sector: 'Financial Resilience', activation: 0.68, delta: -0.02 },
  { sector: 'Supply Chain Intelligence', activation: 0.65, delta: 0.08 }
];

const defaultCohorts = [
  { name: 'Q4 2024 Fellows', participants: 12 },
  { name: 'Alumni Network', participants: 47 }
];

export default function ResilienceActivationScore({ 
  composite = 0.68,
  components = {
    policy_citations: 23,
    mission_enrollments: 156,
    partner_deployments: 8,
    media_mentions: 34
  },
  priorPeriod = 0.62,
  sectorBreakdowns = defaultSectors,
  fellowshipCohorts = defaultCohorts
}: Props) {
  const delta = composite - priorPeriod;
  const deltaPercent = (delta / priorPeriod) * 100;
  
  const getMomentumColor = () => {
    if (delta > 0.05) return semanticColors.minimalRisk;
    if (delta > 0) return semanticColors.moderateRisk;
    return semanticColors.criticalRisk;
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
          Resilience Activation Score
        </h3>
        <span 
          className="text-xs px-2 py-1 rounded font-medium"
          style={{ 
            backgroundColor: getMomentumColor() + '20',
            color: getMomentumColor()
          }}
        >
          {delta > 0 ? '↗' : '↘'} {deltaPercent > 0 ? '+' : ''}{deltaPercent.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-4">
        {/* Main Score */}
        <div className="text-center">
          <p 
            className="text-4xl font-bold"
            style={{ color: getMomentumColor() }}
          >
            {composite.toFixed(2)}
          </p>
          <p className="text-xs text-[#64748b]">
            Rolling RAS Value | Prior: {priorPeriod.toFixed(2)}
          </p>
        </div>

        {/* Component Metrics */}
        <div>
          <h4 className="text-xs font-semibold text-[#475569] mb-2">Component Metrics</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748b]">Policy Citations</span>
              <span className="font-medium">{components.policy_citations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Mission Enrollments</span>
              <span className="font-medium">{components.mission_enrollments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Partner Deployments</span>
              <span className="font-medium">{components.partner_deployments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748b]">Media Mentions</span>
              <span className="font-medium">{components.media_mentions}</span>
            </div>
          </div>
        </div>

        {/* Sector Breakdown */}
        <div>
          <h4 className="text-xs font-semibold text-[#475569] mb-2">Sector Mission Breakdown</h4>
          <div className="space-y-1">
            {sectorBreakdowns.map((sector, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-[#64748b]">{sector.sector}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{sector.activation.toFixed(2)}</span>
                  <span 
                    className="text-xs"
                    style={{ color: sector.delta > 0 ? semanticColors.minimalRisk : semanticColors.criticalRisk }}
                  >
                    {sector.delta > 0 ? '+' : ''}{sector.delta.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fellowship Cohorts */}
        <div>
          <h4 className="text-xs font-semibold text-[#475569] mb-2">Insight Fellowship</h4>
          <div className="space-y-1">
            {fellowshipCohorts.map((cohort, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-[#64748b]">{cohort.name}</span>
                <span className="font-medium">{cohort.participants} participants</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94a3b8]">
              Methodology: Community engagement + institutional adoption
            </span>
            <button 
              className="underline hover:no-underline text-[#1e3a8a]"
              onClick={() => window.open('/transparency/ras-methodology', '_blank')}
            >
              Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}