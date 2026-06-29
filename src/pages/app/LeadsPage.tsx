import { useState } from "react";
import { UserPlus, Plus, Users, Mail, Phone, MoreHorizontal } from "lucide-react";
import { useAuth } from "../../auth/auth.store";
import PageMeta from "../../components/common/PageMeta";
import { useLeads } from "../../features/leads/leads.hooks";

const statusConfig: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  NEW: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  contacted: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  CONTACTED: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
  converted: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  CONVERTED: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400",
  lost: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  LOST: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const { user } = useAuth();
  const gymId = user?.gymId ?? "";
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { data: leads = [], isLoading } = useLeads(gymId);

  const filtered = leads.filter((l: any) =>
    `${l.firstName} ${l.lastName} ${l.email} ${l.phone ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const countByStatus = (status: string) =>
    leads.filter((l: any) => (l.status ?? "").toLowerCase() === status).length;

  return (
    <>
      <PageMeta title="Leads | GymMate" description="Manage your gym leads and prospects" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{leads.length} total leads</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Add Lead
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />} label="Total Leads" value={leads.length} color="bg-brand-100 dark:bg-brand-500/20" />
          <StatCard icon={<UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />} label="New" value={countByStatus("new")} color="bg-blue-100 dark:bg-blue-500/20" />
          <StatCard icon={<Mail className="h-6 w-6 text-warning-600 dark:text-warning-400" />} label="Contacted" value={countByStatus("contacted")} color="bg-warning-100 dark:bg-warning-500/20" />
          <StatCard icon={<Phone className="h-6 w-6 text-success-600 dark:text-success-400" />} label="Converted" value={countByStatus("converted")} color="bg-success-100 dark:bg-success-500/20" />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-gray-100 dark:bg-gray-800 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <UserPlus className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">{search ? "No leads match your search" : "No leads yet"}</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead: any) => {
                    const statusColor = statusConfig[lead.status] ?? "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400";
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{lead.firstName} {lead.lastName}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.email || "â€”"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{lead.phone || "â€”"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 capitalize">{lead.source?.toLowerCase() || "â€”"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}>
                            {lead.status?.toLowerCase() || "new"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "â€”"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button onClick={() => setActiveMenu(activeMenu === lead.id ? null : lead.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {activeMenu === lead.id && (
                              <div className="absolute right-0 top-8 z-10 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
                                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">Edit</button>
                                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-success-600 hover:bg-success-50 dark:hover:bg-success-500/10">Convert</button>
                                <button onClick={() => setActiveMenu(null)} className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10">Delete</button>
                              </div>
                            )}
                          </div>
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
    </>
  );
}

