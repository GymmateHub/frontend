import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BillingPage from "./BillingPage";
import { renderWithProviders } from "../../test/utils";

const q = vi.hoisted(() => ({
  subscription: vi.fn(),
  invoices: vi.fn(),
  methods: vi.fn(),
  tiers: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("../../features/billing", () => ({
  useCurrentSubscription: q.subscription,
  useInvoices: q.invoices,
  usePaymentMethods: q.methods,
  useRemovePaymentMethod: () => ({ mutate: q.remove, isPending: false }),
  useSubscriptionTiers: q.tiers,
  useUpgradeSubscription: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock("../../features/billing/billing.hooks", () => ({ useAttachPaymentMethod: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("../../features/billing/stripe", () => ({ stripePromise: null }));

const subscription = {
  tierName: "PRO",
  tierDisplayName: "Pro",
  status: "ACTIVE",
  price: 99,
  billingCycle: "MONTHLY",
  maxMembers: 500,
  smsCreditsPerMonth: 5000,
  emailCreditsPerMonth: null,
  apiRequestsPerHour: null,
  currentPeriodEnd: "2026-10-01T00:00:00",
  cancelAtPeriodEnd: false,
  isInTrial: false,
  trialEnd: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  q.subscription.mockReturnValue({ data: subscription, isLoading: false, isError: false });
  q.invoices.mockReturnValue({ data: [], isLoading: false });
  q.methods.mockReturnValue({ data: [], isLoading: false });
  q.tiers.mockReturnValue({ data: [], isLoading: false, isError: false });
});

describe("BillingPage", () => {
  it("renders the real subscription — plan, price, features", () => {
    renderWithProviders(<BillingPage />);

    expect(screen.getByRole("heading", { name: "Pro" })).toBeInTheDocument();
    expect(screen.getByText("$99.00")).toBeInTheDocument();
    expect(screen.getByText("Up to 500 members")).toBeInTheDocument();
    expect(screen.getByText("5000 SMS credits / month")).toBeInTheDocument();
  });

  it("does not invent a payment card or invoice when there are none", () => {
    renderWithProviders(<BillingPage />);

    expect(screen.getByText("No payment method on file.")).toBeInTheDocument();
    expect(screen.getByText("No invoices yet.")).toBeInTheDocument();
    expect(screen.queryByText(/4242/)).not.toBeInTheDocument();
    expect(screen.queryByText(/INV-2026-001/)).not.toBeInTheDocument();
  });

  it("lists real payment methods and removes one", async () => {
    q.methods.mockReturnValue({
      data: [{ id: "pm-1", type: "CARD", cardBrand: "visa", lastFour: "1111", expiryMonth: 3, expiryYear: 2029, isDefault: true }],
      isLoading: false,
    });
    const user = userEvent.setup();
    renderWithProviders(<BillingPage />);

    expect(screen.getByText("visa ending in 1111")).toBeInTheDocument();
    expect(screen.getByText(/Expires 03\/29/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove visa ending in 1111" }));
    expect(q.remove).toHaveBeenCalledWith("pm-1");
  });

  it("renders invoices in their own currency with a receipt link", () => {
    q.invoices.mockReturnValue({
      data: [{ id: "i1", invoiceNumber: "INV-42", amount: 99, currency: "USD", status: "PAID", createdAt: "2026-09-01T00:00:00", invoicePdfUrl: "https://stripe.example/inv.pdf", hostedInvoiceUrl: null }],
      isLoading: false,
    });
    renderWithProviders(<BillingPage />);

    const row = screen.getByRole("row", { name: /INV-42/ });
    expect(within(row).getByText("$99.00")).toBeInTheDocument();
    expect(within(row).getByRole("link", { name: /PDF/ })).toHaveAttribute("href", "https://stripe.example/inv.pdf");
  });

  it("Add Payment Method opens the card dialog", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BillingPage />);

    await user.click(screen.getByRole("button", { name: /Add Payment Method/ }));
    expect(screen.getByRole("heading", { name: "Add Card" })).toBeInTheDocument();
  });

  it("Upgrade Plan opens the upgrade dialog", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BillingPage />);

    await user.click(screen.getByRole("button", { name: "Upgrade Plan" }));
    expect(screen.getByRole("heading", { name: "Upgrade Plan", level: 5 })).toBeInTheDocument();
  });

  it("says there's no subscription instead of showing a made-up plan", () => {
    q.subscription.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    renderWithProviders(<BillingPage />);

    expect(screen.getByText("No active subscription")).toBeInTheDocument();
    expect(screen.queryByText(/Standard Business/)).not.toBeInTheDocument();
  });
});
