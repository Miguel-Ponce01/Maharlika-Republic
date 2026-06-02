import { config } from "dotenv";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Load environment variables from .env.local
config({ path: resolve(__dirname, "../../.env.local") });

const ALL_PRODUCTS = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    price: 84990,
    monthlyInstallment: 3541,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop",
    type: "iPhone",
    brand: "Apple",
    compatibility: "iPhone 16 Pro Max",
    specs: "256GB, Desert Titanium"
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    price: 56990,
    monthlyInstallment: 2374,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=400&auto=format&fit=crop",
    type: "iPhone",
    brand: "Apple",
    compatibility: "iPhone 16",
    specs: "128GB, Ultramarine"
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    price: 46990,
    monthlyInstallment: 1957,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400&auto=format&fit=crop",
    type: "iPhone",
    brand: "Apple",
    compatibility: "iPhone 15",
    specs: "128GB, Black"
  },
  {
    id: "ipad-10th-gen",
    name: "iPad 10th Gen 10.9\" Wi-Fi",
    price: 25500,
    monthlyInstallment: 1062,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop",
    type: "iPad",
    brand: "Apple",
    compatibility: "iPad",
    specs: "64GB, Blue"
  },
  {
    id: "ipad-air-m2",
    name: "iPad Air 11\" M2 Wi-Fi",
    price: 42990,
    monthlyInstallment: 1791,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop",
    type: "iPad",
    brand: "Apple",
    compatibility: "iPad",
    specs: "128GB, Space Grey"
  },
  {
    id: "macbook-air-m3",
    name: "MacBook Air 13\" M3",
    price: 61500,
    monthlyInstallment: 2562,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop",
    type: "Mac",
    brand: "Apple",
    compatibility: "Mac",
    specs: "8GB RAM, 256GB SSD, Midnight"
  },
  {
    id: "macbook-pro-m3-max",
    name: "MacBook Pro 16\" M3 Max",
    price: 199990,
    monthlyInstallment: 8332,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop",
    type: "Mac",
    brand: "Apple",
    compatibility: "Mac",
    specs: "36GB RAM, 1TB SSD, Space Black"
  },
  {
    id: "apple-watch-s10",
    name: "Apple Watch Series 10 GPS",
    price: 26500,
    monthlyInstallment: 1104,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=400&auto=format&fit=crop",
    type: "Apple Watch",
    brand: "Apple",
    compatibility: "Apple Watch",
    specs: "46mm, Jet Black Aluminum"
  },
  {
    id: "earpods-lightning",
    name: "EarPods with Lightning Connector",
    price: 1250,
    monthlyInstallment: 0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    type: "AirPods & Earphones",
    brand: "Apple",
    compatibility: "iPhone 15",
    specs: "White"
  },
  {
    id: "apple-pencil-usb-c",
    name: "Apple Pencil (USB-C)",
    price: 5250,
    monthlyInstallment: 218,
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?q=80&w=400&auto=format&fit=crop",
    type: "Accessories",
    brand: "Apple",
    compatibility: "iPad",
    specs: "White"
  },
  {
    id: "airpods-4",
    name: "AirPods 4",
    price: 8490,
    monthlyInstallment: 353,
    image: "https://images.unsplash.com/photo-1588449668338-d15168b5a4c5?q=80&w=400&auto=format&fit=crop",
    type: "AirPods & Earphones",
    brand: "Apple",
    compatibility: "Universal",
    specs: "White"
  },
  {
    id: "magsafe-charger",
    name: "MagSafe Charger (1m)",
    price: 2490,
    monthlyInstallment: 103,
    image: "https://images.unsplash.com/photo-1622445262465-24819af52287?q=80&w=400&auto=format&fit=crop",
    type: "Chargers & Cables",
    brand: "Apple",
    compatibility: "iPhone 16",
    specs: "Silver"
  },
  {
    id: "20w-usb-c-adapter",
    name: "20W USB-C Power Adapter",
    price: 1190,
    monthlyInstallment: 0,
    image: "https://images.unsplash.com/photo-1619173003444-2457fb1e57c6?q=80&w=400&auto=format&fit=crop",
    type: "Chargers & Cables",
    brand: "Apple",
    compatibility: "Universal",
    specs: "White"
  },
  {
    id: "silicone-case-16-pro",
    name: "Silicone Case with MagSafe for iPhone 16 Pro Max",
    price: 3290,
    monthlyInstallment: 137,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400&auto=format&fit=crop",
    type: "Accessories",
    brand: "Apple",
    compatibility: "iPhone 16 Pro Max",
    specs: "Stone Grey"
  }
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not found in environment");
  }

  console.log("Connecting to database...");
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client, { schema });

  console.log("Seeding products...");
  
  for (const item of ALL_PRODUCTS) {
    // Determine category type
    const isAccessory = item.type === "Accessories" || item.type === "Chargers & Cables" || item.type === "AirPods & Earphones";
    const categoryType = isAccessory ? "accessory" : "gadget";
    
    // Parse specs for storage and color (basic approach)
    const specParts = item.specs.split(", ");
    let storageCapacity = null;
    let colorSpec = item.specs;
    if (specParts.length > 1) {
      storageCapacity = specParts[0];
      colorSpec = specParts.slice(1).join(", ");
    }

    // Check if product already exists (by modelName) to avoid duplicate entries on re-run
    const existingProduct = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.modelName, item.name),
    });

    let productId;
    if (existingProduct) {
      productId = existingProduct.id;
      console.log(`Product already exists: ${item.name}`);
    } else {
      console.log(`Inserting product: ${item.name}`);
      const [newProduct] = await db.insert(schema.products).values({
        brandName: item.brand,
        modelName: item.name,
        categoryType: categoryType,
        baseDescription: `A premium ${item.type} compatible with ${item.compatibility}.`,
        systemMetadata: {
          id: item.id, // we store the original ID here to match with UI logic easier
          type: item.type,
          compatibility: item.compatibility,
          monthlyInstallment: item.monthlyInstallment,
        }
      }).returning({ id: schema.products.id });
      productId = newProduct.id;
    }

    // Check variant
    const skuString = `${item.id}-base`;
    const existingVariant = await db.query.productVariants.findFirst({
      where: (variants, { eq }) => eq(variants.skuString, skuString),
    });

    if (!existingVariant) {
      console.log(`Inserting variant for: ${item.name}`);
      await db.insert(schema.productVariants).values({
        productId: productId,
        skuString: skuString,
        storageCapacity: storageCapacity,
        colorSpec: colorSpec,
        stockOnHand: 10, // Default to 10 in stock
        priceCents: item.price * 100, // Convert to cents
        imageUrl: item.image,
      });
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
