"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Client {
  id: number;
  image: string;
  name: string;
  location: string;
}

const CLIENTS: Client[] = [
  {
    id: 0,
    image: "/clients/pic2.jpg",
    name: "Hands-on Device Testing",
    location: "Marexx Showroom",
  },
  {
    id: 1,
    image: "/clients/pic3.jpg",
    name: "Happy Upgraded Clients",
    location: "Davao City",
  },
  {
    id: 2,
    image: "/clients/pic1.jpg",
    name: "Marexx Grand Opening",
    location: "F. Torres St, Bajada",
  },
  {
    id: 3,
    image: "/clients/pic4.jpg",
    name: "iPhone 16 Pro Max Upgraded",
    location: "Marexx Showroom",
  },
  {
    id: 4,
    image: "/clients/pic5.jpg",
    name: "Happy Customer Unboxing",
    location: "Marexx Bajada",
  },
  {
    id: 5,
    image: "/clients/pic6.jpg",
    name: "Grand Store Opening",
    location: "Marexx Bajada",
  },
  {
    id: 6,
    image: "/clients/pic7.jpg",
    name: "Premium Apple Stock Arrival",
    location: "Marexx Main Store",
  },
];

export default function OurClients() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play slideshow functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CLIENTS.length);
    }, 5000); // Slow movement interval: 5 seconds
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CLIENTS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CLIENTS.length) % CLIENTS.length);
  };

  return (
    <section id="clients" className="relative py-24 px-6 md:px-12 overflow-hidden bg-neutral-950 text-white min-h-[500px] flex items-center">
      {/* Immersive blurred dynamic background cross-fade */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={CLIENTS[activeIndex].image}
            alt="Client Background"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 0.22, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.95, ease: "easeInOut" }}
            className="w-full h-full object-cover blur-3xl filter brightness-50 contrast-125 saturate-150"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-neutral-950/80" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Text Content and Navigation Arrows */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-black uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full inline-block"
            >
              Community Showcase
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading font-black tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent"
            >
              Loved by Davao’s Apple Community
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed font-medium"
            >
              Join hundreds of Apple enthusiasts across Davao who have upgraded their digital lifestyle with us. Explore authentic moments from our showroom handovers, happy client milestones, and our grand Bajada store launch.
            </motion.p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/60 backdrop-blur-md transition-all duration-300 focus:outline-none"
              aria-label="Previous client"
            >
              <ArrowLeft className="w-5 h-5 text-white/90" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/60 backdrop-blur-md transition-all duration-300 focus:outline-none"
              aria-label="Next client"
            >
              <ArrowRight className="w-5 h-5 text-white/90" />
            </motion.button>
          </div>
        </div>

        {/* Right Column: Stacked 3D Card Carousel */}
        <div className="lg:col-span-7 flex justify-start lg:justify-end items-center h-[450px] md:h-[530px] relative overflow-visible pl-4 sm:pl-12 lg:pl-0">
          <div className="relative w-full max-w-[650px] h-full flex items-center">
            {CLIENTS.map((client, index) => {
              const L = CLIENTS.length;
              const relativeIndex = (index - activeIndex + L) % L;
              const isActive = relativeIndex === 0;

              // Responsive scaling & shifting
              const stepX = isMobile ? 55 : 115;
              const translateX = relativeIndex * stepX;
              const scale = isActive ? 1.05 : 1 - relativeIndex * 0.08;
              const zIndex = L - relativeIndex;
              const opacity = 1 - relativeIndex * 0.28;

              return (
                <motion.div
                  key={client.id}
                  style={{ zIndex }}
                  animate={{
                    x: translateX,
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 85,
                    damping: 20,
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute left-0 w-[260px] sm:w-[350px] aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer origin-left transition-all duration-500 ${isActive
                      ? "ring-2 ring-brand-gold/80 ring-offset-4 ring-offset-neutral-950 shadow-[0_20px_50px_rgba(212,175,55,0.25)]"
                      : "shadow-2xl hover:opacity-90 grayscale-[25%] contrast-[95%] brightness-90 hover:grayscale-0 hover:brightness-100"
                    }`}
                >
                  <img
                    src={client.image}
                    alt={client.name}
                    className={`w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 ${isActive ? "scale-105" : "scale-100"}`}
                  />
                  {/* Subtle info card watermark/gradient - permanently visible with elegant design when active, hover only for inactive */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-all duration-500 p-6 flex flex-col justify-end ${isActive ? "opacity-100" : "opacity-0 hover:opacity-100"}`}>
                    <motion.div
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.8 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-1"
                    >
                      <p className="font-heading font-black text-sm sm:text-lg tracking-tight text-white drop-shadow-md">
                        {client.name}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                        <p className="text-[10px] text-brand-gold font-bold uppercase tracking-wider">
                          {client.location}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
