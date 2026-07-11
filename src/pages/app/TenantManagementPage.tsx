import { useState } from "react";
import { Building2, MoreHorizontal, Filter } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useTenants } from "../../features/admin/admin.hooks";

type StatusFilter = "all" | "active" | "suspended" | "pending";

const statusConfig: Record<string, string> = {
  active: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  suspended: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  pending: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
};

const planConfig: Record<string, string> = {
  starter: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400",
  professional: "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400",
  enterprise: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
};

const filterOptions: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "pending", label: "Pending" },
];

export default function TenantManagementPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { data: tenants = [], isLoading } = useTenants();
  // Menu is rendered position:fixed so the table's scroll container can't
  // clip it; we anchor it to the trigger button's viewport coordinates.
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    if (activeMenu === id) {
      setActiveMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setActiveMenu(id);
  };

  const filtered = tenants
    .filter((t) => statusFilter === "all" || t.status === statusFilter)
    .filter((t) =>
      `${t.name} ${t.ownerName ?? ""}`.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <PageMeta title="Tenant Management | GymMate" description="Super admin tenant management" />

      <div className="flex min-h-[calc(100vh-120px)] flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Tenant Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isLoading ? "Loading..." : `${tenants.length} organizations`}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: tenants.length, color: "text-gray-800 dark:text-white/90" },
            { label: "Active", value: tenants.filter((t) => t.status === "active").length, color: "text-success-600 dark:text-success-400" },
            { label: "Suspended", value: tenants.filter((t) => t.status === "suspended").length, color: "text-error-600 dark:text-error-400" },
            { label: "Pending", value: tenants.filter((t) => t.status === "pending").length, color: "text-warning-600 dark:text-warning-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
            {filterOptions.map((f) => (
              <button key={f.key} onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f.key
                    ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <Filter className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Table — flex-1 so the card takes the remainder of the page */}
        <div className="flex flex-1 flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gyms</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Members</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loading tenants...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <Building2 className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No tenants found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((tenant) => {
                    const statusColor = statusConfig[tenant.status] ?? statusConfig.inactive;
                    const planColor = planConfig[tenant.plan ?? ""] ?? planConfig.starter;
                    return (
                      <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/20">
                              <Building2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{tenant.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{tenant.ownerName ?? "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{tenant.gymCount}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{tenant.memberCount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${planColor}`}>{tenant.plan ?? "starter"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}>{tenant.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={(e) => toggleMenu(e, tenant.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actions menu — fixed position so it overlays instead of being
          clipped by the table's scroll container */}
      {activeMenu && menuPos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
          <div
            className="fixed z-50 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">View Details</button>
            <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">Change Plan</button>
            <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10">Suspend</button>
          </div>
        </>
      )}
    </>
  );
}
