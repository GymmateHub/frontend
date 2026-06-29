/**
 * Analytics Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "./analytics.api";

export const analyticsKeys = {
  all: ["analytics"] as const,
  gym: (gymId: string) => [...analyticsKeys.all, "gym", gymId] as const,
  allGyms: () => [...analyticsKeys.all, "all-gyms"] as const,
};

export const useGymAnalytics = (gymId: string) => {
  return useQuery({
    queryKey: analyticsKeys.gym(gymId),
    queryFn: async () => { const r = await analyticsAPI.getGymAnalytics(gymId); return r.data; },
    enabled: !!gymId,
  });
};

export const useAllGymsAnalytics = () => {
  return useQuery({
    queryKey: analyticsKeys.allGyms(),
    queryFn: async () => { const r = await analyticsAPI.getAllGymsAnalytics(); return r.data; },
  });
};
