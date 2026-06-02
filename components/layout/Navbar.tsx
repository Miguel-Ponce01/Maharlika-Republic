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
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          
          {/* Left Side: Drawer Trigger + Brand Logo */}
          <div className="flex items-center space-x-3 md:space-x-5">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-2 -ml-2 text-brand-black/80 hover:text-brand-gold transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:block mt-0.5">Menu</span>
            </button>
            <Link href="/" className="flex items-center gap-1 group">
              <div className="relative w-14 h-14 overflow-hidden shrink-0 flex items-center justify-center -ml-3">
                <img 
                  src="/logo-new.png" 
                  className="w-full h-full object-contain scale-[1.8] drop-shadow-sm" 
                  alt="Maharlika Republic Logo" 
                />
              </div>
              <div className="flex flex-col justify-center leading-none mt-0.5 hidden sm:flex -ml-1">
                <span className="font-heading font-extrabold text-sm sm:text-[15px] uppercase tracking-wider text-brand-black group-hover:text-brand-gold transition-colors leading-[1.1]">
                  Maharlika
                </span>
                <span className="font-heading font-extrabold text-sm sm:text-[15px] uppercase tracking-wider text-brand-gold transition-colors leading-[1.1]">
                  Republic
                </span>
              </div>
            </Link>
          </div>
   
          <nav className="hidden lg:flex relative items-center space-x-1 xl:space-x-2" onMouseLeave={() => setHoveredIndex(null)}>
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-2.5 xl:px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-black/80 hover:text-brand-gold transition-colors z-10 whitespace-nowrap"
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {link.name}
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
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
            {user ? (
              <Link href="/account" className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
            
            {/* Theme Toggle Switch */}
            {mounted && (
              <button 
                onClick={toggleTheme} 
                className={`relative mx-2 w-10 h-6 flex items-center rounded-full transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-brand-gold' : 'bg-gray-200 border border-gray-300'
                }`}
                aria-label="Toggle Dark Mode"
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            )}

            <button onClick={toggleSearch} className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors">
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button onClick={toggleCart} className="p-2 text-brand-black/80 hover:text-brand-gold transition-colors relative">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-gold rounded-full border-2 border-brand-white"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu Dropdown */}
      <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
