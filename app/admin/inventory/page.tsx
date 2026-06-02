import { db } from "@/src/db";
import { products, productVariants } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import DeleteVariantButton from "./DeleteVariantButton";

export default async function AdminInventory() {
  // Fetch all products with their variants
  const allProducts = await db.query.products.findMany({
    with: {
      variants: true,
    },
  });

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(cents / 100);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-black">Inventory</h1>
          <p className="text-brand-textMuted text-sm mt-1">Manage your product catalog and stock levels.</p>
        </div>
        <Link 
          href="/admin/inventory/new" 
          className="px-5 py-2.5 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-brand-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-brand-border text-brand-textMuted">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Specs</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Price</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {allProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-brand-textMuted">
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                allProducts.map((product) => (
                  product.variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={variant.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=100"} 
                            alt={product.modelName} 
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100 border border-brand-border"
                          />
                          <div>
                            <div className="font-bold text-brand-black">{product.modelName}</div>
                            <div className="text-xs text-brand-textMuted">{product.brandName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-brand-textMuted">{variant.skuString}</td>
                      <td className="px-6 py-4 text-brand-textMuted">
                        {[variant.storageCapacity, variant.colorSpec].filter(Boolean).join(", ")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          variant.stockOnHand > 5 ? 'bg-green-100 text-green-800' :
                          variant.stockOnHand > 0 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {variant.stockOnHand} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-brand-black">
                        {formatPrice(variant.priceCents)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-brand-textMuted hover:bg-gray-100 rounded-lg transition-colors" title="Edit (Coming Soon)">
                            <Edit className="w-4 h-4" />
                          </button>
                          <DeleteVariantButton variantId={variant.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
