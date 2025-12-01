"use client";

import { useQuery } from "@tanstack/react-query";
import { getPartnersData } from "@/services/realTimeDataService";

export function usePartnersData() {
  return useQuery({
    queryKey: ["partners-data"],
    queryFn: getPartnersData,
    refetchInterval: 120_000, // Refresh every 2 minutes
  });
}