/**
 * Inventory API
 */

import apiClient from "@/api/axios";
import { INVENTORY, SUPPLIERS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

export interface InventoryItemResponse {
  id: string;
  gymId: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  reorderPoint: number;
  unitPrice: number;
  costPrice: number;
  supplierId: string;
  location: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierResponse {
  id: string;
  gymId: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  preferred: boolean;
  active: boolean;
  createdAt: string;
}

export interface InventoryMovementResponse {
  id: string;
  itemId: string;
  itemName: string;
  movementType: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  performedBy: string;
  createdAt: string;
}

export interface InventoryItemCreateRequest {
  name: string;
  description?: string;
  sku?: string;
  category: string;
  quantity: number;
  minQuantity?: number;
  reorderPoint?: number;
  unitPrice: number;
  costPrice?: number;
  supplierId?: string;
  location?: string;
}

export interface SupplierCreateRequest {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const inventoryAPI = {
  getByGym: async (gymId: string): Promise<ApiResponse<InventoryItemResponse[]>> => {
    const response = await apiClient.get(INVENTORY.BY_GYM(gymId));
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<InventoryItemResponse>> => {
    const response = await apiClient.get(INVENTORY.ITEM_BY_ID(id));
    return response.data;
  },
  getLowStock: async (gymId: string): Promise<ApiResponse<InventoryItemResponse[]>> => {
    const response = await apiClient.get(INVENTORY.LOW_STOCK(gymId));
    return response.data;
  },
  getReorderNeeded: async (gymId: string): Promise<ApiResponse<InventoryItemResponse[]>> => {
    const response = await apiClient.get(INVENTORY.REORDER_NEEDED(gymId));
    return response.data;
  },
  create: async (data: InventoryItemCreateRequest): Promise<ApiResponse<InventoryItemResponse>> => {
    const response = await apiClient.post(INVENTORY.ITEMS, data);
    return response.data;
  },
  recordPurchase: async (id: string, quantity: number): Promise<ApiResponse<InventoryMovementResponse>> => {
    const response = await apiClient.post(INVENTORY.PURCHASE(id), { quantity });
    return response.data;
  },
  recordSale: async (id: string, quantity: number): Promise<ApiResponse<InventoryMovementResponse>> => {
    const response = await apiClient.post(INVENTORY.SALE(id), { quantity });
    return response.data;
  },
  recordDamage: async (id: string, quantity: number, reason: string): Promise<ApiResponse<InventoryMovementResponse>> => {
    const response = await apiClient.post(INVENTORY.DAMAGE(id), { quantity, reason });
    return response.data;
  },
  getMovements: async (id: string): Promise<ApiResponse<InventoryMovementResponse[]>> => {
    const response = await apiClient.get(INVENTORY.MOVEMENTS(id));
    return response.data;
  },
};

export const suppliersAPI = {
  getAll: async (): Promise<ApiResponse<SupplierResponse[]>> => {
    const response = await apiClient.get(SUPPLIERS.BASE);
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse<SupplierResponse>> => {
    const response = await apiClient.get(SUPPLIERS.BY_ID(id));
    return response.data;
  },
  create: async (data: SupplierCreateRequest): Promise<ApiResponse<SupplierResponse>> => {
    const response = await apiClient.post(SUPPLIERS.BASE, data);
    return response.data;
  },
  update: async (id: string, data: Partial<SupplierCreateRequest>): Promise<ApiResponse<SupplierResponse>> => {
    const response = await apiClient.put(SUPPLIERS.BY_ID(id), data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(SUPPLIERS.BY_ID(id));
    return response.data;
  },
  setRating: async (id: string, rating: number): Promise<ApiResponse<SupplierResponse>> => {
    const response = await apiClient.put(SUPPLIERS.RATING(id), { rating });
    return response.data;
  },
  markPreferred: async (id: string): Promise<ApiResponse<SupplierResponse>> => {
    const response = await apiClient.put(SUPPLIERS.PREFERRED(id));
    return response.data;
  },
};

export default inventoryAPI;
