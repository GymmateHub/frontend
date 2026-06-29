/**
 * Analytics API
 */

import apiClient from "@/api/axios";
import { GYMS } from "@/api/endpoints";
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

export const analyticsAPI = {
  getGymAnalytics: async (gymId: string): Promise<ApiResponse<GymAnalyticsResponse>> => {
    const response = await apiClient.get(GYMS.GYM_ANALYTICS(gymId));
    return response.data;
  },
  getAllGymsAnalytics: async (): Promise<ApiResponse<GymAnalyticsResponse>> => {
    const response = await apiClient.get(GYMS.ANALYTICS);
    return response.data;
  },
};

export default analyticsAPI;
