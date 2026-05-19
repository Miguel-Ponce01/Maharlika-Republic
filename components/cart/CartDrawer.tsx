"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";

export default function CartDrawer() {
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <p>Your cart is currently empty.</p>
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between text-lg font-medium mb-4">
                <span>Subtotal</span>
                <span>₱ 0.00</span>
              </div>
              <button className="w-full py-4 bg-brand-black text-white font-medium rounded-xl hover:bg-brand-gold transition-colors">
                Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
