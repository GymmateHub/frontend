/**
 * Classes Hooks
 * React Query hooks for class management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  classesAPI,
  type ClassCreateRequest,
  type ClassScheduleCreateRequest,
  type ClassCategoryCreateRequest,
} from "./classes.api";

// Query Keys
export const classKeys = {
  all: ["classes"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (gymId: string) => [...classKeys.lists(), gymId] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
  schedules: () => [...classKeys.all, "schedules"] as const,
  schedulesByGym: (gymId: string) => [...classKeys.schedules(), gymId] as const,
  schedule: (id: string) => [...classKeys.schedules(), "detail", id] as const,
  categories: () => [...classKeys.all, "categories"] as const,
  categoriesByGym: (gymId: string) => [...classKeys.categories(), gymId] as const,
  stats: () => [...classKeys.all, "stats"] as const,
};

/**
 * Fetch classes by gym
 */
export const useClasses = (gymId: string) => {
  return useQuery({
    queryKey: classKeys.list(gymId),
    queryFn: async () => {
      const response = await classesAPI.getAll(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Fetch class by ID
 */
export const useClass = (id: string) => {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: async () => {
      const response = await classesAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Create class
 */
export const useCreateClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ClassCreateRequest) => {
      const response = await classesAPI.create(data);
      return response.data;
    },
    onSuccess: (newClass) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast({
        title: "Class created successfully",
        description: `${newClass.name} has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating class",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update class
 */
export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ClassCreateRequest>;
    }) => {
      const response = await classesAPI.update(id, data);
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(updated.id) });
      toast({
        title: "Class updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating class",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Delete class
 */
export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await classesAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast({
        title: "Class deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting class",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Fetch class schedules by gym
 */
export const useClassSchedules = (gymId: string) => {
  return useQuery({
    queryKey: classKeys.schedulesByGym(gymId),
    queryFn: async () => {
      const response = await classesAPI.getSchedules(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Create class schedule
 */
export const useCreateClassSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ClassScheduleCreateRequest) => {
      const response = await classesAPI.createSchedule(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.schedules() });
      toast({
        title: "Schedule created",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating schedule",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Update class schedule
 */
export const useUpdateClassSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ClassScheduleCreateRequest>;
    }) => {
      const response = await classesAPI.updateSchedule(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.schedules() });
      toast({
        title: "Schedule updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating schedule",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Delete class schedule
 */
export const useDeleteClassSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await classesAPI.deleteSchedule(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.schedules() });
      toast({
        title: "Schedule deleted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting schedule",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Fetch class categories by gym
 */
export const useClassCategories = (gymId: string) => {
  return useQuery({
    queryKey: classKeys.categoriesByGym(gymId),
    queryFn: async () => {
      const response = await classesAPI.getCategories(gymId);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Create class category
 */
export const useCreateClassCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ClassCategoryCreateRequest) => {
      const response = await classesAPI.createCategory(data);
      return response.data;
    },
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: classKeys.categories() });
      toast({
        title: "Category created",
        description: `${newCategory.name} has been added.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/**
 * Get class stats from analytics API
 */
export const useClassStats = () => {
  return useQuery({
    queryKey: classKeys.stats(),
    queryFn: async () => {
      // Fetch analytics data for class stats
      const { analyticsAPI } = await import("@/features/analytics/analytics.api");
      const response = await analyticsAPI.getAllGymsAnalytics();
      const data = response.data;

      // Get top class info if available
      const topClass = data.topClasses?.[0];

      // Transform analytics data to class stats format
      return {
        totalClasses: data.classesThisMonth || 0,
        averageAttendance: data.averageAttendance || 0,
        popularTime: topClass?.name || "N/A",
        monthlyRevenue: data.monthlyRevenue || 0,
        totalClassesChange: data.classesThisMonth > 0 ? `+${data.classesThisMonth}` : "0",
        attendanceChange: data.averageAttendance ? `${data.averageAttendance.toFixed(1)}%` : "0%",
        revenueChange: data.growthRate ? `${data.growthRate >= 0 ? '+' : ''}${data.growthRate.toFixed(1)}%` : "+0%",
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

