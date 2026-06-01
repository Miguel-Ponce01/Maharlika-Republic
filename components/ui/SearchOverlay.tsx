"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";
import Link from "next/link";

// Inline product index — mirrors the catalog for fast client-side search
const SEARCH_INDEX = [
  { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", type: "iPhone", specs: "256GB, Desert Titanium", price: 84990 },
  { id: "iphone-16", name: "iPhone 16", type: "iPhone", specs: "128GB, Ultramarine", price: 56990 },
  { id: "iphone-15", name: "iPhone 15", type: "iPhone", specs: "128GB, Black", price: 46990 },
  { id: "ipad-10th-gen", name: "iPad 10th Gen 10.9\" Wi-Fi", type: "iPad", specs: "64GB, Blue", price: 25500 },
  { id: "ipad-air-m2", name: "iPad Air 11\" M2 Wi-Fi", type: "iPad", specs: "128GB, Space Grey", price: 42990 },
  { id: "macbook-air-m3", name: "MacBook Air 13\" M3", type: "Mac", specs: "8GB RAM, 256GB SSD", price: 61500 },
  { id: "macbook-pro-m3-max", name: "MacBook Pro 16\" M3 Max", type: "Mac", specs: "36GB RAM, 1TB SSD", price: 199990 },
  { id: "apple-watch-s10", name: "Apple Watch Series 10 GPS", type: "Apple Watch", specs: "46mm, Jet Black", price: 26500 },
  { id: "earpods-lightning", name: "EarPods with Lightning Connector", type: "AirPods & Earphones", specs: "White", price: 1250 },
  { id: "apple-pencil-usb-c", name: "Apple Pencil (USB-C)", type: "Accessories", specs: "White", price: 5250 },
  { id: "airpods-4", name: "AirPods 4", type: "AirPods & Earphones", specs: "White", price: 8490 },
  { id: "magsafe-charger", name: "MagSafe Charger (1m)", type: "Chargers & Cables", specs: "Silver", price: 2490 },
  { id: "20w-usb-c-adapter", name: "20W USB-C Power Adapter", type: "Chargers & Cables", specs: "White", price: 1190 },
  { id: "silicone-case-16-pro", name: "Silicone Case with MagSafe for iPhone 16 Pro Max", type: "Accessories", specs: "Stone Grey", price: 3290 },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0 }).format(value);

export default function SearchOverlay() {
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // Keyboard shortcuts
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

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  // Client-side filtering
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const popularCategories = [
    { name: "iPhone", href: "/products?type=iPhone" },
    { name: "iPad", href: "/products?type=iPad" },
    { name: "Mac", href: "/products?type=Mac" },
    { name: "Apple Watch", href: "/products?type=Apple Watch" },
    { name: "AirPods", href: "/products?type=AirPods & Earphones" },
    { name: "Accessories", href: "/products?type=Accessories" },
  ];

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-brand-white/80 dark:bg-black/80 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#1A1C1E] rounded-2xl shadow-2xl overflow-hidden border border-brand-border"
          >
            {/* Search Input Row */}
            <div className="flex items-center px-4 py-4 border-b border-brand-border gap-3">
              <Search className="w-5 h-5 text-brand-textMuted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search iPhone, MacBook, AirPods..."
                className="flex-1 text-base bg-transparent border-none focus:outline-none focus:ring-0 text-brand-black dark:text-white placeholder-brand-textMuted"
              />
              {query && (
                <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-brand-border/50 text-brand-textMuted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-lg hover:bg-brand-border/50 text-brand-textMuted transition-colors border border-brand-border/40 text-[10px] font-bold"
              >
                Esc
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[420px] overflow-y-auto">
              {query && results.length === 0 && (
                <div className="py-12 text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-brand-textMuted mx-auto" />
                  <p className="text-sm text-brand-textMuted">No products found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-brand-textMuted/60">Try iPhone, MacBook, AirPods, or Apple Watch</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2">
                  <p className="text-[10px] font-bold text-brand-textMuted uppercase tracking-widest px-3 py-2">
                    Products ({results.length})
                  </p>
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products?type=${encodeURIComponent(product.type)}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-brand-gold/5 group transition-all"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-brand-black dark:text-white group-hover:text-brand-gold transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-brand-textMuted">{product.specs}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-brand-gold">{formatPrice(product.price)}</span>
                        <ArrowRight className="w-4 h-4 text-brand-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/products?type=${encodeURIComponent(results[0]?.type ?? "")}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-center gap-2 mx-3 mt-2 py-2.5 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold rounded-xl text-xs font-bold transition-colors"
                  >
                    View all results <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {!query && (
                <div className="p-4 space-y-4">
                  <p className="text-[10px] font-bold text-brand-textMuted uppercase tracking-widest px-2">
                    Browse Categories
                  </p>
                  <div className="flex flex-wrap gap-2 px-2">
                    {popularCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setSearchOpen(false)}
                        className="px-4 py-2 bg-brand-border/40 hover:bg-brand-gold/10 hover:text-brand-gold border border-brand-border/30 rounded-full text-xs font-semibold text-brand-black dark:text-white transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="bg-brand-border/20 dark:bg-white/5 px-4 py-2.5 text-[10px] text-brand-textMuted flex items-center justify-between border-t border-brand-border/40">
              <span>Press <kbd className="font-mono bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-brand-border text-[9px]">Ctrl K</kbd> to open search</span>
              <span className="font-semibold text-brand-gold">Maharlika Republic</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
