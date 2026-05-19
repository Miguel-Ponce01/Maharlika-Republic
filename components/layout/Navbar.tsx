"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Sun, Moon, Menu } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";
import { useTheme } from "@/src/store/useThemeStore";
import NavDrawer from "./NavDrawer";

const navLinks = [
  { name: "All Products", href: "/products" },
  { name: "Mac", href: "/products?type=Mac" },
  { name: "iPhone", href: "/products?type=iPhone" },
  { name: "iPad", href: "/products?type=iPad" },
  { name: "Accessories", href: "/products?type=Accessories" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const { theme, toggleTheme, mounted } = useTheme();


  return (
    <>
      <header className="fixed top-0 w-full z-40 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Left Side: Drawer Trigger + Brand Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 -ml-2 text-brand-black/80 hover:text-brand-gold transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="font-heading font-extrabold text-lg uppercase tracking-wider text-brand-black">
              Maharlika <span className="text-brand-gold">Republic</span>
            </Link>
          </div>
   
          <nav className="hidden md:flex relative items-center space-x-2" onMouseLeave={() => setHoveredIndex(null)}>
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-black/80 hover:text-brand-gold transition-colors z-10"
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {link.name}
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 dark:bg-white/5 border border-white/5 rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>
   
          <div className="flex items-center space-x-2">
            <button onClick={toggleSearch} className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={toggleCart} className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide Navigation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
