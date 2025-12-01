"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupplyCascadeSnapshot, getCascadeHistory, getCascadeImpacts } from "@/services/realTimeDataService";

export function useSupplyCascadeSnapshot() {
  return useQuery({
    queryKey: ["supply-cascade-snapshot"],
    queryFn: getSupplyCascadeSnapshot,
    refetchInterval: 60_000,
  });
}

export function useCascadeHistory() {
  return useQuery({
    queryKey: ["supply-cascade-history"],
    queryFn: getCascadeHistory,
    refetchInterval: 120_000,
  });
}

export function useCascadeImpacts() {
  return useQuery({
    queryKey: ["supply-cascade-impacts"],
    queryFn: getCascadeImpacts,
    refetchInterval: 120_000,
  });
}
