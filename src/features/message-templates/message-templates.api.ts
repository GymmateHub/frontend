import apiClient, { type ApiResponse } from "@/api/axios";
import { MESSAGE_TEMPLATES } from "@/api/endpoints";

export type MessageTemplateChannel = "EMAIL" | "NOTIFICATION";

export interface MessageTemplateConfig {
  id: string | null;
  organisationId: string | null;
  templateKey: string;
  channel: MessageTemplateChannel;
  name: string;
  description: string | null;
  subjectOrTitle: string;
  bodyTemplate: string | null;
  classpathTemplate: string | null;
  availableVariables: string | null;
  bodyCustomised: boolean;
  active: boolean;
  organisationOverride: boolean;
  updatedAt: string | null;
}

export interface UpdateMessageTemplateRequest {
  name?: string;
  description?: string;
  subjectOrTitle: string;
  bodyTemplate?: string | null;
  bodyCustomised?: boolean;
  active?: boolean;
}

/**
 * Parses the comma-separated `availableVariables` string returned by the backend
 * into a clean array of variable names.
 */
export function parseAvailableVariables(availableVariables: string | null | undefined): string[] {
  if (!availableVariables) return [];
  return availableVariables
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

const SAMPLE_VARIABLE_VALUES: Record<string, string> = {
  firstName: "Alex",
  lastName: "Morgan",
  memberName: "Alex Morgan",
  trainerName: "Coach Jamie",
  staffName: "Taylor Reed",
  userName: "Alex Morgan",
  gymName: "Iron Peak Fitness",
  organisationName: "Iron Peak Fitness",
  otpCode: "482910",
  expiryMinutes: "10",
  membershipType: "Pro All-Access",
  tierName: "Professional Plan",
  planName: "Professional Plan",
  amount: "$79.00",
  currency: "USD",
  invoiceNumber: "INV-2026-0042",
  invoiceUrl: "https://app.gymmatehub.com/billing/invoices/INV-2026-0042",
  paymentDate: "Nov 11, 2026",
  nextBillingDate: "Dec 11, 2026",
  expiryDate: "Nov 18, 2026",
  daysRemaining: "7",
  daysUntilRenewal: "3",
  failureReason: "Card declined by issuer",
  retryDate: "Nov 14, 2026",
  refundAmount: "$79.00",
  refundReason: "Duplicate charge",
  role: "TRAINER",
  position: "Front Desk Coordinator",
  inviteUrl: "https://app.gymmatehub.com/invite?token=sample",
  loginUrl: "https://app.gymmatehub.com/login",
  dashboardUrl: "https://app.gymmatehub.com/dashboard",
  disputeAmount: "$79.00",
  disputeReason: "Unrecognized charge",
  scheduledTime: "Sunday, 02:00 UTC",
  durationMinutes: "30",
  errorRate: "4.2%",
  timeWindow: "last 5 minutes",
};

/**
 * Replaces `{{var}}` and `${var}` placeholders with realistic sample values
 * so admins can preview how their configured subject/title or message body will look.
 */
export function renderTemplatePreview(
  template: string | null | undefined,
  variables: string[] = []
): string {
  if (!template) return "";
  let rendered = template;
  const allKeys = new Set([...Object.keys(SAMPLE_VARIABLE_VALUES), ...variables]);
  for (const key of allKeys) {
    const sample = SAMPLE_VARIABLE_VALUES[key] ?? `[${key}]`;
    rendered = rendered
      .replaceAll(`{{${key}}}`, sample)
      .replaceAll(`\${${key}}`, sample);
  }
  return rendered;
}

export const messageTemplatesAPI = {
  // Platform Super Admin endpoints (platform:admin)
  listPlatformTemplates: async (): Promise<ApiResponse<MessageTemplateConfig[]>> => {
    const response = await apiClient.get<ApiResponse<MessageTemplateConfig[]>>(
      MESSAGE_TEMPLATES.PLATFORM_LIST
    );
    return response.data;
  },

  getPlatformTemplate: async (templateKey: string): Promise<ApiResponse<MessageTemplateConfig>> => {
    const response = await apiClient.get<ApiResponse<MessageTemplateConfig>>(
      MESSAGE_TEMPLATES.PLATFORM_BY_KEY(templateKey)
    );
    return response.data;
  },

  updatePlatformTemplate: async (
    templateKey: string,
    data: UpdateMessageTemplateRequest
  ): Promise<ApiResponse<MessageTemplateConfig>> => {
    const response = await apiClient.put<ApiResponse<MessageTemplateConfig>>(
      MESSAGE_TEMPLATES.PLATFORM_BY_KEY(templateKey),
      data
    );
    return response.data;
  },

  resetPlatformTemplate: async (
    templateKey: string
  ): Promise<ApiResponse<MessageTemplateConfig>> => {
    const response = await apiClient.post<ApiResponse<MessageTemplateConfig>>(
      MESSAGE_TEMPLATES.PLATFORM_RESET(templateKey)
    );
    return response.data;
  },

  // Organisation / Gym Admin endpoints (org:manage)
  listOrganisationTemplates: async (): Promise<ApiResponse<MessageTemplateConfig[]>> => {
    const response = await apiClient.get<ApiResponse<MessageTemplateConfig[]>>(
      MESSAGE_TEMPLATES.ORG_LIST
    );
    return response.data;
  },

  getOrganisationTemplate: async (
    templateKey: string
  ): Promise<ApiResponse<MessageTemplateConfig>> => {
    const response = await apiClient.get<ApiResponse<MessageTemplateConfig>>(
      MESSAGE_TEMPLATES.ORG_BY_KEY(templateKey)
    );
    return response.data;
  },

  upsertOrganisationOverride: async (
    templateKey: string,
    data: UpdateMessageTemplateRequest
  ): Promise<ApiResponse<MessageTemplateConfig>> => {
    const response = await apiClient.put<ApiResponse<MessageTemplateConfig>>(
      MESSAGE_TEMPLATES.ORG_BY_KEY(templateKey),
      data
    );
    return response.data;
  },

  deleteOrganisationOverride: async (
    templateKey: string
  ): Promise<ApiResponse<MessageTemplateConfig>> => {
    const response = await apiClient.delete<ApiResponse<MessageTemplateConfig>>(
      MESSAGE_TEMPLATES.ORG_OVERRIDE(templateKey)
    );
    return response.data;
  },
};

