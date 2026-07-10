/**
 * Notifications API
 * Maps to backend NotificationController (/api/notifications)
 */

import apiClient from "@/api/axios";
import { NOTIFICATIONS } from "@/api/endpoints";
import type { ApiResponse, PagedResponse } from "@/api/axios";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface NotificationResponse {
  id: string;
  organisationId: string;
  gymId: string | null;
  scope: string | null;
  title: string;
  message: string;
  priority: NotificationPriority;
  eventType: string;
  metadata: string | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  recipientRole: string | null;
  readAt: string | null;
  read: boolean;
  deliveredVia: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

export const notificationsAPI = {
  getAll: async (page = 0, size = 20): Promise<ApiResponse<PagedResponse<NotificationResponse>>> => {
    const response = await apiClient.get(NOTIFICATIONS.BASE, { params: { page, size } });
    return response.data;
  },
  getUnread: async (page = 0, size = 20): Promise<ApiResponse<PagedResponse<NotificationResponse>>> => {
    const response = await apiClient.get(NOTIFICATIONS.UNREAD, { params: { page, size } });
    return response.data;
  },
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get(NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<NotificationResponse>> => {
    const response = await apiClient.get(NOTIFICATIONS.BY_ID(id));
    return response.data;
  },
  markRead: async (id: string): Promise<ApiResponse<NotificationResponse>> => {
    const response = await apiClient.patch(NOTIFICATIONS.MARK_READ(id));
    return response.data;
  },
  markAllRead: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post(NOTIFICATIONS.MARK_ALL_READ);
    return response.data;
  },
  getByGym: async (gymId: string, page = 0, size = 20): Promise<ApiResponse<PagedResponse<NotificationResponse>>> => {
    const response = await apiClient.get(NOTIFICATIONS.BY_GYM(gymId), { params: { page, size } });
    return response.data;
  },
  getGymUnread: async (gymId: string, page = 0, size = 20): Promise<ApiResponse<PagedResponse<NotificationResponse>>> => {
    const response = await apiClient.get(NOTIFICATIONS.GYM_UNREAD(gymId), { params: { page, size } });
    return response.data;
  },
  getGymUnreadCount: async (gymId: string): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get(NOTIFICATIONS.GYM_UNREAD_COUNT(gymId));
    return response.data;
  },
  markAllReadForGym: async (gymId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post(NOTIFICATIONS.GYM_MARK_ALL_READ(gymId));
    return response.data;
  },
};

export default notificationsAPI;
