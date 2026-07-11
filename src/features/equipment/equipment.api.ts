/**
 * Equipment API
 * API functions for equipment and maintenance management
 */

import apiClient from "@/api/axios";
import { EQUIPMENT, MAINTENANCE } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: "operational" | "maintenance" | "out_of_order";
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  purchaseDate: string;
  warrantyExpiry: string;
  quantity: number;
}

export interface EquipmentResponse {
  id: string;
  gymId: string;
  organisationId: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  warrantyExpiryDate: string;
  location: string;
  status: string;
  condition: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceIntervalDays: number;
  notes: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceScheduleResponse {
  id: string;
  equipmentId: string;
  equipmentName: string;
  scheduledDate: string;
  maintenanceType: string;
  description: string;
  estimatedDuration: number;
  assignedTo: string;
  status: string;
  priority: string;
  notes: string;
  completedAt: string;
  completedBy: string;
  actualDuration: number;
  cost: number;
}

export interface MaintenanceRecordResponse {
  id: string;
  equipmentId: string;
  equipmentName: string;
  maintenanceDate: string;
  maintenanceType: string;
  description: string;
  performedBy: string;
  duration: number;
  cost: number;
  partsReplaced: string[];
  notes: string;
  nextMaintenanceDate: string;
  createdAt: string;
}

// Mirrors backend EquipmentCreateRequest (inventory/api/dto)
export interface EquipmentCreateRequest {
  name: string;
  category: string; // EquipmentCategory enum value, e.g. CARDIO
  gymId: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiryDate?: string;
  locationNotes?: string;
  maintenanceIntervalDays?: number;
  notes?: string;
}

export const EQUIPMENT_CATEGORIES = [
  "CARDIO",
  "STRENGTH",
  "FUNCTIONAL",
  "BOXING",
  "YOGA",
  "SWIMMING",
  "SPORTS",
  "ACCESSIBILITY",
  "RECOVERY",
  "OTHER",
] as const;

export interface MaintenanceScheduleCreateRequest {
  equipmentId: string;
  scheduledDate: string;
  maintenanceType: string;
  description?: string;
  estimatedDuration?: number;
  assignedTo?: string;
  priority?: string;
  notes?: string;
}

export interface MaintenanceRecordCreateRequest {
  equipmentId: string;
  maintenanceDate: string;
  maintenanceType: string;
  description?: string;
  performedBy: string;
  duration?: number;
  cost?: number;
  partsReplaced?: string[];
  notes?: string;
}

/**
 * Equipment API Functions
 */
export const equipmentAPI = {
  // Get equipment by organisation
  getByOrganisation: async (): Promise<ApiResponse<EquipmentResponse[]>> => {
    const response = await apiClient.get(EQUIPMENT.BY_ORGANISATION);
    return response.data;
  },

  // Get equipment by gym
  getByGym: async (gymId: string): Promise<ApiResponse<EquipmentResponse[]>> => {
    const response = await apiClient.get(EQUIPMENT.BY_GYM(gymId));
    return response.data;
  },

  // Get active equipment by gym
  getActiveByGym: async (gymId: string): Promise<ApiResponse<EquipmentResponse[]>> => {
    const response = await apiClient.get(EQUIPMENT.ACTIVE_BY_GYM(gymId));
    return response.data;
  },

  // Get equipment by ID
  getById: async (id: string): Promise<ApiResponse<EquipmentResponse>> => {
    const response = await apiClient.get(EQUIPMENT.BY_ID(id));
    return response.data;
  },

  // Create equipment
  create: async (data: EquipmentCreateRequest): Promise<ApiResponse<EquipmentResponse>> => {
    const response = await apiClient.post(EQUIPMENT.BASE, data);
    return response.data;
  },

  // Update equipment
  update: async (
    id: string,
    data: Partial<EquipmentCreateRequest>
  ): Promise<ApiResponse<EquipmentResponse>> => {
    const response = await apiClient.put(EQUIPMENT.BY_ID(id), data);
    return response.data;
  },

  // Update equipment status
  updateStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<EquipmentResponse>> => {
    const response = await apiClient.put(EQUIPMENT.STATUS(id), { status });
    return response.data;
  },

  // Delete equipment
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(EQUIPMENT.BY_ID(id));
    return response.data;
  },

  // Get equipment due for maintenance
  getMaintenanceDue: async (gymId: string): Promise<ApiResponse<EquipmentResponse[]>> => {
    const response = await apiClient.get(EQUIPMENT.MAINTENANCE_DUE(gymId));
    return response.data;
  },

  // Record maintenance
  recordMaintenance: async (
    id: string,
    data: MaintenanceRecordCreateRequest
  ): Promise<ApiResponse<MaintenanceRecordResponse>> => {
    const response = await apiClient.post(EQUIPMENT.MAINTENANCE(id), data);
    return response.data;
  },
};

/**
 * Maintenance API Functions
 */
export const maintenanceAPI = {
  // Schedules
  getSchedulesByGym: async (
    gymId: string,
    type: "pending" | "due"
  ): Promise<ApiResponse<MaintenanceScheduleResponse[]>> => {
    const endpoint =
      type === "pending"
        ? MAINTENANCE.PENDING_BY_GYM(gymId)
        : MAINTENANCE.DUE_BY_GYM(gymId);
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getScheduleById: async (id: string): Promise<ApiResponse<MaintenanceScheduleResponse>> => {
    const response = await apiClient.get(MAINTENANCE.SCHEDULE_BY_ID(id));
    return response.data;
  },

  createSchedule: async (
    data: MaintenanceScheduleCreateRequest
  ): Promise<ApiResponse<MaintenanceScheduleResponse>> => {
    const response = await apiClient.post(MAINTENANCE.SCHEDULES, data);
    return response.data;
  },

  reschedule: async (
    id: string,
    newDate: string
  ): Promise<ApiResponse<MaintenanceScheduleResponse>> => {
    const response = await apiClient.put(MAINTENANCE.RESCHEDULE(id), {
      scheduledDate: newDate,
    });
    return response.data;
  },

  completeSchedule: async (
    id: string,
    data: { completedBy: string; notes?: string; cost?: number }
  ): Promise<ApiResponse<MaintenanceScheduleResponse>> => {
    const response = await apiClient.put(MAINTENANCE.COMPLETE_SCHEDULE(id), data);
    return response.data;
  },

  // Records
  getRecordsByGym: async (gymId: string): Promise<ApiResponse<MaintenanceRecordResponse[]>> => {
    const response = await apiClient.get(MAINTENANCE.RECORDS_BY_GYM(gymId));
    return response.data;
  },

  getRecordsByEquipment: async (
    equipmentId: string
  ): Promise<ApiResponse<MaintenanceRecordResponse[]>> => {
    const response = await apiClient.get(MAINTENANCE.RECORDS_BY_EQUIPMENT(equipmentId));
    return response.data;
  },

  getRecordById: async (id: string): Promise<ApiResponse<MaintenanceRecordResponse>> => {
    const response = await apiClient.get(MAINTENANCE.RECORD_BY_ID(id));
    return response.data;
  },

  createRecord: async (
    data: MaintenanceRecordCreateRequest
  ): Promise<ApiResponse<MaintenanceRecordResponse>> => {
    const response = await apiClient.post(MAINTENANCE.RECORDS, data);
    return response.data;
  },

  completeRecord: async (
    id: string,
    data: { notes?: string; cost?: number }
  ): Promise<ApiResponse<MaintenanceRecordResponse>> => {
    const response = await apiClient.put(MAINTENANCE.COMPLETE_RECORD(id), data);
    return response.data;
  },
};

export default equipmentAPI;
