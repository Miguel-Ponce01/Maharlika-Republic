import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { orders, orderItems, productVariants } from '@/src/db/schema';
import { createClient } from '@/utils/supabase/server';
import { eq, sql } from 'drizzle-orm';

// =============================================================================
// POST /api/checkout — Persist a new order to Supabase
// =============================================================================

function generateOrderReference(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `MR-${year}-${random}`;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items, notes } = body;

    // --- Validation ---
    if (!customerName || !customerEmail || !paymentMethod || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, paymentMethod, items' },
        { status: 400 }
      );
    }

    // --- Calculate total ---
    const totalAmountCents = items.reduce(
      (sum: number, item: { unitPriceCents: number; quantity: number }) =>
        sum + item.unitPriceCents * item.quantity,
      0
    );

    const orderReference = generateOrderReference();

    // --- Insert order + line items in a transaction ---
    const result = await db.transaction(async (tx) => {
      // 1. Validate stock availability for every variant
      for (const item of items as {
        productName: string;
        variantSku: string;
        quantity: number;
        unitPriceCents: number;
        variantId?: number;
      }[]) {
        if (!item.variantId) continue;

        const [variant] = await tx
          .select({ stockOnHand: productVariants.stockOnHand })
          .from(productVariants)
          .where(eq(productVariants.id, item.variantId));

        if (!variant) {
          throw new Error(`Variant ${item.variantSku} no longer exists.`);
        }
        if (variant.stockOnHand < item.quantity) {
          throw new Error(
            `Insufficient stock for "${item.productName}" (${item.variantSku}). ` +
            `Requested ${item.quantity}, only ${variant.stockOnHand} available.`
          );
        }
      }

      // 2. Insert the order
      const [newOrder] = await tx
        .insert(orders)
        .values({
          orderReference,
          userId: user ? user.id : null,
          customerName,
          customerEmail,
          customerPhone: customerPhone ?? null,
          shippingAddress: shippingAddress ?? null,
          paymentMethod,
          paymentStatus: 'PENDING',
          orderStatus: 'PROCESSING',
          totalAmountCents,
          notes: notes ?? null,
        })
        .returning();

      // 3. Insert line items
      const lineItems = items.map((item: {
        productName: string;
        variantSku: string;
        quantity: number;
        unitPriceCents: number;
        variantId?: number;
      }) => ({
        orderId: newOrder.id,
        productName: item.productName,
        variantSku: item.variantSku,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        subtotalCents: item.unitPriceCents * item.quantity,
        variantId: item.variantId ?? null,
      }));

      await tx.insert(orderItems).values(lineItems);

      // 4. Deduct stock from product_variants
      for (const item of items as { variantId?: number; quantity: number }[]) {
        if (!item.variantId) continue;

        await tx
          .update(productVariants)
          .set({
            stockOnHand: sql`${productVariants.stockOnHand} - ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(productVariants.id, item.variantId));
      }

      return newOrder;
    });

    console.log(`[Checkout API] ✅ Order ${result.orderReference} created (ID: ${result.id})`);

    return NextResponse.json(
      {
        success: true,
        order: {
          id: result.id,
          reference: result.orderReference,
          status: result.orderStatus,
          totalAmountCents: result.totalAmountCents,
        },
        message: `Order ${result.orderReference} placed successfully.`,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Checkout API] ❌ Error:', message);

    // Surface stock-related errors as 409 Conflict
    if (message.includes('Insufficient stock') || message.includes('no longer exists')) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json(
      { error: 'Internal Server Error — could not create order.' },
      { status: 500 }
    );
  }
}

// GET /api/checkout — Not allowed
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
