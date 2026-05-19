"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";

const navLinks = [
  { name: "Mac", href: "/category/mac" },
  { name: "iPhone", href: "/category/iphone" },
  { name: "iPad", href: "/category/ipad" },
  { name: "Accessories", href: "/category/accessories" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const toggleCart = useUIStore((state) => state.toggleCart);

  return (
    <header className="fixed top-0 w-full z-40 glass">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl tracking-tight">
          Maharlika <span className="text-brand-gold">Republic</span>
        </Link>

        <nav className="hidden md:flex relative items-center space-x-1" onMouseLeave={() => setHoveredIndex(null)}>
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-brand-gold z-10"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {link.name}
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-black/5 rounded-full -z-10"
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

        <div className="flex items-center space-x-4">
          <button onClick={toggleSearch} className="p-2 hover:text-brand-gold transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={toggleCart} className="p-2 hover:text-brand-gold transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
