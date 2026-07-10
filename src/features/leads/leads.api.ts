/**
 * Leads API
 * Maps to backend LeadController (/api/leads)
 */

import apiClient from "@/api/axios";
import { LEADS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "TRIAL" | "CONVERTED" | "LOST";

export interface LeadResponse {
  id: string;
  gymId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  assignedTo: string | null;
  followUpDate: string | null;
  convertedAt: string | null;
  convertedMemberId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface LeadCreateRequest {
  gymId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  source?: string;
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
}

export const leadsAPI = {
  getAll: async (gymId: string): Promise<ApiResponse<LeadResponse[]>> => {
    const response = await apiClient.get(LEADS.BY_GYM(gymId));
    return response.data;
  },
  getByStatus: async (gymId: string, status: LeadStatus): Promise<ApiResponse<LeadResponse[]>> => {
    const response = await apiClient.get(LEADS.BY_GYM_AND_STATUS(gymId, status));
    return response.data;
  },
  getByOrganisation: async (): Promise<ApiResponse<LeadResponse[]>> => {
    const response = await apiClient.get(LEADS.ORGANISATION);
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.get(LEADS.BY_ID(id));
    return response.data;
  },
  create: async (data: LeadCreateRequest): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.post(LEADS.BASE, data);
    return response.data;
  },
  update: async (id: string, data: Partial<LeadCreateRequest>): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.put(LEADS.BY_ID(id), data);
    return response.data;
  },
  updateStatus: async (id: string, status: string): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.patch(LEADS.STATUS(id), { status });
    return response.data;
  },
  convert: async (id: string, memberId?: string): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.post(LEADS.CONVERT(id), memberId ? { memberId } : {});
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(LEADS.BY_ID(id));
    return response.data;
  },
};

export default leadsAPI;
