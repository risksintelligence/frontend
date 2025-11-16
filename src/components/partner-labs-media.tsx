import { semanticColors } from '../lib/theme';
import useSWR from 'swr';
import { api } from '../lib/api';

// Backend API interfaces
interface BackendLab {
  id: string;
  name: string;
  institution: string;
  sector: string;
  status: 'active' | 'onboarding';
  enrolled_date: string;
  mission: string;
  current_projects: Array<{
    title: string;
    status: string;
    contributors: number;
    due_date?: string;
    completion_date?: string;
  }>;
  recent_submissions: number;
  impact_metrics: {
    ras_contribution: number;
    community_engagement: number;
    data_usage: string;
  };
}

interface BackendMediaKit {
  speaker_bios: Array<{
    name: string;
    title: string;
    bio: string;
    photo_url: string;
    topics: string[];
  }>;
  testimonials: Array<{
    author: string;
    title: string;
    quote: string;
    date: string;
    sector: string;
  }>;
  highlight_reels: Array<{
    title: string;
    description: string;
    duration: string;
    url: string;
    thumbnail: string;
  }>;
}

interface PartnerLabsResponse {
  partner_labs: BackendLab[];
  summary: {
    total_labs: number;
    active_labs: number;
    onboarding_labs: number;
    total_projects: number;
    sectors_covered: number;
    total_ras_contribution: number;
    average_engagement: number;
  };
  upcoming_showcases: Array<{
    title: string;
    date: string;
    participating_labs: string[];
    registration_url: string;
  }>;
  generated_at: string;
}

// Legacy interfaces for backward compatibility
interface Lab {
  name: string;
  sector: string;
  showcase_date: string;
  status: 'active' | 'upcoming' | 'completed';
}

interface MediaAsset {
  type: 'bio' | 'reel' | 'testimonial';
  title: string;
  url: string;
}

const defaultLabs: Lab[] = [
  { name: 'Cornell Tech AI Lab', sector: 'Education', showcase_date: '2024-12-15', status: 'active' },
  { name: 'UC Berkeley Resilience Hub', sector: 'Public Policy', showcase_date: '2024-11-30', status: 'upcoming' },
  { name: 'MIT Economic Intelligence', sector: 'Financial Services', showcase_date: '2024-11-20', status: 'completed' }
];

const defaultAssets: MediaAsset[] = [
  { type: 'bio', title: 'RRIO Leadership Bios', url: '/media/speaker-bios.pdf' },
  { type: 'reel', title: 'Q3 Highlight Reel', url: '/media/q3-highlights.mp4' },
  { type: 'testimonial', title: 'Partner Testimonials', url: '/media/testimonials.pdf' }
];

export default function PartnerLabsMedia() {
  // Fetch partner labs data from backend
  const { data: partnerLabsData, error: labsError } = useSWR<PartnerLabsResponse>(
    'partner-labs',
    () => api.getPartnerLabs(),
    { refreshInterval: 300000 } // Refresh every 5 minutes
  );

  // Fetch media kit data from backend
  const { data: mediaKitData, error: mediaError } = useSWR<BackendMediaKit>(
    'media-kit',
    () => api.getMediaKit(),
    { refreshInterval: 600000 } // Refresh every 10 minutes
  );

  // Transform backend data to component format
  const labs: Lab[] = partnerLabsData?.partner_labs.map(lab => ({
    name: lab.name,
    sector: lab.sector,
    showcase_date: partnerLabsData.upcoming_showcases[0]?.date || new Date().toISOString(),
    status: lab.status === 'active' ? 'active' : 'upcoming'
  })) || defaultLabs;

  // Transform media kit data
  const mediaAssets: MediaAsset[] = [
    ...(mediaKitData?.speaker_bios.slice(0, 1).map(bio => ({
      type: 'bio' as const,
      title: 'Speaker Bios',
      url: bio.photo_url || '/media/speaker-bios.pdf'
    })) || []),
    ...(mediaKitData?.highlight_reels.slice(0, 1).map(reel => ({
      type: 'reel' as const,
      title: reel.title,
      url: reel.url
    })) || []),
    ...(mediaKitData?.testimonials.slice(0, 1).map(testimonial => ({
      type: 'testimonial' as const,
      title: 'Testimonials',
      url: '/media/testimonials.pdf'
    })) || [])
  ];

  // Fallback to defaults if no data
  const finalMediaAssets = mediaAssets.length > 0 ? mediaAssets : defaultAssets;

  const getStatusColor = (status: Lab['status']) => {
    switch (status) {
      case 'active': return semanticColors.minimalRisk;
      case 'upcoming': return semanticColors.moderateRisk;
      case 'completed': return '#64748b';
      default: return '#94a3b8';
    }
  };

  const getAssetIcon = (type: MediaAsset['type']) => {
    switch (type) {
      case 'bio': return '👤';
      case 'reel': return '🎥';
      case 'testimonial': return '💬';
      default: return '📄';
    }
  };

  // Show loading state
  if (labsError || mediaError) {
    return (
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
            Partner Labs & Media
          </h3>
          <span className="text-xs px-2 py-1 rounded bg-[#ef4444] text-white">
            Error
          </span>
        </div>
        <p className="text-sm text-[#64748b]">
          Unable to load partner labs data. Using cached information.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
          Partner Labs & Media
        </h3>
        <span className="text-xs px-2 py-1 rounded bg-[#1e3a8a] text-white">
          {partnerLabsData?.summary.active_labs || labs.filter(lab => lab.status === 'active').length} Active
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-[#475569] mb-2">Current Labs</h4>
          <div className="space-y-2">
            {labs.slice(0, 3).map((lab, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(lab.status) }}
                  />
                  <span className="font-medium">{lab.name}</span>
                  <span className="text-xs text-[#64748b]">({lab.sector})</span>
                </div>
                <span className="text-xs text-[#94a3b8]">
                  {new Date(lab.showcase_date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-3">
          <h4 className="text-xs font-semibold text-[#475569] mb-2">Resilience Media Kit</h4>
          <div className="grid grid-cols-3 gap-2">
            {finalMediaAssets.map((asset, index) => (
              <button
                key={index}
                onClick={() => window.open(asset.url, '_blank')}
                className="flex flex-col items-center p-2 rounded bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors text-xs"
              >
                <span className="text-lg mb-1">{getAssetIcon(asset.type)}</span>
                <span className="text-[#475569] text-center leading-tight">
                  {asset.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748b]">
              Sectors: Education, Policy, FinTech | Next showcase: Nov 30
            </span>
            <button 
              className="underline hover:no-underline text-[#1e3a8a]"
              onClick={() => window.open('/partnerships', '_blank')}
            >
              View All →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}