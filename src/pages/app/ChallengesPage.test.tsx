import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChallengesPage from "./ChallengesPage";
import { renderWithProviders, lastOf } from "../../test/utils";

const gymState = vi.hoisted(() => ({ value: { gymId: "gym-1", isLoading: false } }));
vi.mock("../../features/gyms/useActiveGym", () => ({ useActiveGym: () => gymState.value }));
const toast = vi.hoisted(() => vi.fn());
vi.mock("../../hooks/use-toast", () => ({ useToast: () => ({ toast }) }));

afterEach(() => {
  localStorage.clear();
  gymState.value = { gymId: "gym-1", isLoading: false };
  vi.clearAllMocks();
});

async function openForm() {
  const user = userEvent.setup();
  renderWithProviders(<ChallengesPage />);
  await user.click(screen.getByRole("button", { name: /Create Challenge/ }));
  return user;
}

describe("ChallengesPage", () => {
  it("starts empty — the old page invented two challenges with fake participant counts", () => {
    renderWithProviders(<ChallengesPage />);

    expect(screen.getByText("No challenges yet")).toBeInTheDocument();
    expect(screen.queryByText(/Summer Shred/)).not.toBeInTheDocument();
    expect(screen.queryByText(/participants/)).not.toBeInTheDocument();
  });

  it("tells the owner challenges are stored on this device only", () => {
    renderWithProviders(<ChallengesPage />);
    expect(screen.getByText(/saved on this device only/i)).toBeInTheDocument();
  });

  it("Create Challenge opens the form", async () => {
    await openForm();
    expect(screen.getByRole("heading", { name: "Create Fitness Challenge" })).toBeInTheDocument();
  });

  it("creates a challenge, lists it, and keeps it after a reload", async () => {
    const user = await openForm();
    await user.type(screen.getByLabelText(/Challenge Title/), "Sprint Month");
    await user.type(screen.getByLabelText(/Target Goal/), "12 Workouts");
    await user.click(lastOf(screen.getAllByRole("button", { name: "Create Challenge" })));

    expect(await screen.findByText("Sprint Month")).toBeInTheDocument();
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Challenge saved" }));
    // dialog closed
    expect(screen.queryByRole("heading", { name: "Create Fitness Challenge" })).not.toBeInTheDocument();

    renderWithProviders(<ChallengesPage />);
    expect(screen.getAllByText("Sprint Month").length).toBeGreaterThan(0);
  });

  it("keeps challenges separate per gym", async () => {
    const user = await openForm();
    await user.type(screen.getByLabelText(/Challenge Title/), "Gym One Only");
    await user.type(screen.getByLabelText(/Target Goal/), "5 km");
    fireEvent.submit(screen.getByLabelText(/Challenge Title/).closest("form")!);
    await screen.findByText("Gym One Only");

    gymState.value = { gymId: "gym-2", isLoading: false };
    document.body.innerHTML = "";
    renderWithProviders(<ChallengesPage />);
    expect(screen.queryByText("Gym One Only")).not.toBeInTheDocument();
    expect(screen.getByText("No challenges yet")).toBeInTheDocument();
  });

  it("rejects an end date before the start date", async () => {
    const user = await openForm();
    await user.type(screen.getByLabelText(/Challenge Title/), "Backwards");
    await user.type(screen.getByLabelText(/Target Goal/), "1");
    fireEvent.change(screen.getByLabelText("Start Date"), { target: { value: "2026-06-30" } });
    fireEvent.change(screen.getByLabelText("End Date"), { target: { value: "2026-06-01" } });
    fireEvent.submit(screen.getByLabelText(/Challenge Title/).closest("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(/before the start date/);
    expect(screen.queryByText("Backwards")).not.toBeInTheDocument();
    expect(toast).not.toHaveBeenCalled();
  });

  it("renders nothing until the active gym is known, so it never reads the wrong gym's data", () => {
    gymState.value = { gymId: "", isLoading: true };
    renderWithProviders(<ChallengesPage />);
    expect(screen.queryByText("No challenges yet")).not.toBeInTheDocument();
  });
});
