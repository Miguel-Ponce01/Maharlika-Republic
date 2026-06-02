"use client";

import { useState, useEffect, useRef } from "react";
import MaharlikaMap from "@/components/map/MaharlikaMap";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Award,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Users,
  Percent,
  Truck,
  Zap,
  ArrowRight,
  Shield,
  HeartHandshake,
  Facebook,
  ThumbsUp,
  Star
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductDetailsModal from "@/components/ui/ProductDetailsModal";
import MaharlikaHub from "@/components/ui/MaharlikaHub";
import OurClients from "@/components/ui/OurClients";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "next/navigation";

type ProductItem = {
  id: string;
  name: string;
  price: number;
  monthlyInstallment: number;
  image: string;
  type: string;
  brand: string;
  compatibility: string;
  specs: string;
  variantId: number;
  maxStock: number;
};

const FACEBOOK_REVIEWS = [
  {
    name: "Glyd Joy Roder Yba",
    initials: "GJ",
    date: "February 12",
    text: "Highly recommended. Friendly and helpful staff 😊",
    avatarBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  },
  {
    name: "Toni Png",
    initials: "TP",
    date: "December 9, 2023",
    text: "This is my first time buying from this shop and as expected, service and delivery were excellent. For the record, this is the only shop in Davao that accepts Skyro, lay-away and cash on delivery all at the same time. Highly recommended.",
    avatarBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    name: "Rex Max Mandantes",
    initials: "RM",
    date: "November 30, 2023",
    text: "Got my new iPhone 14 Pro Max. Thank you for the smooth transaction! Long years savings has finally paid off. Perfect model, battery to styling. Loving it! Highly recommended! 👍",
    avatarBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
  },
  {
    name: "Vivaldi Vianca",
    initials: "VV",
    date: "November 5, 2023",
    text: "Very accommodated staff. Responsive, trusted, fast transaction. Fast upgrade process. Highly recommended.",
    avatarBg: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
  },
  {
    name: "Marion Lecka Dela Torre",
    initials: "ML",
    date: "October 29, 2023",
    text: "Just got my iPhone 13 Pro Max. Thank you for the smooth transaction 😊",
    avatarBg: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
  },
  {
    name: "Austin Mark",
    initials: "AM",
    date: "October 10, 2023",
    text: "I recently upgraded to the new iPhone 15 Pro Max. Friendly staff, great deals, and they helped me find the perfect accessories for my new phone. The service was fast, and I am feeling confident with my purchase. Highly recommended.",
    avatarBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
  }
];

export default function Home() {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [bestItems, setBestItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = useAuthStore((state) => state.user);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const router = useRouter();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    setDragDistance(Math.abs(walk));
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    async function fetchBestItems() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          const mapped = data.products.slice(0, 5).map((p: any) => {
            const variant = p.variants?.[0] || {};
            const specsStr = [variant.storageCapacity, variant.colorSpec].filter(Boolean).join(", ");
            return {
              id: p.systemMetadata?.id || p.modelName.toLowerCase().replace(/\s+/g, '-'),
              name: p.modelName,
              price: variant.priceCents ? variant.priceCents / 100 : 0,
              monthlyInstallment: p.systemMetadata?.monthlyInstallment || 0,
              image: variant.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400",
              type: p.systemMetadata?.type || p.categoryType,
              brand: p.brandName,
              compatibility: p.systemMetadata?.compatibility || "",
              specs: specsStr || "Standard",
              variantId: variant.id || 0,
              maxStock: variant.stockOnHand || 0,
            };
          });
          setBestItems(mapped);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBestItems();
  }, []);

  const handleBestItemClick = (item: ProductItem) => {
    if (dragDistance > 10) return; // Prevent click if dragged
    setSelectedProduct(item);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(value);
  };


  const shopApple = [
    { name: "iPhone", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop", href: "/products?type=iPhone" },
    { name: "iPad", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400&auto=format&fit=crop", href: "/products?type=iPad" },
    { name: "Apple Watch", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=400&auto=format&fit=crop", href: "/products?type=Apple Watch" },
    { name: "Mac", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop", href: "/products?type=Mac" },
    { name: "AirPods", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=400&auto=format&fit=crop", href: "/products?type=AirPods & Earphones" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400&auto=format&fit=crop", href: "/products?type=Accessories" }
  ];

  const casesAndProtection = [
    { name: "iPhone Protection", image: "https://images.unsplash.com/photo-1581090700227-13617d98f4ae?q=80&w=400&auto=format&fit=crop", href: "/products?type=Accessories" },
    { name: "iPad Protection", image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=400&auto=format&fit=crop", href: "/products?type=Accessories" },
    { name: "MacBook Protection", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop", href: "/products?type=Accessories" },
    { name: "Watch Protection", image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=400&auto=format&fit=crop", href: "/products?type=Accessories" },
    { name: "AirPods Protection", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&auto=format&fit=crop", href: "/products?type=Accessories" },
    { name: "AirTag Protection", image: "https://images.unsplash.com/photo-1628202926206-c63a34b1618f?q=80&w=400&auto=format&fit=crop", href: "/products?type=Accessories" }
  ];

  const offers = [
    { title: "0% Lay-Away", desc: "Secure the item at today's price. Pay balance in 6 months interest-free.", action: "Inquire" },
    { title: "Paluwagan Plan", desc: "No credit cards required. Spread payments up to 10 months.", action: "Learn More" },
    { title: "Skyro & Salmon", desc: "In-store digital financing with just 1 primary government ID.", action: "Apply Now" },
    { title: "Credit Card Dues", desc: "Spread your order balance up to 24 months at 0% interest.", action: "Details" },
    { title: "GGives & Maya", desc: "Pay seamlessly with digital wallets right from your mobile.", action: "Check" },
    { title: "Straight Cash Cut", desc: "Receive 5% to 10% cash discount on premium Apple flagships.", action: "Save Cash" },
    { title: "Local Rider COD", desc: "Same-day rider delivery with cash-on-delivery in Davao.", action: "Shop COD" },
    { title: "Genuine Warranty", desc: "Full 1-year store diagnostic coverage on all brand new units.", action: "Verify" }
  ];

  const financingSchemes = [
    {
      title: "Paluwagan Scheme",
      desc: "Own your Apple device with simple monthly contributions. Installments up to 10 months with no credit card required. Simple and reliable.",
      icon: Users,
      bullets: [
        "Up to 10 months flexible term",
        "No credit card required",
        "Simple identification checks",
        "Perfect for students and budget-conscious buyers"
      ]
    },
    {
      title: "0% Lay-Away Plan",
      desc: "Lock in your device with a flexible downpayment, and pay the remaining balance at your own pace. 100% interest-free.",
      icon: Percent,
      bullets: [
        "100% interest-free payments",
        "Secure the device at today's price",
        "No fixed monthly dues pressure",
        "Lock term up to 6 months"
      ]
    },
    {
      title: "Digital Financing",
      desc: "Instant approval in-store via trusted local partners: Skyro, Salmon, and GCash GGives. Minimal requirements needed.",
      icon: ShieldCheck,
      bullets: [
        "In-store processing under 15 minutes",
        "Minimal requirement check (1 Valid ID)",
        "Partnered with Skyro, Salmon, & GGives",
        "Flexible repayment terms"
      ]
    },
    {
      title: "Credit Card Installments",
      desc: "Easy credit options supporting all major credit cards. Spread out your payments over flexible terms up to 24 months.",
      icon: CreditCard,
      bullets: [
        "Accepts all major local credit cards",
        "Flexible terms (3, 6, 12, or 24 months)",
        "0% interest terms available",
        "Instant transaction processing"
      ]
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-brand-white text-brand-black transition-colors duration-300">
      
      {/* 1. HERO SPOTLIGHT (Floating Luxury Dark Card) */}
      <section className="py-12 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="bg-[#121416] text-white rounded-3xl p-8 md:p-16 relative overflow-hidden border border-white/[0.08] shadow-2xl shadow-brand-gold/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 max-w-lg text-center md:text-left"
            >
              <motion.h3 
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.15em" }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-brand-gold text-xs font-bold uppercase tracking-widest"
              >
                SPOTLIGHT FEATURE
              </motion.h3>
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tighter leading-tight">
                Fast runs in the family.
              </h1>
              <p className="text-2xl text-gray-400 font-medium">MacBook Pro</p>
              <div className="flex justify-center md:justify-start gap-4 mt-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    onClick={() => {
                      if (user) {
                        router.push("/products?type=Mac");
                      } else {
                        setAuthModalOpen(true);
                      }
                    }}
                    className="px-6 py-3 bg-brand-gold hover:bg-yellow-600 text-white rounded-full font-medium transition-colors shadow-lg shadow-brand-gold/15 inline-block"
                  >
                    Shop MacBook Pro
                  </button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <motion.img 
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop" 
                alt="MacBook Pro mockup" 
                className="max-h-[350px] object-contain drop-shadow-[0_25px_25px_rgba(180,124,46,0.15)]"
              />
            </motion.div>
          </div>
          {/* Ambient Glow Inside Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none" />
        </div>
      </section>

      {/* 2. CONSOLIDATED VALUE PROPOSITION ROW */}
      <section className="py-12 bg-brand-white border-b border-brand-border px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            <div className="relative shrink-0 select-none pb-2">
              {/* Decorative Ribbon Tails */}
              <svg className="absolute top-[34px] left-1/2 -translate-x-1/2 w-8 h-6 text-brand-gold/70 drop-shadow-[0_2px_3px_rgba(0,0,0,0.1)]" viewBox="0 0 32 24" fill="currentColor">
                <path d="M10 0 L4 22 L10 18.5 L16 22 Z" />
                <path d="M22 0 L16 22 L22 18.5 L28 22 Z" />
              </svg>
              {/* Scalloped Gold Seal */}
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-brand-gold to-yellow-600 shadow-md shadow-brand-gold/20 text-neutral-900 border border-amber-200/30">
                <div className="absolute inset-[2.5px] rounded-full border border-dashed border-white/50" />
                <div className="absolute inset-[4.5px] rounded-full border border-white/20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30" />
                <Award className="w-5 h-5 text-neutral-950 relative z-10 drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-sm text-brand-black uppercase tracking-wider">Authentic Apple Products</h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                100% inspected and certified pre-owned or brand-new devices with complete store diagnostic warranty.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 border-y md:border-y-0 md:border-x border-brand-border py-8 md:py-0 md:px-8">
            <div className="relative shrink-0 select-none pb-2">
              {/* Decorative Ribbon Tails */}
              <svg className="absolute top-[34px] left-1/2 -translate-x-1/2 w-8 h-6 text-brand-gold/70 drop-shadow-[0_2px_3px_rgba(0,0,0,0.1)]" viewBox="0 0 32 24" fill="currentColor">
                <path d="M10 0 L4 22 L10 18.5 L16 22 Z" />
                <path d="M22 0 L16 22 L22 18.5 L28 22 Z" />
              </svg>
              {/* Scalloped Gold Seal */}
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-brand-gold to-yellow-600 shadow-md shadow-brand-gold/20 text-neutral-900 border border-amber-200/30">
                <div className="absolute inset-[2.5px] rounded-full border border-dashed border-white/50" />
                <div className="absolute inset-[4.5px] rounded-full border border-white/20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30" />
                <ShieldCheck className="w-5 h-5 text-neutral-950 relative z-10 drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-sm text-brand-black uppercase tracking-wider">Flexible Payments</h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Choose Salmon, Skyro, Paluwagan installment programs, GCash, Maya, cards, or Cash on Delivery.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            <div className="relative shrink-0 select-none pb-2">
              {/* Decorative Ribbon Tails */}
              <svg className="absolute top-[34px] left-1/2 -translate-x-1/2 w-8 h-6 text-brand-gold/70 drop-shadow-[0_2px_3px_rgba(0,0,0,0.1)]" viewBox="0 0 32 24" fill="currentColor">
                <path d="M10 0 L4 22 L10 18.5 L16 22 Z" />
                <path d="M22 0 L16 22 L22 18.5 L28 22 Z" />
              </svg>
              {/* Scalloped Gold Seal */}
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-brand-gold to-yellow-600 shadow-md shadow-brand-gold/20 text-neutral-900 border border-amber-200/30">
                <div className="absolute inset-[2.5px] rounded-full border border-dashed border-white/50" />
                <div className="absolute inset-[4.5px] rounded-full border border-white/20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30" />
                <Clock className="w-5 h-5 text-neutral-950 relative z-10 drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-sm text-brand-black uppercase tracking-wider">Davao Showroom</h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Visit our physical outlet at Bajada, F. Torres St. Open daily 10AM - 9PM with hands-on assistance.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SHOP APPLE GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-heading font-extrabold tracking-tighter uppercase">Shop Apple</h2>
          <p className="text-xs text-brand-textMuted">Discover high-end pre-owned and brand-new items</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {shopApple.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-brand-card border border-brand-border flex items-end p-4 shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              <div className="relative z-10 w-full flex justify-between items-center text-white">
                <span className="font-heading font-bold text-sm tracking-tight">{item.name}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>



      {/* 5. BEST FROM THE BOX SLIDER */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-heading font-bold uppercase tracking-tighter">BEST FROM THE BOX</h2>
              <p className="text-xs text-brand-textMuted">Top picks this week</p>
            </div>
            <Link href="/products" className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-6 overflow-x-auto pb-4 scrollbar-none min-h-[300px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {loading ? (
              <div className="flex w-full items-center justify-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
                <div className="w-5 h-5 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin"></div>
                Loading best items...
              </div>
            ) : (
              bestItems.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
                  key={item.name} 
                  onClick={() => handleBestItemClick(item)}
                  className="w-64 bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col justify-between shrink-0 hover:shadow-lg transition-all group active:scale-[0.98] duration-300"
                >
                  <div className="aspect-square w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden relative flex items-center justify-center p-4 select-none pointer-events-none">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-brand-black text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
                        Quick View
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 select-none">
                    <h3 className="font-heading font-bold text-sm tracking-tight text-brand-black group-hover:text-brand-gold transition-colors">{item.name}</h3>
                    <p className="text-xs font-bold text-brand-gold">{formatPrice(item.price)}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>



      {/* 7. INTERACTIVE MAHARLIKA HUB */}
      <MaharlikaHub />

      {/* 8. CASES & PROTECTION GRID */}
      <section id="cases" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-heading font-extrabold tracking-tighter uppercase">Cases & Protection</h2>
          <p className="text-xs text-brand-textMuted">Stunning armor for your Apple items</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {casesAndProtection.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-brand-card border border-brand-border flex items-end p-4 shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              <div className="relative z-10 w-full flex justify-between items-center text-white">
                <span className="font-heading font-bold text-sm tracking-tight">{item.name}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. DON'T MISS OUT ON OFFERS */}
      <section id="offers" className="py-20 px-6 bg-neutral-50 dark:bg-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-heading font-bold uppercase tracking-tighter">Don&apos;t miss out on these offers!</h2>
            <p className="text-xs text-brand-textMuted">Tailored acquisition layouts for every client</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {offers.map((offer) => (
              <div 
                key={offer.title} 
                className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm text-brand-black">{offer.title}</h3>
                  <p className="text-[11px] text-brand-textMuted leading-relaxed">{offer.desc}</p>
                </div>
                <button 
                  onClick={() => {
                    const idx = financingSchemes.findIndex(s => s.title.includes(offer.title.split(" ")[0]));
                    if (idx !== -1) setActiveStory(idx);
                    else alert(`Inquire for ${offer.title} via Messenger at Facebook.com/marexxrepublicdavao`);
                  }}
                  className="text-left text-[10px] font-bold text-brand-gold hover:underline uppercase tracking-wider"
                >
                  {offer.action} &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TIKTOK BANNER */}
      <section className="py-12 bg-[#BFCBC4] dark:bg-[#1C1F22] text-brand-black dark:text-white text-center px-6 border-y border-brand-border/40">
        <div className="max-w-xl mx-auto space-y-4">
          <h3 className="font-heading font-bold text-lg tracking-tight uppercase">Follow Maharlika Republic on TikTok</h3>
          <p className="text-xs text-brand-black/75 dark:text-brand-textMuted">
            Get daily updates on arrivals, legitness check tutorials, and customer upgrade testimonials.
          </p>
          <a 
            href="https://www.tiktok.com/@marexxrepublic" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block px-6 py-2.5 bg-brand-black dark:bg-brand-gold text-white hover:bg-gray-800 dark:hover:bg-yellow-600 transition-colors rounded-full font-bold text-xs uppercase shadow-sm"
          >
            Follow @marexxrepublic
          </a>
        </div>
      </section>

      {/* OUR CLIENTS SECTION */}
      <OurClients />

      {/* 11. COMMUNITY RECOMMENDATIONS & REVIEWS */}
      <section id="community" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] bg-brand-gold/15 text-brand-gold font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Verified Customer Reviews
          </span>
          <h2 className="text-3xl font-heading font-extrabold tracking-tighter uppercase">
            Loved by our Community
          </h2>
          <p className="text-xs text-brand-textMuted max-w-lg mx-auto leading-relaxed">
            See why Apple device enthusiasts in Davao City trust Maharlika Gadgets. Real feedback straight from our active Facebook recommendation page.
          </p>
        </div>

        {/* Facebook-style Recommendations Bar */}
        <div className="bg-white/70 backdrop-blur-md border border-brand-border/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm shadow-brand-gold/5">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="p-4 bg-brand-gold/10 rounded-2xl text-brand-gold flex items-center justify-center">
              <Facebook className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <h3 className="font-heading font-extrabold text-lg text-brand-black leading-snug">
                100% Recommend
              </h3>
              <p className="text-xs text-brand-textMuted font-semibold mt-0.5">
                Based on 385+ recommendations on Facebook
              </p>
            </div>
          </div>

          <div className="bg-white border border-brand-border/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shadow-sm">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-brand-black/90">
              Do you recommend Maharlika Gadgets?
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href="https://www.facebook.com/marexxrepublicdavao/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-gold hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm shadow-brand-gold/10 active:scale-95 uppercase tracking-wider"
              >
                <ThumbsUp className="w-3.5 h-3.5 fill-current" />
                <span>Yes</span>
              </a>
              <a
                href="https://www.facebook.com/marexxrepublicdavao/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-brand-black border border-brand-border/50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95"
              >
                <span>No</span>
              </a>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACEBOOK_REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm border border-brand-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-brand-gold/20 transition-all duration-300 relative group"
            >
              {/* Facebook Icon watermark */}
              <Facebook className="absolute top-6 right-6 w-4 h-4 text-[#1877F2]/20 group-hover:text-[#1877F2]/40 transition-colors" />

              <div className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm tracking-tight ${review.avatarBg}`}>
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight text-brand-black">{review.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">{review.date}</span>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-[10px] text-[#1877F2] font-semibold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 fill-current text-white bg-[#1877F2] rounded-full" />
                        recommends
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs md:text-sm text-brand-black/85 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* ABOUT US */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto border-t border-brand-border/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] bg-brand-gold/15 text-brand-gold font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="text-3xl font-heading font-extrabold tracking-tighter uppercase">About Maharlika Republic</h2>
            <p className="text-sm text-brand-textMuted leading-relaxed">
              Maharlika Republic was built on a simple vision: to provide the people of Davao City and neighboring regions with access to high-quality, authentic Apple products through flexible and inclusive payment methods. We believe that premium technology should be accessible without the burden of restrictive credit requirements.
            </p>
            <p className="text-sm text-brand-textMuted leading-relaxed">
              From our physical showroom in Bajada to our active online community, we pride ourselves on transparency, top-notch customer service, and an unwavering commitment to bringing the best gadgets closer to you.
            </p>
            <div className="pt-4">
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors">
                Discover Our Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <img src="/clients/pic1.jpg" alt="Maharlika Republic Showroom" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white">
                <p className="text-brand-black font-extrabold text-sm uppercase tracking-wider mb-1">Davao's Trusted Tech Hub</p>
                <p className="text-xs text-brand-textMuted">Located at F. Torres St, Bajada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. MAP & SHOWROOM LOCATOR */}
      <section id="map" className="py-20 px-6 border-t border-brand-border bg-brand-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4 tracking-tighter uppercase">Our Showroom Location</h2>
              <p className="text-xs text-brand-textMuted max-w-xl">
                Locate us in the heart of Bajada. Use the map controls to toggle between the <strong className="font-semibold text-brand-black">Macro View (City)</strong> and the <strong className="font-semibold text-brand-black">Indoor Layout</strong> of our Bajada hub.
              </p>
            </div>
            <div className="text-right hidden md:block shrink-0">
              <p className="font-medium text-brand-black">Davao Wisdom Building</p>
              <p className="text-xs text-brand-textMuted">F. Torres St, Bajada, Davao City</p>
            </div>
          </div>

          <MaharlikaMap />
        </div>
      </section>

      {/* 13. IMMERSIVE FINANCING STORY MODAL */}
      <AnimatePresence>
        {activeStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          >
            {/* Story Card Container */}
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-[420px] h-[720px] bg-black rounded-3xl border border-white/15 overflow-hidden flex flex-col justify-between"
            >
              {/* Progress Bars */}
              <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-30">
                {financingSchemes.map((_, i) => (
                  <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={
                        i < activeStory
                          ? { width: "100%" }
                          : i === activeStory
                            ? { width: "100%" }
                            : { width: "0%" }
                      }
                      transition={
                        i === activeStory
                          ? { duration: 8, ease: "linear" }
                          : { duration: 0.1 }
                      }
                      onAnimationComplete={() => {
                        if (i === activeStory) {
                          if (activeStory < financingSchemes.length - 1) {
                            setActiveStory(activeStory + 1);
                          } else {
                            setActiveStory(null);
                          }
                        }
                      }}
                      className="h-full bg-brand-gold"
                    />
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-8 right-6 z-30 p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Tap Zones for Quick Navigation */}
              <div className="absolute inset-x-0 top-16 bottom-24 z-20 flex">
                <div
                  onClick={() => {
                    if (activeStory > 0) setActiveStory(activeStory - 1);
                  }}
                  className="w-1/3 h-full cursor-w-resize"
                />
                <div
                  onClick={() => {
                    if (activeStory < financingSchemes.length - 1) {
                      setActiveStory(activeStory + 1);
                    } else {
                      setActiveStory(null);
                    }
                  }}
                  className="w-2/3 h-full cursor-e-resize"
                />
              </div>

              {/* Story Content Card */}
              <div className="flex-1 flex flex-col justify-center items-center text-center p-8 z-10 mt-12">
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 border-2 border-brand-gold/30 flex items-center justify-center text-brand-gold mb-8 shadow-lg shadow-brand-gold/5">
                  {(() => {
                    const Icon = financingSchemes[activeStory].icon;
                    return <Icon className="w-10 h-10" />;
                  })()}
                </div>

                <h3 className="text-3xl font-heading font-extrabold text-white mb-4 tracking-tighter">
                  {financingSchemes[activeStory].title}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed max-w-xs mb-8">
                  {financingSchemes[activeStory].desc}
                </p>

                {/* Bullets List */}
                <ul className="text-left space-y-3 max-w-xs mx-auto">
                  {financingSchemes[activeStory].bullets.map((bullet, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Story Bottom CTA Action */}
              <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                <a
                  href="https://www.facebook.com/marexxrepublicdavao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-4 bg-brand-gold hover:bg-yellow-600 text-white rounded-xl text-sm font-bold transition-all block shadow-lg shadow-brand-gold/10"
                >
                  Send Inquiry via Messenger
                </a>
              </div>

              {/* Subtle background overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black z-0" />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
}
