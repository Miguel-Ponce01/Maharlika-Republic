"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";

export default function StatusDropdown({ orderId, currentStatus }: { orderId: number, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    setStatus(newStatus);
    
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result?.error) {
      alert(result.error);
      setStatus(currentStatus); // revert
    }
    setLoading(false);
  };

  return (
    <div className="relative inline-block w-36">
      <select 
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className={`appearance-none w-full border border-brand-border rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer ${
          status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
          status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800' :
          status === 'DELIVERED' ? 'bg-teal-100 text-teal-800' :
          status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}
      >
        <option value="PENDING">PENDING</option>
        <option value="PROCESSING">PROCESSING</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}
