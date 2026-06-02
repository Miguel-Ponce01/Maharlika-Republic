import { db } from "@/src/db";
import { orders } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import StatusDropdown from "./StatusDropdown";

export default async function AdminOrders() {
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
  });

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(cents / 100);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-black">Orders</h1>
        <p className="text-brand-textMuted text-sm mt-1">Manage and view all customer orders.</p>
      </div>

      <div className="bg-brand-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-brand-border text-brand-textMuted">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Order Ref</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-brand-textMuted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                allOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-black">{order.orderReference}</td>
                    <td className="px-6 py-4">
                      <div className="text-brand-black">{order.customerName}</div>
                      <div className="text-xs text-brand-textMuted">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-brand-textMuted">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-brand-textMuted uppercase text-xs font-bold">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusDropdown orderId={order.id} currentStatus={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-brand-black">
                      {formatPrice(order.totalAmountCents)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
