import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeadsPage from "./LeadsPage";
import { renderWithProviders, lastOf } from "../../test/utils";

const h = vi.hoisted(() => ({ create: vi.fn(), leads: vi.fn() }));
vi.mock("../../features/leads/leads.hooks", () => ({
  useLeads: h.leads,
  useCreateLead: () => ({ mutate: h.create, isPending: false }),
  useUpdateLead: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateLeadStatus: () => ({ mutate: vi.fn() }),
  useConvertLead: () => ({ mutate: vi.fn() }),
  useDeleteLead: () => ({ mutate: vi.fn() }),
}));
vi.mock("../../features/gyms/useActiveGym", () => ({ useActiveGym: () => ({ gymId: "gym-1" }) }));

beforeEach(() => {
  vi.clearAllMocks();
  h.leads.mockReturnValue({ data: [], isLoading: false });
});

describe("LeadsPage", () => {
  it("loads leads for the active gym", () => {
    renderWithProviders(<LeadsPage />);
    expect(h.leads).toHaveBeenCalledWith("gym-1");
  });

  it("creates a lead tied to the active gym", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LeadsPage />);

    await user.click(screen.getByRole("button", { name: /Add Lead/ }));
    const first = screen.getByText("First Name *").parentElement!.querySelector("input")!;
    const last = screen.getByText("Last Name *").parentElement!.querySelector("input")!;
    await user.type(first, "Ada");
    await user.type(last, "Obi");
    await user.click(lastOf(screen.getAllByRole("button", { name: "Add Lead" })));

    expect(h.create).toHaveBeenCalledWith(
      expect.objectContaining({ gymId: "gym-1", firstName: "Ada", lastName: "Obi" }),
      expect.anything()
    );
  });
});
