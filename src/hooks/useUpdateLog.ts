"use client";

import { useQuery } from "@tanstack/react-query";
import { getUpdateLog } from "@/services/realTimeDataService";

export function useUpdateLog() {
  return useQuery({
    queryKey: ["update-log"],
    queryFn: getUpdateLog,
    refetchInterval: 30_000, // Refetch every 30 seconds
  });
}