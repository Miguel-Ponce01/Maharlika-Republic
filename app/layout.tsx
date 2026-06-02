import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchOverlay from "@/components/ui/SearchOverlay";
import CartDrawer from "@/components/cart/CartDrawer";
import ThemeProvider from "@/components/theme/ThemeProvider";
import InteractiveGridBackground from "@/components/ui/InteractiveGridBackground";
import AuthProvider from "@/components/auth/AuthProvider";
import AuthModal from "@/components/auth/AuthModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit" });
const ladyrose = localFont({ src: "../public/fonts/Ladyrose.otf", variable: "--font-ladyrose" });

export const metadata: Metadata = {
  metadataBase: new URL("https://maharlikarepublic.vercel.app"),
  title: "Maharlika Republic — Premium Apple Devices in Davao",
  description: "Davao City's premier destination for genuine Apple gadgets and accessories. Shop iPhone, iPad, Mac, AirPods with flexible financing — Paluwagan, Lay-Away, Skyro, Salmon, GCash & COD.",
  keywords: ["Apple", "iPhone", "iPad", "MacBook", "Davao", "gadget shop", "Maharlika Republic", "Marexx Republic", "Bajada"],
  openGraph: {
    title: "Maharlika Republic — Premium Apple Devices in Davao",
    description: "Premium Apple devices with flexible financing. Paluwagan, Lay-Away, Skyro, GCash, COD. Visit our Bajada showroom.",
    url: "https://maharlikarepublic.vercel.app",
    siteName: "Maharlika Republic",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maharlika Republic — Premium Apple Devices",
    description: "Genuine Apple gadgets with flexible financing in Davao City.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${ladyrose.variable} font-sans antialiased bg-brand-white text-brand-black transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider />
          <AuthModal />
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
