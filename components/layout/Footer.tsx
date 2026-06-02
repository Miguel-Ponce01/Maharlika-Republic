"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Send } from "lucide-react";

export default function Footer() {
  const shopApple = [
    { name: "iPhone", href: "/products?type=iPhone" },
    { name: "iPad", href: "/products?type=iPad" },
    { name: "Mac", href: "/products?type=Mac" },
    { name: "Apple Watch", href: "/products?type=Apple Watch" },
    { name: "AirPods", href: "/products?type=AirPods & Earphones" },
    { name: "Chargers & Cables", href: "/products?type=Chargers & Cables" },
    { name: "Apple Accessories", href: "/products?type=Accessories" }
  ];

  const shopCategories = [
    { name: "Audio", href: "/products?type=AirPods & Earphones" },
    { name: "Bags & Sleeves", href: "/products?type=Accessories" },
    { name: "Cases & Protection", href: "/products?type=Accessories" },
    { name: "Input Devices", href: "/products?type=Accessories" },
    { name: "Watch Bands", href: "/products?type=Accessories" },
    { name: "Location Tracker", href: "/products?type=Chargers & Cables" }
  ];

  const support = [
    { name: "Store Locator", href: "/#map" },
    { name: "Payment Options", href: "/payment-options" },
    { name: "Warranty Policy", href: "/products" },
    { name: "Privacy Statement", href: "/products" },
    { name: "Terms of Use", href: "/products" }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing to Maharlika Republic newsletter!");
  };

  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#E4ECE8] dark:bg-[#111214] text-brand-black/80 dark:text-white/80 border-t border-brand-border/60 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Top Section: Brand Info + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-brand-border/60">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="relative w-14 h-14 overflow-hidden shrink-0 flex items-center justify-center -ml-2">
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
              <span className="font-heading font-extrabold text-xl uppercase tracking-wider text-brand-black dark:text-white group-hover:text-brand-gold transition-colors">
                Maharlika <span className="text-brand-gold">Republic</span>
              </span>
            </Link>
            <p className="text-xs text-brand-textMuted max-w-xl leading-relaxed">
              Maharlika Republic (Marexx Republic) is Davao City&apos;s premier reseller of pre-owned and brand-new Apple devices. Enjoy high-quality gadget inspection, store warranty, and flexible financing.
            </p>
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.facebook.com/marexxrepublicdavao" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-black dark:text-white hover:text-brand-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/marexxrepublic" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-black dark:text-white hover:text-brand-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-brand-black dark:text-white">
              Subscribe to our newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                required
                className="flex-grow p-3 rounded-xl border border-brand-border bg-brand-white dark:bg-black/20 text-xs text-brand-black dark:text-white focus:outline-none"
              />
              <button 
                type="submit"
                className="px-5 bg-brand-black text-brand-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-xl flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12">
          
          {/* Col 1: Shop Apple */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-brand-black dark:text-white">
              Shop Apple
            </h4>
            <ul className="space-y-2.5">
              {shopApple.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-brand-textMuted hover:text-brand-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Shop Categories */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-brand-black dark:text-white">
              Shop Categories
            </h4>
            <ul className="space-y-2.5">
              {shopCategories.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-brand-textMuted hover:text-brand-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-brand-black dark:text-white">
              Support
            </h4>
            <ul className="space-y-2.5 grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2.5">
              {support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-brand-textMuted hover:text-brand-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="mt-16 pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-brand-textMuted">
          <p>© {new Date().getFullYear()} MAHARLIKA REPUBLIC. Davao Wisdom Building, F. Torres Street, Davao City.</p>
          <p className="uppercase font-bold tracking-widest text-brand-gold">Genuine Service & Support</p>
        </div>

      </div>
    </footer>
  );
}
