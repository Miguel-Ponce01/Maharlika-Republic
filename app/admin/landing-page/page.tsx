import { db } from "@/src/db";
import LandingPageControlTable from "./LandingPageControlTable";

export const dynamic = "force-dynamic";

export default async function AdminLandingPage() {
  // Fetch all products with their variants
  const allProducts = await db.query.products.findMany({
    with: {
      variants: true,
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1600px] w-full mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-black">Landing Page Controls</h1>
        <p className="text-brand-textMuted text-sm mt-1">
          Select which products are shown on your store's landing page and highlighted as top weekly picks.
        </p>
      </div>

      <LandingPageControlTable initialProducts={allProducts} />
    </div>
  );
}
