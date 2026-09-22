import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "./DashboardPage";
import { makeGym, renderWithProviders } from "../../test/utils";

const navigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigate,
}));

const members = vi.hoisted(() => ({ stats: vi.fn(), list: vi.fn() }));
vi.mock("../../features/members/members.hooks", () => ({
  useMemberStats: members.stats,
  useMembers: members.list,
}));
vi.mock("../../auth/auth.store", () => ({ useAuth: () => ({ user: { firstName: "Ada", role: "GYM_OWNER" } }) }));
const activeGym = vi.hoisted(() => vi.fn());
vi.mock("../../features/gyms/useActiveGym", () => ({ useActiveGym: activeGym }));

beforeEach(() => {
  vi.clearAllMocks();
  members.stats.mockReturnValue({ data: { totalMembers: 1200, monthlyRevenue: 50000, activeMembers: 40 }, isLoading: false });
  members.list.mockReturnValue({ data: [], isLoading: false });
  activeGym.mockReturnValue({ gym: makeGym({ currency: "NGN" }), gymId: "gym-1", gyms: [], isLoading: false });
});

describe("DashboardPage", () => {
  it("shows Monthly Revenue in the gym's currency (₦), not a hard-coded dollar sign", () => {
    renderWithProviders(<DashboardPage />);

    const card = screen.getByText("Monthly Revenue").closest("div")!.parentElement!;
    expect(within(card).getByText("₦50,000.00")).toBeInTheDocument();
    expect(screen.queryByText(/\$50/)).not.toBeInTheDocument();
  });

  it("follows the gym's configured currency", () => {
    activeGym.mockReturnValue({ gym: makeGym({ currency: "USD" }), gymId: "gym-1", gyms: [], isLoading: false });
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText("$50,000.00")).toBeInTheDocument();
  });

  it("Quick Actions opens a panel of shortcuts instead of navigating away", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardPage />);

    await user.click(screen.getByRole("button", { name: "Quick Actions" }));

    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Quick Actions" })).toBeInTheDocument();
    expect(screen.getByText("Add New Member")).toBeInTheDocument();
    expect(screen.getByText("Record Point of Sale")).toBeInTheDocument();
  });

  it("a Quick Action closes the panel and goes to its page", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardPage />);

    await user.click(screen.getByRole("button", { name: "Quick Actions" }));
    await user.click(screen.getByRole("button", { name: /Add Gym Equipment/ }));

    expect(navigate).toHaveBeenCalledWith("/equipment");
    expect(screen.queryByRole("heading", { name: "Quick Actions" })).not.toBeInTheDocument();
  });
});
