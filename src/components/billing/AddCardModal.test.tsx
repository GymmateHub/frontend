import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const stripeState = vi.hoisted(() => ({ promise: Promise.resolve({}) as Promise<unknown> | null }));
vi.mock("../../features/billing/stripe", () => ({
  get stripePromise() {
    return stripeState.promise;
  },
}));

const createPaymentMethod = vi.hoisted(() => vi.fn());
vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardElement: () => <div data-testid="card-element" />,
  useStripe: () => ({ createPaymentMethod }),
  useElements: () => ({ getElement: () => ({}) }),
}));

const mutateAsync = vi.hoisted(() => vi.fn());
vi.mock("../../features/billing/billing.hooks", () => ({
  useAttachPaymentMethod: () => ({ mutateAsync, isPending: false }),
}));

import AddCardModal from "./AddCardModal";

beforeEach(() => {
  vi.clearAllMocks();
  stripeState.promise = Promise.resolve({});
  mutateAsync.mockResolvedValue({});
});

describe("AddCardModal", () => {
  it("never renders raw card-number inputs — Stripe's element collects them", () => {
    render(<AddCardModal isOpen onClose={vi.fn()} />);

    expect(screen.getByTestId("card-element")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/4242/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/cvv/i)).not.toBeInTheDocument();
  });

  it("sends only the Stripe payment-method id to our API", async () => {
    createPaymentMethod.mockResolvedValue({ paymentMethod: { id: "pm_123" } });
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AddCardModal isOpen onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Save Card" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith("pm_123"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("shows Stripe's validation error and does not call our API", async () => {
    createPaymentMethod.mockResolvedValue({ error: { message: "Your card number is incomplete." } });
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AddCardModal isOpen onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Save Card" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Your card number is incomplete.");
    expect(mutateAsync).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("keeps the dialog open when our API rejects the card", async () => {
    createPaymentMethod.mockResolvedValue({ paymentMethod: { id: "pm_123" } });
    mutateAsync.mockRejectedValue(new Error("declined"));
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AddCardModal isOpen onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Save Card" }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("explains when Stripe isn't configured instead of pretending to save a card", async () => {
    stripeState.promise = null;
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<AddCardModal isOpen onClose={onClose} />);

    expect(screen.getByText(/aren't set up for this environment/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save Card" })).not.toBeInTheDocument();
    await user.click(screen.getByText("Close", { selector: "button" }));
    expect(onClose).toHaveBeenCalled();
  });
});
