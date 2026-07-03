import { db } from "@/src/db";
import { products, productVariants, orderItems } from "@/src/db/schema";
import { sql, desc } from "drizzle-orm";
import InventorySplitLayout from "./InventorySplitLayout";

export const dynamic = "force-dynamic";

export default async function AdminInventory() {
  // Fetch all products with their variants
  const allProducts = await db.query.products.findMany({
    with: {
      variants: true,
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  // Fetch top items sold
  const topSellingRaw = await db
    .select({
      name: orderItems.productName,
      sku: orderItems.variantSku,
      quantitySold: sql<number>`sum(${orderItems.quantity})`,
      revenueCents: sql<number>`sum(${orderItems.subtotalCents})`,
    })
    .from(orderItems)
    .groupBy(orderItems.productName, orderItems.variantSku)
    .orderBy(sql`sum(${orderItems.quantity}) desc`)
    .limit(5);

  return (
    <InventorySplitLayout 
      initialProducts={allProducts} 
      topSelling={topSellingRaw}
    />
  );
}
