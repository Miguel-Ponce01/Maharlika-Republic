"use server";

import { db } from "@/src/db";
import { orders } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function cancelOrder(orderId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to cancel an order." };
  }

  try {
    // Check if the order belongs to the user and is in a cancellable state
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, user.id)),
    });

    if (!order) {
      return { error: "Order not found." };
    }

    if (order.orderStatus !== "PROCESSING" && order.orderStatus !== "PENDING") {
      return { error: `Cannot cancel an order that is already ${order.orderStatus.toLowerCase()}.` };
    }

    await db
      .update(orders)
      .set({ 
        orderStatus: "CANCELLED",
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return { error: "An error occurred while trying to cancel your order." };
  }
}
