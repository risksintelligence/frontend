import { semanticColors } from '../lib/theme';
import type { MediaKitResponse, PartnerLabsResponse } from '../lib/api';

interface LabDisplay {
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

interface Props {
  data?: PartnerLabsResponse;
  mediaKit?: MediaKitResponse;
}

const defaultLabs: LabDisplay[] = [
  { name: 'Cornell Tech AI Lab', sector: 'Education', showcase_date: '2024-12-15', status: 'active' },
  { name: 'UC Berkeley Resilience Hub', sector: 'Public Policy', showcase_date: '2024-11-30', status: 'upcoming' },
  { name: 'MIT Economic Intelligence', sector: 'Financial Services', showcase_date: '2024-11-20', status: 'completed' }
];

const defaultAssets: MediaAsset[] = [
  { type: 'bio', title: 'RRIO Leadership Bios', url: '/media/speaker-bios.pdf' },
  { type: 'reel', title: 'Q3 Highlight Reel', url: '/media/q3-highlights.mp4' },
  { type: 'testimonial', title: 'Partner Testimonials', url: '/media/testimonials.pdf' }
];

function mapLabs(data?: PartnerLabsResponse): LabDisplay[] {
  if (!data?.partner_labs?.length) return defaultLabs;
  return data.partner_labs.map((lab) => ({
    name: lab.name,
    sector: lab.sector,
    showcase_date:
      lab.current_projects?.[0]?.due_date ||
      lab.current_projects?.[0]?.completion_date ||
      lab.enrolled_date,
    status: lab.status === 'active' ? 'active' : lab.status === 'onboarding' ? 'upcoming' : 'completed'
  }));
}

function mapMediaAssets(mediaKit?: MediaKitResponse): MediaAsset[] {
  if (!mediaKit) return defaultAssets;
  const assets: MediaAsset[] = [];

  mediaKit.speaker_bios?.slice(0, 1).forEach((bio) => {
    assets.push({ type: 'bio', title: bio.name, url: '/media/speaker-bios.pdf' });
  });
  mediaKit.highlight_reels?.slice(0, 1).forEach((reel) => {
    assets.push({ type: 'reel', title: reel.title, url: reel.url });
  });
  mediaKit.testimonials?.slice(0, 1).forEach((testimonial, index) => {
    assets.push({ type: 'testimonial', title: testimonial.author, url: `/media/testimonials-${index}.pdf` });
  });

  return assets.length ? assets : defaultAssets;
}

export default function PartnerLabsMedia({ data, mediaKit }: Props) {
  const labs = mapLabs(data).slice(0, 3);
  const mediaAssets = mapMediaAssets(mediaKit);

  const getStatusColor = (status: LabDisplay['status']) => {
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

  const summary = data?.summary;
  const showcase = data?.upcoming_showcases?.[0];

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm uppercase font-semibold" style={{ color: 'var(--terminal-muted)' }}>
            Partner Labs & Media
          </h3>
          {summary && (
            <p className="text-xs text-[#94a3b8]">
              {summary.active_labs} active labs • {summary.total_projects} live projects
            </p>
          )}
        </div>
        <span className="text-xs px-2 py-1 rounded bg-[#1e3a8a] text-white">
          {summary?.active_labs ?? labs.filter((lab) => lab.status === 'active').length} Active
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-[#475569] mb-2">Current Labs</h4>
          <div className="space-y-2">
            {labs.map((lab, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(lab.status) }} />
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
            {mediaAssets.map((asset, index) => (
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

        {showcase && (
          <div className="border-t border-[#e2e8f0] pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748b]">
                Next showcase: {new Date(showcase.date).toLocaleDateString()}
              </span>
              <button
                className="underline hover:no-underline text-[#1e3a8a]"
                onClick={() => window.open(showcase.registration_url, '_blank')}
              >
                View All →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
