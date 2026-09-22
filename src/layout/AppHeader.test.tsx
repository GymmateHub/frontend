import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppHeader from "./AppHeader";
import { renderWithProviders } from "../test/utils";

const navigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigate,
}));
vi.mock("../context/SidebarContext", () => ({
  useSidebar: () => ({ isMobileOpen: false, toggleSidebar: vi.fn(), toggleMobileSidebar: vi.fn() }),
}));
vi.mock("../components/common/ThemeToggleButton", () => ({ ThemeToggleButton: () => null }));
vi.mock("../components/header/NotificationDropdown", () => ({ default: () => null }));
vi.mock("../components/header/UserDropdown", () => ({ default: () => null }));

beforeEach(() => vi.clearAllMocks());

describe("AppHeader search", () => {
  it("opens a command palette from the search box", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppHeader />);

    await user.click(screen.getByRole("button", { name: /Search or type a command/ }));

    expect(screen.getByPlaceholderText("Type a command or search pages...")).toBeInTheDocument();
    expect(screen.getByText("Billing & Subscription")).toBeInTheDocument();
  });

  it("opens with Ctrl/⌘+K", () => {
    renderWithProviders(<AppHeader />);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.getByPlaceholderText("Type a command or search pages...")).toBeInTheDocument();
  });

  it("filters pages as you type and navigates on Enter", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppHeader />);
    await user.click(screen.getByRole("button", { name: /Search or type a command/ }));

    await user.type(screen.getByPlaceholderText("Type a command or search pages..."), "billing{Enter}");

    expect(navigate).toHaveBeenCalledWith("/billing");
    expect(screen.queryByPlaceholderText("Type a command or search pages...")).not.toBeInTheDocument();
  });

  it("says when nothing matches", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppHeader />);
    await user.click(screen.getByRole("button", { name: /Search or type a command/ }));

    await user.type(screen.getByPlaceholderText("Type a command or search pages..."), "zzzz");

    expect(screen.getByText(/No matching results found/)).toBeInTheDocument();
  });
});
