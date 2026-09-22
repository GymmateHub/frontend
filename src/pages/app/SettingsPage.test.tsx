import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import SettingsPage from "./SettingsPage";
import { makeGym, renderWithProviders } from "../../test/utils";

const activeGym = vi.hoisted(() => vi.fn());
vi.mock("../../features/gyms/useActiveGym", () => ({ useActiveGym: activeGym }));
vi.mock("../../features/gyms/gyms.hooks", () => ({
  useUpdateGym: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateGymBusinessSettings: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock("../../auth/auth.store", () => ({ authAPI: { changePassword: vi.fn() } }));

beforeEach(() => vi.clearAllMocks());

describe("SettingsPage", () => {
  it("shows every settings section for the active gym", () => {
    const gym = makeGym();
    activeGym.mockReturnValue({ gym, gymId: gym.id, gyms: [gym], isLoading: false });
    renderWithProviders(<SettingsPage />);

    expect(screen.getByRole("heading", { name: "Gym Profile" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Business Hours" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Notification Preferences" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Security" })).toBeInTheDocument();
    expect(screen.getByLabelText("Gym Name")).toHaveValue("Iron Temple");
  });

  it("re-seeds the forms when the active gym changes", () => {
    const first = makeGym();
    activeGym.mockReturnValue({ gym: first, gymId: first.id, gyms: [first], isLoading: false });
    const { rerender } = renderWithProviders(<SettingsPage />);
    expect(screen.getByLabelText("Gym Name")).toHaveValue("Iron Temple");

    const second = makeGym({ id: "gym-2", name: "Second Gym" });
    activeGym.mockReturnValue({ gym: second, gymId: second.id, gyms: [first, second], isLoading: false });
    rerender(<SettingsPage />);
    expect(screen.getByLabelText("Gym Name")).toHaveValue("Second Gym");
  });

  it("does not fake a save when the account has no gym — it explains and links to Gym Management", () => {
    activeGym.mockReturnValue({ gym: undefined, gymId: "", gyms: [], isLoading: false });
    renderWithProviders(<SettingsPage />);

    expect(screen.getByText("No gym found for your account")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save Profile" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Gym Management" })).toHaveAttribute("href", "/gym-management");
    // account-level settings stay available
    expect(screen.getByRole("button", { name: "Change Password" })).toBeInTheDocument();
  });

  it("shows a loading state instead of placeholder values while the gym loads", () => {
    activeGym.mockReturnValue({ gym: undefined, gymId: "", gyms: [], isLoading: true });
    renderWithProviders(<SettingsPage />);

    expect(document.querySelector("[aria-busy='true']")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("GymMate Center")).not.toBeInTheDocument();
    expect(screen.queryByText("No gym found for your account")).not.toBeInTheDocument();
  });
});
