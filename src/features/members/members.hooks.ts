/**
 * Members Hooks
 * React Query hooks for member management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { membersAPI, type MemberResponse, type MemberCreateRequest } from "./members.api";

// Query Keys
export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...memberKeys.lists(), filters] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
  stats: () => [...memberKeys.all, "stats"] as const,
  active: () => [...memberKeys.all, "active"] as const,
  byGym: (gymId: string) => [...memberKeys.all, "gym", gymId] as const,
  byStatus: (status: string) => [...memberKeys.all, "status", status] as const,
};

/**
 * Fetch all members
 */
export const useMembers = () => {
  return useQuery({
    queryKey: memberKeys.lists(),
    queryFn: async () => {
      const response = await membersAPI.getAll();
      return response.data;
    },
  });
};

/**
 * Fetch active members
 */
export const useActiveMembers = () => {
  return useQuery({
    queryKey: memberKeys.active(),
    queryFn: async () => {
      const response = await membersAPI.getActive();
      return response.data;
    },
  });
};

/**
 * Fetch members by gym
 */
export const useMembersByGym = (gymId: string) => {
  return useQuery({
    queryKey: memberKeys.byGym(gymId),
    queryFn: async () => {
      const response = await membersAPI.getByGym(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch member by ID
 */
export const useMember = (id: string) => {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: async () => {
      const response = await membersAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch members by status
 */
export const useMembersByStatus = (status: string) => {
  return useQuery({
    queryKey: memberKeys.byStatus(status),
    queryFn: async () => {
      const response = await membersAPI.getByStatus(status);
      return response.data;
    },
    enabled: !!status,
  });
};

/**
 * Create new member
 */
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: MemberCreateRequest) => {
      const response = await membersAPI.create(data);
      return response.data;
    },
    onSuccess: (newMember) => {
      // Invalidate and refetch members list
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });

      toast({
        title: "Member created successfully",
        description: `${newMember.firstName} ${newMember.lastName} has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating member",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Update member health info
 */
export const useUpdateMemberHealthInfo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: MemberResponse["healthInfo"];
    }) => {
      const response = await membersAPI.updateHealthInfo(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) });
      toast({
        title: "Health info updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating health info",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update member fitness goals
 */
export const useUpdateMemberFitnessGoals = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, goals }: { id: string; goals: string[] }) => {
      const response = await membersAPI.updateFitnessGoals(id, goals);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) });
      toast({
        title: "Fitness goals updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating fitness goals",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Activate member
 */
export const useActivateMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await membersAPI.activate(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      toast({
        title: "Member activated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error activating member",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Suspend member
 */
export const useSuspendMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await membersAPI.suspend(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      toast({
        title: "Member suspended",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error suspending member",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Cancel member
 */
export const useCancelMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await membersAPI.cancel(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
      toast({
        title: "Member cancelled",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error cancelling member",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Sign waiver
 */
export const useSignWaiver = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await membersAPI.signWaiver(id);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) });
      toast({
        title: "Waiver signed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error signing waiver",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Get member stats from analytics API
 */
export const useMemberStats = () => {
  return useQuery({
    queryKey: memberKeys.stats(),
    queryFn: async () => {
      // Fetch analytics data for member stats
      const { analyticsAPI } = await import("@/features/analytics/analytics.api");
      const response = await analyticsAPI.getAllGymsAnalytics();
      const data = response.data;

      // Transform analytics data to member stats format
      return {
        totalMembers: data.totalMembers || 0,
        activeMembers: data.activeMembers || 0,
        newThisMonth: data.newMembersThisMonth || 0,
        monthlyRevenue: data.monthlyRevenue || 0,
        totalMembersChange: data.growthRate ? `${data.growthRate >= 0 ? '+' : ''}${data.growthRate.toFixed(1)}%` : "+0%",
        activeMembersChange: data.memberRetentionRate ? `${data.memberRetentionRate.toFixed(1)}%` : "0%",
        newMembersChange: data.newMembersThisMonth > 0 ? `+${data.newMembersThisMonth}` : "0",
        revenueChange: data.growthRate ? `${data.growthRate >= 0 ? '+' : ''}${data.growthRate.toFixed(1)}%` : "+0%",
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

