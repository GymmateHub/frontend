import { getErrorMessage } from "../../api/axios";
import { useState } from "react";
import { CreditCard, Plus, Star, Trash2, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../auth/auth.store";
import { useMyGyms } from "../../features/gyms/gyms.hooks";
import type { GymResponse } from "../../features/gyms/gyms.api";
import { useCurrency } from "../../utils/currency";
import {
  usePlans,
  useCreatePlan,
  useSetPlanFeatured,
  useDeactivatePlan,
} from "../../features/memberships";

const billingCycles = ["monthly", "quarterly", "yearly", "lifetime"];

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  billingCycle: "monthly",
  durationMonths: "",
  classCredits: "",
  guestPasses: "",
  trainerSessions: "",
};

export default function MembershipPlansPage() {
  const { user } = useAuth();
  const { data: gyms = [] } = useMyGyms();
  const activeGymId = user?.gymId || gyms[0]?.id || "";
  const [selectedGymId, setSelectedGymId] = useState<string>(activeGymId);
  const effectiveGymId = selectedGymId || activeGymId;

  const { symbol } = useCurrency();
  const { isOpen, openModal, closeModal } = useModal();

  const { data: plans = [], isLoading } = usePlans(effectiveGymId);
  const createPlan = useCreatePlan();
  const setFeatured = useSetPlanFeatured();
  const deactivatePlan = useDeactivatePlan();

  const [form, setForm] = useState(emptyForm);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreate = async () => {
    setErrorMsg(null);
    const price = parseFloat(form.price);
    if (!form.name.trim()) {
      setErrorMsg("Plan name is required.");
      return;
    }
    if (isNaN(price) || price < 0) {
      setErrorMsg("Please enter a valid price (0 or greater).");
      return;
    }
    if (!effectiveGymId) {
      setErrorMsg("No active gym location selected. Please ensure you have a gym created.");
      return;
    }

    try {
      await createPlan.mutateAsync({
        gymId: effectiveGymId,
        data: {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          price,
          billingCycle: form.billingCycle,
          durationMonths: form.durationMonths ? parseInt(form.durationMonths) : undefined,
          classCredits: form.classCredits ? parseInt(form.classCredits) : undefined,
          guestPasses: form.guestPasses ? parseInt(form.guestPasses) : undefined,
          trainerSessions: form.trainerSessions ? parseInt(form.trainerSessions) : undefined,
        },
      });
      setForm(emptyForm);
      closeModal();
    } catch (err) {
      setErrorMsg(getErrorMessage(err) || "Failed to create plan");
    }
  };

  return (
    <>
      <PageMeta title="Membership Plans | GymMate" description="Manage gym membership tiers and pricing" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Membership Plans</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and manage subscription packages for your members
            </p>
          </div>
          <div className="flex items-center gap-3">
            {gyms.length > 1 && (
              <select
                value={effectiveGymId}
                onChange={(e) => setSelectedGymId(e.target.value)}
                className="h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-800 dark:text-white focus:outline-none"
              >
                {(gyms as GymResponse[]).map((g: GymResponse) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => {
                setErrorMsg(null);
                setForm(emptyForm);
                openModal();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Plan
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 animate-pulse space-y-4">
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
            <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">No membership plans yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create your first plan to start signing up members</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border bg-white dark:bg-white/[0.03] p-6 flex flex-col gap-4 relative transition-shadow hover:shadow-sm ${
                  plan.featured
                    ? "border-brand-500 ring-1 ring-brand-500/20"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{plan.name}</h3>
                    <p className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-800 dark:text-white/90">
                        {symbol}{plan.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        /{plan.billingCycle}
                      </span>
                    </p>
                  </div>
                  {plan.featured && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
                      Featured
                    </span>
                  )}
                </div>

                {plan.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{plan.description}</p>
                )}

                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
                    {plan.classCredits == null ? "Unlimited classes" : `${plan.classCredits} class credits`}
                  </li>
                  {(plan.guestPasses ?? 0) > 0 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
                      {plan.guestPasses} guest passes
                    </li>
                  )}
                  {(plan.trainerSessions ?? 0) > 0 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
                      {plan.trainerSessions} trainer sessions
                    </li>
                  )}
                  {plan.durationMonths != null && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
                      {plan.durationMonths} month commitment
                    </li>
                  )}
                </ul>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  <button
                    onClick={() => setFeatured.mutate({ id: plan.id, featured: !plan.featured })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Star className={`h-4 w-4 ${plan.featured ? "fill-warning-400 text-warning-400" : ""}`} />
                    {plan.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => deactivatePlan.mutate(plan.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-error-200 dark:border-error-800 text-sm font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                New Membership Plan
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Members will see this plan in the gym and in the mobile app.
              </p>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-error-50 dark:bg-error-500/10 text-error-600 dark:text-error-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Plan Name *</label>
              <input type="text" value={form.name} placeholder="e.g. Gold Monthly"
                onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
              <input type="text" value={form.description} placeholder="Plan benefits and features"
                onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Price ({symbol}) *</label>
              <input type="number" min="0" step="0.01" value={form.price} placeholder="49.99"
                onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Billing Cycle *</label>
              <select value={form.billingCycle}
                onChange={(e) => setForm({ ...form, billingCycle: e.target.value })} className={inputClass}>
                {billingCycles.map((cycle) => (
                  <option key={cycle} value={cycle}>{cycle}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Duration (months)</label>
              <input type="number" min="1" value={form.durationMonths} placeholder="Leave empty for none"
                onChange={(e) => setForm({ ...form, durationMonths: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Class Credits</label>
              <input type="number" min="0" value={form.classCredits} placeholder="Empty = unlimited"
                onChange={(e) => setForm({ ...form, classCredits: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Guest Passes</label>
              <input type="number" min="0" value={form.guestPasses} placeholder="0"
                onChange={(e) => setForm({ ...form, guestPasses: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Trainer Sessions</label>
              <input type="number" min="0" value={form.trainerSessions} placeholder="0"
                onChange={(e) => setForm({ ...form, trainerSessions: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={createPlan.isPending || !form.name.trim() || !form.price}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto shadow-sm"
            >
              {createPlan.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Plan
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
