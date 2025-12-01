"use client";

import { useQuery } from "@tanstack/react-query";
import { getGeriHistory } from "@/services/realTimeDataService";

export function useGeriHistory(days = 14) {
  return useQuery({
    queryKey: ["geri-history", days],
    queryFn: () => getGeriHistory(days),
    staleTime: 60_000,
  });
}
