"use client";

import { useState } from "react";
import { updateProductLandingPageSettings } from "../inventory/actions";
import { Sparkles, Layout, Check, AlertCircle, Loader2 } from "lucide-react";

interface Variant {
  id: number;
  imageUrl: string | null;
  priceCents: number;
}

interface Product {
  id: number;
  brandName: string;
  modelName: string;
  categoryType: string;
  systemMetadata: any;
  variants: Variant[];
}

interface LandingPageControlTableProps {
  initialProducts: Product[];
}

export default function LandingPageControlTable({ initialProducts }: LandingPageControlTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [pendingToggle, setPendingToggle] = useState<{ productId: number; field: "showOnLandingPage" | "isBestFromBox"; currentValue: boolean } | null>(null);

  const triggerToggle = (productId: number, field: "showOnLandingPage" | "isBestFromBox", currentValue: boolean) => {
    setPendingToggle({ productId, field, currentValue });
  };

  const confirmToggle = async () => {
    if (!pendingToggle) return;
    const { productId, field, currentValue } = pendingToggle;
    setPendingToggle(null);
    
    setUpdatingId(productId);
    setMessage(null);

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const metadata = (product.systemMetadata as Record<string, any>) || {};
    
    const showOnLandingPage = field === "showOnLandingPage" ? !currentValue : !!metadata.showOnLandingPage;
    const isBestFromBox = field === "isBestFromBox" ? !currentValue : !!metadata.isBestFromBox;

    const res = await updateProductLandingPageSettings(productId, showOnLandingPage, isBestFromBox);

    if (res?.success) {
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(p => {
          if (p.id === productId) {
            return {
              ...p,
              systemMetadata: {
                ...(p.systemMetadata || {}),
                showOnLandingPage,
                isBestFromBox,
              },
            };
          }
          return p;
        })
      );
      setMessage({ text: "Landing page settings updated successfully!", type: "success" });
    } else {
      setMessage({ text: res?.error || "Failed to update settings.", type: "error" });
    }

    setUpdatingId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium transition-all ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border-green-200" 
            : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {message.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="bg-brand-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-brand-border text-brand-textMuted">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Featured Grid</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Best from the Box</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-brand-textMuted">
                    No products found. Add products in the inventory section.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const metadata = (product.systemMetadata as Record<string, any>) || {};
                  const isFeatured = !!metadata.showOnLandingPage;
                  const isBest = !!metadata.isBestFromBox;
                  const primaryVariant = product.variants?.[0];

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={primaryVariant?.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=100"} 
                            alt={product.modelName} 
                            className="w-12 h-12 object-cover rounded-xl bg-gray-100 border border-brand-border"
                          />
                          <div>
                            <div className="font-bold text-brand-black text-base">{product.modelName}</div>
                            <div className="text-xs text-brand-textMuted flex items-center gap-1.5 mt-0.5">
                              <span>{product.brandName}</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                              <span className="capitalize">{product.categoryType}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => triggerToggle(product.id, "showOnLandingPage", isFeatured)}
                          disabled={updatingId === product.id}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                            isFeatured 
                              ? "bg-brand-gold/10 border-brand-gold/30 text-brand-gold shadow-sm shadow-brand-gold/5" 
                              : "bg-white border-brand-border text-brand-textMuted hover:border-gray-300"
                          }`}
                        >
                          <Layout className="w-3.5 h-3.5" />
                          {isFeatured ? "Featured" : "Disabled"}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => triggerToggle(product.id, "isBestFromBox", isBest)}
                          disabled={updatingId === product.id}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                            isBest 
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 shadow-sm" 
                              : "bg-white border-brand-border text-brand-textMuted hover:border-gray-300"
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {isBest ? "Top Pick" : "Standard"}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {updatingId === product.id ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold uppercase tracking-wider">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Saving...
                          </span>
                        ) : (
                          <span className="text-xs text-brand-textMuted font-medium">
                            {isFeatured || isBest ? "Active on Landing Page" : "Not displayed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {pendingToggle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-brand-white border border-brand-border rounded-[2rem] p-8 max-w-md w-full mx-4 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h4 className="font-heading font-black text-xl text-brand-black tracking-tight">Are you sure with these changes?</h4>
              <p className="text-sm text-brand-textMuted leading-relaxed">
                Confirming this action will update the visibility of <strong className="text-brand-black">"{products.find(p => p.id === pendingToggle.productId)?.modelName}"</strong> on the storefront landing page.
              </p>
            </div>
            
            <div className="flex gap-4 pt-2">
              <button
                onClick={confirmToggle}
                className="flex-1 py-3 bg-brand-gold hover:bg-yellow-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-gold/15"
              >
                Agree
              </button>
              <button
                onClick={() => setPendingToggle(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-brand-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Disagree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
