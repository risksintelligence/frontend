"use client";

import { useQuery } from "@tanstack/react-query";
import { getGovernanceCompliance } from "@/services/realTimeDataService";
import { GovernanceComplianceResponse } from "@/lib/types";

export function useGovernanceCompliance(modelName: string) {
  return useQuery({
    queryKey: ["governance-compliance", modelName],
    queryFn: () => getGovernanceCompliance(modelName),
    enabled: Boolean(modelName),
    refetchInterval: 120_000,
    select: (data): GovernanceComplianceResponse => data,
  });
}
