import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const api = vi.hoisted(() => ({ create: vi.fn(), recordPurchase: vi.fn() }));
vi.mock("./inventory.api", () => ({ inventoryAPI: api, suppliersAPI: {} }));
const toast = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

import { useCreateInventoryItem } from "./inventory.hooks";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>{children}</QueryClientProvider>
);

const request = { gymId: "g1", name: "Whey", category: "SUPPLEMENTS", unitPrice: 5000, unitCost: 3500, minimumStock: 5 };

beforeEach(() => {
  vi.clearAllMocks();
  api.create.mockResolvedValue({ data: { id: "item-1", name: "Whey" } });
  api.recordPurchase.mockResolvedValue({ data: {} });
});

describe("useCreateInventoryItem", () => {
  it("creates the item without leaking the client-only initialStock field to the API", async () => {
    const { result } = renderHook(() => useCreateInventoryItem(), { wrapper });
    await result.current.mutateAsync({ ...request, initialStock: 10 });

    expect(api.create).toHaveBeenCalledWith(request);
  });

  it("records opening stock as a purchase of the new item at cost", async () => {
    const { result } = renderHook(() => useCreateInventoryItem(), { wrapper });
    await result.current.mutateAsync({ ...request, initialStock: 10 });

    expect(api.recordPurchase).toHaveBeenCalledWith("item-1", 10, 3500);
    await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Item added" })));
  });

  it("skips the purchase when there is no opening stock", async () => {
    const { result } = renderHook(() => useCreateInventoryItem(), { wrapper });
    await result.current.mutateAsync({ ...request, initialStock: 0 });

    expect(api.recordPurchase).not.toHaveBeenCalled();
  });

  it("tells the user when the item was created but its stock couldn't be recorded", async () => {
    api.recordPurchase.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useCreateInventoryItem(), { wrapper });
    await result.current.mutateAsync({ ...request, initialStock: 10 });

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Item added without stock", variant: "destructive" }))
    );
    expect(toast).not.toHaveBeenCalledWith(expect.objectContaining({ title: "Item added" }));
  });

  it("reports failure and records no stock when the item itself can't be created", async () => {
    api.create.mockRejectedValue(new Error("Inventory item with this SKU already exists"));
    const { result } = renderHook(() => useCreateInventoryItem(), { wrapper });
    await expect(result.current.mutateAsync({ ...request, initialStock: 10 })).rejects.toThrow();

    expect(api.recordPurchase).not.toHaveBeenCalled();
    await waitFor(() => expect(toast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive", description: "Inventory item with this SKU already exists" })));
  });
});
