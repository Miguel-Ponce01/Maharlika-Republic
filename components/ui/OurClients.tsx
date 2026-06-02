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

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CLIENTS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CLIENTS.length) % CLIENTS.length);
  };

  return (
    <section className="relative py-24 px-6 md:px-12 overflow-hidden bg-neutral-950 text-white min-h-[500px] flex items-center">
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
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-heading font-black tracking-tight"
            >
              Our Clients
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed font-medium"
            >
              Trusted by hundreds of Apple enthusiasts across Davao. See real moments from our showroom and our happy community of upgraded clients.
            </motion.p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors duration-300 focus:outline-none"
              aria-label="Previous client"
            >
              <ArrowLeft className="w-5 h-5 text-white/95" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors duration-300 focus:outline-none"
              aria-label="Next client"
            >
              <ArrowRight className="w-5 h-5 text-white/95" />
            </motion.button>
          </div>
        </div>

        {/* Right Column: Stacked 3D Card Carousel */}
        <div className="lg:col-span-7 flex justify-start lg:justify-end items-center h-[360px] md:h-[420px] relative overflow-visible pl-4 sm:pl-12 lg:pl-0">
          <div className="relative w-full max-w-[480px] h-full flex items-center">
            {CLIENTS.map((client, index) => {
              const L = CLIENTS.length;
              const relativeIndex = (index - activeIndex + L) % L;
              const isActive = relativeIndex === 0;

              // Responsive scaling & shifting
              const stepX = isMobile ? 35 : 75;
              const translateX = relativeIndex * stepX;
              const scale = 1 - relativeIndex * 0.08;
              const zIndex = L - relativeIndex;
              const opacity = 1 - relativeIndex * 0.35;

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
                    stiffness: 260,
                    damping: 24,
                  }}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute left-0 w-[210px] sm:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer origin-left shadow-2xl transition-all duration-300 ${isActive
                      ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-neutral-950 shadow-brand-gold/10"
                      : "hover:opacity-80"
                    }`}
                >
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  {/* Subtle info card watermark/gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                    <p className="font-heading font-bold text-xs sm:text-sm tracking-tight text-white">
                      {client.name}
                    </p>
                    <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider mt-0.5">
                      {client.location}
                    </p>
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
