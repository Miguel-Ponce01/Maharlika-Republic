-- =============================================================================
-- Maharlika Republic — Enable RLS on All Public Tables
-- =============================================================================
-- Run this in the Supabase Dashboard → SQL Editor
-- This resolves ALL 5 "RLS Disabled in Public" advisor warnings.
-- =============================================================================

-- 1. PRODUCTS — public catalog, anyone can browse
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);


-- 2. PRODUCT_VARIANTS — public catalog variants, anyone can browse
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for product_variants"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (true);


-- 3. ORDERS — authenticated users can only view their own orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING ( (select auth.uid())::text = user_id );


-- 4. ORDER_ITEMS — authenticated users can view items from their own orders
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders
      WHERE user_id = (select auth.uid())::text
    )
  );


-- 5. SERIALIZED_ITEMS — admin/service-role only, no public access
ALTER TABLE public.serialized_items ENABLE ROW LEVEL SECURITY;
-- No SELECT/INSERT/UPDATE/DELETE policies = completely locked down via PostgREST
-- The service_role key (used by server-side Drizzle) bypasses RLS automatically
