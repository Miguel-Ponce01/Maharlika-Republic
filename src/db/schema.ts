import { pgTable, text, serial, integer, jsonb, timestamp, numeric } from "drizzle-orm/pg-core";

// =============================================================================
// Maharlika Republic — Nucleic Inventory + Order Model
// =============================================================================

// 1. Parent Blueprint Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  modelName: text("model_name").notNull(),
  categoryType: text("category_type").notNull(), // 'gadget' | 'accessory' | 'part'
  baseDescription: text("base_description").notNull(),
  systemMetadata: jsonb("system_metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Nucleic Variant Node Table
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  skuString: text("sku_string").notNull().unique(),
  storageCapacity: text("storage_capacity"), // e.g. '256GB', '512GB'
  colorSpec: text("color_spec"),
  stockOnHand: integer("stock_on_hand").default(0).notNull(),
  priceCents: integer("price_cents").notNull(), // stored in lowest currency unit (centavos)
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Serialized Inventory Ledger Table
export const serializedItems = pgTable("serialized_items", {
  id: serial("id").primaryKey(),
  variantId: integer("variant_id").references(() => productVariants.id).notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  imeiString: text("imei_string").unique(),
  dispositionStatus: text("disposition_status").default("AVAILABLE").notNull(), // 'AVAILABLE' | 'RESERVED' | 'SOLD'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// =============================================================================
// Order Tables
// =============================================================================

// 4. Orders — one record per checkout submission
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderReference: text("order_reference").notNull().unique(), // e.g. 'MR-2026-00001'
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address"),
  paymentMethod: text("payment_method").notNull(), // 'gcash' | 'maya' | 'cod' | 'bank_transfer'
  paymentStatus: text("payment_status").default("PENDING").notNull(), // 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  orderStatus: text("order_status").default("PROCESSING").notNull(), // 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmountCents: integer("total_amount_cents").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Order Items — line items per order
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productName: text("product_name").notNull(), // snapshot at time of purchase
  variantSku: text("variant_sku").notNull(),   // snapshot at time of purchase
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  variantId: integer("variant_id").references(() => productVariants.id), // nullable — in case product deleted later
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports for use throughout the app
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
