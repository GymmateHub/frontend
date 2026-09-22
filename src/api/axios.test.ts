import { afterEach, describe, expect, it } from "vitest";
import type { AxiosAdapter, AxiosResponse } from "axios";
import apiClient, { tokenStorage } from "./axios";

const reject = (status: number, data: unknown): AxiosAdapter => (config) =>
  Promise.reject(
    Object.assign(new Error(`Request failed with status code ${status}`), {
      isAxiosError: true,
      config,
      response: { status, data, headers: {}, config, statusText: "" } as AxiosResponse,
    })
  );

const original = apiClient.defaults.adapter;
afterEach(() => {
  apiClient.defaults.adapter = original;
  localStorage.clear();
});

describe("apiClient error handling", () => {
  it("replaces axios' generic message with the API's message", async () => {
    apiClient.defaults.adapter = reject(400, { success: false, message: "Gym ID is required" });
    await expect(apiClient.post("/members", {})).rejects.toThrow("Gym ID is required");
  });

  it("keeps axios' message when the API sends none", async () => {
    apiClient.defaults.adapter = reject(500, {});
    await expect(apiClient.post("/members", {})).rejects.toThrow("Request failed with status code 500");
  });

  it("does not treat a wrong current password (400) as an expired session", async () => {
    localStorage.setItem("gymmate_refresh_token", "r");
    apiClient.defaults.adapter = reject(400, { success: false, message: "Current password is incorrect" });
    await expect(apiClient.post("/auth/change-password", {})).rejects.toThrow("Current password is incorrect");
    expect(localStorage.getItem("gymmate_refresh_token")).toBe("r");
  });
});

describe("apiClient request headers", () => {
  it("sends the bearer token and the current gym", async () => {
    tokenStorage.setAccessToken("tok");
    tokenStorage.setCurrentGym("gym-9");
    let seen: Record<string, unknown> = {};
    apiClient.defaults.adapter = (config) => {
      seen = config.headers.toJSON();
      return Promise.resolve({ status: 200, data: {}, headers: {}, config, statusText: "OK" });
    };
    await apiClient.get("/anything");
    expect(seen.Authorization).toBe("Bearer tok");
    expect(seen["X-Gym-Id"]).toBe("gym-9");
  });
});
