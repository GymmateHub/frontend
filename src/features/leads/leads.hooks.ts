/**
 * Leads Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { leadsAPI, type LeadCreateRequest } from "./leads.api";

export const leadKeys = {
  all: ["leads"] as const,
  byGym: (gymId: string) => [...leadKeys.all, gymId] as const,
  detail: (id: string) => [...leadKeys.all, "detail", id] as const,
};

export const useLeads = (gymId: string) => {
  return useQuery({
    queryKey: leadKeys.byGym(gymId),
    queryFn: async () => { const r = await leadsAPI.getAll(gymId); return r.data; },
    enabled: !!gymId,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: async () => { const r = await leadsAPI.getById(id); return r.data; },
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: LeadCreateRequest) => { const r = await leadsAPI.create(data); return r.data; },
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      toast({ title: "Lead added", description: `${lead.firstName} ${lead.lastName} has been added.` });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LeadCreateRequest> }) => {
      const r = await leadsAPI.update(id, data); return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      toast({ title: "Lead updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const r = await leadsAPI.updateStatus(id, status); return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      toast({ title: "Status updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};

export const useConvertLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => { const r = await leadsAPI.convert(id); return r.data; },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      toast({ title: "Lead converted", description: "Lead has been converted to a member." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => { await leadsAPI.delete(id); return id; },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      toast({ title: "Lead deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};
