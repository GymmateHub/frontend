/**
 * Billing Hooks
 * React Query hooks for subscription, invoices, and payment methods
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { billingAPI } from "./billing.api";

// Query Keys
export const billingKeys = {
  all: ["billing"] as const,
  subscription: () => [...billingKeys.all, "subscription"] as const,
  tiers: () => [...billingKeys.all, "tiers"] as const,
  usage: () => [...billingKeys.all, "usage"] as const,
  invoices: () => [...billingKeys.all, "invoices"] as const,
  paymentMethods: () => [...billingKeys.all, "payment-methods"] as const,
};

/**
 * Fetch the organisation's current subscription
 */
export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: billingKeys.subscription(),
    queryFn: async () => {
      const response = await billingAPI.getCurrentSubscription();
      return response.data;
    },
  });
};

/**
 * Fetch available subscription tiers
 */
export const useSubscriptionTiers = () => {
  return useQuery({
    queryKey: billingKeys.tiers(),
    queryFn: async () => {
      const response = await billingAPI.getTiers();
      return response.data;
    },
  });
};

/**
 * Fetch current usage
 */
export const useSubscriptionUsage = () => {
  return useQuery({
    queryKey: billingKeys.usage(),
    queryFn: async () => {
      const response = await billingAPI.getCurrentUsage();
      return response.data;
    },
  });
};

/**
 * Fetch invoices
 */
export const useInvoices = () => {
  return useQuery({
    queryKey: billingKeys.invoices(),
    queryFn: async () => {
      const response = await billingAPI.getInvoices();
      return response.data;
    },
  });
};

/**
 * Fetch payment methods
 */
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: billingKeys.paymentMethods(),
    queryFn: async () => {
      const response = await billingAPI.getPaymentMethods();
      return response.data;
    },
  });
};

/**
 * Upgrade subscription
 */
export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (tierName: string) => {
      const response = await billingAPI.upgrade(tierName);
      return response.data;
    },
    onSuccess: (subscription) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
      toast({
        title: "Subscription upgraded",
        description: `You are now on the ${subscription.tierDisplayName} plan.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error upgrading subscription",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Cancel subscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reason?: string) => {
      const response = await billingAPI.cancel(reason);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
      toast({ title: "Subscription cancelled" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error cancelling subscription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Remove a payment method
 */
export const useRemovePaymentMethod = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await billingAPI.removePaymentMethod(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.paymentMethods() });
      toast({ title: "Payment method removed" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error removing payment method",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
