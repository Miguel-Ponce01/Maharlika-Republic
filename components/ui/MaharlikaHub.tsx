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
  color: string;
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
      ctaLink: "#map",
      color: "from-amber-500/10 via-brand-gold/5 to-transparent bg-white/95 dark:bg-neutral-900/60"
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
      ctaLink: "/products",
      color: "from-emerald-500/10 via-teal-500/5 to-transparent bg-white/95 dark:bg-neutral-900/60"
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
      ctaLink: "https://www.facebook.com/messages/t/marexxrepublicdavao",
      color: "from-blue-500/10 via-indigo-500/5 to-transparent bg-white/95 dark:bg-neutral-900/60"
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
      ctaLink: "/payment-options",
      color: "from-purple-500/10 via-fuchsia-500/5 to-transparent bg-white/95 dark:bg-neutral-900/60"
    }
  ];

  const current = tabs.find((t) => t.id === activeTab) || tabs[0];
  const ActiveIcon = current.icon;

  return (
    <section id="hub" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16 space-y-4">
        <span className="text-[10px] bg-brand-gold/15 text-brand-gold font-extrabold px-5 py-2 rounded-full uppercase tracking-wider">
          Inside Maharlika Republic
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tighter uppercase text-brand-black">
          Meet Davao's Premier Apple Destination
        </h2>
        <p className="text-xs text-brand-textMuted max-w-md mx-auto leading-relaxed">
          Click the interactive tabs below to discover our showroom location, authentic warranty checks, instant trade-ins, and flexible payment plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Interactive Navigation Tabs */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3.5 pb-3 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[210px] lg:w-full text-left p-5 rounded-[22px] border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group active:scale-[0.98] ${
                  isSelected 
                    ? "bg-brand-white dark:bg-neutral-800 border-brand-gold shadow-lg shadow-brand-gold/[0.04]" 
                    : "bg-white/40 dark:bg-white/[0.01] backdrop-blur-sm border-brand-border/60 dark:border-white/[0.03] hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-brand-gold/20"
                }`}
              >
                <div className={`w-11 h-11 flex items-center justify-center rounded-2xl shrink-0 transition-all duration-300 ${
                  isSelected 
                    ? "bg-brand-gold text-white shadow-md shadow-brand-gold/25 scale-105" 
                    : "bg-neutral-100 dark:bg-neutral-800 text-brand-textMuted dark:text-gray-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 group-hover:scale-102"
                }`}>
                  <TabIcon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-brand-black">
                    {tab.label}
                  </h4>
                  <p className="text-[10px] text-brand-textMuted dark:text-gray-400 font-medium truncate max-w-[150px]">
                    {tab.short}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute right-4 w-1.5 h-6 bg-brand-gold rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
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
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={`h-full bg-gradient-to-br ${current.color} backdrop-blur-md border border-brand-border/60 dark:border-white/[0.04] rounded-[32px] p-7 md:p-9 flex flex-col justify-between shadow-xl relative overflow-hidden`}
            >
              {/* Giant Decorative Icon Watermark */}
              <div className="absolute -right-16 -bottom-16 opacity-[0.06] dark:opacity-[0.03] pointer-events-none select-none text-brand-gold">
                <ActiveIcon className="w-80 h-80 stroke-[0.75]" />
              </div>

              <div className="space-y-7 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-neutral-800 border border-brand-border/40 dark:border-white/[0.04] rounded-2xl text-brand-black dark:text-brand-gold shadow-md">
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-brand-gold font-extrabold">
                      {current.label}
                    </span>
                    <h3 className="font-heading font-black text-lg md:text-xl text-brand-black dark:text-white uppercase tracking-tight leading-none">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-neutral-600 dark:text-gray-300 leading-relaxed max-w-2xl font-medium">
                  {current.description}
                </p>

                {/* Bullets List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {current.bullets.map((bullet, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="flex items-center gap-3 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md p-3.5 rounded-2xl border border-black/[0.03] dark:border-white/[0.03] shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-gold/10 dark:bg-brand-gold/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-gold" />
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 leading-snug">
                        {bullet}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="mt-10 pt-6 border-t border-brand-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2 text-[10px] text-brand-textMuted dark:text-gray-400 font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Verified Store Operations • Davao City</span>
                </div>

                <a
                  href={current.ctaLink}
                  target={current.ctaLink.startsWith("http") ? "_blank" : undefined}
                  rel={current.ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-400 via-brand-gold to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-neutral-950 hover:shadow-lg hover:shadow-brand-gold/15 transition-all duration-300 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 group active:scale-[0.97]"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-neutral-950" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
