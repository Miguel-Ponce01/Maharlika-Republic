"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "./actions";
import { XCircle, AlertCircle } from "lucide-react";

interface CancelOrderButtonProps {
  orderId: number;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCancel = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result?.error) {
        setErrorMsg(result.error);
        setShowConfirm(false);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 sm:mt-0">
        <span className="text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Are you sure?
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
          >
            {isPending ? "Cancelling..." : "Yes, Cancel"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all"
          >
            Keep Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1 mt-4 sm:mt-0">
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg font-bold text-xs hover:bg-red-50 transition-all duration-200 active:scale-95"
      >
        <XCircle className="w-3.5 h-3.5" />
        Cancel Order
      </button>
      {errorMsg && (
        <span className="text-[10px] text-red-500 font-medium mt-1">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
