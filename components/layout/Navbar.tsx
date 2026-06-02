"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Sun, Moon, Menu, User } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";
import { useTheme } from "@/src/store/useThemeStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import MegaMenu from "./MegaMenu";

const navLinks = [
  { name: "Inside Maharlika", href: "/#hub" },
  { name: "Cases & Protection", href: "/#cases" },
  { name: "Offers", href: "/#offers" },
  { name: "Our Clients", href: "/#clients" },
  { name: "Our Community", href: "/#community" },
  { name: "About Us", href: "/#about" },
  { name: "Location", href: "/#map" }
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const { theme, toggleTheme, mounted } = useTheme();
  
  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;


  return (
    <>
      <header className="fixed top-0 w-full z-40 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Left Side: Drawer Trigger + Brand Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-2 -ml-2 text-brand-black/80 hover:text-brand-gold transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Menu</span>
            </button>
            <Link href="/" className="flex items-center gap-1.5 group">
              <div className="relative w-12 h-12 overflow-hidden shrink-0 flex items-center justify-center -ml-1">
                <img 
                  src="/logo.png" 
                  className="w-full h-full object-contain dark:hidden mix-blend-multiply scale-[1.7]" 
                  alt="Maharlika Republic Logo" 
                />
                <img 
                  src="/logo-black.jpg" 
                  className="w-full h-full object-contain hidden dark:block mix-blend-screen scale-[1.7]" 
                  alt="Maharlika Republic Logo" 
                />
              </div>
              <span className="font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-brand-black group-hover:text-brand-gold transition-colors">
                Maharlika <span className="text-brand-gold">Republic</span>
              </span>
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
            {user ? (
              <Link href="/account" className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors">
                <User className="w-5 h-5" />
              </button>
            )}
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

      {/* Mega Menu Dropdown */}
      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
