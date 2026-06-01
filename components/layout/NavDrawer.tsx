"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Facebook, Instagram, ChevronRight, Smartphone, Laptop, Tablet, Watch, Headphones, Sparkles, HelpCircle } from "lucide-react";

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "apple" | "categories" | "support";

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("apple");

  const appleLinks = [
    { name: "iPhone", href: "/products?type=iPhone", icon: Smartphone },
    { name: "iPad", href: "/products?type=iPad", icon: Tablet },
    { name: "Mac", href: "/products?type=Mac", icon: Laptop },
    { name: "Apple Watch", href: "/products?type=Apple Watch", icon: Watch },
    { name: "AirPods & Earphones", href: "/products?type=AirPods & Earphones", icon: Headphones },
    { name: "All Products", href: "/products", icon: Sparkles }
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
    { name: "Store Locator", href: "/#map" },
    { name: "Payment Options", href: "/payment-options" },
    { name: "Warranty Policy", href: "/products" },
    { name: "Contact Us via Facebook", href: "https://www.facebook.com/messages/t/marexxrepublicdavao" },
    { name: "Follow on TikTok", href: "https://www.tiktok.com/@marexxrepublic" }
  ];

  const drawerVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 380, damping: 35 } },
    open: { x: 0, transition: { type: "spring", stiffness: 380, damping: 35 } }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            className="relative w-full max-w-sm h-full bg-[#f8f9fa] dark:bg-[#121416] text-brand-black dark:text-white flex flex-col justify-between shadow-2xl z-10 border-r border-brand-border/40"
          >
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Header: Title and Close button */}
              <div className="p-6 flex items-center justify-between border-b border-brand-border/40">
                <span className="font-heading font-extrabold uppercase tracking-widest text-xs">
                  Navigation Menu
                </span>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-brand-black dark:text-white" />
                </button>
              </div>

              {/* Capsule Navigation Tabs */}
              <div className="px-6 pt-6">
                <div className="flex bg-neutral-200/60 dark:bg-neutral-800/60 p-1 rounded-2xl gap-0.5 border border-brand-border/30">
                  <button 
                    onClick={() => setActiveTab("apple")}
                    className={`flex-1 text-center py-2.5 text-[9px] font-extrabold uppercase tracking-widest rounded-xl transition-all ${activeTab === "apple" ? "bg-white dark:bg-[#1A1C1E] text-brand-gold shadow-sm" : "text-brand-textMuted hover:text-brand-black dark:hover:text-white"}`}
                  >
                    Apple
                  </button>
                  <button 
                    onClick={() => setActiveTab("categories")}
                    className={`flex-1 text-center py-2.5 text-[9px] font-extrabold uppercase tracking-widest rounded-xl transition-all ${activeTab === "categories" ? "bg-white dark:bg-[#1A1C1E] text-brand-gold shadow-sm" : "text-brand-textMuted hover:text-brand-black dark:hover:text-white"}`}
                  >
                    Categories
                  </button>
                  <button 
                    onClick={() => setActiveTab("support")}
                    className={`flex-1 text-center py-2.5 text-[9px] font-extrabold uppercase tracking-widest rounded-xl transition-all ${activeTab === "support" ? "bg-white dark:bg-[#1A1C1E] text-brand-gold shadow-sm" : "text-brand-textMuted hover:text-brand-black dark:hover:text-white"}`}
                  >
                    Support
                  </button>
                </div>
              </div>

              {/* Scrollable Links panel */}
              <div className="flex-grow overflow-y-auto px-6 py-6 scrollbar-none">
                <div className="space-y-1">
                  
                  {/* Apple Links Tab */}
                  {activeTab === "apple" && appleLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={onClose}
                        className="group flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-brand-gold/[0.06] transition-all text-xs font-bold text-brand-black dark:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-neutral-200/40 dark:bg-neutral-800/40 rounded-xl group-hover:bg-brand-gold/10 group-hover:text-brand-gold transition-colors">
                            <IconComponent className="w-4 h-4 text-brand-textMuted group-hover:text-brand-gold transition-colors" />
                          </div>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {link.name}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-brand-gold transition-all duration-300" />
                      </Link>
                    );
                  })}

                  {/* Category Links Tab */}
                  {activeTab === "categories" && (
                    <>
                      {categoryLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={onClose}
                          className="group flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-brand-gold/[0.06] transition-all text-xs font-bold text-brand-black dark:text-white"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {link.name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-brand-gold transition-all duration-300" />
                        </Link>
                      ))}
                      
                      <div className="pt-4 border-t border-brand-border/40 mt-4">
                        <Link
                          href="/products"
                          onClick={onClose}
                          className="flex items-center justify-center gap-2 py-3.5 px-4 bg-brand-black hover:bg-neutral-800 text-white rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md shadow-brand-black/5"
                        >
                          View All Products
                        </Link>
                      </div>
                    </>
                  )}

                  {/* Support Links Tab */}
                  {activeTab === "support" && supportLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={onClose}
                      className="group flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-brand-gold/[0.06] transition-all text-xs font-bold text-brand-black dark:text-white"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-brand-gold transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom footer with social links */}
              <div className="p-6 border-t border-brand-border/40 flex items-center justify-between">
                <span className="text-[9px] font-bold text-brand-textMuted uppercase tracking-widest">
                  Maharlika Republic Davao
                </span>
                <div className="flex gap-2">
                  <a 
                    href="https://facebook.com/marexxrepublicdavao" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-full border border-brand-border/50 hover:border-brand-gold hover:text-brand-gold transition-all duration-300 hover:scale-105 bg-white dark:bg-neutral-800 text-brand-black dark:text-white"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.instagram.com/marexxrepublic" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 rounded-full border border-brand-border/50 hover:border-brand-gold hover:text-brand-gold transition-all duration-300 hover:scale-105 bg-white dark:bg-neutral-800 text-brand-black dark:text-white"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
