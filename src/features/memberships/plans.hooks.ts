/**
 * Membership Plans Hooks
 * React Query hooks for membership plan management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { plansAPI, type MembershipPlanCreateRequest } from "./plans.api";

// Query Keys
export const planKeys = {
  all: ["membership-plans"] as const,
  byGym: (gymId: string) => [...planKeys.all, "gym", gymId] as const,
  detail: (id: string) => [...planKeys.all, "detail", id] as const,
};

/**
 * Fetch plans for a gym
 */
export const usePlans = (gymId: string) => {
  return useQuery({
    queryKey: planKeys.byGym(gymId),
    queryFn: async () => {
      const response = await plansAPI.getByGym(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Create a plan
 */
export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ gymId, data }: { gymId: string; data: MembershipPlanCreateRequest }) => {
      const response = await plansAPI.create(gymId, data);
      return response.data;
    },
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast({
        title: "Plan created",
        description: `"${plan.name}" is now available to members.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating plan",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Update plan pricing
 */
export const useUpdatePlanPricing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, price, billingCycle }: { id: string; price: number; billingCycle: string }) => {
      const response = await plansAPI.updatePricing(id, price, billingCycle);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast({ title: "Pricing updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating pricing",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Toggle featured flag
 */
export const useSetPlanFeatured = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const response = await plansAPI.setFeatured(id, featured);
      return response.data;
    },
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast({ title: plan.featured ? "Plan featured" : "Plan unfeatured" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Deactivate a plan
 */
export const useDeactivatePlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await plansAPI.deactivate(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast({ title: "Plan deactivated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deactivating plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
