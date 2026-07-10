/**
 * Notifications Hooks
 * React Query hooks for notifications
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { notificationsAPI } from "./notifications.api";

// Query Keys
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (page: number, size: number) => [...notificationKeys.lists(), page, size] as const,
  unread: (page: number, size: number) => [...notificationKeys.all, "unread", page, size] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
  detail: (id: string) => [...notificationKeys.all, "detail", id] as const,
  byGym: (gymId: string, page: number, size: number) =>
    [...notificationKeys.all, "gym", gymId, page, size] as const,
};

/**
 * Fetch paginated notifications for the current organisation
 */
export const useNotifications = (page = 0, size = 20) => {
  return useQuery({
    queryKey: notificationKeys.list(page, size),
    queryFn: async () => {
      const response = await notificationsAPI.getAll(page, size);
      return response.data;
    },
  });
};

/**
 * Fetch unread notifications
 */
export const useUnreadNotifications = (page = 0, size = 20) => {
  return useQuery({
    queryKey: notificationKeys.unread(page, size),
    queryFn: async () => {
      const response = await notificationsAPI.getUnread(page, size);
      return response.data;
    },
  });
};

/**
 * Fetch unread notification count (for badges)
 */
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await notificationsAPI.getUnreadCount();
      return response.data.count;
    },
    refetchInterval: 60 * 1000,
  });
};

/**
 * Fetch notifications for a specific gym
 */
export const useGymNotifications = (gymId: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: notificationKeys.byGym(gymId, page, size),
    queryFn: async () => {
      const response = await notificationsAPI.getByGym(gymId, page, size);
      return response.data;
    },
    enabled: !!gymId,
  });
};

/**
 * Mark a single notification as read
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await notificationsAPI.markRead(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

/**
 * Mark all notifications as read
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationsAPI.markAllRead();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast({
        title: "All notifications marked as read",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error marking notifications as read",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
