import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { orders, orderItems } from '@/src/db/schema';

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
      // 1. Insert the order
      const [newOrder] = await tx
        .insert(orders)
        .values({
          orderReference,
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

      // 2. Insert line items
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
  } catch (error) {
    console.error('[Checkout API] ❌ Error:', error);
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
