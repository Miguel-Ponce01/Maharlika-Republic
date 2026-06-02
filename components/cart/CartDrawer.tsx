"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";
import { useCartStore } from "@/src/store/useCartStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const setCartOpen = useUIStore((state) => state.setCartOpen);
  const { items, updateQuantity, removeItem } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-brand-card border-l border-brand-border shadow-2xl flex flex-col text-brand-black"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
              <h2 className="text-xl font-heading font-semibold flex items-center gap-2 text-brand-black tracking-tight">
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                Your Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-brand-border rounded-full transition-colors text-brand-textMuted hover:text-brand-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-textMuted space-y-4">
                  <ShoppingBag className="w-16 h-16 text-brand-border" />
                  <p>Your cart is currently empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-neutral-200/50 dark:border-white/[0.04] bg-neutral-50/50 dark:bg-white/[0.01] relative group">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-xl bg-black/5 dark:bg-black/40 border border-brand-border"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-neutral-900 dark:text-white line-clamp-1 tracking-tight">{item.name}</h4>
                        <span className="text-[10px] text-brand-textMuted block mt-0.5">{item.specs}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-neutral-200/50 dark:border-white/[0.04] rounded-lg overflow-hidden bg-brand-card">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-brand-textMuted hover:text-brand-black transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-neutral-900 dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-brand-textMuted hover:text-brand-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
 
                        {/* Price */}
                        <span className="text-sm font-bold text-brand-gold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
 
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-red-500/10 text-brand-textMuted hover:text-red-500 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-200/50 dark:border-white/[0.06] bg-brand-card">
                <div className="flex justify-between items-center text-base mb-4 text-neutral-900 dark:text-white">
                  <span className="font-semibold text-[11px] uppercase tracking-wider text-brand-textMuted">Subtotal</span>
                  <span className="font-bold text-brand-gold text-lg">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Link 
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="w-full py-3 border border-neutral-300 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-white rounded-full font-semibold transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center text-center text-xs uppercase tracking-wider active:scale-[0.98]"
                  >
                    View Full Cart
                  </Link>
                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      if (user) {
                        router.push("/checkout");
                      } else {
                        setAuthModalOpen(true);
                      }
                    }}
                    className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-full font-bold transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center text-center text-xs uppercase tracking-wider active:scale-[0.98] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
