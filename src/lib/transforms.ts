import {
  ForecastBacktestPoint,
  AnomalyHistoryPoint,
  ForecastHistoryResponse,
  AnomalyHistoryResponse,
} from "./types";

export function normalizeForecastHistory(raw: ForecastHistoryResponse): ForecastBacktestPoint[] {
  return (raw.history || []).map((p) => ({
    timestamp: p.timestamp,
    predicted: Number(p.predicted ?? 0),
    realized: Number(p.realized ?? 0),
    lower: p.lower ?? (p.predicted ?? 0) - 1,
    upper: p.upper ?? (p.predicted ?? 0) + 1,
  }));
}

export function normalizeAnomalyHistory(raw: AnomalyHistoryResponse): AnomalyHistoryPoint[] {
  return (raw.history || []).map((h) => ({
    timestamp: h.timestamp,
    score: Number(h.score ?? 0),
    classification: h.classification,
    severity: h.severity,
  }));
}
