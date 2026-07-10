/**
 * Point of Sale Hooks
 * React Query hooks for POS sales, cash drawer, and reports
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { posAPI, type CreateSaleRequest, type CompleteSaleRequest } from "./pos.api";

// Query Keys
export const posKeys = {
  all: ["pos"] as const,
  sales: () => [...posKeys.all, "sales"] as const,
  sale: (saleId: string) => [...posKeys.sales(), saleId] as const,
  salesByGym: (gymId: string) => [...posKeys.sales(), "gym", gymId] as const,
  todaySales: (gymId: string) => [...posKeys.sales(), "gym", gymId, "today"] as const,
  salesByMember: (memberId: string) => [...posKeys.sales(), "member", memberId] as const,
  drawer: (gymId: string) => [...posKeys.all, "drawer", gymId] as const,
  drawerHistory: (gymId: string) => [...posKeys.all, "drawer", gymId, "history"] as const,
  summary: (gymId: string, startDate: string, endDate: string) =>
    [...posKeys.all, "summary", gymId, startDate, endDate] as const,
};

/**
 * Fetch all sales for a gym
 */
export const useSalesByGym = (gymId: string) => {
  return useQuery({
    queryKey: posKeys.salesByGym(gymId),
    queryFn: async () => {
      const response = await posAPI.getSalesByGym(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch today's sales for a gym
 */
export const useTodaySales = (gymId: string) => {
  return useQuery({
    queryKey: posKeys.todaySales(gymId),
    queryFn: async () => {
      const response = await posAPI.getTodaySales(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch a single sale
 */
export const useSale = (saleId: string) => {
  return useQuery({
    queryKey: posKeys.sale(saleId),
    queryFn: async () => {
      const response = await posAPI.getSale(saleId);
      return response.data;
    },
    enabled: !!saleId,
  });
};

/**
 * Fetch current cash drawer for a gym
 */
export const useCurrentDrawer = (gymId: string) => {
  return useQuery({
    queryKey: posKeys.drawer(gymId),
    queryFn: async () => {
      const response = await posAPI.getCurrentDrawer(gymId);
      return response.data;
    },
    enabled: !!gymId,
    retry: false,
  });
};

/**
 * Fetch POS sales summary for a date range
 */
export const usePosSummary = (gymId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: posKeys.summary(gymId, startDate, endDate),
    queryFn: async () => {
      const response = await posAPI.getSummaryReport(gymId, startDate, endDate);
      return response.data;
    },
    enabled: !!gymId && !!startDate && !!endDate,
  });
};

/**
 * Create and complete a sale in one step (quick checkout)
 */
export const useQuickSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSaleRequest) => {
      const response = await posAPI.quickSale(data);
      return response.data;
    },
    onSuccess: (sale) => {
      queryClient.invalidateQueries({ queryKey: posKeys.all });
      toast({
        title: "Sale completed",
        description: `Sale ${sale.saleNumber} for $${sale.totalAmount.toFixed(2)} processed successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error processing sale",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Complete a pending sale with payment
 */
export const useCompleteSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ saleId, data }: { saleId: string; data: CompleteSaleRequest }) => {
      const response = await posAPI.completeSale(saleId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posKeys.all });
      toast({ title: "Sale completed" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error completing sale",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Cancel a pending sale
 */
export const useCancelSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (saleId: string) => {
      const response = await posAPI.cancelSale(saleId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posKeys.all });
      toast({ title: "Sale cancelled" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error cancelling sale",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Refund a completed sale
 */
export const useRefundSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ saleId, amount, reason }: { saleId: string; amount: number; reason?: string }) => {
      const response = await posAPI.refundSale(saleId, amount, reason);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posKeys.all });
      toast({ title: "Refund processed" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error processing refund",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
