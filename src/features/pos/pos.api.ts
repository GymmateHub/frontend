/**
 * Point of Sale API
 * Maps to backend PosController (/api/pos)
 */

import apiClient from "@/api/axios";
import { POS } from "@/api/endpoints";
import type { ApiResponse } from "@/api/axios";

export type SaleStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type PaymentType = "CASH" | "CARD" | "MEMBER_ACCOUNT" | "STRIPE" | "OTHER";

export interface SaleItemResponse {
  id: string;
  inventoryItemId: string | null;
  itemName: string;
  itemSku: string | null;
  itemBarcode: string | null;
  quantity: number;
  unitPrice: number;
  costPrice: number | null;
  discountAmount: number | null;
  discountPercentage: number | null;
  lineTotal: number;
  notes: string | null;
  refunded: boolean;
  refundedQuantity: number | null;
}

export interface SaleResponse {
  id: string;
  saleNumber: string;
  gymId: string;
  memberId: string | null;
  customerName: string | null;
  staffId: string | null;
  status: SaleStatus;
  paymentType: PaymentType;
  subtotal: number;
  discountAmount: number | null;
  discountPercentage: number | null;
  discountCode: string | null;
  taxAmount: number | null;
  taxRate: number | null;
  totalAmount: number;
  amountPaid: number | null;
  changeGiven: number | null;
  refundedAmount: number | null;
  stripePaymentIntentId: string | null;
  saleDate: string;
  completedAt: string | null;
  notes: string | null;
  receiptPrinted: boolean;
  receiptEmailed: boolean;
  totalItemCount: number;
  items: SaleItemResponse[];
  createdAt: string;
  active: boolean;
}

export interface SaleItemRequest {
  inventoryItemId?: string;
  itemName: string;
  itemSku?: string;
  itemBarcode?: string;
  quantity: number;
  unitPrice: number;
  costPrice?: number;
  discountPercentage?: number;
  notes?: string;
}

export interface CreateSaleRequest {
  gymId: string;
  memberId?: string;
  customerName?: string;
  staffId?: string;
  items: SaleItemRequest[];
  paymentType: PaymentType;
  discountPercentage?: number;
  discountCode?: string;
  taxRate?: number;
  amountPaid?: number;
  notes?: string;
}

export interface CompleteSaleRequest {
  paymentType: PaymentType;
  amountPaid: number;
  stripePaymentIntentId?: string;
  externalReference?: string;
}

export interface CashDrawerResponse {
  id: string;
  gymId: string;
  openedByStaffId: string | null;
  closedByStaffId: string | null;
  openingBalance: number;
  closingBalance: number | null;
  expectedBalance: number | null;
  discrepancy: number | null;
  openedAt: string;
  closedAt: string | null;
  status: string;
  notes: string | null;
}

export interface PosSalesSummary {
  totalSales: number;
  completedSales: number;
  refundedSales: number;
  cancelledSales: number;
  totalItemsSold: number;
  totalRevenue: number;
  totalRefunds: number;
  netRevenue: number;
  totalDiscounts: number;
  totalTax: number;
}

export const posAPI = {
  createSale: async (data: CreateSaleRequest): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.post(POS.SALES, data);
    return response.data;
  },
  quickSale: async (data: CreateSaleRequest): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.post(POS.QUICK_SALE, data);
    return response.data;
  },
  completeSale: async (saleId: string, data: CompleteSaleRequest): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.post(POS.COMPLETE_SALE(saleId), data);
    return response.data;
  },
  cancelSale: async (saleId: string): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.post(POS.CANCEL_SALE(saleId));
    return response.data;
  },
  refundSale: async (saleId: string, amount: number, reason?: string): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.post(POS.REFUND_SALE(saleId), null, { params: { amount, reason } });
    return response.data;
  },
  addItemToSale: async (saleId: string, item: SaleItemRequest): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.post(POS.ADD_SALE_ITEM(saleId), item);
    return response.data;
  },
  removeItemFromSale: async (saleId: string, itemId: string): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.delete(POS.REMOVE_SALE_ITEM(saleId, itemId));
    return response.data;
  },
  getSale: async (saleId: string): Promise<ApiResponse<SaleResponse>> => {
    const response = await apiClient.get(POS.SALE_BY_ID(saleId));
    return response.data;
  },
  getSalesByGym: async (gymId: string): Promise<ApiResponse<SaleResponse[]>> => {
    const response = await apiClient.get(POS.SALES_BY_GYM(gymId));
    return response.data;
  },
  getTodaySales: async (gymId: string): Promise<ApiResponse<SaleResponse[]>> => {
    const response = await apiClient.get(POS.SALES_TODAY(gymId));
    return response.data;
  },
  getSalesByMember: async (memberId: string): Promise<ApiResponse<SaleResponse[]>> => {
    const response = await apiClient.get(POS.SALES_BY_MEMBER(memberId));
    return response.data;
  },
  openDrawer: async (gymId: string, openingBalance: number, notes?: string): Promise<ApiResponse<CashDrawerResponse>> => {
    const response = await apiClient.post(POS.DRAWER_OPEN, { gymId, openingBalance, notes });
    return response.data;
  },
  closeDrawer: async (drawerId: string, closingBalance: number, closingNotes?: string): Promise<ApiResponse<CashDrawerResponse>> => {
    const response = await apiClient.post(POS.DRAWER_CLOSE(drawerId), { closingBalance, closingNotes });
    return response.data;
  },
  getCurrentDrawer: async (gymId: string): Promise<ApiResponse<CashDrawerResponse>> => {
    const response = await apiClient.get(POS.DRAWER_CURRENT(gymId));
    return response.data;
  },
  getDrawerHistory: async (gymId: string): Promise<ApiResponse<CashDrawerResponse[]>> => {
    const response = await apiClient.get(POS.DRAWER_HISTORY(gymId));
    return response.data;
  },
  getSalesByDateRange: async (gymId: string, startDate: string, endDate: string): Promise<ApiResponse<SaleResponse[]>> => {
    const response = await apiClient.get(POS.SALES_DATE_RANGE(gymId), { params: { startDate, endDate } });
    return response.data;
  },
  getSummaryReport: async (gymId: string, startDate: string, endDate: string): Promise<ApiResponse<PosSalesSummary>> => {
    const response = await apiClient.get(POS.REPORT_SUMMARY(gymId), { params: { startDate, endDate } });
    return response.data;
  },
  getTopItems: async (gymId: string, startDate: string, endDate: string): Promise<ApiResponse<unknown[][]>> => {
    const response = await apiClient.get(POS.REPORT_TOP_ITEMS(gymId), { params: { startDate, endDate } });
    return response.data;
  },
};

export default posAPI;
