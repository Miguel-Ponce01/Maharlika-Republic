import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchOverlay from "@/components/ui/SearchOverlay";
import CartDrawer from "@/components/cart/CartDrawer";
import ThemeProvider from "@/components/theme/ThemeProvider";
import InteractiveGridBackground from "@/components/ui/InteractiveGridBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit" });

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
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-brand-white text-brand-black transition-colors duration-300`}>
        <ThemeProvider>
          <InteractiveGridBackground />
          <Navbar />
          <SearchOverlay />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
