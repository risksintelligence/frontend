"use client";

import { useQuery } from "@tanstack/react-query";
import { getGeopoliticalDisruptions } from "@/services/realTimeDataService";
import type { GeopoliticalDisruptionsResponse } from "@/types/api";
import { validateGeopoliticalDisruptionsResponse, validateApiResponse } from "@/lib/contractValidator";

export function useGeopoliticalDisruptions(days = 30) {
  return useQuery<GeopoliticalDisruptionsResponse>({
    queryKey: ["geopolitical-disruptions", days],
    queryFn: async () => {
      const data = await getGeopoliticalDisruptions(days);
      
      // Validate contract alignment
      return validateApiResponse(
        `/api/v1/geopolitical/disruptions?days=${days}`,
        data,
        validateGeopoliticalDisruptionsResponse
      );
    },
    refetchInterval: 15 * 60 * 1000, // align to GDELT refresh cadence
    retry: (failureCount, error) => {
      // Don't retry on contract validation errors
      if (error?.name === 'ContractValidationError') {
        console.error('Contract validation failed:', error);
        return false;
      }
      return failureCount < 3;
    },
  });
}
