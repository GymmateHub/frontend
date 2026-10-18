import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InventoryPage from "./InventoryPage";
import { makeGym, renderWithProviders } from "../../test/utils";

vi.mock("../../auth/auth.store", () => ({ useAuth: () => ({ user: { gymId: "gym-1" } }) }));
vi.mock("../../features/gyms/gyms.hooks", () => ({ useMyGyms: () => ({ data: [makeGym()] }) }));
vi.mock("../../utils/currency", () => ({ useCurrency: () => ({ symbol: "₦", format: (n: number) => `₦${n}` }) }));

const h = vi.hoisted(() => ({ items: vi.fn(), create: vi.fn() }));
vi.mock("../../features/inventory/inventory.hooks", () => ({
  useInventory: h.items,
  useCreateInventoryItem: () => ({ mutateAsync: h.create, isPending: false }),
}));

const item = (over = {}) => ({
  id: "i1", name: "Whey Protein", category: "SUPPLEMENTS", currentStock: 8, minimumStock: 5, unitPrice: 5000, unitCost: 3500, ...over,
});

beforeEach(() => {
  vi.clearAllMocks();
  h.items.mockReturnValue({ data: [], isLoading: false });
  h.create.mockResolvedValue({});
});

describe("InventoryPage", () => {
  it("Add Item opens the form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);

    await user.click(screen.getByRole("button", { name: /Add Item/ }));

    expect(screen.getByRole("heading", { name: /Add/ })).toBeInTheDocument();
  });

  it("creates an item scoped to the gym, using the API's field names and category values", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await user.click(screen.getByRole("button", { name: /Add Item/ }));

    await user.type(screen.getByPlaceholderText(/Whey Protein Isolate/), "Creatine");
    await user.type(screen.getByText("Retail Price (₦) *").parentElement!.querySelector("input")!, "4500");
    await user.click(screen.getByRole("button", { name: "Add Product" }));

    await waitFor(() => expect(h.create).toHaveBeenCalled());
    expect(h.create).toHaveBeenCalledWith({
      gymId: "gym-1",
      name: "Creatine",
      category: "SUPPLEMENTS",
      initialStock: 10,
      minimumStock: 5,
      unitPrice: 4500,
      unitCost: undefined,
    });
  });

  it("offers the categories the backend understands", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InventoryPage />);
    await user.click(screen.getByRole("button", { name: /Add Item/ }));

    const select = screen.getByDisplayValue("Supplements") as HTMLSelectElement;
    expect(within(select).getAllByRole("option").map((o) => (o as HTMLOptionElement).value)).toEqual([
      "SUPPLEMENTS", "APPAREL", "ACCESSORIES", "SUPPLIES", "MERCHANDISE", "EQUIPMENT_PARTS", "OTHER",
    ]);
  });

  it("shows stock from the API's currentStock/minimumStock fields", () => {
    h.items.mockReturnValue({ data: [item(), item({ id: "i2", name: "Towel", category: "ACCESSORIES", currentStock: 0 }), item({ id: "i3", name: "Bands", currentStock: 3 })], isLoading: false });
    renderWithProviders(<InventoryPage />);

    const whey = screen.getByRole("row", { name: /Whey Protein/ });
    expect(within(whey).getByText("8")).toBeInTheDocument();
    expect(within(whey).getByText("In Stock")).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Towel/ })).getByText("Out of Stock")).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Bands/ })).getByText("Low Stock")).toBeInTheDocument();
    expect(within(whey).getByText("Supplements")).toBeInTheDocument();
  });
});
