"use client";

import { useQuery } from "@tanstack/react-query";
import { getComponentsData } from "@/services/realTimeDataService";

export function useComponentsData() {
  return useQuery({
    queryKey: ["components-data"],
    queryFn: getComponentsData,
    refetchInterval: 30_000,
  });
}