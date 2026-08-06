import { useState } from "react";
import { Building2, Plus, MapPin, Users, MoreHorizontal } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useMyGyms } from "../../features/gyms/gyms.hooks";
import type { GymResponse } from "../../features/gyms/gyms.api";

type GymItem = GymResponse & { memberCount?: number };

const statusConfig: Record<string, string> = {
  ACTIVE: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  active: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  INACTIVE: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  SUSPENDED: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  suspended: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

export default function GymManagementPage() {
  const { data: gyms = [], isLoading } = useMyGyms();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Add Gym
          </button>
        </div>

        {/* Gym Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 animate-pulse space-y-3">
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : gyms.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
            <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">No gyms yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first gym location to get started</p>
            <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors mx-auto">
              <Plus className="h-4 w-4" />
              Add Gym
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {gyms.map((gym: GymItem) => {
              const statusColor = statusConfig[gym.status] ?? "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400";
              const address = gym.address ? `${gym.address.street ?? ""}, ${gym.address.city ?? ""}`.replace(/^,\s*/, "") : null;
              return (
                <div key={gym.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-500/20">
                        <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{gym.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor}`}>
                          {gym.status?.toLowerCase() || "inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <button onClick={() => setActiveMenu(activeMenu === gym.id ? null : gym.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {activeMenu === gym.id && (
                        <div className="absolute right-0 top-8 z-10 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
                          <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">Edit</button>
                          <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">View Details</button>
                          <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10">Deactivate</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    {address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{gym.memberCount ?? 0} members</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button className="flex-1 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-xs font-medium text-white transition-colors">
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

