import { Package, Plus, AlertTriangle, XCircle, DollarSign } from "lucide-react";
import { useAuth } from "../../auth/auth.store";
import PageMeta from "../../components/common/PageMeta";
import { useInventory } from "../../features/inventory/inventory.hooks";
import type { InventoryItemResponse } from "../../features/inventory/inventory.api";

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

function stockStatus(item: InventoryItemResponse): { label: string; color: string } {
  const stock = item.quantity ?? 0;
  const min = item.minQuantity ?? 0;
  if (stock === 0) return { label: "Out of Stock", color: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400" };
  if (stock <= min) return { label: "Low Stock", color: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400" };
  return { label: "In Stock", color: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400" };
}

export default function InventoryPage() {
  const { user } = useAuth();
  const gymId = user?.gymId ?? "";
  const { data: items = [], isLoading } = useInventory(gymId);

  const lowStock = items.filter((i) => (i.quantity ?? 0) > 0 && (i.quantity ?? 0) <= (i.minQuantity ?? 0));
  const outOfStock = items.filter((i) => (i.quantity ?? 0) === 0);
  const totalValue = items.reduce((sum: number, i) => sum + ((i.quantity ?? 0) * (i.costPrice ?? i.unitPrice ?? 0)), 0);

  return (
    <>
      <PageMeta title="Inventory | GymMate" description="Manage your gym inventory" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Inventory</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{items.length} total items</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<Package className="h-6 w-6 text-brand-600 dark:text-brand-400" />} label="Total Items" value={items.length} color="bg-brand-100 dark:bg-brand-500/20" />
          <StatCard icon={<AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />} label="Low Stock" value={lowStock.length} color="bg-warning-100 dark:bg-warning-500/20" />
          <StatCard icon={<XCircle className="h-6 w-6 text-error-600 dark:text-error-400" />} label="Out of Stock" value={outOfStock.length} color="bg-error-100 dark:bg-error-500/20" />
          <StatCard icon={<DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />} label="Total Value" value={`$${totalValue.toLocaleString()}`} color="bg-success-100 dark:bg-success-500/20" />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min Stock</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Value</th>
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-6 py-4"><div className="h-4 rounded bg-gray-100 dark:bg-gray-800 w-24" /></td>
                      ))}
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Package className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No inventory items yet</p>
                    </td>
                  </tr>
                ) : (
                  items.map((item: InventoryItemResponse) => {
                    const status = stockStatus(item);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.category ?? "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.quantity ?? 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.minQuantity ?? "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{(item.costPrice ?? item.unitPrice) !== undefined ? `$${item.costPrice ?? item.unitPrice}` : "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
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


