"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteVariant } from "./actions";

export default function DeleteVariantButton({ variantId }: { variantId: number }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    
    setLoading(true);
    const result = await deleteVariant(variantId);
    
    if (result?.error) {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete Variant"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
