import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

const sampleProducts = [
  { id: "1", name: "Protein Shake", price: 5.99, category: "Nutrition" },
  { id: "2", name: "Day Pass", price: 15.00, category: "Membership" },
  { id: "3", name: "Resistance Band", price: 12.99, category: "Equipment" },
  { id: "4", name: "Gym Gloves", price: 18.50, category: "Accessories" },
  { id: "5", name: "Water Bottle", price: 8.99, category: "Accessories" },
  { id: "6", name: "Monthly Plan", price: 49.99, category: "Membership" },
];

type CartItem = { id: string; name: string; price: number; qty: number };

export default function PointOfSalePage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: (typeof sampleProducts)[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <>
      <PageMeta title="Point of Sale | GymMate" description="Process sales and payments" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Point of Sale</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Process member and walk-in purchases</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sampleProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 text-left hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm transition-all group"
                >
                  <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 mb-3">{product.category}</span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-1">{product.name}</p>
                  <p className="text-lg font-bold text-brand-600 dark:text-brand-400">${product.price.toFixed(2)}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-3.5 w-3.5" />
                    Add to cart
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart Panel */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 flex flex-col h-fit">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Cart</h2>
              {cart.length > 0 && (
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{cart.reduce((s, i) => s + i.qty, 0)} items</span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShoppingCart className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Cart is empty</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click a product to add it</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4 flex-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(item.id, -1)} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-gray-800 dark:text-white/90">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-error-50 dark:hover:bg-error-500/10 text-error-500 ml-1">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Tax (0%)</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">$0.00</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-base font-semibold text-gray-800 dark:text-white/90">Total</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white/90">${total.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                className="w-full py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
