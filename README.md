# Maharlika Republic Platform — User Manual & Developer Guide

Welcome to the **Maharlika Republic Platform**, Davao City's premier hybrid digital storefront, showroom navigation, and inventory management system designed specifically for **Maharlika Marexx Republic Davao** (Maharlika Gadgets). 

This platform bridges the gap between online convenience and physical showroom trust. It features a curated Apple device catalog, a multi-canvas indoor showroom locator, custom financing details highlights, and a secure backoffice admin dashboard.

---

## 🚀 Technical Stack & Architecture

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling & UI**: Tailwind CSS & Framer Motion (for premium, soft UI neumorphic and glassmorphic designs)
- **Database ORM**: Drizzle ORM (PostgreSQL)
- **Backend Services**: Supabase (Auth, SSR integration, Storage bucket hosting)
- **State Management**: Zustand (Cart state persistence, theme configurations, UI visibility controls)
- **Maps**: MapLibre GL (for macro city locator and micro indoor showroom blueprint layouts)

---

## 📊 Database Schema Design (The "Nucleic" Model)

The database follows a relational structure optimized for electronic device tracking and serialized inventory control.

```
       +-------------------+
       |     products      |
       +---------+---------+
                 | (1:N)
       +---------v---------+
       |  product_variants |
       +----+-----------+--+
            | (1:N)     | (1:N)
+-----------v-------+   |
|  serialized_items |   |
+-------------------+   |
                        |
       +----------------v--+         +-------------------+
       |    order_items     <--------+      orders       |
       +-------------------+  (N:1)  +-------------------+
```

### Core Tables:
1. **`products`**: Parent blueprint containing model details (`brandName`, `modelName`, `categoryType`, `baseDescription`).
2. **`product_variants`**: Variant specifications (`storageCapacity`, `colorSpec`, `stockOnHand`, `priceCents` stored in centavos, `imageUrl`).
3. **`serialized_items`**: Tracked physical stock by `serialNumber` or `imeiString`, mapped to a `dispositionStatus` (`AVAILABLE`, `RESERVED`, `SOLD`).
4. **`orders`**: Transaction records containing client information (`customerName`, `customerEmail`, `shippingAddress`), payment choices, statuses, and total amount.
5. **`order_items`**: Purchase snapshot line items mapping specific orders to product variants and quantities.

---

## 🛠️ Developer Setup & Installation

Follow these steps to set up the project locally:

### 1. Prerequisites
- Install **Node.js** (v18.x or v20.x recommended)
- Set up a **PostgreSQL Database** (e.g., Supabase PostgreSQL or Neon)
- Initialize a **Supabase Project** for Auth and Storage

### 2. Clone & Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Create a `.env.local` file in the root directory (matching the layout of `.env.example`):
```env
# Database Credentials
DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"

# Supabase Web Services Integration
NEXT_PUBLIC_SUPABASE_URL="https://[project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 4. Database Setup & Seeding
Push the database schemas using Drizzle Kit:
```bash
npm run db:push
```

Seed the initial product catalog data (iPhones, MacBooks, iPads, AirPods, and Accessories):
```bash
npm run seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 📖 Operational User Manual

### 1. Customer-Facing Storefront
- **Catalog Navigation**: Filter devices dynamically by brand (iPhone, Mac, iPad, Watch, etc.).
- **Interactive Location Map**: Located at the bottom of the landing page. Toggle between the **Bajada building locator** (macro view) and the **indoor showroom floor layout** (micro view) to guide your physical visit.
- **Cart & Checkout Workflow**:
  1. Add products to the sliding cart drawer.
  2. Proceed to the `/checkout` page and fill in contact/delivery details.
  3. Select from flexible options (Cash on Delivery, GCash, Maya, or partner financing schemes like Skyro/Salmon).
  4. Submit your order to generate the transaction reference.
- **Messenger Dispatch**: Click the copy button on the invoice confirmation screen to copy a structured invoice payload. Paste this to the Maharlika Marexx Facebook representative for rapid approval.

### 2. Admin Backoffice operations
- **Dashboard Access**: Access the administrative controls at `/admin` (or `/login` as admin).
- **Dashboard Analytics**: Check live data metrics (Total Revenue, Active Orders, Low Stock warnings).
- **Inventory Control**:
  - Add new products and configure variants (color, storage capacity, price, images).
  - Track physical serialized codes to monitor individual items.
  - Safely delete items—the system automatically blocks deleting items currently linked to orders.

---

## 🩺 System Verification & Integrity

Run the system diagnostics utility to verify that directories, Next.js page routes, and core package dependencies are correctly aligned:
```bash
node src/diagnostics.js
```
This utility will return `0 errors` if the environment is healthy.
