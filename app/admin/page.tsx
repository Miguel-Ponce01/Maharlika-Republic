import { db } from "@/src/db";
import { orders, productVariants } from "@/src/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { 
  Banknote, 
  Package, 
  ShoppingCart, 
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// Server Component
export default async function AdminDashboard() {
  // Fetch overview metrics
  const [totalRevenueResult] = await db
    .select({ total: sql<number>`sum(${orders.totalAmountCents})` })
    .from(orders)
    .where(eq(orders.paymentStatus, "PAID"));

  const [activeOrdersResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.orderStatus, "PROCESSING"));

  const [lowStockResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(productVariants)
    .where(sql`${productVariants.stockOnHand} < 5`);

  // Fetch recent orders
  const recentOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: 5,
  });

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(cents / 100);
  };

  const metrics = [
    {
      title: "Total Revenue (Paid)",
      value: formatPrice(totalRevenueResult?.total || 0),
      icon: Banknote,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Active Orders",
      value: activeOrdersResult?.count || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Low Stock Items",
      value: lowStockResult?.count || 0,
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-black">Dashboard Overview</h1>
        <p className="text-brand-textMuted text-sm mt-1">Welcome back. Here's what's happening with your store today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-brand-white border border-brand-border rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-xl ${metric.bg}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-textMuted uppercase tracking-wider">{metric.title}</p>
              <p className="text-2xl font-bold text-brand-black mt-1">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-brand-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-black">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-brand-gold hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-brand-border text-brand-textMuted">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Order Ref</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-brand-textMuted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.orderStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus}
                      </span>
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
