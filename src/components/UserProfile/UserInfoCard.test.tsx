import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserInfoCard from "./UserInfoCard";

const h = vi.hoisted(() => ({ profile: vi.fn(), refetch: vi.fn() }));
vi.mock("../../features/users/users.hooks", () => ({ useMyProfile: h.profile }));
vi.mock("../../auth/auth.store", () => ({
  useAuth: () => ({ user: { firstName: "Ada", lastName: "Obi", email: "ada@example.com", role: "GYM_OWNER" } }),
}));

beforeEach(() => vi.clearAllMocks());

describe("UserInfoCard", () => {
  it("shows the signed-in user's details immediately while the full profile loads", () => {
    h.profile.mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch: h.refetch });
    render(<UserInfoCard />);

    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("prefers the fetched profile", () => {
    h.profile.mockReturnValue({
      data: { firstName: "Adaeze", lastName: "Obi", email: "ada@example.com", phone: "+2348011111111", role: "GYM_OWNER", status: "ACTIVE", createdAt: "2026-01-01T00:00:00", lastLoginAt: null },
      isLoading: false,
      isError: false,
      refetch: h.refetch,
    });
    render(<UserInfoCard />);

    expect(screen.getByText("Adaeze")).toBeInTheDocument();
    expect(screen.getByText("+2348011111111")).toBeInTheDocument();
  });

  it("explains a failed load and lets the user retry — instead of loading forever", async () => {
    h.profile.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch: h.refetch });
    const user = userEvent.setup();
    render(<UserInfoCard />);

    expect(screen.getByRole("alert")).toHaveTextContent(/couldn't load your full profile/i);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(h.refetch).toHaveBeenCalled();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });
});
