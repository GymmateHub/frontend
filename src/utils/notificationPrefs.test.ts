import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_NOTIFICATION_PREFS, loadNotificationPrefs, saveNotificationPrefs } from "./notificationPrefs";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("notification preferences storage", () => {
  it("returns defaults when nothing is stored", () => {
    expect(loadNotificationPrefs("g1")).toEqual(DEFAULT_NOTIFICATION_PREFS);
  });

  it("persists per gym", () => {
    saveNotificationPrefs("g1", { ...DEFAULT_NOTIFICATION_PREFS, classChanges: true });
    expect(loadNotificationPrefs("g1").classChanges).toBe(true);
    expect(loadNotificationPrefs("g2").classChanges).toBe(false);
  });

  it("falls back to defaults for corrupt data and fills missing keys", () => {
    localStorage.setItem("gymmate_notification_prefs_g1", "{oops");
    expect(loadNotificationPrefs("g1")).toEqual(DEFAULT_NOTIFICATION_PREFS);
    localStorage.setItem("gymmate_notification_prefs_g1", JSON.stringify({ payment: false }));
    expect(loadNotificationPrefs("g1")).toEqual({ ...DEFAULT_NOTIFICATION_PREFS, payment: false });
  });

  it("reports failure instead of throwing when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(saveNotificationPrefs("g1", DEFAULT_NOTIFICATION_PREFS)).toBe(false);
  });
});
