import { describe, expect, it } from "vitest";
import { formatCurrency, getCurrencySymbol } from "./currency";

describe("getCurrencySymbol", () => {
  it("defaults to Naira when no currency is configured", () => {
    expect(getCurrencySymbol(undefined)).toBe("₦");
    expect(getCurrencySymbol("")).toBe("₦");
  });

  it("maps ISO codes and is case-insensitive", () => {
    expect(getCurrencySymbol("NGN")).toBe("₦");
    expect(getCurrencySymbol("ngn")).toBe("₦");
    expect(getCurrencySymbol("USD")).toBe("$");
    expect(getCurrencySymbol("GBP")).toBe("£");
    expect(getCurrencySymbol("GHS")).toBe("GH₵");
  });
});

describe("formatCurrency", () => {
  it("formats with the currency symbol and two decimals", () => {
    expect(formatCurrency(50000, "NGN")).toBe("₦50,000.00");
    expect(formatCurrency(12.5, "USD")).toBe("$12.50");
  });

  it("treats null, empty and non-numeric input as zero", () => {
    expect(formatCurrency(null, "NGN")).toBe("₦0.00");
    expect(formatCurrency("", "NGN")).toBe("₦0.00");
    expect(formatCurrency("abc", "NGN")).toBe("₦0.00");
  });

  it("parses numeric strings", () => {
    expect(formatCurrency("1,250.5", "NGN")).toBe("₦1,250.50");
  });
});
