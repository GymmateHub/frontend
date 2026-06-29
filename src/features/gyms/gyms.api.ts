/**
 * Gyms API
 * API functions for gym management
 */

import apiClient from "@/api/axios";
import { GYMS, GYM_AREAS, ORGANISATIONS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

// Gym Types
export interface GymResponse {
  id: string;
  organisationId: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  logoUrl: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessSettings: {
    openingTime: string;
    closingTime: string;
    timezone: string;
    currency: string;
    taxRate: number;
  };
  subscription: {
    tier: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  status: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GymAnalytics {
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
}

export interface GymAreaResponse {
  id: string;
  gymId: string;
  name: string;
  description: string;
  capacity: number;
  areaType: string;
  active: boolean;
}

export interface GymCreateRequest {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface GymUpdateRequest {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export interface AddressUpdateRequest {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BusinessSettingsUpdateRequest {
  openingTime?: string;
  closingTime?: string;
  timezone?: string;
  currency?: string;
  taxRate?: number;
}

export interface GymAreaCreateRequest {
  name: string;
  description?: string;
  capacity: number;
  areaType: string;
}

/**
 * Gyms API Functions
 */
export const gymsAPI = {
  // Get all gyms
  getAll: async (): Promise<ApiResponse<GymResponse[]>> => {
    const response = await apiClient.get(GYMS.BASE);
    return response.data;
  },

  // Get my gyms (for owners)
  getMyGyms: async (): Promise<ApiResponse<GymResponse[]>> => {
    const response = await apiClient.get(GYMS.MY_GYMS);
    return response.data;
  },

  // Get active gyms
  getActive: async (): Promise<ApiResponse<GymResponse[]>> => {
    const response = await apiClient.get(GYMS.ACTIVE);
    return response.data;
  },

  // Get gym by ID
  getById: async (id: string): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.get(GYMS.BY_ID(id));
    return response.data;
  },

  // Create gym (via organisation)
  create: async (data: GymCreateRequest): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.post(ORGANISATIONS.GYMS, data);
    return response.data;
  },

  // Update gym
  update: async (
    id: string,
    data: GymUpdateRequest
  ): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.put(GYMS.BY_ID(id), data);
    return response.data;
  },

  // Update gym address
  updateAddress: async (
    id: string,
    data: AddressUpdateRequest
  ): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.put(GYMS.ADDRESS(id), data);
    return response.data;
  },

  // Update business settings
  updateBusinessSettings: async (
    id: string,
    data: BusinessSettingsUpdateRequest
  ): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.put(GYMS.BUSINESS_SETTINGS(id), data);
    return response.data;
  },

  // Delete gym
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(GYMS.BY_ID(id));
    return response.data;
  },

  // Activate gym
  activate: async (id: string): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.patch(GYMS.ACTIVATE(id));
    return response.data;
  },

  // Deactivate gym
  deactivate: async (id: string): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.patch(GYMS.DEACTIVATE(id));
    return response.data;
  },

  // Suspend gym
  suspend: async (id: string): Promise<ApiResponse<GymResponse>> => {
    const response = await apiClient.patch(GYMS.SUSPEND(id));
    return response.data;
  },

  // Get gym analytics
  getAnalytics: async (gymId: string): Promise<ApiResponse<GymAnalytics>> => {
    const response = await apiClient.get(GYMS.GYM_ANALYTICS(gymId));
    return response.data;
  },

  // Get owner analytics (all gyms)
  getOwnerAnalytics: async (): Promise<ApiResponse<GymAnalytics>> => {
    const response = await apiClient.get(GYMS.ANALYTICS);
    return response.data;
  },
};

/**
 * Gym Areas API Functions
 */
export const gymAreasAPI = {
  // Get areas by gym
  getByGym: async (gymId: string): Promise<ApiResponse<GymAreaResponse[]>> => {
    const response = await apiClient.get(GYM_AREAS.BY_GYM(gymId));
    return response.data;
  },

  // Get area by ID
  getById: async (id: string): Promise<ApiResponse<GymAreaResponse>> => {
    const response = await apiClient.get(GYM_AREAS.BY_ID(id));
    return response.data;
  },

  // Create area
  create: async (data: GymAreaCreateRequest): Promise<ApiResponse<GymAreaResponse>> => {
    const response = await apiClient.post(GYM_AREAS.BASE, data);
    return response.data;
  },

  // Update area
  update: async (
    id: string,
    data: Partial<GymAreaCreateRequest>
  ): Promise<ApiResponse<GymAreaResponse>> => {
    const response = await apiClient.put(GYM_AREAS.BY_ID(id), data);
    return response.data;
  },

  // Delete area
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(GYM_AREAS.BY_ID(id));
    return response.data;
  },
};

export default gymsAPI;
