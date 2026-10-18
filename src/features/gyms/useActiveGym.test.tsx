import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useActiveGym } from "./useActiveGym";
import { tokenStorage } from "../../api/axios";
import { makeGym } from "../../test/utils";

const auth = vi.hoisted(() => ({ user: null as { gymId?: string } | null }));
vi.mock("@/auth/auth.store", () => ({ useAuth: () => ({ user: auth.user }) }));
const gymsQuery = vi.hoisted(() => vi.fn());
vi.mock("./gyms.hooks", () => ({ useMyGyms: gymsQuery }));

const a = makeGym({ id: "a", name: "A" });
const b = makeGym({ id: "b", name: "B" });

beforeEach(() => {
  auth.user = { gymId: "" };
  gymsQuery.mockReturnValue({ data: [a, b], isLoading: false });
});
afterEach(() => localStorage.clear());

describe("useActiveGym", () => {
  it("prefers the gym in the auth token", () => {
    auth.user = { gymId: "b" };
    const { result } = renderHook(() => useActiveGym());
    expect(result.current.gym?.id).toBe("b");
    expect(result.current.gymId).toBe("b");
  });

  it("falls back to the first gym when the token carries none (accounts created before gym resolution)", () => {
    const { result } = renderHook(() => useActiveGym());
    expect(result.current.gymId).toBe("a");
  });

  it("falls back to the first gym when the token's gym isn't in the list", () => {
    auth.user = { gymId: "deleted" };
    const { result } = renderHook(() => useActiveGym());
    expect(result.current.gymId).toBe("a");
  });

  it("uses the token's gym id while the gym list is still loading", () => {
    auth.user = { gymId: "b" };
    gymsQuery.mockReturnValue({ data: undefined, isLoading: true });
    const { result } = renderHook(() => useActiveGym());
    expect(result.current.gymId).toBe("b");
    expect(result.current.isLoading).toBe(true);
  });

  it("is empty when there is no gym at all", () => {
    gymsQuery.mockReturnValue({ data: [], isLoading: false });
    const { result } = renderHook(() => useActiveGym());
    expect(result.current.gymId).toBe("");
    expect(result.current.gym).toBeUndefined();
  });

  it("tells the API which gym to use via X-Gym-Id", () => {
    renderHook(() => useActiveGym());
    expect(tokenStorage.getCurrentGym()).toBe("a");
  });

  it("does not overwrite the header when there is no gym", () => {
    tokenStorage.setCurrentGym("existing");
    gymsQuery.mockReturnValue({ data: [], isLoading: false });
    renderHook(() => useActiveGym());
    expect(tokenStorage.getCurrentGym()).toBe("existing");
  });
});
