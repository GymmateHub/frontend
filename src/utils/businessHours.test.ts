import { describe, expect, it } from "vitest";
import {
  DEFAULT_BUSINESS_HOURS,
  parseBusinessHours,
  serializeBusinessHours,
  validateBusinessHours,
} from "./businessHours";

describe("parseBusinessHours", () => {
  it("returns defaults for null, empty and malformed input", () => {
    expect(parseBusinessHours(null)).toEqual(DEFAULT_BUSINESS_HOURS);
    expect(parseBusinessHours("")).toEqual(DEFAULT_BUSINESS_HOURS);
    expect(parseBusinessHours("{not json")).toEqual(DEFAULT_BUSINESS_HOURS);
    expect(parseBusinessHours("42")).toEqual(DEFAULT_BUSINESS_HOURS);
  });

  it("round-trips through serialize", () => {
    const hours = { ...DEFAULT_BUSINESS_HOURS, monday: { open: "05:30", close: "23:00", active: false } };
    expect(parseBusinessHours(serializeBusinessHours(hours))).toEqual(hours);
  });

  it("keeps valid days and repairs invalid fields per day", () => {
    const parsed = parseBusinessHours(
      JSON.stringify({
        monday: { open: "07:15", close: "21:00", active: true },
        tuesday: { open: "25:99", close: "nope", active: "yes" },
      })
    );
    expect(parsed.monday).toEqual({ open: "07:15", close: "21:00", active: true });
    expect(parsed.tuesday).toEqual(DEFAULT_BUSINESS_HOURS.tuesday);
    expect(parsed.sunday).toEqual(DEFAULT_BUSINESS_HOURS.sunday);
  });
});

describe("validateBusinessHours", () => {
  it("accepts the defaults", () => {
    expect(validateBusinessHours(DEFAULT_BUSINESS_HOURS)).toBeNull();
  });

  it("rejects an open day that closes before it opens", () => {
    const bad = { ...DEFAULT_BUSINESS_HOURS, friday: { open: "22:00", close: "06:00", active: true } };
    expect(validateBusinessHours(bad)).toMatch(/Friday/);
  });

  it("rejects zero-length days but ignores closed days", () => {
    const equal = { ...DEFAULT_BUSINESS_HOURS, monday: { open: "10:00", close: "10:00", active: true } };
    expect(validateBusinessHours(equal)).toMatch(/Monday/);
    const closed = { ...DEFAULT_BUSINESS_HOURS, monday: { open: "22:00", close: "06:00", active: false } };
    expect(validateBusinessHours(closed)).toBeNull();
  });
});
