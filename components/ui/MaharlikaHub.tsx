"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  ShieldCheck, 
  RefreshCw, 
  Landmark, 
  ArrowRight, 
  Clock, 
  CheckCircle
} from "lucide-react";

interface HubTab {
  id: string;
  label: string;
  short: string;
  icon: any;
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  ctaLink: string;
}

export default function MaharlikaHub() {
  const [activeTab, setActiveTab] = useState("showroom");

  const tabs: HubTab[] = [
    {
      id: "showroom",
      label: "Showroom Hub",
      short: "Visit our outlet",
      icon: MapPin,
      title: "Physical Davao Showroom",
      description: "Drop by our physical showroom in the heart of Bajada to get hands-on experience with all of our devices before buying.",
      bullets: [
        "Located at Davao Wisdom Building, F. Torres St, Bajada, Davao City",
        "Open Daily: 10:00 AM – 9:00 PM",
        "Live device testing, diagnostic testing, and support",
        "Hands-on comparison between models with our specialists"
      ],
      ctaText: "Get Showroom Directions",
      ctaLink: "#map"
    },
    {
      id: "genuine",
      label: "Genuine Guarantee",
      short: "100% Authentic",
      icon: ShieldCheck,
      title: "Inspected & Certified Apple Devices",
      description: "We are committed to absolute quality. Every brand-new or pre-owned Apple device is certified authentic and undergoes a comprehensive review.",
      bullets: [
        "Rigorous 40-point hardware & software inspection",
        "Verified clean serial numbers & iCloud status",
        "Complimentary store diagnostic warranty",
        "Official store receipt issued with every acquisition"
      ],
      ctaText: "Browse Genuine Products",
      ctaLink: "/products"
    },
    {
      id: "tradein",
      label: "Trade-In & Upgrade",
      short: "Appraise & upgrade",
      icon: RefreshCw,
      title: "Valuate & Trade-Up Instantly",
      description: "Don't let your old device sit in a drawer. Bring it in for an instant valuation and use the store credit to upgrade to a newer model.",
      bullets: [
        "Highest appraisal value in Davao City",
        "Trade in older iPhones, iPads, MacBooks, or Apple Watches",
        "Quick 15-minute diagnostic checks & valuation",
        "Pay only the price difference for your upgrade"
      ],
      ctaText: "Inquire via Messenger",
      ctaLink: "https://www.facebook.com/messages/t/marexxrepublicdavao"
    },
    {
      id: "financing",
      label: "Flexible Programs",
      short: "Salmon, Skyro & Lay-away",
      icon: Landmark,
      title: "Tailored Acquisition Options",
      description: "We make premium Apple tech accessible. Choose from our various cash, digital, lay-away, or installment payment methods.",
      bullets: [
        "Salmon & Skyro financing options (easy monthly terms)",
        "Paluwagan (lay-away) program to secure items",
        "Accepts GCash, Maya, local bank transfers, and credit cards",
        "Cash on Pickup or Cash on Delivery (COD) in Davao City"
      ],
      ctaText: "View Payment Options",
      ctaLink: "/payment-options"
    }
  ];

  const glows: Record<string, string> = {
    showroom: "from-brand-gold/15 to-transparent",
    genuine: "from-emerald-500/10 to-transparent",
    tradein: "from-blue-500/10 to-transparent",
    financing: "from-purple-500/10 to-transparent"
  };

  const current = tabs.find((t) => t.id === activeTab) || tabs[0];
  const ActiveIcon = current.icon;

  return (
    <section id="hub" className="py-24 md:py-32 px-6 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center mb-16 space-y-3">
        <span className="text-[11px] text-brand-gold font-semibold uppercase tracking-[0.2em]">
          Inside Maharlika
        </span>
        <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-[-0.03em] text-neutral-900 dark:text-white leading-[1.05]">
          Davao's Premier Apple Destination
        </h2>
        <p className="text-sm md:text-base text-neutral-500 dark:text-gray-400 max-w-xl mx-auto font-medium tracking-tight">
          A premium ecosystem of authentic warranty guarantees, instant device trade-ins, and flexible financing built around our flagship Davao showroom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Interactive Navigation Tabs */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 pb-3 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[210px] lg:w-full text-left p-5 rounded-[22px] border flex items-center gap-4 relative overflow-hidden group active:scale-[0.98] transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isSelected 
                    ? "border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white shadow-sm" 
                    : "border-neutral-200/40 dark:border-white/[0.03] text-neutral-400 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-[#F4F4F3]/90 dark:bg-white/[0.05] backdrop-blur-md rounded-[22px] -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div className={`w-11 h-11 flex items-center justify-center rounded-2xl shrink-0 transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isSelected 
                    ? "bg-brand-gold text-neutral-950 scale-105" 
                    : "bg-neutral-100 dark:bg-white/[0.02] text-neutral-400 dark:text-gray-500 group-hover:bg-neutral-200/60 dark:group-hover:bg-white/[0.04] group-hover:scale-102"
                }`}>
                  <TabIcon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className={`font-heading font-extrabold text-xs uppercase tracking-wider transition-colors duration-[500ms] ${
                    isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-gray-400 group-hover:text-neutral-900 dark:group-hover:text-white"
                  }`}>
                    {tab.label}
                  </h4>
                  <p className="text-[10px] text-neutral-400 dark:text-gray-500 font-medium truncate max-w-[150px]">
                    {tab.short}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Details Display Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-white dark:bg-[#121212]/60 backdrop-blur-xl border border-neutral-200/50 dark:border-white/[0.06] rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              {/* Dynamic Glow in the top right corner */}
              <div className={`absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-b ${glows[current.id]} blur-[120px] pointer-events-none -z-10`} />

              {/* Giant Decorative Icon Watermark */}
              <div className="absolute -right-16 -bottom-16 opacity-[0.03] dark:opacity-[0.02] pointer-events-none select-none text-neutral-950 dark:text-brand-gold">
                <ActiveIcon className="w-80 h-80 stroke-[0.5]" />
              </div>

              <div className="space-y-7 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 dark:bg-white/[0.02] border border-neutral-200/50 dark:border-white/[0.04] rounded-2xl text-neutral-900 dark:text-brand-gold shadow-sm">
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-brand-gold font-semibold">
                      {current.label}
                    </span>
                    <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-neutral-900 dark:text-white tracking-[-0.02em] leading-tight">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm md:text-base text-neutral-600 dark:text-gray-300/90 leading-relaxed max-w-2xl font-medium">
                  {current.description}
                </p>

                {/* Bullets List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {current.bullets.map((bullet, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="flex items-start gap-3 bg-white/60 dark:bg-white/[0.02] backdrop-blur-md p-4 rounded-2xl border border-neutral-200/50 dark:border-white/[0.04] shadow-sm hover:shadow-md transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    >
                      <div className="w-5 h-5 rounded-full bg-brand-gold/10 dark:bg-brand-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-gold" />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                        {bullet}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="mt-10 pt-6 border-t border-neutral-200/50 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 dark:text-gray-400 font-bold uppercase tracking-[0.1em]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Verified Store Operations • Davao City</span>
                </div>

                <a
                  href={current.ctaLink}
                  target={current.ctaLink.startsWith("http") ? "_blank" : undefined}
                  rel={current.ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-full text-xs font-semibold tracking-tight transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-2 group active:scale-[0.98] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
