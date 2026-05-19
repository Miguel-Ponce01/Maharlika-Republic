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
  Smartphone, 
  CheckCircle,
  MessageSquare
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
      color: "from-amber-500/10 to-brand-gold/10"
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
      color: "from-emerald-500/10 to-teal-500/10"
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
      ctaLink: "https://www.facebook.com/marexxrepublicdavao",
      color: "from-blue-500/10 to-indigo-500/10"
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
      color: "from-purple-500/10 to-fuchsia-500/10"
    }
  ];

  const current = tabs.find((t) => t.id === activeTab) || tabs[0];
  const ActiveIcon = current.icon;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-12 space-y-3">
        <span className="text-[10px] bg-brand-gold/15 text-brand-gold font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
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
        <div className="lg:col-span-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 pb-3 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[200px] lg:w-full text-left p-4.5 rounded-2xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group active:scale-[0.98] ${
                  isSelected 
                    ? "bg-brand-card border-brand-gold shadow-md" 
                    : "bg-white/40 backdrop-blur-sm border-brand-border/60 hover:bg-white/80 hover:border-brand-border"
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                  isSelected ? "bg-brand-gold text-white" : "bg-neutral-100 text-brand-textMuted group-hover:bg-neutral-200"
                }`}>
                  <TabIcon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-black">
                    {tab.label}
                  </h4>
                  <p className="text-[10px] text-brand-textMuted font-medium truncate max-w-[150px]">
                    {tab.short}
                  </p>
                </div>

                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute right-3 w-1.5 h-6 bg-brand-gold rounded-full"
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
              className={`h-full bg-gradient-to-br ${current.color} border border-brand-border/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden`}
            >
              {/* Giant Decorative Icon Watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none select-none text-brand-black">
                <ActiveIcon className="w-64 h-64" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-white/80 backdrop-blur-sm border border-brand-border/40 rounded-2xl text-brand-black shadow-sm">
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-lg md:text-xl text-brand-black uppercase tracking-tight">
                    {current.title}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-brand-black/85 leading-relaxed max-w-2xl">
                  {current.description}
                </p>

                {/* Bullets List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {current.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-brand-white/50 backdrop-blur-xs p-3 rounded-xl border border-brand-border/20">
                      <CheckCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium text-brand-black/90 leading-normal">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="mt-8 pt-6 border-t border-brand-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2 text-[10px] text-brand-textMuted font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Verified Store Operations • Davao City</span>
                </div>

                <a
                  href={current.ctaLink}
                  target={current.ctaLink.startsWith("http") ? "_blank" : undefined}
                  rel={current.ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-black text-white hover:bg-gray-800 transition-colors rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 group shadow-sm active:scale-[0.98]"
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
