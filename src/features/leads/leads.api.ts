/**
 * Leads API - placeholder for custom lead management
 */

import apiClient from "@/api/axios";
import type { ApiResponse } from "@/api/axios";

export interface LeadResponse {
  id: string;
  gymId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  assignedTo: string;
  followUpDate: string;
  convertedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
}

// Note: Leads endpoints may need to be added to the backend
// Using placeholder endpoints for now
export const leadsAPI = {
  getAll: async (gymId: string): Promise<ApiResponse<LeadResponse[]>> => {
    const response = await apiClient.get(`/leads/gym/${gymId}`);
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.get(`/leads/${id}`);
    return response.data;
  },
  create: async (data: LeadCreateRequest): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.post("/leads", data);
    return response.data;
  },
  update: async (id: string, data: Partial<LeadCreateRequest>): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.put(`/leads/${id}`, data);
    return response.data;
  },
  updateStatus: async (id: string, status: string): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.patch(`/leads/${id}/status`, { status });
    return response.data;
  },
  convert: async (id: string): Promise<ApiResponse<LeadResponse>> => {
    const response = await apiClient.post(`/leads/${id}/convert`);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/leads/${id}`);
    return response.data;
  },
};

export default leadsAPI;
