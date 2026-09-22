import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EquipmentPage from "./EquipmentPage";
import { makeGym, renderWithProviders } from "../../test/utils";

const h = vi.hoisted(() => ({ gyms: vi.fn() }));
vi.mock("../../features/equipment/equipment.hooks", () => ({
  useEquipmentByOrganisation: () => ({ data: [], isLoading: false }),
  useEquipmentStats: () => ({ data: undefined }),
  useCreateEquipment: () => ({ mutateAsync: vi.fn() }),
}));
vi.mock("../../features/gyms/gyms.hooks", () => ({ useGyms: h.gyms }));
vi.mock("../../features/gyms/useActiveGym", () => ({ useActiveGym: () => ({ gymId: "gym-2" }) }));

beforeEach(() => vi.clearAllMocks());

const openForm = async () => {
  const user = userEvent.setup();
  renderWithProviders(<EquipmentPage />);
  await user.click(screen.getByRole("button", { name: /Add Equipment/ }));
};

describe("EquipmentPage — gym dropdown", () => {
  it("lists the account's gyms and preselects the active one", async () => {
    h.gyms.mockReturnValue({ data: [makeGym({ id: "gym-1", name: "Iron Temple" }), makeGym({ id: "gym-2", name: "Second Gym" })] });
    await openForm();

    const select = screen.getByRole("combobox", { name: /Gym/ }) as HTMLSelectElement;
    expect(within(select).getAllByRole("option").map((o) => o.textContent)).toEqual(["Select a gym", "Iron Temple", "Second Gym"]);
    expect(select.value).toBe("gym-2");
  });

  it("says why it's empty instead of showing a blank dropdown", async () => {
    h.gyms.mockReturnValue({ data: [] });
    await openForm();

    expect(screen.getByRole("option", { name: "No gyms available" })).toBeInTheDocument();
  });
});
