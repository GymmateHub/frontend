import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpgradePlanModal, { upgradeOptions } from "./UpgradePlanModal";
import type { SubscriptionResponse, SubscriptionTierResponse } from "../../features/billing";

const tiersQuery = vi.hoisted(() => vi.fn());
const mutateAsync = vi.hoisted(() => vi.fn());
vi.mock("../../features/billing", () => ({
  useSubscriptionTiers: tiersQuery,
  useUpgradeSubscription: () => ({ mutateAsync, isPending: false }),
}));

const tier = (name: string, price: number, extra: Partial<SubscriptionTierResponse> = {}): SubscriptionTierResponse => ({
  id: `id-${name}`,
  name,
  displayName: name[0] + name.slice(1).toLowerCase(),
  description: null,
  price,
  billingCycle: "MONTHLY",
  maxMembers: null,
  featured: false,
  features: null,
  ...extra,
});

const current = { tierName: "STARTER", price: 20 } as SubscriptionResponse;
const tiers = [tier("ENTERPRISE", 249), tier("STARTER", 20), tier("PRO", 99, { maxMembers: 500, features: ["Advanced Analytics"] })];

beforeEach(() => {
  vi.clearAllMocks();
  tiersQuery.mockReturnValue({ data: tiers, isLoading: false, isError: false });
  mutateAsync.mockResolvedValue({});
});

describe("upgradeOptions", () => {
  it("offers only pricier tiers than the current one, cheapest first", () => {
    expect(upgradeOptions(tiers, current).map((t) => t.name)).toEqual(["PRO", "ENTERPRISE"]);
  });
  it("offers everything above zero when there is no subscription yet", () => {
    expect(upgradeOptions(tiers, undefined)).toHaveLength(3);
  });
  it("offers nothing on the top tier", () => {
    expect(upgradeOptions(tiers, { tierName: "ENTERPRISE", price: 249 } as SubscriptionResponse)).toEqual([]);
  });
});

describe("UpgradePlanModal", () => {
  it("lists real tiers with their real prices — nothing hard-coded", () => {
    render(<UpgradePlanModal isOpen onClose={vi.fn()} subscription={current} />);

    expect(screen.getByRole("radio", { name: /Pro/ })).toHaveTextContent("$99.00");
    expect(screen.getByRole("radio", { name: /Enterprise/ })).toHaveTextContent("$249.00");
    expect(screen.getByText("Up to 500 members")).toBeInTheDocument();
    expect(screen.getByText("Advanced Analytics")).toBeInTheDocument();
    expect(screen.queryByText(/Starter/)).not.toBeInTheDocument();
  });

  it("upgrades to the cheapest option by default and closes on success", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<UpgradePlanModal isOpen onClose={onClose} subscription={current} />);

    await user.click(screen.getByRole("button", { name: "Confirm Upgrade to Pro" }));

    expect(mutateAsync).toHaveBeenCalledWith("PRO");
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("upgrades to the tier the user picked", async () => {
    const user = userEvent.setup();
    render(<UpgradePlanModal isOpen onClose={vi.fn()} subscription={current} />);

    await user.click(screen.getByRole("radio", { name: /Enterprise/ }));
    await user.click(screen.getByRole("button", { name: "Confirm Upgrade to Enterprise" }));

    expect(mutateAsync).toHaveBeenCalledWith("ENTERPRISE");
  });

  it("stays open when the upgrade fails", async () => {
    mutateAsync.mockRejectedValue(new Error("boom"));
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<UpgradePlanModal isOpen onClose={onClose} subscription={current} />);

    await user.click(screen.getByRole("button", { name: /Confirm Upgrade/ }));

    expect(mutateAsync).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("says so on the top tier and disables confirmation", () => {
    render(<UpgradePlanModal isOpen onClose={vi.fn()} subscription={{ tierName: "ENTERPRISE", price: 249 } as SubscriptionResponse} />);

    expect(screen.getByText(/already on our highest plan/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm Upgrade" })).toBeDisabled();
  });

  it("reports a failure to load plans", () => {
    tiersQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    render(<UpgradePlanModal isOpen onClose={vi.fn()} subscription={current} />);
    expect(screen.getByRole("alert")).toHaveTextContent(/couldn't load plans/i);
  });
});
