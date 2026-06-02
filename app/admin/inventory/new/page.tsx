"use client";

import { useState } from "react";
import { addProduct } from "../actions";
import { ArrowLeft, Save, Image as ImageIcon, Smartphone, Headphones, Wrench, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState("gadget");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [stockQuantity, setStockQuantity] = useState(10);

  const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];
  
  const appleColors = [
    { name: "Space Black", hex: "#2c2c2e" },
    { name: "Space Grey", hex: "#535150" },
    { name: "Silver", hex: "#e3e4e6" },
    { name: "Natural Titanium", hex: "#8b8a86" },
    { name: "Desert Titanium", hex: "#b9a595" },
    { name: "Starlight", hex: "#f9f4f0" },
    { name: "Midnight", hex: "#1a2432" },
    { name: "Product (RED)", hex: "#c5112e" },
    { name: "Blue", hex: "#215e7c" },
    { name: "Yellow", hex: "#f3d060" },
    { name: "Green", hex: "#303c37" },
    { name: "Pink", hex: "#faddd7" },
    { name: "Purple", hex: "#bcb0c9" },
    { name: "White", hex: "#f5f5f7" }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("categoryType", categoryType); // Ensure the custom state is included
    formData.set("storageCapacity", selectedStorage);
    formData.set("colorSpec", selectedColor);
    formData.set("stockOnHand", stockQuantity.toString());
    
    const result = await addProduct(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/inventory" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-brand-black" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-black">Add New Product</h1>
            <p className="text-brand-textMuted text-sm mt-1">Create a new product blueprint and its first variant.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Blueprint & Categorization */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-brand-white border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-brand-black mb-6 border-b border-brand-border pb-4">1. Input Product Blueprint</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Brand Name</label>
                    <input type="text" name="brandName" required placeholder="e.g. Apple" className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Model Name</label>
                    <input type="text" name="modelName" required placeholder="e.g. iPhone 15 Pro" className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Category Type</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setCategoryType("gadget")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${categoryType === "gadget" ? "border-brand-gold bg-yellow-50 text-brand-gold" : "border-brand-border bg-brand-white text-brand-textMuted hover:border-gray-300"}`}
                    >
                      <Smartphone className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Gadget</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryType("accessory")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${categoryType === "accessory" ? "border-brand-gold bg-yellow-50 text-brand-gold" : "border-brand-border bg-brand-white text-brand-textMuted hover:border-gray-300"}`}
                    >
                      <Headphones className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Accessory</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryType("part")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${categoryType === "part" ? "border-brand-gold bg-yellow-50 text-brand-gold" : "border-brand-border bg-brand-white text-brand-textMuted hover:border-gray-300"}`}
                    >
                      <Wrench className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-wider">Part</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Description</label>
                  <textarea name="baseDescription" required rows={4} placeholder="Product description..." className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-brand-white border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-brand-black mb-6 border-b border-brand-border pb-4">2. Initial Variant Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">SKU Code (Unique identifier)</label>
                  <input type="text" name="skuString" required placeholder="e.g. APPL-IP15P-256-BLK" className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Price (PHP)</label>
                  <input type="number" step="0.01" name="price" required placeholder="e.g. 65990.00" className="w-full bg-gray-50 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Storage Capacity</label>
                  <div className="flex flex-wrap gap-3">
                    {storageOptions.map((storage) => (
                      <button
                        key={storage}
                        type="button"
                        onClick={() => setSelectedStorage(storage)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                          selectedStorage === storage 
                            ? "border-brand-gold bg-yellow-50 text-brand-gold" 
                            : "border-brand-border bg-brand-white text-brand-textMuted hover:border-gray-300"
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                    <input type="hidden" name="storageCapacity" value={selectedStorage} />
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Color Options</label>
                  <div className="flex flex-wrap gap-4 p-2">
                    {appleColors.map((color) => (
                      <div key={color.name} className="relative group flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform ${
                            selectedColor === color.name ? "scale-125 border-brand-gold" : "border-gray-200 hover:scale-110"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          aria-label={color.name}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none z-10">
                          {color.name}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    ))}
                    <input type="hidden" name="colorSpec" value={selectedColor} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Initial Stock Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStockQuantity(Math.max(0, stockQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-brand-border bg-gray-50 text-brand-black hover:bg-gray-100 transition-colors font-bold text-lg"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="0"
                      value={stockQuantity} 
                      onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                      className="w-20 bg-brand-white border border-brand-border rounded-xl px-2 py-2 text-center text-sm font-bold text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all" 
                    />
                    <button
                      type="button"
                      onClick={() => setStockQuantity(stockQuantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-brand-border bg-gray-50 text-brand-black hover:bg-gray-100 transition-colors font-bold text-lg"
                    >
                      +
                    </button>
                    <input type="hidden" name="stockOnHand" value={stockQuantity} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image Preview & Actions */}
          <div className="space-y-8">
            <div className="bg-brand-white border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-brand-black mb-6 border-b border-brand-border pb-4">Product Image</h2>
              
              <div className="space-y-6">
                {/* Image Preview Window */}
                <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-brand-border bg-gray-50 flex items-center justify-center overflow-hidden relative group">
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <ImageIcon className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-xs text-brand-textMuted font-medium">Image preview will appear here</p>
                    </div>
                  )}
                  {imagePreviewUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => {
                        setImageFile(null);
                        setImagePreviewUrl("");
                      }} className="px-4 py-2 bg-white text-red-600 font-bold text-xs rounded-lg uppercase tracking-wider shadow-lg">Remove</button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block ml-1">Upload Image</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UploadCloud className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                      type="file" 
                      name="imageFile" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full bg-gray-50 border border-brand-border rounded-xl pl-10 pr-4 py-2 text-sm text-brand-black focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-gold file:text-white hover:file:bg-yellow-600 file:transition-colors file:cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-border flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 disabled:opacity-70 uppercase tracking-wider text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Product
                      </>
                    )}
                  </button>
                  <Link href="/admin/inventory" className="w-full py-4 rounded-xl font-bold text-brand-black bg-gray-100 hover:bg-gray-200 transition-colors text-center uppercase tracking-wider text-sm">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
