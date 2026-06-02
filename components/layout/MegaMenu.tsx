"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Headphones, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Facebook, 
  Video,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const appleLinks = [
    { name: "iPhone", href: "/products?type=iPhone", icon: Smartphone },
    { name: "iPad", href: "/products?type=iPad", icon: Tablet },
    { name: "Mac", href: "/products?type=Mac", icon: Laptop },
    { name: "Apple Watch", href: "/products?type=Apple Watch", icon: Watch },
    { name: "AirPods & Audio", href: "/products?type=AirPods & Earphones", icon: Headphones }
  ];

  const categoryLinks = [
    { name: "Audio", href: "/products?type=AirPods & Earphones" },
    { name: "Bags & Sleeves", href: "/products?type=Accessories" },
    { name: "Cases & Protection", href: "/products?type=Accessories" },
    { name: "Input Devices", href: "/products?type=Accessories" },
    { name: "Power & Cables", href: "/products?type=Chargers & Cables" },
    { name: "Watch Bands", href: "/products?type=Accessories" },
    { name: "Location Tracker", href: "/products?type=Chargers & Cables" },
  ];

  const supportLinks = [
    { name: "Store Locator", href: "/#map", icon: MapPin },
    { name: "Payment Options", href: "/payment-options", icon: CreditCard },
    { name: "Warranty Policy", href: "/products", icon: ShieldCheck },
    { name: "Message on Facebook", href: "https://www.facebook.com/messages/t/marexxrepublicdavao", icon: Facebook },
    { name: "Follow on TikTok", href: "https://www.tiktok.com/@marexxrepublic", icon: Video }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm mt-16"
          />

          {/* Mega Menu Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-16 left-0 w-full z-50 bg-white dark:bg-[#121416] border-b border-brand-border shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                
                {/* Column 1: Apple Devices */}
                <div className="space-y-5">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-widest text-brand-gold border-b border-brand-border/40 pb-2">
                    Apple Devices
                  </h3>
                  <ul className="space-y-3">
                    {appleLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <li key={link.name}>
                          <Link 
                            href={link.href}
                            onClick={onClose}
                            className="group flex items-center gap-3 text-brand-black dark:text-white hover:text-brand-gold transition-colors text-sm font-semibold"
                          >
                            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors text-brand-textMuted">
                              <Icon className="w-4 h-4" />
                            </div>
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Column 2: Categories */}
                <div className="space-y-5">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-widest text-brand-gold border-b border-brand-border/40 pb-2">
                    Accessories
                  </h3>
                  <ul className="space-y-3">
                    {categoryLinks.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          onClick={onClose}
                          className="text-brand-black dark:text-white hover:text-brand-gold transition-colors text-sm font-semibold flex items-center gap-1 group"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-brand-gold/0 group-hover:text-brand-gold -ml-4 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Support */}
                <div className="space-y-5">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-widest text-brand-gold border-b border-brand-border/40 pb-2">
                    Support
                  </h3>
                  <ul className="space-y-3">
                    {supportLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <li key={link.name}>
                          <Link 
                            href={link.href}
                            onClick={onClose}
                            className="group flex items-center gap-3 text-brand-black dark:text-white hover:text-brand-gold transition-colors text-sm font-semibold"
                          >
                            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors text-brand-textMuted">
                              <Icon className="w-4 h-4" />
                            </div>
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Column 4: Featured Actions */}
                <div className="space-y-5 bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-brand-border/60">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-widest text-brand-black dark:text-white">
                    Discover More
                  </h3>
                  <p className="text-xs text-brand-textMuted leading-relaxed">
                    Explore our full catalog of authentic Apple devices, verified accessories, and premium tech.
                  </p>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="w-full py-3 bg-brand-gold hover:bg-yellow-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    View All Products
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
