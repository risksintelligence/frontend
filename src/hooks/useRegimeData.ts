"use client";

import { useQuery } from "@tanstack/react-query";
import { getRegimeData } from "@/services/realTimeDataService";

export function useRegimeData() {
  return useQuery({
    queryKey: ["regime-data"],
    queryFn: getRegimeData,
    refetchInterval: 30_000,
  });
}
