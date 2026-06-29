/**
 * Equipment Hooks
 * React Query hooks for equipment and maintenance management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  equipmentAPI,
  maintenanceAPI,
  type EquipmentResponse,
  type EquipmentCreateRequest,
  type MaintenanceScheduleCreateRequest,
  type MaintenanceRecordCreateRequest,
} from "./equipment.api";

// Query Keys
export const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  byOrganisation: () => [...equipmentKeys.lists(), "organisation"] as const,
  byGym: (gymId: string) => [...equipmentKeys.lists(), "gym", gymId] as const,
  activeByGym: (gymId: string) => [...equipmentKeys.lists(), "gym", gymId, "active"] as const,
  details: () => [...equipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,
  maintenanceDue: (gymId: string) => [...equipmentKeys.all, "maintenance-due", gymId] as const,
  stats: () => [...equipmentKeys.all, "stats"] as const,
};

export const maintenanceKeys = {
  all: ["maintenance"] as const,
  schedules: () => [...maintenanceKeys.all, "schedules"] as const,
  pendingByGym: (gymId: string) => [...maintenanceKeys.schedules(), "pending", gymId] as const,
  dueByGym: (gymId: string) => [...maintenanceKeys.schedules(), "due", gymId] as const,
  schedule: (id: string) => [...maintenanceKeys.schedules(), "detail", id] as const,
  records: () => [...maintenanceKeys.all, "records"] as const,
  recordsByGym: (gymId: string) => [...maintenanceKeys.records(), "gym", gymId] as const,
  recordsByEquipment: (equipmentId: string) =>
    [...maintenanceKeys.records(), "equipment", equipmentId] as const,
  record: (id: string) => [...maintenanceKeys.records(), "detail", id] as const,
};

/**
 * Fetch equipment by organisation
 */
export const useEquipmentByOrganisation = () => {
  return useQuery({
    queryKey: equipmentKeys.byOrganisation(),
    queryFn: async () => {
      const response = await equipmentAPI.getByOrganisation();
      return response.data;
    },
  });
};

/**
 * Fetch equipment by gym
 */
export const useEquipment = (gymId: string) => {
  return useQuery({
    queryKey: equipmentKeys.byGym(gymId),
    queryFn: async () => {
      const response = await equipmentAPI.getByGym(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch active equipment by gym
 */
export const useActiveEquipment = (gymId: string) => {
  return useQuery({
    queryKey: equipmentKeys.activeByGym(gymId),
    queryFn: async () => {
      const response = await equipmentAPI.getActiveByGym(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch equipment by ID
 */
export const useEquipmentById = (id: string) => {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: async () => {
      const response = await equipmentAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Create equipment
 */
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: EquipmentCreateRequest) => {
      const response = await equipmentAPI.create(data);
      return response.data;
    },
    onSuccess: (newEquipment) => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      toast({
        title: "Equipment added",
        description: `${newEquipment.name} has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding equipment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update equipment
 */
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<EquipmentCreateRequest>;
    }) => {
      const response = await equipmentAPI.update(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.detail(updated.id) });
      toast({
        title: "Equipment updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating equipment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update equipment status
 */
export const useUpdateEquipmentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await equipmentAPI.updateStatus(id, status);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      toast({
        title: "Status updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Delete equipment
 */
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await equipmentAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      toast({
        title: "Equipment deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting equipment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Fetch equipment due for maintenance
 */
export const useEquipmentMaintenanceDue = (gymId: string) => {
  return useQuery({
    queryKey: equipmentKeys.maintenanceDue(gymId),
    queryFn: async () => {
      const response = await equipmentAPI.getMaintenanceDue(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch pending maintenance schedules
 */
export const usePendingMaintenanceSchedules = (gymId: string) => {
  return useQuery({
    queryKey: maintenanceKeys.pendingByGym(gymId),
    queryFn: async () => {
      const response = await maintenanceAPI.getSchedulesByGym(gymId, "pending");
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch due maintenance schedules
 */
export const useDueMaintenanceSchedules = (gymId: string) => {
  return useQuery({
    queryKey: maintenanceKeys.dueByGym(gymId),
    queryFn: async () => {
      const response = await maintenanceAPI.getSchedulesByGym(gymId, "due");
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Create maintenance schedule
 */
export const useCreateMaintenanceSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: MaintenanceScheduleCreateRequest) => {
      const response = await maintenanceAPI.createSchedule(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.schedules() });
      toast({
        title: "Maintenance scheduled",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error scheduling maintenance",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Reschedule maintenance
 */
export const useRescheduleMaintenance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, newDate }: { id: string; newDate: string }) => {
      const response = await maintenanceAPI.reschedule(id, newDate);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.schedules() });
      toast({
        title: "Maintenance rescheduled",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error rescheduling",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Complete maintenance schedule
 */
export const useCompleteMaintenanceSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { completedBy: string; notes?: string; cost?: number };
    }) => {
      const response = await maintenanceAPI.completeSchedule(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.schedules() });
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.records() });
      toast({
        title: "Maintenance completed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error completing maintenance",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Fetch maintenance records by gym
 */
export const useMaintenanceRecordsByGym = (gymId: string) => {
  return useQuery({
    queryKey: maintenanceKeys.recordsByGym(gymId),
    queryFn: async () => {
      const response = await maintenanceAPI.getRecordsByGym(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch maintenance records by equipment
 */
export const useMaintenanceRecordsByEquipment = (equipmentId: string) => {
  return useQuery({
    queryKey: maintenanceKeys.recordsByEquipment(equipmentId),
    queryFn: async () => {
      const response = await maintenanceAPI.getRecordsByEquipment(equipmentId);
      return response.data;
    },
    enabled: !!equipmentId,
  });
};

/**
 * Create maintenance record
 */
export const useCreateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: MaintenanceRecordCreateRequest) => {
      const response = await maintenanceAPI.createRecord(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceKeys.records() });
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      toast({
        title: "Maintenance recorded",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error recording maintenance",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Get equipment stats by aggregating equipment data
 */
export const useEquipmentStats = () => {
  return useQuery({
    queryKey: equipmentKeys.stats(),
    queryFn: async () => {
      // Fetch all equipment for the organisation
      const response = await equipmentAPI.getByOrganisation();
      const equipment = response.data || [];

      // Calculate stats from equipment list
      const totalEquipment = equipment.length;
      const operational = equipment.filter((e: EquipmentResponse) => e.status === 'OPERATIONAL' || e.status === 'operational').length;
      const needsMaintenance = equipment.filter((e: EquipmentResponse) => e.status === 'NEEDS_MAINTENANCE' || e.status === 'needs_maintenance' || e.status === 'MAINTENANCE_DUE').length;
      const outOfOrder = equipment.filter((e: EquipmentResponse) => e.status === 'OUT_OF_ORDER' || e.status === 'out_of_order' || e.status === 'BROKEN').length;

      return {
        totalEquipment,
        operational,
        needsMaintenance,
        outOfOrder,
        maintenanceCostThisMonth: 0, // Would need a separate maintenance costs endpoint
        operationalChange: operational > 0 ? `${operational}` : "0",
        maintenanceChange: needsMaintenance > 0 ? `${needsMaintenance}` : "0",
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

