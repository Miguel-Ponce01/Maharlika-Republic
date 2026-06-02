"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateOrderStatus } from "./actions";
import { ChevronDown, Check } from "lucide-react";

const STATUSES = [
  { value: "PENDING", label: "PENDING", color: "bg-gray-100 text-gray-800 border-gray-200", dot: "bg-gray-500" },
  { value: "PROCESSING", label: "PROCESSING", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  { value: "SHIPPED", label: "SHIPPED", color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  { value: "DELIVERED", label: "DELIVERED", color: "bg-teal-50 text-teal-700 border-teal-200", dot: "bg-teal-500" },
  { value: "COMPLETED", label: "COMPLETED", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  { value: "CANCELLED", label: "CANCELLED", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" }
];

export default function StatusDropdown({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or scroll
  useEffect(() => {
    function handleEvent(event: Event) {
      if (event.type === "scroll") {
        setIsOpen(false);
        return;
      }
      const target = event.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleEvent);
    window.addEventListener("scroll", handleEvent, true); // use capture phase to catch internal scrolls
    
    return () => {
      document.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("scroll", handleEvent, true);
    };
  }, []);

  const toggleDropdown = () => {
    if (!loading) {
      if (!isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
      setIsOpen(!isOpen);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsOpen(false);
    if (newStatus === status) return;
    
    setLoading(true);
    const oldStatus = status;
    setStatus(newStatus);
    
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result?.error) {
      alert(result.error);
      setStatus(oldStatus); // revert
    }
    setLoading(false);
  };

  const currentConfig = STATUSES.find(s => s.value === status) || STATUSES[0];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        disabled={loading}
        className={`relative inline-flex items-center justify-between w-40 border rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-1 ${currentConfig.color} ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${currentConfig.dot}`}></span>
          {status}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div 
          ref={menuRef}
          className="fixed z-[9999] bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden py-1 origin-top-right"
          style={{ top: coords.top, left: coords.left, width: coords.width }}
        >
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-gray-50 ${status === s.value ? 'bg-gray-50 text-gray-900' : 'text-gray-500'}`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                {s.label}
              </span>
              {status === s.value && <Check className="w-3.5 h-3.5 text-brand-gold" />}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
