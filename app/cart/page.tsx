"use client";

import { useState } from "react";
import { useCartStore } from "@/src/store/useCartStore";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, Check } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [payAs, setPayAs] = useState("Cash");
  const [shippingMethod, setShippingMethod] = useState("rider"); // "rider" | "outside" | "pickup"
  const [shippingFee, setShippingFee] = useState(79); // Default Rider Dash base rate

  // Shipping calculator form fields
  const [country, setCountry] = useState("Philippines");
  const [stateCounty, setStateCounty] = useState("");
  const [townCity, setTownCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleShippingChange = (method: string) => {
    setShippingMethod(method);
    if (method === "pickup") {
      setShippingFee(0);
    } else if (method === "outside") {
      setShippingFee(250);
    } else {
      setShippingFee(79);
    }
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!townCity) return;

    // City-based flat rate lookup (Davao Region + major PH cities)
    const CITY_RATES: Record<string, number> = {
      "davao city": 79, "bajada": 79, "toril": 79, "buhangin": 79,
      "calinan": 79, "marilog": 79, "paquibato": 79, "baguio": 120,
      "tagum": 120, "digos": 120, "panabo": 120, "mati": 150,
      "general santos": 150, "cotabato": 150, "zamboanga": 200,
      "cebu": 200, "cebu city": 200, "mandaue": 200, "lapu-lapu": 200,
      "manila": 250, "quezon city": 250, "makati": 250, "pasig": 250,
      "taguig": 250, "marikina": 250, "caloocan": 250, "las piñas": 250,
      "iloilo": 220, "bacolod": 220, "cagayan de oro": 180,
    };

    if (shippingMethod === "pickup") {
      setShippingFee(0);
    } else {
      const key = townCity.trim().toLowerCase();
      const rate = CITY_RATES[key] ?? (shippingMethod === "outside" ? 250 : 200);
      setShippingFee(rate);
    }
    setIsCalculated(true);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const total = subtotal + shippingFee;

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen bg-brand-white text-brand-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb / Title */}
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-brand-textMuted hover:text-brand-gold gap-1 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> Continue Shopping
          </Link>
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-brand-gold shrink-0" />
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-black tracking-tighter uppercase">Cart</h1>
          </div>
          <p className="text-sm text-brand-textMuted">Let&apos;s see what we&apos;ve got inside.</p>
        </div>

        {/* Dynamic Cart success banner */}
        {items.length > 0 && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs md:text-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>
                &ldquo;{items[0].name}&rdquo; {items.length > 1 ? `and ${items.length - 1} other item(s)` : ""} are currently ready for checkout.
              </span>
            </div>
            <Link 
              href="/" 
              className="px-4 py-2 border border-green-500/30 hover:bg-green-500/10 rounded-lg text-xs font-semibold uppercase tracking-wider text-center transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-24 bg-brand-card rounded-3xl border border-brand-border space-y-6 max-w-lg mx-auto shadow-sm">
            <ShoppingBag className="w-16 h-16 text-brand-border mx-auto" />
            <h2 className="text-2xl font-heading font-bold text-brand-black tracking-tighter">Your cart is empty</h2>
            <p className="text-sm text-brand-textMuted max-w-xs mx-auto">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/" className="px-6 py-3 bg-brand-gold hover:bg-yellow-600 text-white rounded-xl font-bold transition-all shadow-md inline-block">
              Shop Apple Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Product Table */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-brand-card rounded-3xl border border-brand-border overflow-hidden shadow-sm">
                
                {/* Desktop Table Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-brand-white/40 border-b border-brand-border text-xs font-bold text-brand-textMuted uppercase tracking-wider">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-brand-border">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      
                      {/* Desktop layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        
                        {/* Product Detail info */}
                        <div className="col-span-6 flex items-center gap-4">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-brand-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-xl bg-black/5 dark:bg-black/40 border border-brand-border"
                          />
                          
                          <div>
                            <h4 className="font-heading font-semibold text-sm text-brand-black line-clamp-2 tracking-tight">{item.name}</h4>
                            <span className="text-[10px] text-brand-textMuted block mt-0.5">{item.specs}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-right text-sm font-semibold text-brand-black">
                          {formatPrice(item.price)}
                        </div>

                        {/* Quantity Counter */}
                        <div className="col-span-2 flex justify-center">
                          <div className="flex items-center border border-brand-border rounded-lg bg-brand-white">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-brand-border text-brand-textMuted transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-brand-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-brand-border text-brand-textMuted transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 text-right text-sm font-bold text-brand-black">
                          {formatPrice(item.price * item.quantity)}
                        </div>

                      </div>

                      {/* Mobile layout */}
                      <div className="md:hidden space-y-4">
                        <div className="flex gap-4 relative">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 object-cover rounded-xl bg-black/5 dark:bg-black/40 border border-brand-border"
                          />
                          <div className="flex-1 space-y-1 pr-6">
                            <h4 className="font-heading font-semibold text-sm text-brand-black leading-tight tracking-tight">{item.name}</h4>
                            <span className="text-[10px] text-brand-textMuted block">{item.specs}</span>
                            <div className="text-sm font-bold text-brand-black pt-1">{formatPrice(item.price)}</div>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="absolute top-0 right-0 p-1.5 text-brand-textMuted hover:text-red-500 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex justify-between items-center bg-brand-white/40 p-3 rounded-xl border border-brand-border">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-brand-border rounded-lg bg-brand-white">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-brand-border text-brand-textMuted transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold text-brand-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-brand-border text-brand-textMuted transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Total */}
                          <div className="text-sm font-bold text-brand-black">
                            Subtotal: <span className="text-brand-gold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>



            </div>

            {/* Right Column: Cart Totals */}
            <div className="space-y-6">
              <div className="bg-brand-card rounded-3xl border border-brand-border p-6 shadow-sm space-y-6">
                <h2 className="text-xl font-heading font-bold text-brand-black tracking-tighter uppercase pb-2 border-b border-brand-border">Cart Totals</h2>
                
                {/* Pay As Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block">Pay As</label>
                  <select 
                    value={payAs} 
                    onChange={(e) => setPayAs(e.target.value)}
                    className="w-full p-3 rounded-xl border border-brand-border bg-brand-white dark:bg-[#1C1F22] text-sm text-brand-black dark:text-white focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="Cash">Cash on Delivery / Pickup</option>
                    <option value="GCash">GCash</option>
                    <option value="Maya">Maya</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center py-2 text-sm border-b border-brand-border/60">
                  <span className="font-semibold text-brand-textMuted uppercase tracking-wider text-[11px]">Subtotal</span>
                  <span className="font-bold text-brand-black">{formatPrice(subtotal)}</span>
                </div>

                {/* Shipping Radios */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-brand-textMuted uppercase tracking-wider block">Shipping</span>
                  <div className="space-y-3">
                    
                    {/* Option 1: Rider Dash */}
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-brand-white/40 cursor-pointer hover:border-brand-gold/40 transition-colors">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === "rider"}
                        onChange={() => handleShippingChange("rider")}
                        className="mt-1 accent-brand-gold"
                      />
                      <div className="text-xs space-y-0.5 text-brand-black">
                        <span className="font-bold block uppercase tracking-wider text-[10px]">Rider Dash | Davao City</span>
                        <span className="text-brand-textMuted">First 4KM at ₱79 then succeeding ₱15/KM.</span>
                      </div>
                    </label>

                    {/* Option 2: Outside Davao */}
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-brand-white/40 cursor-pointer hover:border-brand-gold/40 transition-colors">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === "outside"}
                        onChange={() => handleShippingChange("outside")}
                        className="mt-1 accent-brand-gold"
                      />
                      <div className="text-xs space-y-0.5 text-brand-black">
                        <span className="font-bold block uppercase tracking-wider text-[10px]">Outside Davao City</span>
                        <span className="text-brand-textMuted">Rates depend on package size/weight (Flat ₱250 estimate).</span>
                      </div>
                    </label>

                    {/* Option 3: Pickup */}
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-brand-border bg-brand-white/40 cursor-pointer hover:border-brand-gold/40 transition-colors">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === "pickup"}
                        onChange={() => handleShippingChange("pickup")}
                        className="mt-1 accent-brand-gold"
                      />
                      <div className="text-xs space-y-0.5 text-brand-black">
                        <span className="font-bold block uppercase tracking-wider text-[10px]">Store Pickup</span>
                        <span className="text-brand-textMuted">Collect directly at our Bajada showroom (₱0 fee).</span>
                      </div>
                    </label>

                  </div>
                </div>

                {/* Calculate Shipping Form toggler */}
                <details className="group border border-brand-border rounded-2xl bg-brand-white/40 overflow-hidden transition-all duration-300">
                  <summary className="flex items-center justify-between p-3.5 cursor-pointer text-xs font-bold text-brand-black uppercase tracking-wider hover:bg-brand-border transition-colors list-none">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-gold" />
                      Calculate Shipping
                    </span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  
                  <form onSubmit={handleCalculateShipping} className="p-4 border-t border-brand-border space-y-3 bg-brand-white">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">Country</label>
                      <select 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-brand-border bg-brand-card dark:bg-[#1C1F22] text-xs text-brand-black dark:text-white focus:outline-none focus:border-brand-gold transition-colors"
                      >
                        <option value="Philippines">Philippines</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">State / County</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Davao del Sur" 
                        value={stateCounty} 
                        onChange={(e) => setStateCounty(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-brand-border bg-brand-card text-xs text-brand-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">Town / City</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Bajada, Davao City" 
                        value={townCity} 
                        onChange={(e) => setTownCity(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-lg border border-brand-border bg-brand-card text-xs text-brand-black focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">Postcode / ZIP</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 8000" 
                        value={zipCode} 
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-brand-border bg-brand-card text-xs text-brand-black focus:outline-none"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full py-2.5 bg-brand-black hover:bg-gray-800 dark:hover:bg-gray-200 text-brand-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Update
                    </button>

                    {isCalculated && (
                      <p className="text-[10px] text-green-600 font-semibold text-center mt-2">
                        ✔ Shipping rates calculated based on location!
                      </p>
                    )}
                  </form>
                </details>

                {/* Final Total */}
                <div className="flex justify-between items-center py-2 text-base border-y border-brand-border">
                  <span className="font-bold text-brand-black uppercase tracking-wider text-xs">Total</span>
                  <div className="text-right">
                    <span className="font-heading font-extrabold text-xl text-brand-gold block">{formatPrice(total)}</span>
                    {shippingFee > 0 && (
                      <span className="text-[10px] text-brand-textMuted block">Includes {formatPrice(shippingFee)} shipping fee</span>
                    )}
                  </div>
                </div>

                {/* Checkout Link CTA */}
                <Link 
                  href={`/checkout?payAs=${payAs}&shipping=${shippingMethod}&fee=${shippingFee}`}
                  className="w-full py-4 bg-brand-gold hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-gold/15 flex items-center justify-center text-center uppercase tracking-widest text-xs"
                >
                  Proceed to Checkout
                </Link>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
