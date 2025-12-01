"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransparencyStatus } from "@/services/realTimeDataService";

export function useTransparencyStatus() {
  return useQuery({
    queryKey: ["transparency-status"],
    queryFn: getTransparencyStatus,
    refetchInterval: 60_000,
  });
}
