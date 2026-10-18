/**
 * Gyms API
 * API functions for gym management
 */

import apiClient from "@/api/axios";
import { GYMS, GYM_AREAS, ORGANISATIONS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

// Gym Types
/** Mirrors backend `GymResponse` (gym/api/dto/GymResponse.java). */
export interface GymResponse {
  id: string;
  organisationId: string;
  name: string;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  logoUrl: string | null;
  address: {
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;
  /** ISO 4217 code, e.g. "NGN". */
  currency: string | null;
  timezone: string | null;
  /** JSON string, see `BusinessHours` in utils/businessHours.ts. */
  businessHours: string | null;
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

/** Form-shaped request; `gymsAPI.create` maps it to the backend's flat `CreateGymRequest`. */
export interface GymCreateRequest {
  name: string;
  description?: string;
  email: string;
  /** Required by the API. */
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  /** New gyms otherwise default to USD on the server. */
  currency?: string;
  timezone?: string;
}

/** Backend `organisation/api/dto/CreateGymRequest`. */
export function toCreateGymPayload(data: GymCreateRequest) {
  const blankToUndefined = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);
  return {
    name: data.name.trim(),
    description: blankToUndefined(data.description),
    contactEmail: data.email.trim(),
    contactPhone: data.phone.trim(),
    address: blankToUndefined(data.address.street),
    city: blankToUndefined(data.address.city),
    state: blankToUndefined(data.address.state),
    postalCode: blankToUndefined(data.address.postalCode),
    country: blankToUndefined(data.address.country),
    currency: data.currency,
    timezone: data.timezone,
  };
}

/**
 * Body of `PUT /gyms/{id}`. The backend validates name, contactEmail and contactPhone as
 * required and overwrites the whole address when any address field is sent, so callers must
 * send the current values for everything they are not changing.
 */
export interface GymUpdateRequest {
  name: string;
  contactEmail: string;
  contactPhone: string;
  description?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  logoUrl?: string;
  timezone?: string;
  currency?: string;
  maxMembers?: number;
}

export interface AddressUpdateRequest {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BusinessSettingsUpdateRequest {
  timezone?: string;
  currency?: string;
  /** JSON string, see utils/businessHours.ts */
  businessHours?: string;
  maxMembers?: number;
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
  // Get all gyms (scoped to user's organisation/gyms)
  getAll: async (): Promise<ApiResponse<GymResponse[]>> => {
    const response = await apiClient.get(GYMS.MY_GYMS);
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
    const response = await apiClient.post(ORGANISATIONS.GYMS, toCreateGymPayload(data));
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
