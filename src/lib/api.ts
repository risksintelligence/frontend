export type Driver = { 
  component: string; 
  contribution: number;
  impact: number;
  confidence?: number;
  z_score?: number;
};

export type GeriResponse = {
  score: number;
  band: string;
  band_color: string;
  color: string;
  updated_at: string;
  drivers: Driver[];
  change_24h: number;
  confidence: number;
  confidence_interval?: [number, number];
};

export type PartnerLab = {
  id: string;
  name: string;
  institution: string;
  sector: string;
  status: 'active' | 'onboarding' | 'completed';
  enrolled_date: string;
  mission: string;
  current_projects?: Array<{
    title: string;
    status: string;
    contributors?: number;
    due_date?: string;
    completion_date?: string;
  }>;
  impact_metrics?: {
    ras_contribution?: number;
    community_engagement?: number;
    data_usage?: string;
  };
};

export type PartnerLabsResponse = {
  partner_labs: PartnerLab[];
  summary?: {
    total_labs: number;
    active_labs: number;
    onboarding_labs: number;
    total_projects: number;
    sectors_covered: number;
    total_ras_contribution: number;
    average_engagement: number;
  };
  upcoming_showcases?: Array<{
    title: string;
    date: string;
    participating_labs: string[];
    registration_url: string;
  }>;
  generated_at?: string;
};

export type MediaKitResponse = {
  speaker_bios?: Array<{ name: string; title: string; bio: string; topics?: string[] }>;
  testimonials?: Array<{ author: string; title: string; quote: string; sector?: string }>;
  highlight_reels?: Array<{ title: string; description: string; url: string }>;
  press_releases?: Array<{ title: string; date: string; summary: string; url: string }>;
  awards_recognition?: Array<{ award: string; organization: string; year: number; description: string }>;
  generated_at?: string;
};

export type NewsletterStatusResponse = {
  daily_flash: {
    status: string;
    last_published: string;
    next_scheduled: string;
    draft_preview: { headline: string; geri_score: number; risk_band: string };
    automation?: {
      enabled: boolean;
      slack_posting?: boolean;
      email_delivery?: boolean;
      last_automation_run?: string;
    };
  };
  weekly_wrap: {
    status: string;
    last_published: string;
    next_scheduled: string;
    draft_preview: { headline: string; regime_summary: string };
    automation?: {
      enabled: boolean;
      slack_posting?: boolean;
      email_delivery?: boolean;
      last_automation_run?: string;
    };
  };
  subscription_metrics?: {
    total_subscribers: number;
    active_subscribers: number;
    weekly_growth: number;
    engagement_rates?: {
      daily_open_rate: number;
      weekly_open_rate: number;
      click_through_rate: number;
    };
  };
  content_pipeline?: {
    scheduled_content?: Array<{ type: string; scheduled_time: string; automation: boolean }>;
  };
  generated_at: string;
};

export type ScenarioPrompt = {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimated_time: string;
  created_date: string;
  deadline: string;
  status: string;
  submission_count: number;
  featured_submission?: {
    author: string;
    title: string;
    preview?: string;
  } | null;
};

export type ScenarioPromptsResponse = {
  current_prompts: ScenarioPrompt[];
  completed_prompts: Array<{ id: string; title: string; completion_date: string }>;
  summary: {
    active_prompts: number;
    total_submissions: number;
    participation_rate: number;
    difficulty_distribution: Record<string, number>;
  };
  generated_at: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:10000/api/v1';

import { authManager } from './auth';

async function fetchJson<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...authManager.getAuthHeaders()
  };

  const res = await fetch(`${BASE_URL}${path}`, { 
    cache: 'no-store',
    headers 
  });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getGeri: () => fetchJson<GeriResponse>('/analytics/geri'),
  getRegime: () => fetchJson('/ai/regime/current'),
  getForecast: () => fetchJson('/ai/forecast/next-24h'),
  getAnomalies: () => fetchJson('/anomalies/latest'),
  getRas: () => fetchJson('/impact/ras'),
  getDataFreshness: () => fetchJson('/transparency/data-freshness'),
  getUpdateLog: () => fetchJson('/transparency/update-log'),
  
  // Community APIs
  getPartnerLabs: () => fetchJson<PartnerLabsResponse>('/community/partner-labs'),
  getMediaKit: () => fetchJson<MediaKitResponse>('/community/media-kit'),
  getScenarioPrompts: () => fetchJson<ScenarioPromptsResponse>('/community/scenario-prompts'),
  getSubmissionsSummary: () => fetchJson<any>('/community/submissions/summary'),
  
  // Communication APIs  
  getNewsletterStatus: () => fetchJson<NewsletterStatusResponse>('/communication/newsletter-status'),
  getPublishingCalendar: () => fetchJson<any>('/communication/publishing-calendar'),
};
