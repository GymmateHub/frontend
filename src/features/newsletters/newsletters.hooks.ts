/**
 * Newsletters Hooks
 * React Query hooks for newsletter campaigns and templates
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { newslettersAPI, type CreateCampaignRequest, type CreateTemplateRequest } from "./newsletters.api";

// Query Keys
export const newsletterKeys = {
  all: ["newsletters"] as const,
  campaigns: () => [...newsletterKeys.all, "campaigns"] as const,
  campaign: (id: string) => [...newsletterKeys.campaigns(), id] as const,
  templates: () => [...newsletterKeys.all, "templates"] as const,
  template: (id: string) => [...newsletterKeys.templates(), id] as const,
};

/**
 * Fetch all campaigns
 */
export const useCampaigns = (gymId?: string) => {
  return useQuery({
    queryKey: [...newsletterKeys.campaigns(), gymId],
    queryFn: async () => {
      const response = await newslettersAPI.getCampaigns(gymId);
      return response.data;
    },
  });
};

/**
 * Fetch a single campaign
 */
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: newsletterKeys.campaign(id),
    queryFn: async () => {
      const response = await newslettersAPI.getCampaign(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch all templates
 */
export const useNewsletterTemplates = (gymId?: string) => {
  return useQuery({
    queryKey: [...newsletterKeys.templates(), gymId],
    queryFn: async () => {
      const response = await newslettersAPI.getTemplates(gymId);
      return response.data;
    },
  });
};

/**
 * Create a campaign
 */
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateCampaignRequest) => {
      const response = await newslettersAPI.createCampaign(data);
      return response.data;
    },
    onSuccess: (campaign) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.campaigns() });
      toast({
        title: "Campaign created",
        description: `"${campaign.name}" has been saved as a draft.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating campaign",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Send a campaign immediately
 */
export const useSendCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await newslettersAPI.sendCampaign(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.campaigns() });
      toast({ title: "Campaign is being sent" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Schedule a campaign
 */
export const useScheduleCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, scheduledAt }: { id: string; scheduledAt: string }) => {
      const response = await newslettersAPI.scheduleCampaign(id, scheduledAt);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.campaigns() });
      toast({ title: "Campaign scheduled" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error scheduling campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Cancel a scheduled campaign
 */
export const useCancelCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await newslettersAPI.cancelCampaign(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.campaigns() });
      toast({ title: "Campaign cancelled" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error cancelling campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Delete a draft campaign
 */
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await newslettersAPI.deleteCampaign(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.campaigns() });
      toast({ title: "Campaign deleted" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting campaign",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Create a template
 */
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTemplateRequest) => {
      const response = await newslettersAPI.createTemplate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.templates() });
      toast({ title: "Template created" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
