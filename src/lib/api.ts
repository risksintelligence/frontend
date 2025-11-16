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
  getPartnerLabs: () => fetchJson<any>('/community/partner-labs'),
  getMediaKit: () => fetchJson<any>('/community/media-kit'),
  getScenarioPrompts: () => fetchJson<any>('/community/scenario-prompts'),
  getSubmissionsSummary: () => fetchJson<any>('/community/submissions/summary'),
  
  // Communication APIs  
  getNewsletterStatus: () => fetchJson<any>('/communication/newsletter-status'),
  getPublishingCalendar: () => fetchJson<any>('/communication/publishing-calendar'),
};
