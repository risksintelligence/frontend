"use client";

import { useQuery } from "@tanstack/react-query";
import { getExplainability } from "@/services/realTimeDataService";

export function useExplainability() {
  return useQuery({
    queryKey: ["explainability"],
    queryFn: getExplainability,
    refetchInterval: 60_000,
  });
}
