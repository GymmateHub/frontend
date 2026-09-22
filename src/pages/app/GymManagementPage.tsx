import { useState } from "react";
import { Building2, Plus, MapPin, X, Loader2, Phone, Mail } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useMyGyms, useCreateGym, useActivateGym, useDeactivateGym } from "../../features/gyms/gyms.hooks";
import type { GymResponse, GymCreateRequest } from "../../features/gyms/gyms.api";

type GymItem = GymResponse & { memberCount?: number };

const statusConfig: Record<string, string> = {
  ACTIVE: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  active: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  INACTIVE: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  SUSPENDED: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  suspended: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

export default function GymManagementPage() {
  const { data: gyms = [], isLoading } = useMyGyms();
  const createGym = useCreateGym();
  const activateGym = useActivateGym();
  const deactivateGym = useDeactivateGym();
  const { isOpen, openModal, closeModal } = useModal();

    const [form, setForm] = useState<GymCreateRequest>({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;

    try {
      // New gyms inherit the organisation's currency/timezone rather than the server's USD default.
      const reference = gyms[0];
      await createGym.mutateAsync({
        ...form,
        currency: reference?.currency ?? undefined,
        timezone: reference?.timezone ?? undefined,
      });
      setForm({
        name: "",
        description: "",
        email: "",
        phone: "",
        website: "",
        address: { street: "", city: "", state: "", postalCode: "", country: "Nigeria" },
      });
      closeModal();
    } catch {
      // handled in hook
    }
  };

  return (
    <>
      <PageMeta title="Gym Management | GymMate" description="Manage your gym locations" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Gym Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{gyms.length} gym location{gyms.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Gym
          </button>
        </div>

        {/* Gym Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 animate-pulse space-y-3">
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : gyms.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
            <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">No gym locations yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first gym to start operations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {gyms.map((gym: GymItem) => {
              const status = statusConfig[gym.status] ?? statusConfig.active;
              return (
                <div key={gym.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 hover:shadow-sm transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-lg">
                          {gym.name?.[0] ?? "G"}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{gym.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${status}`}>
                            {gym.status?.toLowerCase() || "active"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {gym.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{gym.description}</p>
                    )}

                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                      {gym.address?.city && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {gym.address.street ? `${gym.address.street}, ` : ""}{gym.address.city}, {gym.address.state}
                        </p>
                      )}
                      {gym.contactEmail && (
                        <p className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          {gym.contactEmail}
                        </p>
                      )}
                      {gym.contactPhone && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {gym.contactPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Currency: {gym.currency || "NGN"}</span>
                    <button
                      onClick={() => gym.active ? deactivateGym.mutate(gym.id) : activateGym.mutate(gym.id)}
                      className={`font-medium ${gym.active ? "text-warning-600 hover:text-warning-700" : "text-success-600 hover:text-success-700"}`}
                    >
                      {gym.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Gym Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-8">
        <form onSubmit={handleCreate} className="flex flex-col">
          <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h5 className="text-xl font-bold text-gray-800 dark:text-white/90">Add New Gym Location</h5>
              <p className="text-xs text-gray-400 mt-0.5">Register a new branch for your organization</p>
            </div>
            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 py-4 max-h-[420px] overflow-y-auto pr-1">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">Gym Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. GymMate Downtown Branch"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">Description</label>
              <input
                type="text"
                placeholder="Branch facilities and features"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="branch@gymmate.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 000 0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">Street Address</label>
              <input
                type="text"
                placeholder="123 Fitness Way"
                value={form.address.street}
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">City</label>
                <input
                  type="text"
                  placeholder="Lagos"
                  value={form.address.city}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">State</label>
                <input
                  type="text"
                  placeholder="Lagos"
                  value={form.address.state}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-400">Country</label>
                <input
                  type="text"
                  placeholder="Nigeria"
                  value={form.address.country}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createGym.isPending}
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {createGym.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Gym
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
