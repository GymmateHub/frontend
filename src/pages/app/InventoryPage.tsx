import { getErrorMessage } from "../../api/axios";
import { useState } from "react";
import { Package, Plus, AlertTriangle, XCircle, DollarSign, X, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/auth.store";
import { useMyGyms } from "../../features/gyms/gyms.hooks";
import { useCurrency } from "../../utils/currency";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useInventory, useCreateInventoryItem } from "../../features/inventory/inventory.hooks";
import { INVENTORY_CATEGORIES, inventoryCategoryLabel, type InventoryItemResponse } from "../../features/inventory/inventory.api";
import type { GymResponse } from "../../features/gyms/gyms.api";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

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
  const stock = item.currentStock ?? 0;
  const min = item.minimumStock ?? 0;
  if (stock === 0) return { label: "Out of Stock", color: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-400" };
  if (stock <= min) return { label: "Low Stock", color: "bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400" };
  return { label: "In Stock", color: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400" };
}

export default function InventoryPage() {
  const { user } = useAuth();
  const { data: gyms = [] } = useMyGyms();
  const activeGymId = user?.gymId || gyms[0]?.id || "";
  const [selectedGymId, setSelectedGymId] = useState<string>(activeGymId);
  const effectiveGymId = selectedGymId || activeGymId;

  const { symbol, format } = useCurrency();
  const { data: items = [], isLoading } = useInventory(effectiveGymId);
  const createItem = useCreateInventoryItem();
  const { isOpen, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    name: "",
    category: "SUPPLEMENTS",
    quantity: "10",
    minQuantity: "5",
    unitPrice: "",
    costPrice: "",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const lowStock = items.filter((i) => (i.currentStock ?? 0) > 0 && (i.currentStock ?? 0) <= (i.minimumStock ?? 0));
  const outOfStock = items.filter((i) => (i.currentStock ?? 0) === 0);
  const totalValue = items.reduce((sum: number, i) => sum + ((i.currentStock ?? 0) * (i.unitCost ?? i.unitPrice ?? 0)), 0);

  const handleCreate = async () => {
    setErrorMsg(null);
    if (!form.name.trim()) {
      setErrorMsg("Item name is required.");
      return;
    }
    const unitPrice = parseFloat(form.unitPrice);
    if (isNaN(unitPrice) || unitPrice < 0) {
      setErrorMsg("Please enter a valid retail unit price.");
      return;
    }
    if (!effectiveGymId) {
      setErrorMsg("Please select an active gym location.");
      return;
    }

    try {
      await createItem.mutateAsync({
        gymId: effectiveGymId,
        name: form.name.trim(),
        category: form.category,
        initialStock: parseInt(form.quantity) || 0,
        minimumStock: parseInt(form.minQuantity) || 0,
        unitPrice,
        unitCost: form.costPrice ? parseFloat(form.costPrice) : undefined,
      });
      setForm({ name: "", category: "SUPPLEMENTS", quantity: "10", minQuantity: "5", unitPrice: "", costPrice: "" });
      closeModal();
    } catch (err) {
      setErrorMsg(getErrorMessage(err) || "Failed to add inventory item");
    }
  };

  return (
    <>
      <PageMeta title="Inventory | GymMate" description="Manage your gym inventory and products" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Inventory</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{items.length} total products</p>
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
                openModal();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<Package className="h-6 w-6 text-brand-600 dark:text-brand-400" />} label="Total Items" value={items.length} color="bg-brand-100 dark:bg-brand-500/20" />
          <StatCard icon={<AlertTriangle className="h-6 w-6 text-warning-600 dark:text-warning-400" />} label="Low Stock" value={lowStock.length} color="bg-warning-100 dark:bg-warning-500/20" />
          <StatCard icon={<XCircle className="h-6 w-6 text-error-600 dark:text-error-400" />} label="Out of Stock" value={outOfStock.length} color="bg-error-100 dark:bg-error-500/20" />
          <StatCard icon={<DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />} label="Total Value" value={format(totalValue)} color="bg-success-100 dark:bg-success-500/20" />
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
                  <th className="px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Price</th>
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
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{inventoryCategoryLabel(item.category)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-semibold">{item.currentStock ?? 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.minimumStock ?? "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-white font-medium">
                          {format(item.unitPrice)}
                        </td>
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

      {/* Add Item Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[550px] p-6 lg:p-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                Add Inventory Product
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Register items for stock management and point of sale.
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

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Item Name *</label>
              <input
                type="text"
                value={form.name}
                placeholder="e.g. Whey Protein Isolate, Water Bottle"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {INVENTORY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Initial Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Low Stock Alert Level</label>
                <input
                  type="number"
                  min="0"
                  value={form.minQuantity}
                  onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Retail Price ({symbol}) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                  value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cost Price ({symbol})</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="15.00"
                  value={form.costPrice}
                  onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                  className={inputClass}
                />
              </div>
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
              disabled={createItem.isPending || !form.name.trim() || !form.unitPrice}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto shadow-sm"
            >
              {createItem.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Product
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
