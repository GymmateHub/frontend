/**
 * Analytics Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { analyticsAPI, type AnalyticsPeriod } from "./analytics.api";

export const analyticsKeys = {
  all: ["analytics"] as const,
  gym: (gymId: string) => [...analyticsKeys.all, "gym", gymId] as const,
  allGyms: () => [...analyticsKeys.all, "all-gyms"] as const,
  dashboard: (gymId: string, period: AnalyticsPeriod) =>
    [...analyticsKeys.all, "dashboard", gymId, period] as const,
  members: (gymId: string, period: AnalyticsPeriod) =>
    [...analyticsKeys.all, "members", gymId, period] as const,
  revenue: (gymId: string, period: AnalyticsPeriod) =>
    [...analyticsKeys.all, "revenue", gymId, period] as const,
  classes: (gymId: string, period: AnalyticsPeriod) =>
    [...analyticsKeys.all, "classes", gymId, period] as const,
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

export const useAnalyticsDashboard = (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS") => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(gymId, period),
    queryFn: async () => { const r = await analyticsAPI.getDashboard(gymId, period); return r.data; },
    enabled: !!gymId,
  });
};

export const useMemberAnalytics = (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS") => {
  return useQuery({
    queryKey: analyticsKeys.members(gymId, period),
    queryFn: async () => { const r = await analyticsAPI.getMemberAnalytics(gymId, period); return r.data; },
    enabled: !!gymId,
  });
};

export const useRevenueAnalytics = (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS") => {
  return useQuery({
    queryKey: analyticsKeys.revenue(gymId, period),
    queryFn: async () => { const r = await analyticsAPI.getRevenueAnalytics(gymId, period); return r.data; },
    enabled: !!gymId,
  });
};

export const useClassAnalytics = (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS") => {
  return useQuery({
    queryKey: analyticsKeys.classes(gymId, period),
    queryFn: async () => { const r = await analyticsAPI.getClassAnalytics(gymId, period); return r.data; },
    enabled: !!gymId,
  });
};
