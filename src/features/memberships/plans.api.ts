/**
 * Membership Plans API
 * Maps to backend MembershipPlanController (/api/membership-plans)
 */

import apiClient from "@/api/axios";
import { MEMBERSHIP_PLANS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

export interface MembershipPlanResponse {
  id: string;
  gymId: string;
  name: string;
  description: string | null;
  price: number;
  billingCycle: string;
  durationMonths: number | null;
  classCredits: number | null;
  guestPasses: number | null;
  trainerSessions: number | null;
  amenities: string | null;
  peakHoursAccess: boolean;
  offPeakOnly: boolean;
  specificAreas: string | null;
  featured: boolean;
  active: boolean;
}

export interface MembershipPlanCreateRequest {
  name: string;
  description?: string;
  price: number;
  billingCycle: string; // monthly | quarterly | yearly | annual | lifetime
  durationMonths?: number;
  classCredits?: number;
  guestPasses?: number;
  trainerSessions?: number;
}

export const plansAPI = {
  create: async (gymId: string, data: MembershipPlanCreateRequest): Promise<ApiResponse<MembershipPlanResponse>> => {
    const response = await apiClient.post(MEMBERSHIP_PLANS.BASE, data, { params: { gymId } });
    return response.data;
  },
  getByGym: async (gymId: string): Promise<ApiResponse<MembershipPlanResponse[]>> => {
    const response = await apiClient.get(MEMBERSHIP_PLANS.BY_GYM(gymId));
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<MembershipPlanResponse>> => {
    const response = await apiClient.get(MEMBERSHIP_PLANS.BY_ID(id));
    return response.data;
  },
  updatePricing: async (id: string, price: number, billingCycle: string): Promise<ApiResponse<MembershipPlanResponse>> => {
    const response = await apiClient.put(MEMBERSHIP_PLANS.PRICING(id), { price, billingCycle });
    return response.data;
  },
  updateFeatures: async (
    id: string,
    features: { classCredits?: number; guestPasses?: number; trainerSessions?: number }
  ): Promise<ApiResponse<MembershipPlanResponse>> => {
    const response = await apiClient.put(MEMBERSHIP_PLANS.FEATURES(id), features);
    return response.data;
  },
  setFeatured: async (id: string, featured: boolean): Promise<ApiResponse<MembershipPlanResponse>> => {
    const response = await apiClient.put(MEMBERSHIP_PLANS.FEATURED(id), null, { params: { featured } });
    return response.data;
  },
  deactivate: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(MEMBERSHIP_PLANS.BY_ID(id));
    return response.data;
  },
};

export default plansAPI;
