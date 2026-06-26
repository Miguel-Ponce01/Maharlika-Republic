import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { orders } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { Package, LogOut, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { logout } from "../login/actions";
import CancelOrderButton from "./CancelOrderButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch orders for this specific user — wrapped in try-catch for DB resilience
  let userOrders: any[] = [];
  let dbError = false;

  try {
    userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, user.id),
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true
      }
    });
  } catch (err) {
    console.error("[Account] Failed to fetch orders:", err);
    dbError = true;
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-brand-white pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-brand-black">My Account</h1>
            <p className="text-sm text-brand-textMuted mt-1">{user.email}</p>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-brand-black flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-gold" />
            Order History
          </h2>

          {dbError ? (
            <div className="bg-brand-card border border-brand-border rounded-3xl p-10 text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-brand-black">Unable to load orders</h3>
              <p className="text-sm text-brand-textMuted max-w-sm mx-auto">
                We&apos;re having trouble connecting to the database. This is usually temporary — please try again in a moment.
              </p>
              <Link href="/account" className="inline-block mt-4 px-6 py-3 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors">
                Retry
              </Link>
            </div>
          ) : userOrders.length === 0 ? (
            <div className="bg-brand-card border border-brand-border rounded-3xl p-10 text-center space-y-4">
              <Package className="w-12 h-12 text-brand-textMuted mx-auto opacity-50" />
              <h3 className="text-lg font-bold text-brand-black">No orders yet</h3>
              <p className="text-sm text-brand-textMuted max-w-sm mx-auto">When you place an order, it will appear here so you can track its status.</p>
              <Link href="/products" className="inline-block mt-4 px-6 py-3 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-brand-card border border-brand-border rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-brand-border pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-black text-lg">{order.orderReference}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-brand-textMuted mt-1">
                        Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="text-left md:text-right flex flex-col md:items-end justify-between">
                      <div>
                        <p className="text-xs text-brand-textMuted">Total Amount</p>
                        <p className="font-bold text-brand-gold text-lg">{formatPrice(order.totalAmountCents)}</p>
                      </div>
                      {(order.orderStatus === 'PROCESSING' || order.orderStatus === 'PENDING') && (
                        <div className="mt-2 md:mt-3">
                          <CancelOrderButton orderId={order.id} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-brand-black font-medium">{item.productName}</span>
                          <span className="text-xs text-brand-textMuted">x{item.quantity}</span>
                        </div>
                        <span className="text-brand-black font-medium">{formatPrice(item.subtotalCents)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
