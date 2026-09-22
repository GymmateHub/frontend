import { beforeEach, describe, expect, it, vi } from "vitest";

const post = vi.hoisted(() => vi.fn());
vi.mock("@/api/axios", () => ({ default: { post, get: vi.fn(), put: vi.fn(), delete: vi.fn(), patch: vi.fn() } }));

import { inventoryAPI, inventoryCategoryLabel } from "./inventory.api";

beforeEach(() => {
  vi.clearAllMocks();
  post.mockResolvedValue({ data: { data: {} } });
});

describe("inventoryAPI.recordPurchase", () => {
  it("sends the movement type the API requires", async () => {
    await inventoryAPI.recordPurchase("item-1", 12, 350);

    expect(post).toHaveBeenCalledWith(expect.stringContaining("item-1"), { movementType: "PURCHASE", quantity: 12, unitCost: 350 });
  });
});

describe("inventoryCategoryLabel", () => {
  it("labels enum values", () => {
    expect(inventoryCategoryLabel("EQUIPMENT_PARTS")).toBe("Equipment parts");
    expect(inventoryCategoryLabel("supplements")).toBe("Supplements");
  });
  it("falls back gracefully", () => {
    expect(inventoryCategoryLabel(undefined)).toBe("—");
    expect(inventoryCategoryLabel("MYSTERY")).toBe("MYSTERY");
  });
});
