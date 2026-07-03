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
  ChevronLeft,
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

const HERO_PRODUCTS = [
  {
    name: "Premium MacBook Colorway",
    title: "Vibrant Colors.",
    tagline: "Starlight, Midnight, Silver, & Space Gray",
    description: "Four stunning finishes. Crafted from 100% recycled aluminum. Designed to fit your aesthetic perfectly, without any background distractions.",
    image: "/hero/mac5-removebg-preview.png",
    glowColor: "rgba(212, 175, 55, 0.15)",
    buttonText: "Explore Colors",
  },
  {
    name: "MacBook Pro Sleek Profile",
    title: "Sleek Profile.",
    tagline: "Unbelievably Thin. Remarkably Powerful.",
    description: "Built for mobility and performance. Features a robust aluminum enclosure with support for dual external displays and versatile ports.",
    image: "/hero/mac2-removebg-preview.png",
    glowColor: "rgba(100, 116, 139, 0.15)",
    buttonText: "View Specs",
  },
  {
    name: "Apple Silicon M5 Chip",
    title: "Next-Gen M5.",
    tagline: "Supercharged for Artificial Intelligence.",
    description: "The next major milestone in Apple Silicon. Unprecedented CPU, GPU, and Neural Engine processing power built directly into the core.",
    image: "/hero/mac1-removebg-preview.png",
    glowColor: "rgba(20, 184, 166, 0.18)",
    buttonText: "Discover M5",
  },
  {
    name: "Liquid Retina Display",
    title: "Brilliant Screen.",
    tagline: "1 Billion Colors. Immersive Liquid Retina.",
    description: "Pristine visual clarity with thin borders, high contrast, and up to 500 nits of brightness. Rendering every pixel with lifelike precision.",
    image: "/hero/mac3-removebg-preview.png",
    glowColor: "rgba(59, 130, 246, 0.15)",
    buttonText: "See Display Tech",
  },
  {
    name: "Magic Keyboard Layout",
    title: "Magic Keyboard.",
    tagline: "Comfortable, Quiet, & Responsive.",
    description: "Features a full-height function row, Touch ID for secure authentication, and a scissor mechanism for the ultimate typing experience.",
    image: "/hero/mac4-removebg-preview.png",
    glowColor: "rgba(168, 85, 247, 0.15)",
    buttonText: "Test Keyboard",
  }
];

export default function Home() {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [bestItems, setBestItems] = useState<ProductItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play hero products slideshow (pauses when hovered)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_PRODUCTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

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
    async function fetchLandingPageProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          const mapProduct = (p: any) => {
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
          };

          // Filter for Best From The Box
          let bestProducts = data.products.filter((p: any) => p.systemMetadata?.isBestFromBox === true);
          if (bestProducts.length === 0) {
            bestProducts = data.products.slice(0, 5);
          }
          setBestItems(bestProducts.map(mapProduct));

          // Filter for Featured Grid
          const featuredProducts = data.products.filter((p: any) => p.systemMetadata?.showOnLandingPage === true);
          setFeaturedItems(featuredProducts.map(mapProduct));
        }
      } catch (err) {
        console.error("Failed to load products for landing page", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLandingPageProducts();
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
    { name: "Apple Watch", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=400&auto=format&fit=crop", href: "/products?type=Apple%20Watch" },
    { name: "Mac", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop", href: "/products?type=Mac" },
    { name: "AirPods", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=400&auto=format&fit=crop", href: "/products?type=AirPods%20%26%20Earphones" },
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
    <div className="pt-16 min-h-screen transition-colors duration-300">

      {/* 1. HERO SPOTLIGHT (Immersive Luxury Aesthetic with Dynamic Slideshow) */}
      <section
        className="py-12 md:py-24 px-6 relative z-10 max-w-[1400px] mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-[#0A0B0C] text-white rounded-[2.5rem] p-8 md:p-16 lg:p-20 relative overflow-hidden transition-all duration-500 border border-white/5">
          {/* Dynamic Background Glow changing color based on active slide */}
          <motion.div
            animate={{
              background: `radial-gradient(circle, ${HERO_PRODUCTS[heroIndex].glowColor} 0%, rgba(10, 11, 12, 0) 70%)`
            }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none z-0"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
            {/* Left Info Column */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-brand-gold">
                    Highlight Spotlight
                  </span>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-[-0.04em] leading-[1.05] text-white">
                    {HERO_PRODUCTS[heroIndex].title}
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 font-medium tracking-tight">
                    {HERO_PRODUCTS[heroIndex].tagline}
                  </p>

                  <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                    {HERO_PRODUCTS[heroIndex].description}
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (user) {
                          router.push("/products");
                        } else {
                          setAuthModalOpen(true);
                        }
                      }}
                      className="px-6 py-3 bg-brand-gold hover:bg-yellow-600 text-white rounded-full font-medium transition-colors tracking-tight text-sm shadow-lg shadow-brand-gold/15"
                    >
                      {HERO_PRODUCTS[heroIndex].buttonText}
                    </motion.button>

                    <button
                      onClick={() => {
                        router.push("/products");
                      }}
                      className="flex items-center gap-2 px-5 py-3 text-white hover:text-brand-gold transition-colors text-sm font-medium"
                    >
                      Explore Collection <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Image/Visual Column */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[400px]">
              {/* Previous Button */}
              <button
                onClick={() => setHeroIndex((prev) => (prev - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length)}
                className="absolute left-0 lg:-left-6 z-30 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md"
                aria-label="Previous Product"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex justify-center z-10 px-8"
                >
                  <motion.img
                    animate={{
                      y: [0, -12, 0]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    src={HERO_PRODUCTS[heroIndex].image}
                    alt={HERO_PRODUCTS[heroIndex].name}
                    className="w-full max-h-[280px] md:max-h-[380px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next Button */}
              <button
                onClick={() => setHeroIndex((prev) => (prev + 1) % HERO_PRODUCTS.length)}
                className="absolute right-0 lg:-right-6 z-30 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md"
                aria-label="Next Product"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Dot Navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
            {HERO_PRODUCTS.map((product, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className="group flex flex-col items-center focus:outline-none"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div className="relative w-12 h-1.5 rounded-full bg-white/15 overflow-hidden transition-all duration-300 group-hover:bg-white/30">
                  {idx === heroIndex && (
                    <motion.div
                      layoutId="activeSlideIndicator"
                      className="absolute inset-0 bg-brand-gold rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CONSOLIDATED VALUE PROPOSITION ROW */}
      <section className="py-12 md:py-20 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">

          <div className="bg-[#121212] rounded-[2rem] p-10 md:p-12 flex flex-col items-center md:items-start gap-6 group shadow-lg hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="text-white/40 group-hover:text-brand-gold transition-colors duration-500 bg-white/5 p-4 rounded-2xl">
              <Award className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight">Certified Devices</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                100% inspected and certified with complete diagnostic warranty.
              </p>
            </div>
          </div>

          <div className="bg-[#121212] rounded-[2rem] p-10 md:p-12 flex flex-col items-center md:items-start gap-6 group shadow-lg hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="text-white/40 group-hover:text-brand-gold transition-colors duration-500 bg-white/5 p-4 rounded-2xl">
              <ShieldCheck className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight">Flexible Payment</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Installments available through Salmon, Skyro, and major cards.
              </p>
            </div>
          </div>

          <div className="bg-[#121212] rounded-[2rem] p-10 md:p-12 flex flex-col items-center md:items-start gap-6 group shadow-lg hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="text-white/40 group-hover:text-brand-gold transition-colors duration-500 bg-white/5 p-4 rounded-2xl">
              <Clock className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight">Visit Us</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Open daily in Davao City for hands-on assistance and testing.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SHOP APPLE GRID */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-16 space-y-4 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">Devices.</h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium">
            Discover high-end pre-owned<br />and brand-new items.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Hero Card: iPhone */}
          <Link href="/products?type=iPhone" className="col-span-12 md:col-span-7 group relative rounded-[2rem] overflow-hidden min-h-[400px] md:min-h-[500px] bg-[#121212] flex flex-col p-8 md:p-12 shadow-sm hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="relative z-10 space-y-2 mt-auto">
              <h3 className="font-heading font-bold text-2xl md:text-3xl tracking-tight text-white">iPhone</h3>
              <p className="text-gray-300 font-medium text-sm md:text-base">Pro cameras. Pro display.<br />Pro performance.</p>
            </div>
            <img src="/hero/cat_iphone.png" alt="iPhone" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </Link>

          {/* Secondary Card: Mac */}
          <Link href="/products?type=Mac" className="col-span-12 md:col-span-5 group relative rounded-[2rem] overflow-hidden min-h-[400px] md:min-h-[500px] bg-[#121212] flex flex-col p-8 md:p-12 shadow-sm hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="relative z-10 space-y-2 mt-auto">
              <h3 className="font-heading font-bold text-2xl md:text-3xl tracking-tight text-white">Mac</h3>
              <p className="text-gray-300 font-medium text-sm md:text-base">Supercharged for pros.<br />Built for everyone.</p>
            </div>
            <img src="/hero/cat_mac.png" alt="Mac" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </Link>

          {/* Quarter Cards */}
          {[
            { title: "iPad", sub: "Touch, draw, and type.", img: "/hero/cat_ipad.png", type: "iPad" },
            { title: "Apple Watch", sub: "Your fitness partner.", img: "/hero/cat_watch.png", type: "Apple Watch" },
            { title: "AirPods", sub: "Magic sounds.", img: "/hero/cat_airpods.png", type: "AirPods & Earphones" },
            { title: "Accessories", sub: "Everything you need.", img: "", type: "Accessories" }
          ].map((item) => (
            <Link key={item.title} href={`/products?type=${encodeURIComponent(item.type)}`} className="col-span-12 sm:col-span-6 md:col-span-3 group relative rounded-[1.5rem] overflow-hidden aspect-square md:aspect-[4/5] bg-[#121212] flex flex-col p-6 shadow-sm hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
              <div className="relative z-20 space-y-1 mt-auto">
                <h3 className="font-heading font-bold text-lg tracking-tight text-white">{item.title}</h3>
                <p className="font-medium text-xs text-gray-300">{item.sub}</p>
              </div>
              {item.title === "Accessories" ? (
                <div className="absolute inset-0 w-full h-full bg-[#121212] flex items-center justify-center overflow-hidden p-4">
                  {/* iPad case as background/left */}
                  <img
                    src="/hero/acc_ipad_case.png"
                    alt="iPad Case"
                    className="absolute w-[46%] object-contain left-[5%] top-[10%] rotate-[-15deg] group-hover:scale-[1.08] group-hover:rotate-[-8deg] transition-all duration-700 select-none pointer-events-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                  />
                  {/* iPhone case as background/right */}
                  <img
                    src="/hero/acc_iphone_case.png"
                    alt="iPhone Case"
                    className="absolute w-[44%] object-contain right-[4%] top-[20%] rotate-[15deg] group-hover:scale-[1.08] group-hover:rotate-[8deg] transition-all duration-700 select-none pointer-events-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                  />
                  {/* Pencil Pro in center/foreground */}
                  <img
                    src="/hero/acc_pencil.png"
                    alt="Apple Pencil Pro"
                    className="absolute w-[18%] object-contain z-10 bottom-[12%] left-[41%] rotate-[-30deg] group-hover:scale-[1.12] group-hover:rotate-[-15deg] transition-all duration-700 select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                  />
                </div>
              ) : (
                <img src={item.img} alt={item.title} className={`absolute inset-0 w-full h-full object-center group-hover:scale-[1.05] transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90 ${item.title === "Apple Watch" ? "object-contain p-6" : "object-cover"}`} />
              )}
              {item.title !== "Accessories" && item.title !== "Apple Watch" && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-10" />
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED SPOTLIGHT COLLECTION */}
      {featuredItems.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-brand-border/40">
          <div className="mb-16 space-y-4 text-center">
            <span className="text-[10px] bg-brand-gold/15 text-brand-gold font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              Exclusive Picks
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight uppercase">
              Featured Collection
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
              Carefully curated flagships and premium configurations recommended by our diagnostics team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="group relative bg-[#121212] rounded-[2rem] overflow-hidden min-h-[380px] flex flex-col justify-between p-8 border border-white/5 shadow-sm hover:shadow-[0_30px_80px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-[600ms] cursor-pointer"
              >
                {/* Image display */}
                <div className="w-full flex justify-center py-6 h-48 relative z-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Details overlay / bottom info */}
                <div className="relative z-20 space-y-3 mt-auto">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] text-brand-gold uppercase font-bold tracking-wider">
                        {item.brand} • {item.type}
                      </span>
                      <h3 className="font-heading font-bold text-xl text-white tracking-tight group-hover:text-brand-gold transition-colors mt-0.5">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-light mt-0.5">{item.specs}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-extrabold text-brand-gold text-lg">
                        {formatPrice(item.price)}
                      </p>
                      {item.monthlyInstallment > 0 && (
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          As low as {formatPrice(item.monthlyInstallment)}/mo
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">
                    <span>Quick Details</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

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
                      <span className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
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



      {/* 9. OFFERS SECTION */}
      <section id="offers" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">Flexible Ways to Pay.</h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium">
              Acquire your dream device on your terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.title}
                className="bg-[#121212] rounded-[1.5rem] p-8 flex flex-col justify-between min-h-[220px] shadow-sm hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group"
              >
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-xl text-white tracking-tight">{offer.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{offer.desc}</p>
                </div>
                <button
                  onClick={() => {
                    const idx = financingSchemes.findIndex(s => s.title.includes(offer.title.split(" ")[0]));
                    if (idx !== -1) setActiveStory(idx);
                    else alert(`Inquire for ${offer.title} via Messenger at Facebook.com/marexxrepublicdavao`);
                  }}
                  className="text-left text-brand-gold font-medium text-sm mt-8 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                >
                  {offer.action} <ArrowRight className="w-4 h-4" />
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
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors">
                Discover Our Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <img src="/clients/pic1.jpg" alt="Maharlika Republic Showroom" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white dark:border-white/10">
                <p className="text-brand-black dark:text-white font-extrabold text-sm uppercase tracking-wider mb-1">Davao's Trusted Tech Hub</p>
                <p className="text-xs text-brand-textMuted">Located at F. Torres St, Bajada</p>
              </div>
            </div>
          </div>
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
        <div className="bg-white/70 dark:bg-neutral-900/80 backdrop-blur-md border border-brand-border/60 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm shadow-brand-gold/5">
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
              <h3 className="font-heading font-extrabold text-lg text-brand-black dark:text-white leading-snug">
                100% Recommend
              </h3>
              <p className="text-xs text-brand-textMuted font-semibold mt-0.5">
                Based on 385+ recommendations on Facebook
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-brand-border/40 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shadow-sm">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-brand-black/90 dark:text-white/90">
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
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-brand-black dark:text-white border border-brand-border/50 dark:border-white/10 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95"
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
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-brand-border dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-brand-gold/20 transition-all duration-300 relative group"
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
                    <h4 className="font-bold text-sm leading-tight text-brand-black dark:text-white">{review.name}</h4>
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
                <p className="text-xs md:text-sm text-brand-black/85 dark:text-white/85 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 12. MAP & SHOWROOM LOCATOR */}
      <section id="map" className="py-20 px-6 border-t border-brand-border bg-brand-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-4 tracking-tighter uppercase text-brand-black dark:text-white">Our Showroom Location</h2>
              <p className="text-xs text-brand-textMuted max-w-xl">
                Locate us in the heart of Bajada. Use the map controls to toggle between the <strong className="font-semibold text-brand-black dark:text-white">Macro View (City)</strong> and the <strong className="font-semibold text-brand-black dark:text-white">Indoor Layout</strong> of our Bajada hub.
              </p>
            </div>
            <div className="text-right hidden md:block shrink-0">
              <p className="font-medium text-brand-black dark:text-white">Davao Wisdom Building</p>
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
