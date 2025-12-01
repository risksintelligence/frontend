"use client";

import { useQuery } from "@tanstack/react-query";
import { getNewsroomBriefs } from "@/services/realTimeDataService";

export function useNewsroomBriefs() {
  return useQuery({
    queryKey: ["newsroom-briefs"],
    queryFn: getNewsroomBriefs,
    refetchInterval: 120_000,
  });
}
