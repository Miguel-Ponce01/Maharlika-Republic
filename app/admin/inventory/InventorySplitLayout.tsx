"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Loader2, 
  ShieldAlert, 
  Save,
  ArrowLeft,
  X
} from "lucide-react";
import { quickUpdateVariant } from "./actions";
import DeleteVariantButton from "./DeleteVariantButton";

interface Variant {
  id: number;
  productId: number;
  skuString: string;
  storageCapacity: string | null;
  colorSpec: string | null;
  stockOnHand: number;
  priceCents: number;
  imageUrl: string | null;
}

interface Product {
  id: number;
  brandName: string;
  modelName: string;
  categoryType: string;
  baseDescription: string;
  variants: Variant[];
}

interface TopSeller {
  name: string;
  sku: string;
  quantitySold: number;
  revenueCents: number;
}

interface InventorySplitLayoutProps {
  initialProducts: Product[];
  topSelling: TopSeller[];
}

export default function InventorySplitLayout({ initialProducts, topSelling }: InventorySplitLayoutProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Quick edit form states
  const [editSku, setEditSku] = useState("");
  const [editStorage, setEditStorage] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editStock, setEditStock] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Helper to load variant into quick editor
  const handleHoverOrSelect = (product: Product, variant: Variant) => {
    setActiveProduct(product);
    setActiveVariant(variant);
    setEditSku(variant.skuString);
    setEditStorage(variant.storageCapacity || "");
    setEditColor(variant.colorSpec || "");
    setEditStock(variant.stockOnHand);
    setEditPrice(variant.priceCents / 100);
    setFeedback(null);
  };

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVariant) return;

    setSaving(true);
    setFeedback(null);

    const res = await quickUpdateVariant(
      activeVariant.id,
      editSku,
      editStorage,
      editColor,
      editStock,
      editPrice
    );

    if (res?.success) {
      // Update local state dynamically
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === activeVariant.productId) {
            return {
              ...p,
              variants: p.variants.map((v) => {
                if (v.id === activeVariant.id) {
                  return {
                    ...v,
                    skuString: editSku,
                    storageCapacity: editStorage || null,
                    colorSpec: editColor || null,
                    stockOnHand: editStock,
                    priceCents: Math.round(editPrice * 100),
                  };
                }
                return v;
              }),
            };
          }
          return p;
        })
      );
      setFeedback({ text: "Variant updated successfully!", type: "success" });
    } else {
      setFeedback({ text: res?.error || "Failed to update variant", type: "error" });
    }

    setSaving(false);
  };

  // Compile stock health metrics
  const flatVariants = products.flatMap(p => p.variants.map(v => ({ ...v, modelName: p.modelName, brandName: p.brandName })));
  const outOfStock = flatVariants.filter(v => v.stockOnHand === 0);
  const lowStock = flatVariants.filter(v => v.stockOnHand > 0 && v.stockOnHand < 5);

  const formatPrice = (cents: number | null | undefined) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0
    }).format((cents || 0) / 100);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1600px] w-full mx-auto admin-theme">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-black">Inventory Controls</h1>
          <p className="text-brand-textMuted text-sm mt-1">Split console view for stock editing, leaderboards, and variant levels.</p>
        </div>
        <Link 
          href="/admin/inventory/new" 
          className="px-5 py-2.5 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/20 flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* 50/50 Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Analytics or Active Hover Quick Editor */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-8">
          
          {activeVariant && activeProduct ? (
            /* ACTIVE QUICK EDITOR VIEW */
            <div className="bg-brand-white border border-brand-border rounded-3xl p-6 md:p-8 shadow-md space-y-6 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={activeVariant.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=100"} 
                    alt={activeProduct.modelName} 
                    className="w-12 h-12 object-cover rounded-xl bg-gray-100 border border-brand-border"
                  />
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-brand-black">{activeProduct.modelName}</h3>
                    <p className="text-xs text-brand-textMuted">{activeProduct.brandName} • {activeProduct.categoryType}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setActiveVariant(null); setActiveProduct(null); }}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-brand-textMuted hover:text-brand-black"
                  title="Close Editor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {feedback && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border text-xs font-semibold ${
                  feedback.type === "success" 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {feedback.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  {feedback.text}
                </div>
              )}

              <form onSubmit={handleQuickSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider ml-1">SKU Code</label>
                    <input 
                      type="text" 
                      value={editSku} 
                      onChange={(e) => setEditSku(e.target.value)}
                      required 
                      className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-brand-black focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider ml-1">Price (PHP)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={editPrice} 
                      onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                      required 
                      className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-brand-black focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider ml-1">Storage</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 256GB" 
                      value={editStorage} 
                      onChange={(e) => setEditStorage(e.target.value)}
                      className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-brand-black focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider ml-1">Color Spec</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Natural Titanium" 
                      value={editColor} 
                      onChange={(e) => setEditColor(e.target.value)}
                      className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-brand-black focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider ml-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={editStock} 
                      onChange={(e) => setEditStock(parseInt(e.target.value, 10) || 0)}
                      required 
                      className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-brand-black focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-brand-gold hover:bg-yellow-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-gold/15 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveVariant(null); setActiveProduct(null); }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-brand-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Back to Stats
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* DEFAULT ANALYTICS VIEW */
            <div className="space-y-6">
              
              {/* Out of Stock Warning */}
              {outOfStock.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <h3 className="font-heading font-black text-red-800 text-sm flex items-center gap-2 uppercase tracking-wider">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    Out of Stock Alerts ({outOfStock.length})
                  </h3>
                  <div className="max-h-36 overflow-y-auto space-y-2 divide-y divide-red-100 pr-2 scrollbar-none">
                    {outOfStock.map(v => (
                      <div key={v.id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-red-900">{v.modelName}</p>
                          <p className="text-[10px] text-red-700">{[v.storageCapacity, v.colorSpec].filter(Boolean).join(", ") || "Standard"}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-red-100 text-red-850 font-bold uppercase text-[9px] rounded-full">
                          Sold Out
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Low Stock Warning */}
              {lowStock.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <h3 className="font-heading font-black text-amber-800 text-sm flex items-center gap-2 uppercase tracking-wider">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Lowest Stock Warnings ({lowStock.length})
                  </h3>
                  <div className="max-h-36 overflow-y-auto space-y-2 divide-y divide-amber-100 pr-2 scrollbar-none">
                    {lowStock.map(v => (
                      <div key={v.id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-amber-900">{v.modelName}</p>
                          <p className="text-[10px] text-amber-700">{[v.storageCapacity, v.colorSpec].filter(Boolean).join(", ") || "Standard"}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-850 font-bold text-[9px] rounded-full">
                          {v.stockOnHand} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Selling Leaderboard */}
              <div className="bg-brand-white border border-brand-border rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-heading font-extrabold text-base text-brand-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-gold" />
                  Top Items Sold
                </h3>
                <div className="divide-y divide-brand-border">
                  {topSelling.length === 0 ? (
                    <p className="text-xs text-brand-textMuted py-4">No item sales recorded yet.</p>
                  ) : (
                    topSelling.map((item, idx) => (
                      <div key={item.sku} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-gray-55 border border-brand-border flex items-center justify-center text-[11px] font-black text-brand-gold">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-brand-black">{item.name}</p>
                            <p className="text-[9px] text-brand-textMuted uppercase font-mono">{item.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-brand-black">{item.quantitySold} sold</p>
                          <p className="text-[10px] text-brand-textMuted">{formatPrice(item.revenueCents)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Inventory Table with Hover Active triggers */}
        <div className="lg:col-span-6 bg-brand-white border border-brand-border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-brand-border flex justify-between items-center bg-gray-50/50">
            <h3 className="font-heading font-extrabold text-sm text-brand-black uppercase tracking-wider">Product Catalog</h3>
            <span className="text-[10px] text-brand-textMuted font-bold uppercase tracking-wider bg-white border border-brand-border px-2.5 py-1 rounded-full">
              Hover row to Edit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-brand-border text-brand-textMuted font-bold uppercase">
                <tr>
                  <th className="px-5 py-3.5 tracking-wider">Product / Variant</th>
                  <th className="px-5 py-3.5 tracking-wider">SKU Code</th>
                  <th className="px-5 py-3.5 tracking-wider text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {products.flatMap((product) => 
                  product.variants.map((variant) => {
                    const isHoverActive = activeVariant?.id === variant.id;
                    const specs = [variant.storageCapacity, variant.colorSpec].filter(Boolean).join(", ");
                    
                    return (
                      <tr 
                        key={variant.id} 
                        onMouseEnter={() => handleHoverOrSelect(product, variant)}
                        onClick={() => handleHoverOrSelect(product, variant)}
                        className={`hover:bg-brand-gold/5 transition-colors cursor-pointer group ${
                          isHoverActive ? "bg-brand-gold/5 border-l-4 border-l-brand-gold" : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={variant.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=100"} 
                              alt={product.modelName} 
                              className="w-10 h-10 object-cover rounded-lg bg-gray-100 border border-brand-border group-hover:scale-105 transition-transform"
                            />
                            <div>
                              <div className="font-bold text-brand-black text-sm">{product.modelName}</div>
                              <div className="text-[10px] text-brand-textMuted flex items-center gap-1.5 mt-0.5">
                                <span className="font-bold text-brand-gold">{variant.stockOnHand} stock</span>
                                <span>•</span>
                                <span>{specs || "Standard Spec"}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-brand-textMuted font-mono">
                          {variant.skuString}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="font-black text-brand-black text-sm">
                              {formatPrice(variant.priceCents)}
                            </span>
                            <Link 
                              href={`/admin/inventory/${variant.id}/edit`} 
                              className="p-1.5 text-brand-textMuted hover:bg-brand-gold hover:text-white rounded-lg transition-colors border border-brand-border bg-white"
                              title="Detailed Edit"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <div onClick={(e) => e.stopPropagation()}>
                              <DeleteVariantButton variantId={variant.id} />
                            </div>
                          </div>
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
    </div>
  );
}
