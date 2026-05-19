import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

// Tier 2: The "Nucleic" Inventory Model

// 1. Parent Blueprint Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  modelName: text("model_name").notNull(),
  categoryType: text("category_type").notNull(), // 'gadget'|'accessory'|'part'
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
  storageCapacityBytes: text("storage_capacity_bytes"), // e.g., '256GB' represented as string or actual bytes
  colorSpec: text("color_spec"),
  stockOnHand: integer("stock_on_hand").default(0).notNull(),
  priceCents: integer("price_cents").notNull(), // Absolute integers representing lowest currency denominator
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Serialized Inventory Ledger Table
export const serializedItems = pgTable("serialized_items", {
  id: serial("id").primaryKey(),
  variantId: integer("variant_id").references(() => productVariants.id).notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  imeiString: text("imei_string").unique(),
  dispositionStatus: text("disposition_status").default('AVAILABLE').notNull(), // 'AVAILABLE', 'RESERVED', 'SOLD'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
