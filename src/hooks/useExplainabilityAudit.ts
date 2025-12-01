"use client";

import { useQuery } from "@tanstack/react-query";
import { getExplainabilityAudit } from "@/services/realTimeDataService";

export function useExplainabilityAudit(startISO: string, endISO: string, accessedBy = "") {
  return useQuery({
    queryKey: ["explainability-audit", startISO, endISO, accessedBy],
    queryFn: () => getExplainabilityAudit(startISO, endISO, accessedBy),
    enabled: Boolean(startISO && endISO),
    refetchInterval: 120_000,
  });
}
