import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError, type AxiosResponse } from "axios";
import ClassesPage from "./ClassesPage";
import { makeGym, renderWithProviders, lastOf } from "../../test/utils";

vi.mock("../../auth/auth.store", () => ({ useAuth: () => ({ user: { gymId: "gym-1" } }) }));
vi.mock("../../features/gyms/gyms.hooks", () => ({ useMyGyms: () => ({ data: [makeGym()] }) }));

const h = vi.hoisted(() => ({ classes: vi.fn(), stats: vi.fn(), create: vi.fn() }));
vi.mock("../../features/classes/classes.hooks", () => ({
  useClasses: h.classes,
  useClassStats: h.stats,
  useClassCategories: () => ({ data: [] }),
  useCreateClass: () => ({ mutateAsync: h.create, isPending: false }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  h.classes.mockReturnValue({ data: [], isLoading: false });
  h.stats.mockReturnValue({ data: undefined });
  h.create.mockResolvedValue({});
});

describe("ClassesPage", () => {
  it("Add Class opens the form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClassesPage />);

    await user.click(screen.getByRole("button", { name: "Add Class" }));

    expect(screen.getByRole("heading", { name: "Add New Class" })).toBeInTheDocument();
  });

  it("creates a class for the active gym and closes the form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClassesPage />);

    await user.click(screen.getByRole("button", { name: "Add Class" }));
    await user.type(screen.getByPlaceholderText(/HIIT Power Hour/), "  Morning Yoga ");
    await user.click(lastOf(screen.getAllByRole("button", { name: "Add Class" })));

    await waitFor(() =>
      expect(h.create).toHaveBeenCalledWith(
        expect.objectContaining({ gymId: "gym-1", name: "Morning Yoga", capacity: 20, durationMinutes: 60 })
      )
    );
    await waitFor(() => expect(screen.queryByRole("heading", { name: "Add New Class" })).not.toBeInTheDocument());
  });

  it("won't submit a blank class name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClassesPage />);
    await user.click(screen.getByRole("button", { name: "Add Class" }));

    expect(lastOf(screen.getAllByRole("button", { name: "Add Class" }))).toBeDisabled();
    expect(h.create).not.toHaveBeenCalled();
  });

  it("shows the API's reason when creation fails, and keeps the form open", async () => {
    h.create.mockRejectedValue(
      new AxiosError("Request failed with status code 409", "ERR_BAD_REQUEST", undefined, undefined, {
        status: 409,
        data: { message: "Class with this name already exists" },
      } as AxiosResponse)
    );
    const user = userEvent.setup();
    renderWithProviders(<ClassesPage />);
    await user.click(screen.getByRole("button", { name: "Add Class" }));
    await user.type(screen.getByPlaceholderText(/HIIT Power Hour/), "Yoga");
    await user.click(lastOf(screen.getAllByRole("button", { name: "Add Class" })));

    expect(await screen.findByText("Class with this name already exists")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Add New Class" })).toBeInTheDocument();
  });

  it("Avg Attendance shows a dash when there are no stats — never garbled characters", () => {
    renderWithProviders(<ClassesPage />);

    const card = screen.getByText("Avg Attendance").closest("div")!.parentElement!;
    expect(card).toHaveTextContent("—");
    expect(document.body.textContent).not.toMatch(/â€/);
  });

  it("Avg Attendance shows a rounded percentage when stats exist", () => {
    h.stats.mockReturnValue({ data: { totalClasses: 3, averageAttendance: 72.4 } });
    renderWithProviders(<ClassesPage />);
    expect(screen.getByText("72%")).toBeInTheDocument();
  });
});
