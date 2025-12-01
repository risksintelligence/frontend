"use client";

import { useQuery } from "@tanstack/react-query";
import { getGovernanceModels } from "@/services/realTimeDataService";
import { GovernanceModelsResponse } from "@/lib/types";

export function useGovernanceModels() {
  return useQuery({
    queryKey: ["governance-models"],
    queryFn: getGovernanceModels,
    select: (data): GovernanceModelsResponse => data,
    refetchInterval: 60_000,
  });
}
