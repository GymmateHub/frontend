import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PointOfSalePage from "./PointOfSalePage";
import { makeGym, renderWithProviders } from "../../test/utils";

const navigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigate,
}));
vi.mock("../../auth/auth.store", () => ({ useAuth: () => ({ user: { gymId: "gym-1" } }) }));
vi.mock("../../features/gyms/gyms.hooks", () => ({ useMyGyms: () => ({ data: [makeGym()] }) }));
vi.mock("../../utils/currency", () => ({ useCurrency: () => ({ symbol: "₦", format: (n: number) => `₦${n}` }) }));

const h = vi.hoisted(() => ({ products: vi.fn(), quickSale: vi.fn() }));
vi.mock("../../features/inventory/inventory.hooks", () => ({ useInventory: h.products }));
vi.mock("../../features/pos/pos.hooks", () => ({ useQuickSale: () => ({ mutate: h.quickSale, isPending: false }) }));

const product = (over = {}) => ({ id: "p1", name: "Water", unitPrice: 500, currentStock: 4, ...over });

beforeEach(() => {
  vi.clearAllMocks();
  h.products.mockReturnValue({ data: [], isLoading: false });
});

describe("PointOfSalePage", () => {
  it("explains where products come from and links to Inventory when there are none", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PointOfSalePage />);

    expect(screen.getByText("No inventory products found")).toBeInTheDocument();
    expect(screen.getByText(/pulled directly from your gym inventory/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /inventory/i }));
    expect(navigate).toHaveBeenCalledWith("/inventory");
  });

  it("shows real stock counts and disables sold-out products", () => {
    h.products.mockReturnValue({ data: [product(), product({ id: "p2", name: "Towel", currentStock: 0 })], isLoading: false });
    renderWithProviders(<PointOfSalePage />);

    expect(screen.getByText("4 in stock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Towel/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Water/ })).toBeEnabled();
  });

  it("checks out the cart against the active gym", async () => {
    h.products.mockReturnValue({ data: [product()], isLoading: false });
    const user = userEvent.setup();
    renderWithProviders(<PointOfSalePage />);

    await user.click(screen.getByRole("button", { name: /Water/ }));
    await user.click(screen.getByRole("button", { name: /checkout|complete|charge/i }));

    expect(h.quickSale).toHaveBeenCalledWith(
      expect.objectContaining({
        gymId: "gym-1",
        paymentType: "CASH",
        amountPaid: 500,
        items: [{ inventoryItemId: "p1", itemName: "Water", quantity: 1, unitPrice: 500 }],
      }),
      expect.anything()
    );
  });
});
