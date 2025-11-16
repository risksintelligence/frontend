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
  contributions?: Record<string, number>;
  component_scores?: Record<string, number>;
  metadata?: any;
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

export type GeriHistoryResponse = {
  period: { start: string; end: string; days: number };
  geri_history: Array<{ date: string; score: number; band: string; color: string }>;
  components: Record<string, Array<{ date: string; value: number; z_score: number; contribution: number }>>;
  metadata: {
    total_observations: number;
    series_count: number;
    generated_at: string;
  };
};

export type ComponentHistoryResponse = {
  component_id: string;
  period: { start: string; end: string; days: number };
  history: Array<{ date: string; value: number; z_score: number; percentile: number; contribution: number; freshness: string }>;
  statistics: {
    mean: number;
    min: number;
    max: number;
    current_z_score: number;
    volatility: number;
  };
  metadata: { total_points: number; latest_update: string | null; generated_at: string };
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-9t5o.onrender.com/api/v1';

import { authManager } from './auth';

async function fetchJson<T>(path: string, retries = 2): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...authManager.getAuthHeaders()
  };

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, { 
        cache: 'no-store',
        headers,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!res.ok) {
        // Don't retry on 4xx errors (client errors)
        if (res.status >= 400 && res.status < 500 && i === 0) {
          throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
        }
        // Retry on 5xx errors (server errors)
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          continue;
        }
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
      }
      
      return res.json() as Promise<T>;
    } catch (error) {
      if (i < retries && (error instanceof TypeError || error.name === 'NetworkError')) {
        // Retry on network errors
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  
  throw new Error(`Failed to fetch ${path} after ${retries + 1} attempts`);
}

async function postJson<T>(path: string, data: any, retries = 2): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...authManager.getAuthHeaders()
  };

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, { 
        method: 'POST',
        cache: 'no-store',
        headers,
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!res.ok) {
        // Don't retry on 4xx errors (client errors)
        if (res.status >= 400 && res.status < 500 && i === 0) {
          throw new Error(`Failed to post ${path}: ${res.status} ${res.statusText}`);
        }
        // Retry on 5xx errors (server errors)
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          continue;
        }
        throw new Error(`Failed to post ${path}: ${res.status} ${res.statusText}`);
      }
      
      return res.json() as Promise<T>;
    } catch (error) {
      if (i < retries && (error instanceof TypeError || error.name === 'NetworkError')) {
        // Retry on network errors
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  
  throw new Error(`Failed to post ${path} after ${retries + 1} attempts`);
}

export const api = {
  getGeri: () => fetchJson<GeriResponse>('/analytics/geri'),
  getGeriComponents: () => fetchJson<{
    components: Array<{
      id: string;
      value: number;
      z_score: number;
      timestamp: string;
    }>;
  }>('/analytics/components'),
  getRegime: () => fetchJson<{
    regime: string;
    probabilities: Record<string, number>;
    weights?: Record<string, number>;
    confidence: number;
    updated_at: string;
  }>('/ai/regime/current'),
  getForecast: () => fetchJson<{
    delta: number;
    p_gt_5: number;
    confidence_interval: [number, number];
    drivers: Array<{component: string; impact: number}>;
    updated_at: string;
  }>('/ai/forecast/next-24h'),
  getAnomalies: () => fetchJson<{
    anomalies: Array<{
      score: number;
      classification: string;
      drivers?: Array<{component: string; impact: number}>;
      timestamp: string;
    }>;
    summary: {
      total_anomalies: number;
      max_severity: number;
      updated_at: string;
    };
  }>('/anomalies/latest'),
  getRas: () => fetchJson('/impact/ras'),
  getDataFreshness: () => fetchJson<Array<{
    component: string;
    status: string;
    last_updated: string;
    cache_tier?: string;
    ttl_remaining?: number;
  }>>('/system/data-freshness'),
  getUpdateLog: () => fetchJson<Array<{
    date: string;
    description: string;
    event_type?: string;
  }>>('/transparency/update-log'),
  getSystemReleases: () => fetchJson('/system/releases'),
  getNewsletterPreview: (type: string) => fetchJson(`/communication/newsletter/preview?newsletter_type=${type}`),
  getGeriHistory: (days: number = 30) => fetchJson<GeriHistoryResponse>(`/analytics/history?days=${days}`),
  getComponentHistory: (componentId: string, days: number = 30) => fetchJson<ComponentHistoryResponse>(`/analytics/components/${componentId}/history?days=${days}`),
  
  // Community APIs
  getPartnerLabs: () => fetchJson<PartnerLabsResponse>('/community/partner-labs'),
  getMediaKit: () => fetchJson<MediaKitResponse>('/community/media-kit'),
  getScenarioPrompts: () => fetchJson<ScenarioPromptsResponse>('/community/scenario-prompts'),
  getSubmissionsSummary: () => fetchJson<any>('/community/submissions/summary'),
  submitScenarioResponse: (promptId: string, submissionData: any) => postJson(`/community/scenario-prompts/${promptId}/submit`, submissionData),
  
  // Communication APIs  
  getNewsletterStatus: () => fetchJson<NewsletterStatusResponse>('/communication/newsletter-status'),
  getPublishingCalendar: () => fetchJson<any>('/communication/publishing-calendar'),
};
