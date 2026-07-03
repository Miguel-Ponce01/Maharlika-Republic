"use server";

import { db } from "@/src/db";
import { orders } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function updateOrderStatus(orderId: number, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["anthonpnc@gmail.com"];
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return { error: "Unauthorized" };
  }

  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(newStatus)) {
    return { error: "Invalid status value" };
  }

  try {
    await db
      .update(orders)
      .set({ orderStatus: newStatus })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders/history");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { error: "Failed to update order status" };
  }
}
