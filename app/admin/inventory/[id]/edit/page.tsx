import { db } from "@/src/db";
import { productVariants, products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditVariantForm from "./EditVariantForm";

type Params = Promise<{ id: string }> | { id: string };

export default async function EditVariantPage({ params }: { params: Params }) {
  const resolvedParams = await Promise.resolve(params);
  const variantId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(variantId)) {
    return notFound();
  }

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, variantId),
    with: {
      product: true,
    },
  });

  if (!variant) {
    return notFound();
  }

  return <EditVariantForm initialVariant={variant} />;
}
