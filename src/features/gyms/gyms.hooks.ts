/**
 * Gyms Hooks
 * React Query hooks for gym management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  gymsAPI,
  gymAreasAPI,
  type GymCreateRequest,
  type GymUpdateRequest,
  type AddressUpdateRequest,
  type BusinessSettingsUpdateRequest,
  type GymAreaCreateRequest,
} from "./gyms.api";

// Query Keys
export const gymKeys = {
  all: ["gyms"] as const,
  lists: () => [...gymKeys.all, "list"] as const,
  myGyms: () => [...gymKeys.lists(), "my-gyms"] as const,
  active: () => [...gymKeys.lists(), "active"] as const,
  details: () => [...gymKeys.all, "detail"] as const,
  detail: (id: string) => [...gymKeys.details(), id] as const,
  analytics: (gymId: string) => [...gymKeys.all, "analytics", gymId] as const,
  ownerAnalytics: () => [...gymKeys.all, "owner-analytics"] as const,
};

export const gymAreaKeys = {
  all: ["gym-areas"] as const,
  byGym: (gymId: string) => [...gymAreaKeys.all, gymId] as const,
  detail: (id: string) => [...gymAreaKeys.all, "detail", id] as const,
};

/**
 * Fetch all gyms
 */
export const useGyms = () => {
  return useQuery({
    queryKey: gymKeys.lists(),
    queryFn: async () => {
      const response = await gymsAPI.getAll();
      return response.data;
    },
  });
};

/**
 * Fetch my gyms (for owners)
 */
export const useMyGyms = () => {
  return useQuery({
    queryKey: gymKeys.myGyms(),
    queryFn: async () => {
      const response = await gymsAPI.getMyGyms();
      return response.data;
    },
  });
};

/**
 * Fetch active gyms
 */
export const useActiveGyms = () => {
  return useQuery({
    queryKey: gymKeys.active(),
    queryFn: async () => {
      const response = await gymsAPI.getActive();
      return response.data;
    },
  });
};

/**
 * Fetch gym by ID
 */
export const useGym = (id: string) => {
  return useQuery({
    queryKey: gymKeys.detail(id),
    queryFn: async () => {
      const response = await gymsAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Create gym
 */
export const useCreateGym = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GymCreateRequest) => {
      const response = await gymsAPI.create(data);
      return response.data;
    },
    onSuccess: (newGym) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.lists() });
      toast({
        title: "Gym created successfully",
        description: `${newGym.name} has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating gym",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update gym
 */
export const useUpdateGym = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: GymUpdateRequest }) => {
      const response = await gymsAPI.update(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.lists() });
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(updated.id) });
      toast({
        title: "Gym updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating gym",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update gym address
 */
export const useUpdateGymAddress = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AddressUpdateRequest;
    }) => {
      const response = await gymsAPI.updateAddress(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(updated.id) });
      toast({
        title: "Address updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating address",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update gym business settings
 */
export const useUpdateGymBusinessSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: BusinessSettingsUpdateRequest;
    }) => {
      const response = await gymsAPI.updateBusinessSettings(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: gymKeys.detail(updated.id) });
      toast({
        title: "Business settings updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Delete gym
 */
export const useDeleteGym = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await gymsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.lists() });
      toast({
        title: "Gym deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting gym",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Activate gym
 */
export const useActivateGym = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await gymsAPI.activate(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.all });
      toast({
        title: "Gym activated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error activating gym",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Deactivate gym
 */
export const useDeactivateGym = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await gymsAPI.deactivate(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.all });
      toast({
        title: "Gym deactivated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deactivating gym",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Suspend gym
 */
export const useSuspendGym = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await gymsAPI.suspend(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymKeys.all });
      toast({
        title: "Gym suspended",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error suspending gym",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Fetch gym analytics
 */
export const useGymAnalytics = (gymId: string) => {
  return useQuery({
    queryKey: gymKeys.analytics(gymId),
    queryFn: async () => {
      const response = await gymsAPI.getAnalytics(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch owner analytics (all gyms)
 */
export const useOwnerAnalytics = () => {
  return useQuery({
    queryKey: gymKeys.ownerAnalytics(),
    queryFn: async () => {
      const response = await gymsAPI.getOwnerAnalytics();
      return response.data;
    },
  });
};

/**
 * Fetch gym areas
 */
export const useGymAreas = (gymId: string) => {
  return useQuery({
    queryKey: gymAreaKeys.byGym(gymId),
    queryFn: async () => {
      const response = await gymAreasAPI.getByGym(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Create gym area
 */
export const useCreateGymArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GymAreaCreateRequest) => {
      const response = await gymAreasAPI.create(data);
      return response.data;
    },
    onSuccess: (newArea) => {
      queryClient.invalidateQueries({ queryKey: gymAreaKeys.all });
      toast({
        title: "Area created",
        description: `${newArea.name} has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating area",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update gym area
 */
export const useUpdateGymArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<GymAreaCreateRequest>;
    }) => {
      const response = await gymAreasAPI.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymAreaKeys.all });
      toast({
        title: "Area updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating area",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Delete gym area
 */
export const useDeleteGymArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await gymAreasAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymAreaKeys.all });
      toast({
        title: "Area deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting area",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
