"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";

export default function SearchOverlay() {
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-brand-white/80 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="flex items-center px-4 py-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products, brands, models..."
                className="flex-1 px-4 py-2 text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-brand-black placeholder-gray-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 min-h-[300px]">
              <div className="text-sm text-gray-500 text-center mt-10">
                Start typing to search Meilisearch edge index...
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
              <span>Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border">Esc</kbd> to close</span>
              <span>Search by Meilisearch</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
