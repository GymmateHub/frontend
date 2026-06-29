/**
 * Members API
 * API functions for member management
 */

import apiClient from "@/api/axios";
import { MEMBERS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

// Member Types
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plan: string;
  status: "active" | "inactive" | "expired" | "suspended" | "cancelled";
  joinDate: string;
  lastVisit: string;
  totalVisits: number;
  revenue: number;
}

export interface MemberResponse {
  id: string;
  userId: string;
  gymId: string;
  organisationId: string;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  healthInfo: {
    bloodType: string;
    allergies: string[];
    medicalConditions: string[];
    medications: string[];
  };
  fitnessGoals: string[];
  status: string;
  waiverSigned: boolean;
  waiverSignedAt: string;
  joinedAt: string;
  activatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface MemberUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  newThisMonth: number;
  monthlyRevenue: number;
  totalMembersChange: string;
  activeMembersChange: string;
  newMembersChange: string;
  revenueChange: string;
}

/**
 * Members API Functions
 */
export const membersAPI = {
  // Get all members
  getAll: async (): Promise<ApiResponse<MemberResponse[]>> => {
    const response = await apiClient.get(MEMBERS.BASE);
    return response.data;
  },

  // Get active members
  getActive: async (): Promise<ApiResponse<MemberResponse[]>> => {
    const response = await apiClient.get(MEMBERS.ACTIVE);
    return response.data;
  },

  // Get members by gym
  getByGym: async (gymId: string): Promise<ApiResponse<MemberResponse[]>> => {
    const response = await apiClient.get(MEMBERS.BY_GYM(gymId));
    return response.data;
  },

  // Get member by ID
  getById: async (id: string): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.get(MEMBERS.BY_ID(id));
    return response.data;
  },

  // Get member by user ID
  getByUserId: async (userId: string): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.get(MEMBERS.BY_USER(userId));
    return response.data;
  },

  // Get members by status
  getByStatus: async (status: string): Promise<ApiResponse<MemberResponse[]>> => {
    const response = await apiClient.get(MEMBERS.BY_STATUS(status));
    return response.data;
  },

  // Create member
  create: async (data: MemberCreateRequest): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.post(MEMBERS.BASE, data);
    return response.data;
  },

  // Update member health info
  updateHealthInfo: async (
    id: string,
    data: MemberResponse["healthInfo"]
  ): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.put(MEMBERS.HEALTH_INFO(id), data);
    return response.data;
  },

  // Update member fitness goals
  updateFitnessGoals: async (
    id: string,
    goals: string[]
  ): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.put(MEMBERS.FITNESS_GOALS(id), { goals });
    return response.data;
  },

  // Update emergency contact
  updateEmergencyContact: async (
    id: string,
    data: MemberResponse["emergencyContact"]
  ): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.put(MEMBERS.EMERGENCY_CONTACT(id), data);
    return response.data;
  },

  // Activate member
  activate: async (id: string): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.patch(MEMBERS.ACTIVATE(id));
    return response.data;
  },

  // Suspend member
  suspend: async (id: string): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.patch(MEMBERS.SUSPEND(id));
    return response.data;
  },

  // Cancel member
  cancel: async (id: string): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.patch(MEMBERS.CANCEL(id));
    return response.data;
  },

  // Sign waiver
  signWaiver: async (id: string): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.patch(MEMBERS.SIGN_WAIVER(id));
    return response.data;
  },
};

export default membersAPI;
