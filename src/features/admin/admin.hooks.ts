/**
 * Platform admin hooks (SUPER_ADMIN only endpoints)
 */

import { useQuery } from "@tanstack/react-query";
import apiClient, { ApiResponse } from "@/api/axios";
import { ADMIN } from "@/api/endpoints";

export interface OrganisationSummary {
  id: string;
  name: string;
  slug: string;
  contactEmail: string | null;
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
  gymCount: number;
  createdAt: string;
}

export interface PlatformOverview {
  totalOrganisations: number;
  totalGyms: number;
  totalUsers: number;
  totalOwners: number;
  totalMembers: number;
  recentOrganisations: OrganisationSummary[];
}

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  ownerName: string | null;
  contactEmail: string | null;
  gymCount: number;
  memberCount: number;
  plan: string | null;
  status: "active" | "suspended" | "pending";
  createdAt: string;
}

export function useTenants() {
  return useQuery({
    queryKey: ["admin", "organisations"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TenantSummary[]>>(
        ADMIN.ORGANISATIONS
      );
      return response.data.data;
    },
  });
}

export function usePlatformOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PlatformOverview>>(
        ADMIN.OVERVIEW
      );
      return response.data.data;
    },
  });
}
