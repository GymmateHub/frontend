/**
 * Billing API
 * Maps to backend SubscriptionController (/api/subscriptions) and
 * PaymentController (/api/subscriptions/payments)
 */

import apiClient from "@/api/axios";
import { SUBSCRIPTIONS, SUBSCRIPTION_PAYMENTS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

export interface SubscriptionResponse {
  id: string;
  organisationId: string;
  tierName: string;
  tierDisplayName: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean | null;
  cancelledAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
  currentMemberCount: number | null;
  maxMembers: number | null;
  price: number | null;
  billingCycle: string | null;
  apiRequestsPerHour: number | null;
  apiBurstLimit: number | null;
  smsCreditsPerMonth: number | null;
  emailCreditsPerMonth: number | null;
  isActive: boolean | null;
  isInTrial: boolean | null;
  hasExceededMemberLimit: boolean | null;
  memberOverage: number | null;
  hasStripeSubscription: boolean | null;
  hasPaymentMethod: boolean | null;
  daysRemainingInTrial: number | null;
  daysUntilRenewal: number | null;
}

export interface SubscriptionTierResponse {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  price: number;
  billingCycle: string;
  maxMembers: number | null;
  featured: boolean;
  features: string[] | null;
  [key: string]: unknown;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  dueDate: string | null;
  paidAt: string | null;
  invoicePdfUrl: string | null;
  hostedInvoiceUrl: string | null;
  createdAt: string;
}

export interface PaymentMethodResponse {
  id: string;
  type: string;
  cardBrand: string | null;
  lastFour: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  isDefault: boolean | null;
}

export const billingAPI = {
  getCurrentSubscription: async (): Promise<ApiResponse<SubscriptionResponse>> => {
    const response = await apiClient.get(SUBSCRIPTIONS.CURRENT);
    return response.data;
  },
  getTiers: async (): Promise<ApiResponse<SubscriptionTierResponse[]>> => {
    const response = await apiClient.get(SUBSCRIPTIONS.TIERS);
    return response.data;
  },
  upgrade: async (tierName: string): Promise<ApiResponse<SubscriptionResponse>> => {
    const response = await apiClient.post(SUBSCRIPTIONS.UPGRADE, { tierName });
    return response.data;
  },
  downgrade: async (tierName: string): Promise<ApiResponse<SubscriptionResponse>> => {
    const response = await apiClient.post(SUBSCRIPTIONS.DOWNGRADE, { tierName });
    return response.data;
  },
  cancel: async (reason?: string): Promise<ApiResponse<SubscriptionResponse>> => {
    const response = await apiClient.post(SUBSCRIPTIONS.CANCEL, { reason });
    return response.data;
  },
  reactivate: async (): Promise<ApiResponse<SubscriptionResponse>> => {
    const response = await apiClient.post(SUBSCRIPTIONS.REACTIVATE);
    return response.data;
  },
  getCurrentUsage: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get(SUBSCRIPTIONS.USAGE_CURRENT);
    return response.data;
  },
  getInvoices: async (): Promise<ApiResponse<InvoiceResponse[]>> => {
    const response = await apiClient.get(SUBSCRIPTION_PAYMENTS.INVOICES);
    return response.data;
  },
  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethodResponse[]>> => {
    const response = await apiClient.get(SUBSCRIPTION_PAYMENTS.METHODS);
    return response.data;
  },
  attachPaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<PaymentMethodResponse>> => {
    const response = await apiClient.post(SUBSCRIPTION_PAYMENTS.METHODS, { paymentMethodId });
    return response.data;
  },
  removePaymentMethod: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(SUBSCRIPTION_PAYMENTS.METHOD_BY_ID(id));
    return response.data;
  },
};

export default billingAPI;
