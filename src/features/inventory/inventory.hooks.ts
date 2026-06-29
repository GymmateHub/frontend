/**
 * Inventory Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { inventoryAPI, suppliersAPI, type InventoryItemCreateRequest, type SupplierCreateRequest } from "./inventory.api";

export const inventoryKeys = {
  all: ["inventory"] as const,
  byGym: (gymId: string) => [...inventoryKeys.all, gymId] as const,
  lowStock: (gymId: string) => [...inventoryKeys.all, "low-stock", gymId] as const,
  reorderNeeded: (gymId: string) => [...inventoryKeys.all, "reorder", gymId] as const,
  detail: (id: string) => [...inventoryKeys.all, "detail", id] as const,
  movements: (id: string) => [...inventoryKeys.all, "movements", id] as const,
  suppliers: () => [...inventoryKeys.all, "suppliers"] as const,
};

export const useInventory = (gymId: string) => {
  return useQuery({
    queryKey: inventoryKeys.byGym(gymId),
    queryFn: async () => { const r = await inventoryAPI.getByGym(gymId); return r.data; },
    enabled: !!gymId,
  });
};

export const useLowStockItems = (gymId: string) => {
  return useQuery({
    queryKey: inventoryKeys.lowStock(gymId),
    queryFn: async () => { const r = await inventoryAPI.getLowStock(gymId); return r.data; },
    enabled: !!gymId,
  });
};

export const useReorderNeededItems = (gymId: string) => {
  return useQuery({
    queryKey: inventoryKeys.reorderNeeded(gymId),
    queryFn: async () => { const r = await inventoryAPI.getReorderNeeded(gymId); return r.data; },
    enabled: !!gymId,
  });
};

export const useInventoryMovements = (itemId: string) => {
  return useQuery({
    queryKey: inventoryKeys.movements(itemId),
    queryFn: async () => { const r = await inventoryAPI.getMovements(itemId); return r.data; },
    enabled: !!itemId,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InventoryItemCreateRequest) => { const r = await inventoryAPI.create(data); return r.data; },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      toast({ title: "Item added", description: `${item.name} has been added.` });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};

export const useRecordPurchase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const r = await inventoryAPI.recordPurchase(id, quantity); return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      toast({ title: "Purchase recorded" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};

export const useRecordSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const r = await inventoryAPI.recordSale(id, quantity); return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      toast({ title: "Sale recorded" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};

export const useSuppliers = () => {
  return useQuery({
    queryKey: inventoryKeys.suppliers(),
    queryFn: async () => { const r = await suppliersAPI.getAll(); return r.data; },
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: SupplierCreateRequest) => { const r = await suppliersAPI.create(data); return r.data; },
    onSuccess: (s) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.suppliers() });
      toast({ title: "Supplier added", description: `${s.name} has been added.` });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });
};
