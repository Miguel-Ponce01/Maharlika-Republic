"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, CreditCard, Wallet, Landmark, Gift, Info } from "lucide-react";

export default function PaymentOptionsPage() {
  // Accordion state
  const [activePayment, setActivePayment] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const togglePayment = (key: string) => {
    setActivePayment(prev => (prev === key ? null : key));
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(prev => (prev === index ? null : index));
  };

  const paymentModes = [
    {
      key: "card",
      title: "Credit / Debit Card",
      icon: CreditCard,
      content: "We accept all major local and international credit and debit cards, including Visa, Mastercard, JCB, and American Express. Card transactions are processed securely through our payment gateways with 0% installment options available for participating local banks (BDO, BPI, Metrobank) up to 12 months."
    },
    {
      key: "online",
      title: "Online Banking",
      icon: Landmark,
      content: "Process instant payments directly through your bank's secure portal. Supported banks include BDO Online, BPI Express Online, Metrobank Direct, UnionBank Online, and Landbank. Transactions are validated in real-time for immediate order processing."
    },
    {
      key: "wallet",
      title: "e-Wallet",
      icon: Wallet,
      content: "Pay instantly using your favorite mobile wallet. We fully support GCash (with GGives and GPay options), Maya (PayMaya), GrabPay, and ShopeePay. Scan the generated QR code at checkout to authorize your payment."
    },
    {
      key: "tendopay",
      title: "TendoPay",
      icon: Info,
      content: "TendoPay is an installment platform that allows you to buy devices now and spread the cost over 2 to 12 months. Requires an active TendoPay account with approved credit limit. Available at checkout authorization."
    },
    {
      key: "billease",
      title: "BillEase (Buy Now, Pay Later)",
      icon: Info,
      content: "Split your purchase into low-interest, flexible installment plans under BillEase without needing a credit card. Choose pay terms from 30 days up to 12 months. Instant registration and credit evaluation in under 5 minutes."
    },
    {
      key: "egifts",
      title: "eGifts from Giftaway",
      icon: Gift,
      content: "Redeem Giftaway eGift vouchers directly during checkout. Input your unique voucher code to subtract the voucher value from your order total. Multiple vouchers can be combined on a single order."
    }
  ];

  const faqs = [
    {
      q: "1. Do you have an installment plan?",
      a: "Yes! We offer 0% interest lay-away plans up to 6 months directly. In addition, we support digital financing partners in-store and online (Salmon, Skyro, GGives, BillEase, and TendoPay) as well as credit card installments up to 24 months."
    },
    {
      q: "2. Is it safe to pay with my credit card?",
      a: "Absolutely. Our checkout system is fully PCI-DSS compliant. Card credentials are encrypted and processed directly via secure payment tokens, meaning no card details are ever stored on our local servers."
    },
    {
      q: "3. My payment failed. What do I do next?",
      a: "If your payment fails, check that your account has sufficient funds or that your credit card online limit is active. You can also change the payment method to GCash/COD, or contact our support desk for manual order reservation."
    },
    {
      q: "4. My credit card got charged twice. How do I fix this?",
      a: "Duplicate charges are usually temporary bank hold authorizations that clear in 2-3 business days. Please contact us with your order reference (MHLK-XXXXXX) and bank receipt screenshot, and we will coordinate with the processor to void the double charge immediately."
    },
    {
      q: "5. Do you offer Cash on Delivery (COD)?",
      a: "Yes! We offer local Cash on Delivery (COD) and Cash on Pickup for buyers in Davao City. For shipments outside Davao, payment must be processed beforehand via GCash, Maya, or bank transfer."
    },
    {
      q: "6. Can I request for the Sales Invoice to be addressed to my company?",
      a: "Yes. During checkout, you can input your company details (Company Name, TIN, and Address) in the order notes field, and we will issue the official receipt/sales invoice matching those parameters."
    }
  ];

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Title block */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center text-brand-gold">
            <CreditCard className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-brand-black tracking-tighter uppercase">
            Payment Options
          </h1>
          <p className="text-xs md:text-sm text-brand-textMuted max-w-lg mx-auto leading-relaxed">
            Here&apos;s a list of accepted modes of payments on our website. For questions and concerns, feel free to send us a message through our social desk, or email us at{" "}
            <a href="mailto:inquiry@maharlikarepublic.com" className="text-brand-gold hover:underline font-semibold">
              inquiry@maharlikarepublic.com
            </a>.
          </p>
        </div>

        {/* Section 1: Modes of Payment */}
        <div className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-brand-black tracking-tighter uppercase pb-2 border-b border-brand-border">
            Modes of Payment
          </h2>
          
          <div className="space-y-3">
            {paymentModes.map((mode) => {
              const Icon = mode.icon;
              const isOpen = activePayment === mode.key;
              return (
                <div 
                  key={mode.key}
                  className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => togglePayment(mode.key)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-brand-white/40 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-brand-gold shrink-0" />
                      <span className="text-sm font-semibold text-brand-black tracking-tight">{mode.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-brand-textMuted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-brand-textMuted leading-relaxed border-t border-brand-border/60 bg-brand-white/20">
                      {mode.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Frequently Asked Questions */}
        <div className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-brand-black tracking-tighter uppercase pb-2 border-b border-brand-border">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFAQ === index;
              return (
                <div 
                  key={index}
                  className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-brand-white/40 transition-colors focus:outline-none"
                  >
                    <span className="text-sm font-semibold text-brand-black tracking-tight">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-brand-textMuted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-brand-textMuted leading-relaxed border-t border-brand-border/60 bg-brand-white/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Help banner */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="flex justify-center text-brand-gold">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-brand-black tracking-tight uppercase">
            Need help? Let us know how.
          </h2>
          <p className="text-xs text-brand-textMuted max-w-sm mx-auto leading-relaxed">
            Our support desk is online to assist you with specs compatibility check, bulk purchases, and live in-store financing.
          </p>
          <a 
            href="https://www.facebook.com/messages/t/marexxrepublicdavao"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-brand-black hover:bg-gray-800 dark:hover:bg-gray-200 text-brand-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            Contact us
          </a>
        </div>

      </div>
    </div>
  );
}
