"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/src/store/useCartStore";
import { useUIStore } from "@/src/store/useUIStore";
import { ShoppingBag, HelpCircle, Check, Smartphone, Cpu, Camera, Battery, ShieldAlert, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface iPhoneModel {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: { name: string; hex: string }[];
  specs: {
    display: string;
    displayFeatures: string[];
    chip: string;
    chipDetails: string[];
    camera: string;
    cameraDetails: string[];
    zoom: string;
    battery: string;
    ports: string;
    safety: string[];
    build: string;
  };
}

const COMPARISON_MODELS: iPhoneModel[] = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    price: 84990,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Desert Titanium", hex: "#c2b2a2" },
      { name: "Natural Titanium", hex: "#aba7a4" },
      { name: "White Titanium", hex: "#f2f1ed" },
      { name: "Black Titanium", hex: "#3b3c3e" }
    ],
    specs: {
      display: "6.9-inch Super Retina XDR display",
      displayFeatures: ["ProMotion technology with adaptive refresh rates up to 120Hz", "Always-On display", "Dynamic Island", "Ceramic Shield (latest-generation)"],
      chip: "A18 Pro chip",
      chipDetails: ["New 6-core CPU with 2 performance and 4 efficiency cores", "New 6-core GPU", "New 16-core Neural Engine"],
      camera: "Pro camera system (48MP Fusion, 48MP Ultra Wide, 12MP 5x Telephoto)",
      cameraDetails: ["48MP Fusion: 24mm, ƒ/1.78 aperture", "48MP Ultra Wide: 13mm, ƒ/2.2 aperture", "12MP 5x Telephoto: 120mm, ƒ/2.8 aperture", "Camera Control button"],
      zoom: "5x optical zoom in, 2x optical zoom out; 10x optical zoom range",
      battery: "Up to 33 hours video playback",
      ports: "USB-C connector with support for USB 3 (up to 10Gb/s)",
      safety: ["Emergency SOS via satellite", "Crash Detection", "Roadside Assistance via satellite"],
      build: "Titanium design with textured matte glass back"
    }
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    price: 69990,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Desert Titanium", hex: "#c2b2a2" },
      { name: "Natural Titanium", hex: "#aba7a4" },
      { name: "White Titanium", hex: "#f2f1ed" },
      { name: "Black Titanium", hex: "#3b3c3e" }
    ],
    specs: {
      display: "6.3-inch Super Retina XDR display",
      displayFeatures: ["ProMotion technology with adaptive refresh rates up to 120Hz", "Always-On display", "Dynamic Island", "Ceramic Shield (latest-generation)"],
      chip: "A18 Pro chip",
      chipDetails: ["New 6-core CPU with 2 performance and 4 efficiency cores", "New 6-core GPU", "New 16-core Neural Engine"],
      camera: "Pro camera system (48MP Fusion, 48MP Ultra Wide, 12MP 5x Telephoto)",
      cameraDetails: ["48MP Fusion: 24mm, ƒ/1.78 aperture", "48MP Ultra Wide: 13mm, ƒ/2.2 aperture", "12MP 5x Telephoto: 120mm, ƒ/2.8 aperture", "Camera Control button"],
      zoom: "5x optical zoom in, 2x optical zoom out; 10x optical zoom range",
      battery: "Up to 27 hours video playback",
      ports: "USB-C connector with support for USB 3 (up to 10Gb/s)",
      safety: ["Emergency SOS via satellite", "Crash Detection", "Roadside Assistance via satellite"],
      build: "Titanium design with textured matte glass back"
    }
  },
  {
    id: "iphone-16-plus",
    name: "iPhone 16 Plus",
    price: 63990,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Ultramarine", hex: "#4b6fa6" },
      { name: "Teal", hex: "#2e8b83" },
      { name: "Pink", hex: "#f2b5be" },
      { name: "White", hex: "#f5f5f7" },
      { name: "Black", hex: "#1c1d21" }
    ],
    specs: {
      display: "6.7-inch Super Retina XDR display",
      displayFeatures: ["Dynamic Island", "Ceramic Shield (latest-generation)", "HDR display & True Tone"],
      chip: "A18 chip",
      chipDetails: ["6-core CPU with 2 performance and 4 efficiency cores", "5-core GPU", "16-core Neural Engine"],
      camera: "Advanced dual-camera system (48MP Fusion, 12MP Ultra Wide)",
      cameraDetails: ["48MP Fusion: 26mm, ƒ/1.6 aperture", "12MP Ultra Wide: 13mm, ƒ/2.2 aperture", "Camera Control button"],
      zoom: "2x optical zoom in, 2x optical zoom out; 4x optical zoom range",
      battery: "Up to 27 hours video playback",
      ports: "USB-C connector with support for USB 2 (up to 480Mb/s)",
      safety: ["Emergency SOS via satellite", "Crash Detection", "Roadside Assistance via satellite"],
      build: "Aluminum design with color-infused glass back"
    }
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    price: 56990,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Ultramarine", hex: "#4b6fa6" },
      { name: "Teal", hex: "#2e8b83" },
      { name: "Pink", hex: "#f2b5be" },
      { name: "White", hex: "#f5f5f7" },
      { name: "Black", hex: "#1c1d21" }
    ],
    specs: {
      display: "6.1-inch Super Retina XDR display",
      displayFeatures: ["Dynamic Island", "Ceramic Shield (latest-generation)", "HDR display & True Tone"],
      chip: "A18 chip",
      chipDetails: ["6-core CPU with 2 performance and 4 efficiency cores", "5-core GPU", "16-core Neural Engine"],
      camera: "Advanced dual-camera system (48MP Fusion, 12MP Ultra Wide)",
      cameraDetails: ["48MP Fusion: 26mm, ƒ/1.6 aperture", "12MP Ultra Wide: 13mm, ƒ/2.2 aperture", "Camera Control button"],
      zoom: "2x optical zoom in, 2x optical zoom out; 4x optical zoom range",
      battery: "Up to 22 hours video playback",
      ports: "USB-C connector with support for USB 2 (up to 480Mb/s)",
      safety: ["Emergency SOS via satellite", "Crash Detection", "Roadside Assistance via satellite"],
      build: "Aluminum design with color-infused glass back"
    }
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    price: 74990,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Natural Titanium", hex: "#aba7a4" },
      { name: "Blue Titanium", hex: "#2f4452" },
      { name: "White Titanium", hex: "#f2f1ed" },
      { name: "Black Titanium", hex: "#3b3c3e" }
    ],
    specs: {
      display: "6.7-inch Super Retina XDR display",
      displayFeatures: ["ProMotion technology with adaptive refresh rates up to 120Hz", "Always-On display", "Dynamic Island", "Ceramic Shield front"],
      chip: "A17 Pro chip",
      chipDetails: ["6-core CPU with 2 performance and 4 efficiency cores", "6-core GPU", "16-core Neural Engine"],
      camera: "Pro camera system (48MP Main, 12MP Ultra Wide, 12MP 5x Telephoto)",
      cameraDetails: ["48MP Main: ƒ/1.78 aperture", "12MP Ultra Wide: ƒ/2.2 aperture", "12MP 5x Telephoto: ƒ/2.8 aperture", "Action button"],
      zoom: "5x optical zoom in, 2x optical zoom out; 10x optical zoom range",
      battery: "Up to 29 hours video playback",
      ports: "USB-C connector with support for USB 3 (up to 10Gb/s)",
      safety: ["Emergency SOS via satellite", "Crash Detection"],
      build: "Titanium design with textured matte glass back"
    }
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    price: 64990,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Natural Titanium", hex: "#aba7a4" },
      { name: "Blue Titanium", hex: "#2f4452" },
      { name: "White Titanium", hex: "#f2f1ed" },
      { name: "Black Titanium", hex: "#3b3c3e" }
    ],
    specs: {
      display: "6.1-inch Super Retina XDR display",
      displayFeatures: ["ProMotion technology with adaptive refresh rates up to 120Hz", "Always-On display", "Dynamic Island", "Ceramic Shield front"],
      chip: "A17 Pro chip",
      chipDetails: ["6-core CPU with 2 performance and 4 efficiency cores", "6-core GPU", "16-core Neural Engine"],
      camera: "Pro camera system (48MP Main, 12MP Ultra Wide, 12MP 3x Telephoto)",
      cameraDetails: ["48MP Main: ƒ/1.78 aperture", "12MP Ultra Wide: ƒ/2.2 aperture", "12MP 3x Telephoto: ƒ/2.8 aperture", "Action button"],
      zoom: "3x optical zoom in, 2x optical zoom out; 6x optical zoom range",
      battery: "Up to 23 hours video playback",
      ports: "USB-C connector with support for USB 3 (up to 10Gb/s)",
      safety: ["Emergency SOS via satellite", "Crash Detection"],
      build: "Titanium design with textured matte glass back"
    }
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    price: 46990,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Black", hex: "#1c1d21" },
      { name: "Blue", hex: "#d3e3eb" },
      { name: "Green", hex: "#d2ebd9" },
      { name: "Yellow", hex: "#faebd2" },
      { name: "Pink", hex: "#fad2d9" }
    ],
    specs: {
      display: "6.1-inch Super Retina XDR display",
      displayFeatures: ["Dynamic Island", "Ceramic Shield front", "HDR display & True Tone"],
      chip: "A16 Bionic chip",
      chipDetails: ["6-core CPU with 2 performance and 4 efficiency cores", "5-core GPU", "16-core Neural Engine"],
      camera: "Dual-camera system (48MP Main, 12MP Ultra Wide)",
      cameraDetails: ["48MP Main: ƒ/1.6 aperture", "12MP Ultra Wide: ƒ/2.4 aperture", "Ring/Silent switch"],
      zoom: "2x optical zoom in, 2x optical zoom out; 4x optical zoom range",
      battery: "Up to 20 hours video playback",
      ports: "USB-C connector with support for USB 2 (up to 480Mb/s)",
      safety: ["Emergency SOS via satellite", "Crash Detection"],
      build: "Aluminum design with color-infused glass back"
    }
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    price: 39990,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400&auto=format&fit=crop",
    colors: [
      { name: "Midnight", hex: "#1e2124" },
      { name: "Purple", hex: "#e5d3eb" },
      { name: "Starlight", hex: "#f0ece1" },
      { name: "Red", hex: "#a82229" },
      { name: "Blue", hex: "#d3e3eb" }
    ],
    specs: {
      display: "6.1-inch Super Retina XDR display",
      displayFeatures: ["Ceramic Shield front", "HDR display & True Tone"],
      chip: "A15 Bionic chip",
      chipDetails: ["6-core CPU with 2 performance and 4 efficiency cores", "5-core GPU", "16-core Neural Engine"],
      camera: "Dual-camera system (12MP Main, 12MP Ultra Wide)",
      cameraDetails: ["12MP Main: ƒ/1.5 aperture", "12MP Ultra Wide: ƒ/2.4 aperture", "Ring/Silent switch"],
      zoom: "2x optical zoom out; 2x optical zoom range",
      battery: "Up to 20 hours video playback",
      ports: "Lightning connector (supports USB 2)",
      safety: ["Emergency SOS via satellite", "Crash Detection"],
      build: "Aluminum design with glass back"
    }
  }
];

export default function ComparePage() {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const [selectedIds, setSelectedIds] = useState<(string | null)[]>([
    "iphone-16-pro-max",
    "iphone-16",
    "iphone-15"
  ]);

  // Selected colors state for each compared column (default to first color of each model)
  const [selectedColors, setSelectedColors] = useState<(string | null)[]>([
    COMPARISON_MODELS[0].colors[0].name,
    COMPARISON_MODELS[2].colors[0].name,
    COMPARISON_MODELS[6].colors[0].name
  ]);

  const handleModelChange = (columnIndex: number, id: string) => {
    const updatedIds = [...selectedIds];
    updatedIds[columnIndex] = id === "none" ? null : id;
    setSelectedIds(updatedIds);

    const updatedColors = [...selectedColors];
    if (id !== "none") {
      const model = COMPARISON_MODELS.find((m) => m.id === id);
      updatedColors[columnIndex] = model ? model.colors[0].name : null;
    } else {
      updatedColors[columnIndex] = null;
    }
    setSelectedColors(updatedColors);
  };

  const handleColorChange = (columnIndex: number, colorName: string) => {
    const updatedColors = [...selectedColors];
    updatedColors[columnIndex] = colorName;
    setSelectedColors(updatedColors);
  };

  const handleAddToCart = (columnIndex: number) => {
    const modelId = selectedIds[columnIndex];
    if (!modelId) return;

    const model = COMPARISON_MODELS.find((m) => m.id === modelId);
    if (!model) return;

    const chosenColor = selectedColors[columnIndex] || model.colors[0].name;

    addItem({
      id: `${model.id}-${chosenColor.toLowerCase().replace(/\s+/g, "-")}`,
      name: `${model.name} (${chosenColor})`,
      price: model.price,
      image: model.image,
      quantity: 1,
      specs: `${chosenColor}, Dynamic Comparison spec`
    });
    setCartOpen(true);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Get selected models
  const models = selectedIds.map((id) =>
    id ? COMPARISON_MODELS.find((m) => m.id === id) || null : null
  );

  return (
    <div className="min-h-screen pt-32 pb-24 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs & Header */}
        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest gap-2 mb-4">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-brand-gold">Compare</span>
        </div>

        <div className="mb-16 text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter uppercase">
            iPhone. <span className="text-brand-gold bg-gradient-to-r from-brand-gold to-yellow-600 bg-clip-text text-transparent">Find yours.</span>
          </h1>
          <p className="text-xs md:text-sm text-brand-textMuted max-w-lg mx-auto leading-relaxed">
            Compare models to find the perfect iPhone for you. Pick up to three models and see their detailed hardware parameters side by side.
          </p>
        </div>

        {/* Model Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-b border-brand-border/40 pb-16">
          {models.map((model, idx) => (
            <div key={idx} className="space-y-6 flex flex-col items-center">
              {/* Dropdown Selector */}
              <div className="w-full">
                <label className="block text-[9px] font-bold text-brand-textMuted uppercase tracking-widest mb-2 text-center">
                  iPhone Position {idx + 1}
                </label>
                <div className="relative">
                  <select
                    value={model?.id || "none"}
                    onChange={(e) => handleModelChange(idx, e.target.value)}
                    className="w-full bg-brand-card/90 backdrop-blur border border-brand-border/60 rounded-2xl px-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-gold/60 cursor-pointer appearance-none shadow-sm hover:border-brand-gold/30 transition-colors"
                  >
                    <option value="none">-- Select iPhone --</option>
                    {COMPARISON_MODELS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-textMuted">
                    <span className="text-[10px]">▼</span>
                  </div>
                </div>
              </div>

              {/* iPhone Card details */}
              {model ? (
                <div className="flex-grow flex flex-col items-center w-full space-y-5">
                  {/* Image Box */}
                  <div className="aspect-[4/5] bg-brand-card/85 backdrop-blur-sm w-full rounded-3xl p-6 flex items-center justify-center relative overflow-hidden transition-all duration-300 group border border-brand-border/60 hover:border-brand-gold/20 shadow-md">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="object-contain w-full h-full mix-blend-darken transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Name and Price */}
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-heading font-bold leading-tight text-brand-black">{model.name}</h3>
                    <p className="text-xs text-brand-gold font-extrabold">{formatPrice(model.price)}</p>
                  </div>

                  {/* Color Circles */}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[9px] font-bold text-brand-textMuted uppercase tracking-widest">
                      Color: <span className="text-brand-black">{selectedColors[idx]}</span>
                    </p>
                    <div className="flex gap-2">
                      {model.colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => handleColorChange(idx, color.name)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            selectedColors[idx] === color.name
                              ? "border-brand-gold scale-110 shadow-md ring-2 ring-brand-gold/30"
                              : "border-brand-border/65 hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selectedColors[idx] === color.name && (
                            <Check className={`w-3 h-3 ${color.hex === "#f2f1ed" || color.hex === "#ffffff" || color.hex === "#f5f5f7" ? "text-black" : "text-white"}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full max-w-[200px]"
                  >
                    <button
                      onClick={() => handleAddToCart(idx)}
                      className="w-full mt-2 py-3 bg-brand-black hover:bg-neutral-800 text-brand-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-brand-black/5"
                    >
                      Add to Cart
                    </button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex-grow aspect-[4/5] w-full bg-brand-card/50 backdrop-blur-sm border border-dashed border-brand-border/60 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-brand-textMuted text-xs group hover:border-brand-gold/30 transition-colors">
                  <Smartphone className="w-8 h-8 text-brand-border mb-3 group-hover:text-brand-gold transition-colors" />
                  <p className="font-semibold">Choose an iPhone above to start comparing specs</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Specs Table */}
        <div className="mt-16 bg-brand-card/90 backdrop-blur-md border border-brand-border rounded-3xl overflow-hidden shadow-xl shadow-brand-black/[0.02]">
          <div className="p-6 md:p-8 border-b border-brand-border/40">
            <h2 className="text-xl font-heading font-extrabold uppercase tracking-tight text-center">
              Detailed Comparison Matrix
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-16 bg-brand-card/95 backdrop-blur-md z-20 border-b border-brand-border shadow-sm">
                <tr className="border-b border-brand-border/20 text-[10px] font-bold text-brand-textMuted uppercase tracking-widest">
                  <th className="py-5 px-6 w-1/4 bg-brand-card/60">Specification</th>
                  {models.map((model, idx) => (
                    <th key={idx} className="py-5 px-6 w-1/4 bg-brand-card/60">
                      {model ? (
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-brand-white rounded-xl p-1 flex items-center justify-center shrink-0 border border-brand-border/30">
                            <img src={model.image} alt={model.name} className="h-full object-contain mix-blend-darken" />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-[11px] font-bold text-brand-black leading-tight truncate max-w-[120px]">{model.name}</p>
                            <p className="text-[10px] text-brand-gold font-extrabold mt-0.5">{formatPrice(model.price)}</p>
                          </div>
                          <button
                            onClick={() => handleAddToCart(idx)}
                            className="ml-auto px-2.5 py-1 bg-brand-black hover:bg-neutral-800 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-300">Empty Position</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30 text-xs md:text-sm">
                
                {/* 1. Display */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <Layers className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Display Tech</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">Screen size & features</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <div className="space-y-3">
                          <p className="font-bold text-brand-gold">{model.specs.display}</p>
                          <ul className="space-y-1.5 text-xs text-brand-textMuted">
                            {model.specs.displayFeatures.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/70 mt-1.5 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 2. Chip */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <Cpu className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Processor (Chip)</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">Silicon & performance</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <div className="space-y-3">
                          <p className="font-bold text-brand-black">{model.specs.chip}</p>
                          <ul className="space-y-1.5 text-xs text-brand-textMuted">
                            {model.specs.chipDetails.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/70 mt-1.5 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 3. Camera */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <Camera className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Camera System</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">Optical specifications</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <div className="space-y-3">
                          <p className="font-semibold text-brand-black leading-snug">{model.specs.camera}</p>
                          <ul className="space-y-1.5 text-xs text-brand-textMuted">
                            {model.specs.cameraDetails.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/70 mt-1.5 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 4. Optical Zoom */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Optical Zoom</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">Range & lens capture</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <p className="text-xs text-brand-black leading-normal font-medium">{model.specs.zoom}</p>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 5. Battery */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <Battery className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Battery Runtime</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">Video playback capacity</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <p className="text-xs text-brand-black font-bold leading-normal">{model.specs.battery}</p>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6. Ports */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Connection & Ports</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">Cable types & speeds</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <p className="text-xs text-brand-black leading-normal">{model.specs.ports}</p>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 7. Safety */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Safety Features</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">SOS & crash sensors</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <ul className="space-y-1.5 text-xs text-brand-textMuted">
                          {model.specs.safety.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/70 mt-1.5 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 8. Build */}
                <tr className="hover:bg-brand-gold/[0.015] transition-colors">
                  <td className="py-6 px-6 font-semibold flex items-start gap-2.5">
                    <Layers className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-brand-black font-bold">Materials & Build</p>
                      <p className="text-[10px] text-brand-textMuted leading-normal">Design enclosure</p>
                    </div>
                  </td>
                  {models.map((model, idx) => (
                    <td key={idx} className="py-6 px-6 align-top">
                      {model ? (
                        <p className="text-xs text-brand-black leading-normal">{model.specs.build}</p>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
