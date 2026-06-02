"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, User } from "lucide-react";
import { useUIStore } from "@/src/store/useUIStore";
import { useTheme } from "@/src/store/useThemeStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import MegaMenu from "./MegaMenu";

const navLinks = [
  { name: "Inside", href: "/#hub" },
  { name: "Protection", href: "/#cases" },
  { name: "Community", href: "/#community" },
  { name: "Stories", href: "/#clients" },
  { name: "About", href: "/#about" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleSearch = useUIStore((state) => state.toggleSearch);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const { theme, toggleTheme, mounted } = useTheme();
  
  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 glass transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "h-[60px]" : "h-[72px]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full flex items-center justify-between">
          
          {/* Left Side: Brand Logo */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center p-2 -ml-2 text-brand-black dark:text-white hover:text-brand-gold transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-1 group">
              <div 
                className={`relative overflow-hidden shrink-0 flex items-center justify-center -ml-3 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  scrolled ? "w-12 h-12" : "w-14 h-14"
                }`}
              >
                <img 
                  src="/logo-new.png" 
                  className="w-full h-full object-contain scale-[1.8]" 
                  alt="Maharlika Republic Logo" 
                />
              </div>
              <div className="flex flex-col justify-center leading-none mt-0.5 hidden sm:flex -ml-1">
                <span className="font-heading font-extrabold text-[15px] uppercase tracking-wider text-brand-gold transition-colors leading-[1.1]">
                  Maharlika
                </span>
                <span className="font-heading font-extrabold text-[15px] uppercase tracking-wider text-brand-gold transition-colors leading-[1.1]">
                  Republic
                </span>
              </div>
            </Link>
          </div>
   
          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex flex-1 justify-center relative items-center space-x-8 xl:space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-[14px] font-medium tracking-[-0.01em] text-brand-black/90 dark:text-white/90 hover:text-brand-gold dark:hover:text-brand-gold transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>
   
          {/* Right Side: Icons */}
          <div className="flex items-center justify-end space-x-3 xl:space-x-4">
            
            {/* Theme Toggle Switch */}
            {mounted && (
              <button 
                onClick={toggleTheme} 
                className={`relative mx-2 w-10 h-6 flex items-center rounded-full transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#2A2C30]' : 'bg-gray-200 border border-gray-300'
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

            {user ? (
              <Link href="/account" className="p-2 text-brand-black dark:text-white hover:text-brand-gold transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px]">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="p-2 text-brand-black dark:text-white hover:text-brand-gold transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px]">
                <User className="w-5 h-5" />
              </button>
            )}

            <button onClick={toggleSearch} className="p-2 text-brand-black dark:text-white hover:text-brand-gold transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px]">
              <Search className="w-5 h-5" />
            </button>
            
            <button onClick={toggleCart} className="p-2 text-brand-black dark:text-white hover:text-brand-gold transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[1px] relative">
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
