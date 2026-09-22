import { useState } from "react";
import { CheckCircle, Loader2, X } from "lucide-react";
import { Modal } from "../ui/modal";
import {
  useSubscriptionTiers,
  useUpgradeSubscription,
  type SubscriptionResponse,
  type SubscriptionTierResponse,
} from "../../features/billing";
import { formatCurrency } from "../../utils/currency";

/** Subscription tiers carry no currency field; platform plans are priced in USD. */
export const PLAN_CURRENCY = "USD";

/** Tiers strictly more expensive than the current one, cheapest first. */
export function upgradeOptions(
  tiers: SubscriptionTierResponse[],
  current: SubscriptionResponse | undefined
): SubscriptionTierResponse[] {
  const currentPrice = current?.price ?? 0;
  return tiers
    .filter((t) => t.name !== current?.tierName && t.price > currentPrice)
    .sort((a, b) => a.price - b.price);
}

export default function UpgradePlanModal({
  isOpen,
  onClose,
  subscription,
}: {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionResponse | undefined;
}) {
  const { data: tiers = [], isLoading, isError } = useSubscriptionTiers();
  const upgrade = useUpgradeSubscription();
  const options = upgradeOptions(tiers, subscription);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedName = selected && options.some((t) => t.name === selected) ? selected : options[0]?.name ?? null;
  const selectedTier = options.find((t) => t.name === selectedName);

  const confirm = async () => {
    if (!selectedTier) return;
    try {
      await upgrade.mutateAsync(selectedTier.name);
      onClose();
    } catch {
      // the mutation's onError already toasted the API message
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-6 lg:p-8">
      <div className="flex flex-col">
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h5 className="text-xl font-bold text-gray-800 dark:text-white/90">Upgrade Plan</h5>
            <p className="text-xs text-gray-400 mt-0.5">Scale your gym operations with a higher tier</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-6">
          {isLoading ? (
            <p className="text-sm text-gray-500" aria-busy="true">Loading plans…</p>
          ) : isError ? (
            <p role="alert" className="text-sm text-error-600">Couldn't load plans. Please try again.</p>
          ) : options.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">You're already on our highest plan.</p>
          ) : (
            <div role="radiogroup" aria-label="Plans" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {options.map((tier) => {
                const active = tier.name === selectedName;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelected(tier.name)}
                    className={`text-left p-5 rounded-2xl border transition-all ${
                      active
                        ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 ring-1 ring-brand-500"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                    }`}
                  >
                    <h4 className="text-base font-bold text-gray-800 dark:text-white">{tier.displayName}</h4>
                    <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
                      {formatCurrency(tier.price, PLAN_CURRENCY)}
                      <span className="text-xs font-normal text-gray-400">/{tier.billingCycle?.toLowerCase() === "yearly" ? "yr" : "mo"}</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-success-500" />
                        {tier.maxMembers ? `Up to ${tier.maxMembers} members` : "Unlimited members"}
                      </li>
                      {(tier.features ?? []).slice(0, 4).map((f) => (
                        <li key={f} className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-success-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={!selectedTier || upgrade.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upgrade.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {selectedTier ? `Confirm Upgrade to ${selectedTier.displayName}` : "Confirm Upgrade"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
