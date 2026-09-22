import { useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, Plus, Minus, Trash2, Loader2, PackageOpen, Banknote, CreditCard, Package } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../auth/auth.store";
import { useMyGyms } from "../../features/gyms/gyms.hooks";
import type { GymResponse } from "../../features/gyms/gyms.api";
import { useCurrency } from "../../utils/currency";
import { useInventory } from "../../features/inventory/inventory.hooks";
import { useQuickSale } from "../../features/pos/pos.hooks";
import type { PaymentType } from "../../features/pos/pos.api";
import type { InventoryItemResponse } from "../../features/inventory/inventory.api";

type CartItem = { id: string; name: string; price: number; qty: number };

export default function PointOfSalePage() {
  const { user } = useAuth();
  const { data: gyms = [] } = useMyGyms();
  const activeGymId = user?.gymId || gyms[0]?.id || "";
  const [selectedGymId, setSelectedGymId] = useState<string>(activeGymId);
  const effectiveGymId = selectedGymId || activeGymId;

  const navigate = useNavigate();
  const { symbol } = useCurrency();
  const { data: products = [], isLoading } = useInventory(effectiveGymId);
  const quickSale = useQuickSale();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<PaymentType>("CASH");

  const addToCart = (product: InventoryItemResponse) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.unitPrice ?? 0, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleCheckout = () => {
    if (cart.length === 0 || !effectiveGymId) return;
    quickSale.mutate(
      {
        gymId: effectiveGymId,
        items: cart.map((i) => ({
          inventoryItemId: i.id,
          itemName: i.name,
          quantity: i.qty,
          unitPrice: i.price,
        })),
        paymentType,
        amountPaid: total,
      },
      {
        onSuccess: () => setCart([]),
      }
    );
  };

  return (
    <>
      <PageMeta title="Point of Sale | GymMate" description="Sell retail products, drinks, and snacks" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Point of Sale</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Process fast counter sales for drinks, apparel, and supplements
            </p>
          </div>
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
        </div>

        {/* 2-column layout: Products (2/3) + Cart (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Products catalog */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 animate-pulse space-y-3">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-12 text-center">
                <PackageOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">No inventory products found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-5 max-w-sm mx-auto">
                  POS items are pulled directly from your gym inventory. Add items to inventory to start selling.
                </p>
                <button
                  onClick={() => navigate("/inventory")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Add Products to Inventory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={(product.currentStock ?? 0) === 0}
                    className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 text-left hover:border-brand-500/50 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex flex-col justify-between min-h-[110px]"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      {product.category && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{product.category}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        {symbol}{product.unitPrice?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.currentStock ?? 0} in stock
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart & Checkout */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
              <ShoppingCart className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Current Cart</h2>
              {cart.length > 0 && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 font-medium">
                  {cart.reduce((s, i) => s + i.qty, 0)} items
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                Cart is empty. Click items on the left to add them.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 dark:border-gray-800/50">
                    <div className="flex-1 pr-2">
                      <p className="font-medium text-gray-800 dark:text-white/90 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{symbol}{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="h-6 w-6 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="h-6 w-6 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-error-500 p-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType("CASH")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    paymentType === "CASH"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <Banknote className="h-4 w-4" />
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("CARD")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    paymentType === "CARD"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Card / POS
                </button>
              </div>
            </div>

            {/* Total and Checkout */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {symbol}{total.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || quickSale.isPending}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {quickSale.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Complete Sale ({symbol}{total.toLocaleString()})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
