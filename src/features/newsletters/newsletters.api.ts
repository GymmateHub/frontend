/**
 * Newsletters API
 * Maps to backend NewsletterCampaignController and NewsletterTemplateController
 * (/api/newsletters/campaigns, /api/newsletters/templates)
 */

import apiClient from "@/api/axios";
import { NEWSLETTERS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED" | "FAILED";
export type AudienceType = "ALL_MEMBERS" | "ACTIVE_MEMBERS" | "EXPIRED_MEMBERS" | "CUSTOM";

export interface CampaignResponse {
  id: string;
  gymId: string;
  organisationId: string;
  templateId: string | null;
  name: string;
  subject: string;
  body: string;
  audienceType: AudienceType;
  audienceFilter: string | null;
  scheduledAt: string | null;
  sentAt: string | null;
  totalRecipients: number | null;
  deliveredCount: number | null;
  failedCount: number | null;
  status: CampaignStatus;
  sentByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignRequest {
  gymId?: string;
  templateId?: string;
  name: string;
  subject: string;
  body: string;
  audienceType: AudienceType;
  audienceFilter?: string;
  scheduledAt?: string;
}

export interface TemplateResponse {
  id: string;
  gymId: string;
  organisationId: string;
  name: string;
  subject: string;
  body: string;
  templateType: string;
  placeholders: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  body: string;
  templateType?: string;
  placeholders?: string;
}

export const newslettersAPI = {
  // Campaigns
  createCampaign: async (data: CreateCampaignRequest): Promise<ApiResponse<CampaignResponse>> => {
    const response = await apiClient.post(NEWSLETTERS.CAMPAIGNS, data);
    return response.data;
  },
  getCampaigns: async (gymId?: string): Promise<ApiResponse<CampaignResponse[]>> => {
    const url = gymId ? `${NEWSLETTERS.CAMPAIGNS}?gymId=${gymId}` : NEWSLETTERS.CAMPAIGNS;
    const response = await apiClient.get(url);
    return response.data;
  },
  getCampaign: async (id: string): Promise<ApiResponse<CampaignResponse>> => {
    const response = await apiClient.get(NEWSLETTERS.CAMPAIGN_BY_ID(id));
    return response.data;
  },
  previewAudience: async (id: string): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.get(NEWSLETTERS.CAMPAIGN_PREVIEW(id));
    return response.data;
  },
  scheduleCampaign: async (id: string, scheduledAt: string): Promise<ApiResponse<CampaignResponse>> => {
    const response = await apiClient.post(NEWSLETTERS.CAMPAIGN_SCHEDULE(id), { scheduledAt });
    return response.data;
  },
  sendCampaign: async (id: string): Promise<ApiResponse<CampaignResponse>> => {
    const response = await apiClient.post(NEWSLETTERS.CAMPAIGN_SEND(id));
    return response.data;
  },
  cancelCampaign: async (id: string): Promise<ApiResponse<CampaignResponse>> => {
    const response = await apiClient.post(NEWSLETTERS.CAMPAIGN_CANCEL(id));
    return response.data;
  },
  deleteCampaign: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(NEWSLETTERS.CAMPAIGN_BY_ID(id));
    return response.data;
  },

  // Templates
  createTemplate: async (data: CreateTemplateRequest): Promise<ApiResponse<TemplateResponse>> => {
    const response = await apiClient.post(NEWSLETTERS.TEMPLATES, data);
    return response.data;
  },
  getTemplates: async (gymId?: string): Promise<ApiResponse<TemplateResponse[]>> => {
    const url = gymId ? `${NEWSLETTERS.TEMPLATES}?gymId=${gymId}` : NEWSLETTERS.TEMPLATES;
    const response = await apiClient.get(url);
    return response.data;
  },
  getTemplate: async (id: string): Promise<ApiResponse<TemplateResponse>> => {
    const response = await apiClient.get(NEWSLETTERS.TEMPLATE_BY_ID(id));
    return response.data;
  },
  updateTemplate: async (id: string, data: Partial<CreateTemplateRequest>): Promise<ApiResponse<TemplateResponse>> => {
    const response = await apiClient.put(NEWSLETTERS.TEMPLATE_BY_ID(id), data);
    return response.data;
  },
  deleteTemplate: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(NEWSLETTERS.TEMPLATE_BY_ID(id));
    return response.data;
  },
};

export default newslettersAPI;
