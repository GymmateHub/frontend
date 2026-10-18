import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GymManagementPage from "./GymManagementPage";
import { makeGym, renderWithProviders } from "../../test/utils";

const h = vi.hoisted(() => ({ gyms: vi.fn(), create: vi.fn() }));
vi.mock("../../features/gyms/gyms.hooks", () => ({
  useMyGyms: h.gyms,
  useCreateGym: () => ({ mutateAsync: h.create, isPending: false }),
  useActivateGym: () => ({ mutate: vi.fn() }),
  useDeactivateGym: () => ({ mutate: vi.fn() }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  h.gyms.mockReturnValue({ data: [makeGym({ currency: "NGN", timezone: "Africa/Lagos" })], isLoading: false });
  h.create.mockResolvedValue({});
});

describe("GymManagementPage", () => {
  it("shows each gym's contact details and currency from the API's real field names", () => {
    renderWithProviders(<GymManagementPage />);

    expect(screen.getByText("owner@example.com")).toBeInTheDocument();
    expect(screen.getByText("+2348000000000")).toBeInTheDocument();
    expect(screen.getByText("Currency: NGN")).toBeInTheDocument();
  });

  it("Add Gym opens the form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GymManagementPage />);

    await user.click(screen.getByRole("button", { name: "Add Gym" }));

    expect(screen.getByPlaceholderText("+234 000 0000")).toBeRequired();
  });

  it("creates a gym that inherits the organisation's currency and timezone", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GymManagementPage />);
    await user.click(screen.getByRole("button", { name: "Add Gym" }));

    const form = screen.getByPlaceholderText("+234 000 0000").closest("form")!;
    const inputs = form.querySelectorAll("input");
    await user.type(inputs[0], "Iron Temple Ikeja");
    await user.type(form.querySelector("input[type=email]")!, "ikeja@irontemple.com");
    await user.type(screen.getByPlaceholderText("+234 000 0000"), "+2348011111111");
    await user.click(form.querySelector("button[type=submit]")!);

    await waitFor(() => expect(h.create).toHaveBeenCalled());
    expect(h.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Iron Temple Ikeja",
        email: "ikeja@irontemple.com",
        phone: "+2348011111111",
        currency: "NGN",
        timezone: "Africa/Lagos",
      })
    );
  });

  it("keeps the form open when the API rejects the gym", async () => {
    h.create.mockRejectedValue(new Error("Subscription gym limit reached"));
    const user = userEvent.setup();
    renderWithProviders(<GymManagementPage />);
    await user.click(screen.getByRole("button", { name: "Add Gym" }));
    const form = screen.getByPlaceholderText("+234 000 0000").closest("form")!;
    await user.type(form.querySelectorAll("input")[0], "X Gym");
    await user.type(form.querySelector("input[type=email]")!, "x@gym.com");
    await user.type(screen.getByPlaceholderText("+234 000 0000"), "+2348011111111");
    await user.click(form.querySelector("button[type=submit]")!);

    await waitFor(() => expect(h.create).toHaveBeenCalled());
    expect(screen.getByPlaceholderText("+234 000 0000")).toBeInTheDocument();
  });
});
