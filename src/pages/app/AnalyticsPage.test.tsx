import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnalyticsPage from "./AnalyticsPage";
import { renderWithProviders } from "../../test/utils";

const h = vi.hoisted(() => ({ analytics: vi.fn(), refetch: vi.fn() }));
vi.mock("../../features/analytics/analytics.hooks", () => ({ useAllGymsAnalytics: h.analytics }));
vi.mock("../../utils/currency", () => ({ useCurrency: () => ({ format: (n: number) => `₦${n}` }) }));

beforeEach(() => vi.clearAllMocks());

describe("AnalyticsPage", () => {
  it("renders real metrics", () => {
    h.analytics.mockReturnValue({
      data: { totalMembers: 120, activeMembers: 80, totalRevenue: 5000, monthlyRevenue: 900, classesThisMonth: 14, averageAttendance: 61.25, memberRetentionRate: 88, growthRate: 4.5 },
      isLoading: false,
      isError: false,
      refetch: h.refetch,
    });
    renderWithProviders(<AnalyticsPage />);

    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("80 active")).toBeInTheDocument();
    expect(screen.getByText("₦5000")).toBeInTheDocument();
    expect(screen.getByText("+4.5%")).toBeInTheDocument();
  });

  it("shows skeletons only while loading", () => {
    h.analytics.mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch: h.refetch });
    const { container } = renderWithProviders(<AnalyticsPage />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows an error with retry instead of skeleton or blank cards when the request fails", async () => {
    h.analytics.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch: h.refetch });
    const user = userEvent.setup();
    const { container } = renderWithProviders(<AnalyticsPage />);

    expect(screen.getByRole("alert")).toHaveTextContent(/couldn't load analytics/i);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(h.refetch).toHaveBeenCalled();
  });
});
