/**
 * Classes API
 * API functions for class management
 */

import apiClient from "@/api/axios";
import { CLASSES, CLASS_SCHEDULES, CLASS_CATEGORIES } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

// Class Types
export interface Class {
  id: string;
  name: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  enrolled: number;
  price: number;
  description: string;
  category: string;
}

export interface ClassResponse {
  id: string;
  gymId: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  defaultDuration: number;
  defaultCapacity: number;
  difficultyLevel: string;
  caloriesBurnedEstimate: number;
  equipmentNeeded: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassScheduleResponse {
  id: string;
  classId: string;
  className: string;
  trainerId: string;
  trainerName: string;
  gymAreaId: string;
  gymAreaName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  enrolledCount: number;
  availableSpots: number;
  recurring: boolean;
  active: boolean;
}

export interface ClassCategoryResponse {
  id: string;
  gymId: string;
  name: string;
  description: string;
  colorCode: string;
  active: boolean;
}

export interface ClassCreateRequest {
  name: string;
  description?: string;
  categoryId: string;
  defaultDuration: number;
  defaultCapacity: number;
  difficultyLevel?: string;
  caloriesBurnedEstimate?: number;
  equipmentNeeded?: string[];
}

export interface ClassScheduleCreateRequest {
  classId: string;
  trainerId: string;
  gymAreaId?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
  recurring?: boolean;
}

export interface ClassCategoryCreateRequest {
  name: string;
  description?: string;
  colorCode?: string;
}

/**
 * Classes API Functions
 */
export const classesAPI = {
  // Classes
  getAll: async (gymId: string): Promise<ApiResponse<ClassResponse[]>> => {
    const response = await apiClient.get(CLASSES.BY_GYM(gymId));
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ClassResponse>> => {
    const response = await apiClient.get(CLASSES.BY_ID(id));
    return response.data;
  },

  create: async (data: ClassCreateRequest): Promise<ApiResponse<ClassResponse>> => {
    const response = await apiClient.post(CLASSES.BASE, data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<ClassCreateRequest>
  ): Promise<ApiResponse<ClassResponse>> => {
    const response = await apiClient.put(CLASSES.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(CLASSES.BY_ID(id));
    return response.data;
  },

  // Schedules
  getSchedules: async (gymId: string): Promise<ApiResponse<ClassScheduleResponse[]>> => {
    const response = await apiClient.get(CLASS_SCHEDULES.BY_GYM(gymId));
    return response.data;
  },

  getScheduleById: async (id: string): Promise<ApiResponse<ClassScheduleResponse>> => {
    const response = await apiClient.get(CLASS_SCHEDULES.BY_ID(id));
    return response.data;
  },

  createSchedule: async (
    data: ClassScheduleCreateRequest
  ): Promise<ApiResponse<ClassScheduleResponse>> => {
    const response = await apiClient.post(CLASS_SCHEDULES.BASE, data);
    return response.data;
  },

  updateSchedule: async (
    id: string,
    data: Partial<ClassScheduleCreateRequest>
  ): Promise<ApiResponse<ClassScheduleResponse>> => {
    const response = await apiClient.put(CLASS_SCHEDULES.BY_ID(id), data);
    return response.data;
  },

  deleteSchedule: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(CLASS_SCHEDULES.BY_ID(id));
    return response.data;
  },

  // Categories
  getCategories: async (gymId: string): Promise<ApiResponse<ClassCategoryResponse[]>> => {
    const response = await apiClient.get(CLASS_CATEGORIES.BY_GYM(gymId));
    return response.data;
  },

  getCategoryById: async (id: string): Promise<ApiResponse<ClassCategoryResponse>> => {
    const response = await apiClient.get(CLASS_CATEGORIES.BY_ID(id));
    return response.data;
  },

  createCategory: async (
    data: ClassCategoryCreateRequest
  ): Promise<ApiResponse<ClassCategoryResponse>> => {
    const response = await apiClient.post(CLASS_CATEGORIES.BASE, data);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: Partial<ClassCategoryCreateRequest>
  ): Promise<ApiResponse<ClassCategoryResponse>> => {
    const response = await apiClient.put(CLASS_CATEGORIES.BY_ID(id), data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(CLASS_CATEGORIES.BY_ID(id));
    return response.data;
  },
};

export default classesAPI;
