"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Check, ShieldCheck, HelpCircle, ArrowRight, Truck } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { useUIStore } from "@/src/store/useUIStore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  brand: string;
  compatibility: string;
  specs: string;
  monthlyInstallment?: number;
  variantId: number;
  maxStock: number;
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Map product types to genuine color variations
const getColorPalette = (productType: string, productName: string) => {
  const lowerName = productName.toLowerCase();
  if (productType === "iPhone") {
    if (lowerName.includes("16 pro") || lowerName.includes("16-pro")) {
      return [
        { name: "Desert Titanium", hex: "#c2b2a2" },
        { name: "Natural Titanium", hex: "#aba7a4" },
        { name: "White Titanium", hex: "#f2f1ed" },
        { name: "Black Titanium", hex: "#3b3c3e" }
      ];
    } else if (lowerName.includes("16")) {
      return [
        { name: "Ultramarine", hex: "#4b6fa6" },
        { name: "Teal", hex: "#2e8b83" },
        { name: "Pink", hex: "#f2b5be" },
        { name: "White", hex: "#f5f5f7" },
        { name: "Black", hex: "#1c1d21" }
      ];
    } else if (lowerName.includes("15 pro")) {
      return [
        { name: "Natural Titanium", hex: "#aba7a4" },
        { name: "Blue Titanium", hex: "#2f4452" },
        { name: "White Titanium", hex: "#f2f1ed" },
        { name: "Black Titanium", hex: "#3b3c3e" }
      ];
    } else if (lowerName.includes("15")) {
      return [
        { name: "Black", hex: "#1c1d21" },
        { name: "Blue", hex: "#d3e3eb" },
        { name: "Green", hex: "#d2ebd9" },
        { name: "Yellow", hex: "#faebd2" },
        { name: "Pink", hex: "#fad2d9" }
      ];
    } else if (lowerName.includes("14")) {
      return [
        { name: "Midnight", hex: "#1e2124" },
        { name: "Purple", hex: "#e5d3eb" },
        { name: "Starlight", hex: "#f0ece1" },
        { name: "Red", hex: "#a82229" },
        { name: "Blue", hex: "#d3e3eb" }
      ];
    }
    return [
      { name: "Space Grey", hex: "#5d5e62" },
      { name: "Silver", hex: "#e3e4e6" }
    ];
  } else if (productType === "Mac") {
    return [
      { name: "Space Black", hex: "#1f2022" },
      { name: "Space Grey", hex: "#5d5e62" },
      { name: "Silver", hex: "#e3e4e6" },
      { name: "Midnight", hex: "#1e2124" }
    ];
  } else if (productType === "iPad") {
    return [
      { name: "Space Grey", hex: "#5d5e62" },
      { name: "Silver", hex: "#e3e4e6" },
      { name: "Blue", hex: "#d3e3eb" },
      { name: "Pink", hex: "#fad2d9" }
    ];
  } else if (productType === "Apple Watch") {
    return [
      { name: "Jet Black", hex: "#1c1d21" },
      { name: "Rose Gold", hex: "#fad2d9" },
      { name: "Silver", hex: "#e3e4e6" }
    ];
  }
  return [
    { name: "Default Black", hex: "#1c1d21" },
    { name: "Default White", hex: "#f5f5f7" }
  ];
};

export default function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const colors = useMemo(() => {
    return product ? getColorPalette(product.type, product.name) : [];
  }, [product?.id, product?.name, product?.type]);
  
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    if (colors.length > 0) {
      setSelectedColor(colors[0].name);
    }
  }, [colors]);

  if (!product) return null;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddToCart = () => {
    if (product.maxStock <= 0) return;
    const specsString = `${selectedColor}, ${product.specs.includes(",") ? product.specs.split(",")[0] : product.specs}`;
    addItem({
      id: `${product.id}-${selectedColor.toLowerCase().replace(/\s+/g, "-")}`,
      name: `${product.name} (${selectedColor})`,
      price: product.price,
      image: product.image,
      quantity: 1,
      specs: specsString,
      variantId: product.variantId,
      maxStock: product.maxStock
    });
    setCartOpen(true);
    onClose();
  };

  // Financing computed plans
  const computedMonthlyPaluwagan = Math.ceil(product.price / 10);
  const computedMonthlyLayaway = Math.ceil(product.price / 6);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-4xl bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-brand-black max-h-[90vh] md:max-h-[85vh]"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-brand-border/40 rounded-full transition-colors text-brand-textMuted hover:text-brand-black"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Product Image Spotlight */}
              <div className="w-full md:w-1/2 bg-neutral-50/50 dark:bg-black/30 p-8 flex items-center justify-center relative overflow-hidden group border-b md:border-b-0 md:border-r border-neutral-200/50 dark:border-white/[0.04]">
                {/* Spotlight Ambient Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none z-0" />
                
                <div className="absolute top-6 left-6 flex gap-2 z-10">
                  <span className="text-[10px] bg-brand-gold/10 text-brand-gold font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-brand-gold/20">
                    {product.type}
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> Genuine
                  </span>
                </div>

                <div className="w-full h-[280px] md:h-[400px] flex items-center justify-center p-4 relative z-10">
                  <motion.img
                    layoutId={`product-image-${product.id}`}
                    src={product.image}
                    alt={product.name}
                    className="object-contain max-w-full max-h-full mix-blend-darken dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Right Column: Detailed Options & Specifications */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Brand & Title */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.brand}</p>
                    <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-neutral-900 dark:text-white tracking-tight leading-none">
                      {product.name}
                    </h2>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="p-5 bg-neutral-50/40 dark:bg-white/[0.02] rounded-2xl border border-neutral-200/50 dark:border-white/[0.04]">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold">Cash Price</span>
                      <span className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-[-0.02em]">{formatPrice(product.price)}</span>
                    </div>
                  </div>

                  {/* Specs summary list */}
                  <div className="space-y-1.5 text-xs text-brand-black/90">
                    <p className="font-bold uppercase tracking-wider text-[10px] text-brand-textMuted">Features & Parameters</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 border-t border-neutral-200/50 dark:border-white/[0.04]">
                      <div>
                        <span className="text-[10px] text-brand-textMuted block uppercase">Hardware configuration</span>
                        <span className="font-semibold text-neutral-900 dark:text-white truncate block">{product.specs}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-textMuted block uppercase">Compatibility</span>
                        <span className="font-semibold text-neutral-900 dark:text-white truncate block">{product.compatibility}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Color selector */}
                  {colors.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold uppercase tracking-wider text-[10px] text-brand-textMuted">Finish / Color</span>
                        <span className="font-semibold text-neutral-900 dark:text-white">{selectedColor}</span>
                      </div>
                      <div className="flex gap-2.5">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] relative ${
                              selectedColor === color.name
                                ? "border-brand-gold scale-105 shadow-sm ring-2 ring-brand-gold/20"
                                : "border-neutral-300 dark:border-white/10 hover:scale-[1.05]"
                            }`}
                            title={color.name}
                          >
                            <span 
                              className="w-7 h-7 rounded-full block flex items-center justify-center" 
                              style={{ backgroundColor: color.hex }}
                            >
                              {selectedColor === color.name && (
                                <Check className={`w-3.5 h-3.5 ${color.hex === "#f2f1ed" || color.hex === "#ffffff" || color.hex === "#f5f5f7" ? "text-black" : "text-white"}`} />
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Immersive Local Financing Schemes */}
                  <div className="space-y-3 pt-3">
                    <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider block">Davao Local Financing Estimates</span>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="p-4 bg-neutral-50/50 dark:bg-white/[0.02] border border-neutral-200/50 dark:border-white/[0.04] rounded-2xl space-y-1.5 transition-all duration-300 hover:border-brand-gold/30"
                      >
                        <span className="text-[9px] text-brand-gold font-semibold uppercase tracking-[0.05em] block">Paluwagan (10 Mo.)</span>
                        <span className="font-heading font-extrabold text-neutral-900 dark:text-white text-base md:text-lg leading-tight block">{formatPrice(computedMonthlyPaluwagan)}<span className="text-xs font-normal text-gray-400">/mo</span></span>
                        <span className="text-[10px] text-neutral-400 dark:text-gray-500 font-medium block leading-none">No credit card required</span>
                      </motion.div>
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="p-4 bg-neutral-50/50 dark:bg-white/[0.02] border border-neutral-200/50 dark:border-white/[0.04] rounded-2xl space-y-1.5 transition-all duration-300 hover:border-brand-gold/30"
                      >
                        <span className="text-[9px] text-brand-gold font-semibold uppercase tracking-[0.05em] block">Lay-Away (6 Mo.)</span>
                        <span className="font-heading font-extrabold text-neutral-900 dark:text-white text-base md:text-lg leading-tight block">{formatPrice(computedMonthlyLayaway)}<span className="text-xs font-normal text-gray-400">/mo</span></span>
                        <span className="text-[10px] text-neutral-400 dark:text-gray-500 font-medium block leading-none">0% fixed interest rate</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Buy Button CTA */}
                <div className="pt-6 border-t border-neutral-200/50 dark:border-white/[0.06] flex flex-col sm:flex-row gap-3">
                  {product.maxStock <= 0 ? (
                    <button
                      disabled
                      className="flex-1 py-3.5 bg-gray-400 text-white font-bold rounded-full cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                      <span>Out of Stock</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-full font-semibold transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                  <a
                    href="https://www.facebook.com/messages/t/marexxrepublicdavao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 border border-neutral-300 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-white rounded-full font-semibold transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center text-center uppercase tracking-wider text-[10px] gap-1 active:scale-[0.98]"
                  >
                    <span>Inquire via Messenger</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
