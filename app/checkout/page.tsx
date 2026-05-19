"use client";

import { useState, useEffect, Suspense } from "react";
import { useCartStore } from "@/src/store/useCartStore";
import { useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  Building,
  Clipboard,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import OfficialQuotation from "@/components/checkout/OfficialQuotation";

function CheckoutContent() {
  const { items, clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryMethod: "cod", // 'cod' | 'pickup'
    addressRegion: "",
    addressCity: "",
    addressStreet: "",
    paymentMethod: "gcash", // 'gcash' | 'maya' | 'card' | 'cod' | 'store_pickup'
  });

  const [customShippingFee, setCustomShippingFee] = useState<number | null>(null);

  useEffect(() => {
    const payAsParam = searchParams.get("payAs");
    const shippingParam = searchParams.get("shipping");
    const feeParam = searchParams.get("fee");

    setFormData((prev) => {
      const updated = { ...prev };
      
      if (shippingParam === "pickup") {
        updated.deliveryMethod = "pickup";
        updated.paymentMethod = "store_pickup";
      } else if (shippingParam === "outside") {
        updated.deliveryMethod = "cod";
        updated.paymentMethod = "gcash";
      } else if (shippingParam === "rider") {
        updated.deliveryMethod = "cod";
        updated.paymentMethod = "gcash";
      }

      if (payAsParam) {
        const lower = payAsParam.toLowerCase();
        if (lower === "gcash") updated.paymentMethod = "gcash";
        else if (lower === "maya") updated.paymentMethod = "maya";
        else if (lower === "card") updated.paymentMethod = "card";
        else if (lower === "cash") {
          if (updated.deliveryMethod === "pickup") {
            updated.paymentMethod = "store_pickup";
          } else {
            updated.paymentMethod = "cod";
          }
        }
      }

      return updated;
    });

    if (feeParam) {
      const parsed = parseFloat(feeParam);
      if (!isNaN(parsed)) {
        setCustomShippingFee(parsed);
      }
    }
  }, [searchParams]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = customShippingFee !== null 
    ? customShippingFee 
    : (formData.deliveryMethod === "pickup" ? 0 : 150);
  const total = subtotal + shippingFee;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto adjust payment option based on delivery method
      if (name === "deliveryMethod") {
        if (value === "pickup") {
          updated.paymentMethod = "store_pickup";
        } else {
          updated.paymentMethod = "gcash";
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API POST /api/checkout
    try {
      const orderId = `MHLK-${Math.floor(100000 + Math.random() * 900000)}`;
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerEmail: formData.email,
          items: items.map(item => ({ id: item.id, qty: item.quantity }))
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        // Success payload for modal
        setOrderSuccess({
          orderId,
          date: new Date().toLocaleDateString(),
          ...formData,
          items: [...items],
          subtotal,
          shippingFee,
          total
        });
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-black pt-24 pb-20 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-brand-textMuted hover:text-brand-black transition-colors mb-8 group text-sm font-medium">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to store
        </Link>

        <h1 className="text-3xl md:text-5xl font-heading font-bold text-brand-black mb-10 tracking-tighter">Checkout</h1>

        {orderSuccess ? (
          <OfficialQuotation 
            order={orderSuccess} 
            onBackToStore={() => {
              setOrderSuccess(null);
              window.location.href = "/";
            }}
          />
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-brand-card rounded-3xl border border-brand-border space-y-6 max-w-md mx-auto shadow-sm">
            <ShoppingBag className="w-16 h-16 text-brand-textMuted mx-auto" />
            <h2 className="text-xl font-heading font-semibold text-brand-black">Your cart is empty</h2>
            <p className="text-sm text-brand-textMuted">Add some premium devices to your cart to process checkout details.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-brand-gold text-white font-medium rounded-xl hover:bg-yellow-600 transition-colors">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left side: Checkout Forms */}
            <div className="lg:col-span-7 bg-brand-card rounded-3xl border border-brand-border p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Customer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-brand-black flex items-center gap-2 pb-2 border-b border-brand-border">
                    <User className="w-5 h-5 text-brand-gold" />
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        name="fullName" 
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe" 
                        className="w-full bg-brand-white/50 dark:bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com" 
                        className="w-full bg-brand-white/50 dark:bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="text" 
                        name="phone" 
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0912 345 6789" 
                        className="w-full bg-brand-white/50 dark:bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-brand-black flex items-center gap-2 pb-2 border-b border-brand-border">
                    <MapPin className="w-5 h-5 text-brand-gold" />
                    Delivery Option
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${formData.deliveryMethod === "cod" ? "border-brand-gold bg-brand-gold/5" : "border-brand-border bg-brand-white/50 dark:bg-white/5"}`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value="cod"
                        checked={formData.deliveryMethod === "cod"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-brand-black block">Cash on Delivery</span>
                        <span className="text-[10px] text-brand-textMuted">Shipped locally (₱150)</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-brand-textMuted group-hover:translate-x-0.5 transition-transform" />
                    </label>

                    <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${formData.deliveryMethod === "pickup" ? "border-brand-gold bg-brand-gold/5" : "border-brand-border bg-brand-white/50 dark:bg-white/5"}`}>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value="pickup"
                        checked={formData.deliveryMethod === "pickup"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-brand-black block">Showroom Pick-up</span>
                        <span className="text-[10px] text-brand-textMuted">F. Torres St, Davao City (Free)</span>
                      </div>
                      <Building className="w-4 h-4 text-brand-gold" />
                    </label>
                  </div>

                  {formData.deliveryMethod === "cod" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Region</label>
                        <input 
                          type="text" 
                          name="addressRegion" 
                          required
                          value={formData.addressRegion}
                          onChange={handleInputChange}
                          placeholder="Davao Region" 
                          className="w-full bg-brand-white/50 dark:bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">City / Municipality</label>
                        <input 
                          type="text" 
                          name="addressCity" 
                          required
                          value={formData.addressCity}
                          onChange={handleInputChange}
                          placeholder="Davao City" 
                          className="w-full bg-brand-white/50 dark:bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Street / House No.</label>
                        <input 
                          type="text" 
                          name="addressStreet" 
                          required
                          value={formData.addressStreet}
                          onChange={handleInputChange}
                          placeholder="F. Torres St, House #4" 
                          className="w-full bg-brand-white/50 dark:bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-black focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-heading font-bold text-brand-black flex items-center gap-2 pb-2 border-b border-brand-border">
                    <CreditCard className="w-5 h-5 text-brand-gold" />
                    Payment Method
                  </h3>
                  
                  {formData.deliveryMethod === "pickup" ? (
                    <div className="p-4 rounded-2xl border border-brand-border bg-brand-white/50 dark:bg-white/5 space-y-1">
                      <span className="text-sm font-semibold text-brand-black block">Cash / Card on Store Pick-up</span>
                      <span className="text-xs text-brand-textMuted">Complete payment via Cash or Terminal Credit Cards when verifying order in showroom.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center ${formData.paymentMethod === "gcash" ? "border-brand-gold bg-brand-gold/5" : "border-brand-border bg-brand-white/50 dark:bg-white/5"}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="gcash"
                          checked={formData.paymentMethod === "gcash"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-brand-black block">GCash Digital Wallet</span>
                          <span className="text-[10px] text-brand-textMuted">Instant online clearance</span>
                        </div>
                        <span className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center font-bold text-[10px] uppercase">G</span>
                      </label>

                      <label className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center ${formData.paymentMethod === "maya" ? "border-brand-gold bg-brand-gold/5" : "border-brand-border bg-brand-white/50 dark:bg-white/5"}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="maya"
                          checked={formData.paymentMethod === "maya"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-brand-black block">Maya Wallet</span>
                          <span className="text-[10px] text-brand-textMuted">Online payment clearance</span>
                        </div>
                        <span className="w-8 h-8 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center font-bold text-[10px] uppercase">M</span>
                      </label>

                      <label className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center ${formData.paymentMethod === "card" ? "border-brand-gold bg-brand-gold/5" : "border-brand-border bg-brand-white/50 dark:bg-white/5"}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-brand-black block">Credit / Debit Card</span>
                          <span className="text-[10px] text-brand-textMuted">Visa, Mastercard</span>
                        </div>
                        <CreditCard className="w-4 h-4 text-brand-textMuted" />
                      </label>

                      <label className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center ${formData.paymentMethod === "cod" ? "border-brand-gold bg-brand-gold/5" : "border-brand-border bg-brand-white/50 dark:bg-white/5"}`}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-brand-black block">Cash on Delivery (COD)</span>
                          <span className="text-[10px] text-brand-textMuted">Pay when item arrives</span>
                        </div>
                        <span className="w-8 h-8 bg-brand-gold/10 text-brand-gold rounded-lg flex items-center justify-center font-bold text-[10px] uppercase">COD</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-gold hover:bg-yellow-600 disabled:bg-gray-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-gold/15 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing transaction payload...</span>
                  ) : (
                    <span>Place Order & Generate Invoice</span>
                  )}
                </button>

              </form>
            </div>

            {/* Right side: Cart Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-brand-card rounded-3xl border border-brand-border p-6 space-y-6 shadow-sm">
                <h3 className="text-lg font-heading font-bold text-brand-black flex items-center gap-2 pb-2 border-b border-brand-border">
                  <ShoppingBag className="w-5 h-5 text-brand-gold" />
                  Order Summary
                </h3>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-black/5 dark:bg-black/40 border border-brand-border" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-xs text-brand-black truncate">{item.name}</h4>
                        <span className="text-[9px] text-brand-textMuted block truncate">{item.specs}</span>
                        <span className="text-[10px] text-brand-gold mt-1 block">Qty: {item.quantity}</span>
                      </div>
                      <span className="text-xs font-bold text-brand-black">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-border pt-4 space-y-3">
                  <div className="flex justify-between text-xs text-brand-textMuted">
                    <span>Subtotal</span>
                    <span className="text-brand-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-textMuted">
                    <span>Delivery Fee</span>
                    <span className="text-brand-black">{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-brand-border pt-3">
                    <span>Total Amount</span>
                    <span className="text-brand-gold">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-white text-brand-black flex items-center justify-center pt-24 uppercase font-bold text-xs tracking-widest">
        Loading Checkout details...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
