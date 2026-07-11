/**
 * Current-user profile hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient, { ApiResponse } from "@/api/axios";
import { USERS } from "@/api/endpoints";

export interface UserProfile {
  id: string;
  organisationId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  status: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

export function useMyProfile() {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserProfile>>(USERS.ME);
      return response.data.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateProfileRequest;
    }) => {
      const response = await apiClient.put<ApiResponse<UserProfile>>(
        USERS.PROFILE(userId),
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      toast.success("Profile updated");
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update profile";
      toast.error(msg);
    },
  });
}
