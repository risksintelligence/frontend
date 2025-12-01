"use client";

import { useQuery } from "@tanstack/react-query";
import { getForecastData } from "@/services/realTimeDataService";

export function useForecastData() {
  return useQuery({
    queryKey: ["forecast-data"],
    queryFn: getForecastData,
    refetchInterval: 60_000,
  });
}
