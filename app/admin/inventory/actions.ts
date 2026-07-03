"use server";

import { db } from "@/src/db";
import { products, productVariants, orderItems, serializedItems } from "@/src/db/schema";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, and, sql } from "drizzle-orm";

export async function addProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["anthonpnc@gmail.com"];
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) return { error: "Unauthorized" };

  try {
    const brandName = formData.get("brandName") as string;
    const modelName = formData.get("modelName") as string;
    const categoryType = formData.get("categoryType") as string;
    const baseDescription = formData.get("baseDescription") as string;

    const skuString = formData.get("skuString") as string;
    const storageCapacity = formData.get("storageCapacity") as string;
    const colorSpec = formData.get("colorSpec") as string;
    const stockOnHand = parseInt(formData.get("stockOnHand") as string, 10);
    const pricePhp = parseFloat(formData.get("price") as string);
    const imageFile = formData.get("imageFile") as File | null;

    const priceCents = Math.round(pricePhp * 100);

    let finalImageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);
        
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Failed to upload image.");
      }
      
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
        
      finalImageUrl = publicUrlData.publicUrl;
    }

    let productId: number;

    // Insert Product and Variant in a transaction
    await db.transaction(async (tx) => {
      // Check if product exists in transaction to avoid race conditions
      const existing = await tx
        .select()
        .from(products)
        .where(
          and(
            sql`lower(${products.brandName}) = ${brandName.toLowerCase().trim()}`,
            sql`lower(${products.modelName}) = ${modelName.toLowerCase().trim()}`
          )
        )
        .limit(1);

      if (existing.length > 0) {
        productId = existing[0].id;
      } else {
        const [newProduct] = await tx
          .insert(products)
          .values({
            brandName,
            modelName,
            categoryType,
            baseDescription,
          })
          .returning();
        productId = newProduct.id;
      }

      await tx
        .insert(productVariants)
        .values({
          productId,
          skuString,
          storageCapacity: storageCapacity || null,
          colorSpec: colorSpec || null,
          stockOnHand: isNaN(stockOnHand) ? 0 : stockOnHand,
          priceCents,
          imageUrl: finalImageUrl || null,
        });
    });

  } catch (error: any) {
    console.error("Failed to add product:", error);
    return { error: error.message || "Failed to add product" };
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/inventory");
}

export async function deleteVariant(variantId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["anthonpnc@gmail.com"];
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) return { error: "Unauthorized" };

  try {
    // Check if variant is referenced in any orders
    const existingOrders = await db.query.orderItems.findFirst({
      where: eq(orderItems.variantId, variantId),
    });

    if (existingOrders) {
      return { error: "Cannot delete variant: it has been ordered by a customer." };
    }

    // Check if variant has physical serialized items
    const existingSerials = await db.query.serializedItems.findFirst({
      where: eq(serializedItems.variantId, variantId),
    });

    if (existingSerials) {
      return { error: "Cannot delete variant: it has physical serialized items in stock." };
    }

    // Delete the variant. (Note: in a real app, you'd soft delete or check if it's in an order)
    await db.delete(productVariants).where(eq(productVariants.id, variantId));
    
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete variant:", error);
    return { error: error.message || "Failed to delete variant" };
  }
}

export async function updateVariant(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["anthonpnc@gmail.com"];
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) return { error: "Unauthorized" };

  try {
    const variantId = parseInt(formData.get("variantId") as string, 10);
    const productId = parseInt(formData.get("productId") as string, 10);

    const brandName = formData.get("brandName") as string;
    const modelName = formData.get("modelName") as string;
    const categoryType = formData.get("categoryType") as string;
    const baseDescription = formData.get("baseDescription") as string;

    const skuString = formData.get("skuString") as string;
    const storageCapacity = formData.get("storageCapacity") as string;
    const colorSpec = formData.get("colorSpec") as string;
    const stockOnHand = parseInt(formData.get("stockOnHand") as string, 10);
    const pricePhp = parseFloat(formData.get("price") as string);
    const imageFile = formData.get("imageFile") as File | null;

    const showOnLandingPage = formData.get("showOnLandingPage") === "true";
    const isBestFromBox = formData.get("isBestFromBox") === "true";

    const priceCents = Math.round(pricePhp * 100);

    let newImageUrl: string | undefined = undefined;
    
    // Only upload if a new file is provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);
        
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Failed to upload new image.");
      }
      
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
        
      newImageUrl = publicUrlData.publicUrl;
    }

    // Update Product and Variant in a transaction
    await db.transaction(async (tx) => {
      // Get existing product to preserve systemMetadata
      const existingProduct = await tx
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);
      
      const currentMetadata = (existingProduct[0]?.systemMetadata as Record<string, any>) || {};
      const updatedMetadata = {
        ...currentMetadata,
        showOnLandingPage,
        isBestFromBox,
      };

      // Update parent product
      await tx
        .update(products)
        .set({
          brandName,
          modelName,
          categoryType,
          baseDescription,
          systemMetadata: updatedMetadata,
        })
        .where(eq(products.id, productId));

      // Update variant
      const variantUpdateData: any = {
        skuString,
        storageCapacity: storageCapacity || null,
        colorSpec: colorSpec || null,
        stockOnHand: isNaN(stockOnHand) ? 0 : stockOnHand,
        priceCents,
      };
      
      if (newImageUrl) {
        variantUpdateData.imageUrl = newImageUrl;
      }

      await tx
        .update(productVariants)
        .set(variantUpdateData)
        .where(eq(productVariants.id, variantId));
    });

  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { error: error.message || "Failed to update product" };
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/inventory");
}

export async function updateProductLandingPageSettings(productId: number, showOnLandingPage: boolean, isBestFromBox: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["anthonpnc@gmail.com"];
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) return { error: "Unauthorized" };

  try {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (existing.length === 0) {
      return { error: "Product not found" };
    }

    const currentMetadata = (existing[0].systemMetadata as Record<string, any>) || {};
    const updatedMetadata = {
      ...currentMetadata,
      showOnLandingPage,
      isBestFromBox,
    };

    await db
      .update(products)
      .set({ systemMetadata: updatedMetadata })
      .where(eq(products.id, productId));

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/landing-page");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update landing page settings:", error);
    return { error: error.message || "Failed to update landing page settings" };
  }
}

export async function quickUpdateVariant(
  variantId: number,
  skuString: string,
  storageCapacity: string,
  colorSpec: string,
  stockOnHand: number,
  pricePhp: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["anthonpnc@gmail.com"];
  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) return { error: "Unauthorized" };

  try {
    const priceCents = Math.round(pricePhp * 100);

    await db
      .update(productVariants)
      .set({
        skuString,
        storageCapacity: storageCapacity || null,
        colorSpec: colorSpec || null,
        stockOnHand,
        priceCents,
      })
      .where(eq(productVariants.id, variantId));

    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to quick-update variant:", error);
    return { error: error.message || "Failed to update variant" };
  }
}
