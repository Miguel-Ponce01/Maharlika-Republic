import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SearchOverlay from "@/components/ui/SearchOverlay";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "Maharlika Republic",
  description: "Davao City's premier destination for high-end Apple gadgets and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-brand-white text-brand-black`}>
        <Navbar />
        <SearchOverlay />
        <CartDrawer />
        <main>{children}</main>
      </body>
    </html>
  );
}
