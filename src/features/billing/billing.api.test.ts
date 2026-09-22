import { beforeEach, describe, expect, it, vi } from "vitest";

const http = vi.hoisted(() => ({ post: vi.fn(), get: vi.fn(), delete: vi.fn() }));
vi.mock("@/api/axios", () => ({ default: http }));

import { billingAPI } from "./billing.api";

beforeEach(() => {
  vi.clearAllMocks();
  http.post.mockResolvedValue({ data: {} });
});

describe("billingAPI request shapes (must match the Spring DTOs)", () => {
  it("upgrade sends newTierName", async () => {
    await billingAPI.upgrade("PRO");
    expect(http.post).toHaveBeenCalledWith(expect.any(String), { newTierName: "PRO" });
  });

  it("downgrade sends newTierName", async () => {
    await billingAPI.downgrade("STARTER");
    expect(http.post).toHaveBeenCalledWith(expect.any(String), { newTierName: "STARTER" });
  });

  it("attachPaymentMethod sends stripePaymentMethodId, as the default method", async () => {
    await billingAPI.attachPaymentMethod("pm_123");
    expect(http.post).toHaveBeenCalledWith(expect.any(String), { stripePaymentMethodId: "pm_123", setAsDefault: true });
  });

  it("cancel passes `immediate` as a query param, not a body", async () => {
    await billingAPI.cancel(true);
    expect(http.post).toHaveBeenCalledWith(expect.any(String), null, { params: { immediate: true } });
  });
});
