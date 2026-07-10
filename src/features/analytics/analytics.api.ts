/**
 * Analytics API
 * Maps to backend GymController analytics endpoints (/api/gyms/analytics)
 * and the dedicated AnalyticsController (/api/analytics)
 */

import apiClient from "@/api/axios";
import { GYMS, ANALYTICS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

export interface GymAnalyticsResponse {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  classesThisMonth: number;
  averageAttendance: number;
  equipmentUtilization: number;
  memberRetentionRate: number;
  growthRate: number;
  topClasses: { name: string; attendance: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  membersByPlan: { plan: string; count: number }[];
}

export type AnalyticsPeriod =
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "THIS_YEAR";

export interface KpiCardResponse {
  title: string;
  value: string;
  previousValue: string | null;
  changePercentage: number | null;
  isPositiveChange: boolean;
  icon: string | null;
  color: string | null;
  description: string | null;
}

export interface TimeSeriesDataPoint {
  label: string;
  value: number;
  [key: string]: unknown;
}

export interface CategoryBreakdown {
  category: string;
  value: number;
  [key: string]: unknown;
}

export interface DashboardResponse {
  totalMembers: KpiCardResponse;
  activeMembers: KpiCardResponse;
  newMembersThisMonth: KpiCardResponse;
  memberRetentionRate: KpiCardResponse;
  totalRevenue: KpiCardResponse;
  recurringRevenue: KpiCardResponse;
  posRevenue: KpiCardResponse;
  averageRevenuePerMember: KpiCardResponse;
  classesToday: KpiCardResponse;
  bookingsToday: KpiCardResponse;
  averageClassAttendance: KpiCardResponse;
  classCapacityUtilization: KpiCardResponse;
  revenueChart: TimeSeriesDataPoint[];
  memberGrowthChart: TimeSeriesDataPoint[];
  bookingsTrendChart: TimeSeriesDataPoint[];
  revenueBySource: CategoryBreakdown[];
  membersByPlan: CategoryBreakdown[];
  bookingsByClass: CategoryBreakdown[];
  churnRate: number;
  expiringMemberships: number;
  overduePayments: number;
  lowStockItems: number;
}

export const analyticsAPI = {
  getGymAnalytics: async (gymId: string): Promise<ApiResponse<GymAnalyticsResponse>> => {
    const response = await apiClient.get(GYMS.GYM_ANALYTICS(gymId));
    return response.data;
  },
  getAllGymsAnalytics: async (): Promise<ApiResponse<GymAnalyticsResponse>> => {
    const response = await apiClient.get(GYMS.ANALYTICS);
    return response.data;
  },
  getDashboard: async (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS"): Promise<ApiResponse<DashboardResponse>> => {
    const response = await apiClient.get(ANALYTICS.DASHBOARD(gymId), { params: { period } });
    return response.data;
  },
  getTodaysDashboard: async (gymId: string): Promise<ApiResponse<DashboardResponse>> => {
    const response = await apiClient.get(ANALYTICS.DASHBOARD_TODAY(gymId));
    return response.data;
  },
  getMemberAnalytics: async (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS"): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get(ANALYTICS.MEMBERS(gymId), { params: { period } });
    return response.data;
  },
  getRevenueAnalytics: async (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS"): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get(ANALYTICS.REVENUE(gymId), { params: { period } });
    return response.data;
  },
  getClassAnalytics: async (gymId: string, period: AnalyticsPeriod = "LAST_30_DAYS"): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get(ANALYTICS.CLASSES(gymId), { params: { period } });
    return response.data;
  },
};

export default analyticsAPI;
