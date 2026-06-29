import { useState } from "react";
import { Dumbbell, Plus, CheckCircle, AlertTriangle, XCircle, Wrench } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useEquipmentByOrganisation, useEquipmentStats } from "../../features/equipment/equipment.hooks";

const statusConfig: Record<string, { label: string; color: string }> = {
  OPERATIONAL: { label: "Operational", color: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400" },
  operational: { label: "Operational", color: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400" },
  NEEDS_MAINTENANCE: { label: "Needs Maintenance", color: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400" },
  needs_maintenance: { label: "Needs Maintenance", color: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400" },
  MAINTENANCE_DUE: { label: "Maintenance Due", color: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400" },
  OUT_OF_ORDER: { label: "Out of Order", color: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400" },
  out_of_order: { label: "Out of Order", color: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400" },
  BROKEN: { label: "Out of Order", color: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400" },
};

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
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

export default function EquipmentPage() {
  const { data: equipment = [], isLoading } = useEquipmentByOrganisation();
  const { data: stats } = useEquipmentStats();
  const [search, setSearch] = useState("");

  const filtered = equipment.filter((e: any) =>
    `${e.name} ${e.brand ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageMeta title="Equipment | GymMate" description="Manage your gym equipment" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Equipment</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{equipment.length} total items</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Add Equipment
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<Dumbbell className="h-6 w-6 text-brand-600 dark:text-brand-400" />} label="Total Equipment" value={stats?.totalEquipment ?? equipment.length} color="bg-brand-100 dark:bg-brand-500/20" />
          <StatCard icon={<CheckCircle className="h-6 w-6 text-success-600 dark:text-success-400" />} label="Operational" value={stats?.operational ?? 0} color="bg-success-100 dark:bg-success-500/20" />
          <StatCard icon={<AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />} label="Needs Maintenance" value={stats?.needsMaintenance ?? 0} color="bg-warning-100 dark:bg-warning-500/20" />
          <StatCard icon={<XCircle className="h-6 w-6 text-error-600 dark:text-error-400" />} label="Out of Order" value={stats?.outOfOrder ?? 0} color="bg-error-100 dark:bg-error-500/20" />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />

        {/* Equipment Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 animate-pulse space-y-3">
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-16 text-center">
            <Dumbbell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">No equipment found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your first piece of equipment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item: any) => {
              const status = statusConfig[item.status] ?? { label: item.status ?? "Unknown", color: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400" };
              return (
                <div key={item.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{item.name}</h3>
                      {item.brand && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.brand}</p>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </div>
                  {item.serialNumber && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-3">SN: {item.serialNumber}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Wrench className="h-3.5 w-3.5" />
                    Last maintenance: {item.lastMaintenanceDate ? new Date(item.lastMaintenanceDate).toLocaleDateString() : "â€”"}
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

