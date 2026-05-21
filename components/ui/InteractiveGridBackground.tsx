"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InteractiveGridBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#F9F9F7]">
      {/* Drifting glow blobs */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 80, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-gold/5 blur-[80px]"
      />
      <motion.div
        animate={{
          x: [0, -90, 50, 0],
          y: [0, 80, -70, 0],
          scale: [1, 0.95, 1.15, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#BFCBC4]/20 blur-[90px]"
      />
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, 90, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-brand-gold/3 blur-[75px]"
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-70 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(180, 124, 46, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(180, 124, 46, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
        }}
      />
    </div>
  );
}
