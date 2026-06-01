"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-white text-brand-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-lg">
        {/* Giant 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] block mb-4">
            404 — Page Not Found
          </span>
          <h1 className="text-[120px] md:text-[180px] font-heading font-extrabold leading-none tracking-tighter text-brand-black/10 dark:text-white/10 select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4 -mt-8"
        >
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7 text-brand-gold" />
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tighter">
            This page doesn&apos;t exist.
          </h2>
          <p className="text-sm text-brand-textMuted leading-relaxed max-w-sm mx-auto">
            The page you&apos;re looking for may have been moved, deleted, or never existed. Let&apos;s get you back to the good stuff.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-3.5 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/15 uppercase tracking-wider text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-3.5 border border-brand-border hover:bg-brand-border/50 text-brand-black font-bold rounded-xl transition-all uppercase tracking-wider text-xs"
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
