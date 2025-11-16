export type Driver = { component: string; contribution: number };
export type GeriResponse = {
  score: number;
  band: string;
  color: string;
  updated_at: string;
  drivers: Driver[];
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:10000/api/v1';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
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
};
