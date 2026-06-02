import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { products, productVariants } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// =============================================================================
// GET /api/products — Fetch all products with their variants from Supabase
// =============================================================================

export async function GET() {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        brandName: products.brandName,
        modelName: products.modelName,
        categoryType: products.categoryType,
        baseDescription: products.baseDescription,
        systemMetadata: products.systemMetadata,
        createdAt: products.createdAt,
      })
      .from(products);

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      allProducts.map(async (product) => {
        const variants = await db
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, product.id));

        return {
          ...product,
          variants,
        };
      })
    );

    return NextResponse.json(
      { success: true, products: productsWithVariants },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Products API] ❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products — Not allowed from client
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
