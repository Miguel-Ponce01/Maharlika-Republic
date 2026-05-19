"use client";

import { useState } from "react";
import { 
  Printer, 
  Clipboard, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Percent,
  Users,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  specs: string;
  quantity: number;
}

interface Order {
  orderId: string;
  date: string;
  fullName: string;
  email: string;
  phone: string;
  deliveryMethod: string;
  addressRegion?: string;
  addressCity?: string;
  addressStreet?: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

interface OfficialQuotationProps {
  order: Order;
  onBackToStore: () => void;
}

export default function OfficialQuotation({ order, onBackToStore }: OfficialQuotationProps) {
  const [copiedText, setCopiedText] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getValidityDate = () => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 7);
    return dateObj.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate copy-paste text for Facebook Messenger
  const getOrderPayloadString = () => {
    const itemsStr = order.items
      .map((i) => `• ${i.name} (${i.specs}) x${i.quantity} - ${formatPrice(i.price * i.quantity)}`)
      .join("\n");
    return `Maharlika Republic Quotation Reference: ${order.orderId}
--------------------------------------
Date Issued: ${order.date}
Valid Until: ${getValidityDate()}

Customer Details:
- Name: ${order.fullName}
- Phone: ${order.phone}
- Email: ${order.email}
- Delivery Option: ${order.deliveryMethod === "pickup" ? "Showroom Pick-up (Bajada)" : "Cash on Delivery"}
- Address: ${order.deliveryMethod === "pickup" ? "Bajada Showroom, Davao City" : `${order.addressStreet}, ${order.addressCity}, ${order.addressRegion}`}
- Chosen Payment Terms: ${order.paymentMethod.toUpperCase()}

QUOTED ITEMS:
${itemsStr}

Subtotal: ${formatPrice(order.subtotal)}
Shipping Fee: ${formatPrice(order.shippingFee)}
GRAND TOTAL: ${formatPrice(order.total)}
--------------------------------------
Quotation generated online. Please confirm unit availability and dispatch schedule.`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getOrderPayloadString());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Davao local financing scheme calculations
  const paluwaganMonthly = (order.total * 1.12) / 10; // 10 months installment with 12% total processing markup
  const layAwayDown = order.total * 0.20; // 20% downpayment
  const layAwayMonthly = (order.total * 0.80) / 6; // 6 months lay-away at 0% interest
  const salmonMonthly = (order.total * 0.70 * 1.28) / 12; // 30% down, 12 months with 28% APR standard financing

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Control Action Bar (Hidden on print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-card p-4 rounded-2xl border border-brand-border/40 shadow-sm print:hidden">
        <button 
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-textMuted hover:text-brand-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Store
        </button>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopyToClipboard}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-brand-white dark:bg-black border border-brand-border text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-brand-black"
          >
            <Clipboard className="w-3.5 h-3.5 text-brand-gold" />
            {copiedText ? "Copied Details!" : "Copy Order Details"}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-brand-white dark:bg-black border border-brand-border text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-brand-black"
          >
            <Printer className="w-3.5 h-3.5 text-brand-gold" />
            Print Quotation / Save PDF
          </button>

          <a
            href="https://www.facebook.com/messages/t/marexxrepublicdavao"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-brand-gold hover:bg-yellow-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-brand-gold/10 text-white"
          >
            <span>Message Representative</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Success Notification Alert (Hidden on print) */}
      <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 p-5 rounded-2xl print:hidden">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 shrink-0">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-brand-black">Quotation Created Successfully</h4>
          <p className="text-xs text-brand-textMuted leading-relaxed">
            Your quotation sheet is locked below. Please print/save it or copy the details to finalize scheduling on our Davao facebook shop.
          </p>
        </div>
      </div>

      {/* 2. Official Printable Quotation Card */}
      <div id="printable-quotation-sheet" className="bg-brand-card print:bg-white text-brand-black print:text-black border border-brand-border print:border-none rounded-3xl p-6 sm:p-12 shadow-md print:shadow-none max-w-4xl mx-auto relative overflow-hidden">
        
        {/* Subtle Watermark for Authenticity (Hidden on print) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.01] pointer-events-none select-none print:hidden">
          <h1 className="text-[120px] font-heading font-extrabold rotate-45 tracking-widest leading-none">MAHARLIKA</h1>
        </div>

        {/* Quotation Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-brand-border/60 pb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <h2 className="text-xl font-heading font-extrabold tracking-tight text-brand-black print:text-black flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-brand-gold rounded-full" />
              MAHARLIKA REPUBLIC
            </h2>
            <p className="text-[11px] text-brand-textMuted print:text-neutral-500 max-w-xs leading-relaxed">
              Davao City's Premier Premium Apple Device Showroom & Lay-Away Hub<br />
              2nd Floor, Marexx Building, F. Torres St., Bajada, Davao City, 8000
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-brand-textMuted print:text-neutral-500">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-brand-gold" /> +63 917 123 4567</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-brand-gold" /> sales@maharlikarepublic.com</span>
            </div>
          </div>

          {/* Quotation Metadata */}
          <div className="text-left md:text-right space-y-2 md:self-stretch flex flex-col justify-between items-start md:items-end">
            <div>
              <span className="px-2.5 py-1 bg-brand-gold/10 text-brand-gold text-[9px] font-extrabold rounded-full uppercase tracking-wider print:hidden">
                OFFICIAL SALE QUOTATION
              </span>
              <span className="hidden print:inline text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                OFFICIAL SALE QUOTATION
              </span>
              <h1 className="text-2xl font-heading font-extrabold tracking-tighter text-brand-black print:text-black mt-1">
                Ref: {order.orderId}
              </h1>
            </div>
            <div className="text-[11px] text-brand-textMuted print:text-neutral-500 space-y-1">
              <div className="flex md:justify-end gap-1.5">
                <span className="font-semibold text-brand-black print:text-black">Date Issued:</span>
                <span>{order.date}</span>
              </div>
              <div className="flex md:justify-end gap-1.5">
                <span className="font-semibold text-brand-black print:text-black">Validity:</span>
                <span>7 Days (Until {getValidityDate()})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Billing Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-brand-border/60">
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Prepared For (Client Details)
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-bold text-brand-black print:text-black">{order.fullName}</p>
              <p className="text-[11px] text-brand-textMuted print:text-neutral-500">Contact: {order.phone}</p>
              <p className="text-[11px] text-brand-textMuted print:text-neutral-500">Email: {order.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Dispatch & Fulfillment
            </h3>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-brand-black print:text-black">
                {order.deliveryMethod === "pickup" ? "Showroom Pick-up (Bajada Showroom)" : "Local Doorstep Cash on Delivery (COD)"}
              </p>
              <p className="text-[11px] text-brand-textMuted print:text-neutral-500 leading-relaxed">
                {order.deliveryMethod === "pickup" 
                  ? "Maharlika Showroom, 2nd Flr, Marexx Bldg, Bajada, Davao City" 
                  : `${order.addressStreet}, ${order.addressCity}, ${order.addressRegion}`}
              </p>
              <p className="text-[11px] text-brand-textMuted print:text-neutral-500">
                Payment Type: <span className="font-semibold text-brand-black print:text-black uppercase">{order.paymentMethod}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-8">
          <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-4">Itemized Quoted Catalog Devices</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-border/60 text-brand-textMuted print:text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 w-8">No.</th>
                  <th className="pb-3 pl-2">Product Details</th>
                  <th className="pb-3 text-center w-20">Quantity</th>
                  <th className="pb-3 text-right w-28">Unit Price</th>
                  <th className="pb-3 text-right w-28">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/45">
                {order.items.map((item, index) => (
                  <tr key={item.id} className="text-brand-textMuted print:text-neutral-700">
                    <td className="py-4 text-brand-black print:text-black font-semibold">{index + 1}</td>
                    <td className="py-4 pl-2 space-y-0.5">
                      <p className="font-semibold text-brand-black print:text-black text-xs leading-snug">{item.name}</p>
                      <p className="text-[10px] text-brand-textMuted print:text-neutral-500 font-medium">Specs: {item.specs}</p>
                    </td>
                    <td className="py-4 text-center text-brand-black print:text-black">{item.quantity}</td>
                    <td className="py-4 text-right">{formatPrice(item.price)}</td>
                    <td className="py-4 text-right text-brand-black print:text-black font-semibold">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Calculations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-brand-border/60 pt-8 items-start">
          
          {/* Terms, Conditions, and Reminders */}
          <div className="space-y-4">
            <div className="bg-brand-white/40 dark:bg-white/5 print:bg-neutral-50 p-4 rounded-xl border border-brand-border/40 text-[10px] text-brand-textMuted print:text-neutral-600 leading-relaxed space-y-2">
              <p className="font-bold text-brand-black print:text-black uppercase tracking-wider flex items-center gap-1 text-[9px]">
                <Calendar className="w-3 h-3 text-brand-gold" />
                Terms & Conditions
              </p>
              <ul className="list-disc pl-3.5 space-y-1.5">
                <li>This official quotation is valid for seven (7) days. Stock allocations are subject to reservation check.</li>
                <li>Devices include 1-Year Store Diagnostic Warranty & Apple Warranty (for brand new units).</li>
                <li>Ensure details match your primary government ID if processingSalmon or Skyro installments in-store.</li>
              </ul>
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="bg-brand-white/40 dark:bg-white/5 print:bg-neutral-50 p-6 rounded-2xl border border-brand-border/40 space-y-3.5">
            <div className="flex justify-between text-xs text-brand-textMuted print:text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-black print:text-black">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-brand-textMuted print:text-neutral-500">
              <span>Fulfillment & Delivery Fee</span>
              <span className="font-semibold text-brand-black print:text-black">{formatPrice(order.shippingFee)}</span>
            </div>
            
            <div className="border-t border-brand-border/60 pt-3 flex justify-between items-baseline">
              <span className="text-xs font-bold text-brand-black print:text-black uppercase">GRAND TOTAL DUE</span>
              <span className="text-lg font-heading font-extrabold text-brand-gold">{formatPrice(order.total)}</span>
            </div>
          </div>

        </div>

        {/* Davao Local Installment Breakdown Section */}
        <div className="mt-8 border-t border-brand-border/60 pt-8">
          <h3 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-4 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            Estimated Davao Showroom Installment & Financing Schedule
          </h3>
          <p className="text-[10px] text-brand-textMuted print:text-neutral-500 mb-6 leading-relaxed">
            Locked estimates for visual reference only. Actual terms can be finalized upon ID checking at our Bajada physical outlet.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Paluwagan */}
            <div className="p-4 bg-brand-white/20 dark:bg-white/5 print:bg-neutral-50 rounded-xl border border-brand-border/40 space-y-1.5 text-center">
              <Users className="w-4 h-4 text-brand-gold mx-auto" />
              <h4 className="text-[10px] font-bold text-brand-black print:text-black uppercase">Paluwagan term</h4>
              <p className="text-sm font-heading font-extrabold text-brand-gold">{formatPrice(paluwaganMonthly)}</p>
              <p className="text-[9px] text-brand-textMuted">Per month for 10 months</p>
            </div>

            {/* Lay-Away */}
            <div className="p-4 bg-brand-white/20 dark:bg-white/5 print:bg-neutral-50 rounded-xl border border-brand-border/40 space-y-1.5 text-center">
              <Percent className="w-4 h-4 text-brand-gold mx-auto" />
              <h4 className="text-[10px] font-bold text-brand-black print:text-black uppercase">0% Lay-Away term</h4>
              <p className="text-xs font-bold text-brand-black print:text-black mt-1">Down: {formatPrice(layAwayDown)}</p>
              <p className="text-sm font-heading font-extrabold text-brand-gold">{formatPrice(layAwayMonthly)}</p>
              <p className="text-[9px] text-brand-textMuted">Per month for 6 months</p>
            </div>

            {/* Salmon & Skyro */}
            <div className="p-4 bg-brand-white/20 dark:bg-white/5 print:bg-neutral-50 rounded-xl border border-brand-border/40 space-y-1.5 text-center">
              <ShieldCheck className="w-4 h-4 text-brand-gold mx-auto" />
              <h4 className="text-[10px] font-bold text-brand-black print:text-black uppercase">Salmon / Skyro term</h4>
              <p className="text-[9px] text-brand-textMuted">With 30% Downpayment</p>
              <p className="text-sm font-heading font-extrabold text-brand-gold">{formatPrice(salmonMonthly)}</p>
              <p className="text-[9px] text-brand-textMuted">Per month for 12 months</p>
            </div>
          </div>
        </div>

        {/* Printable Footer / Signatures */}
        <div className="mt-12 pt-8 border-t border-brand-border/40 grid grid-cols-2 gap-8 text-center text-[10px] text-brand-textMuted print:text-neutral-500">
          <div className="space-y-12">
            <p className="font-semibold">Prepared By:</p>
            <div className="w-32 border-b border-brand-border/60 mx-auto" />
            <p className="font-bold text-brand-black print:text-black">MAHARLIKA REPUBLIC SALES TEAM</p>
          </div>
          <div className="space-y-12">
            <p className="font-semibold">Received & Approved By Client:</p>
            <div className="w-32 border-b border-brand-border/60 mx-auto" />
            <p className="font-bold text-brand-black print:text-black uppercase">{order.fullName}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
