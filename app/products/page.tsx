"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/src/store/useCartStore";
import { useUIStore } from "@/src/store/useUIStore";
import { ShoppingBag, ChevronRight, HelpCircle } from "lucide-react";
import ProductDetailsModal from "@/components/ui/ProductDetailsModal";

// The products are now fetched dynamically from the Supabase database via the API
type ProductItem = {
  id: string;
  name: string;
  price: number;
  monthlyInstallment: number;
  image: string;
  type: string;
  brand: string;
  compatibility: string;
  specs: string;
};

const ITEMS_PER_PAGE = 12;

const BANNER_MAP: Record<string, { title: string, desc: string, image: string }> = {
  "Accessories": {
    title: "TechWoven Case with MagSafe for the latest generation of iPhone.",
    desc: "Designed by Apple, the TechWoven Case with MagSafe offers beautiful personalization and protection for your iPhone. This case is made from a custom technical woven fabric, made from 100 percent recycled polyester.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop"
  },
  "Apple Watch": {
    title: "The ultimate way to watch your health.",
    desc: "The more insights you have, the more empowered you are to take action. From the ECG app to the Vitals app and more, Apple Watch provides a bigger picture of your health, so you can stay informed.",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800&auto=format&fit=crop"
  },
  "iPad": {
    title: "Whoosh.",
    desc: "The lightning fast M4 chip with 50 percent more unified system memory elevates performance for all the things you love to do on iPad Pro. It's an AI powerhouse, enabling the AI features and capabilities you use every day to get things done faster.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop"
  },
  "Mac": {
    title: "Love at first Mac.",
    desc: "We're making Mac that have an amazing presence. It is an amazing piece. With a durable design, beautiful colors, and powerful features, it is a great new way to fall in love with Mac, every day.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
  },
  "iPhone": {
    title: "iPhone 16 Pro Max.",
    desc: "Built for Apple Intelligence. Featuring a stunning titanium design. Camera Control. 4K 120 fps Dolby Vision. And the ultra-fast A18 Pro chip.",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop"
  },
  "AirPods & Earphones": {
    title: "Magic runs in the family.",
    desc: "AirPods deliver an unparalleled wireless audio experience. With high-quality sound, advanced noise cancellation, and a charging case that provides more than 24 hours of battery life.",
    image: "https://images.unsplash.com/photo-1588449668338-d15168b5a4c5?q=80&w=800&auto=format&fit=crop"
  }
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const [currentCategory, setCurrentCategory] = useState("All Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        
        if (data.success && data.products) {
          // Map database structure to flat frontend structure
          const mappedProducts = data.products.map((p: any) => {
            const variant = p.variants?.[0] || {};
            const specsStr = [variant.storageCapacity, variant.colorSpec].filter(Boolean).join(", ");
            
            return {
              id: p.systemMetadata?.id || p.modelName.toLowerCase().replace(/\s+/g, '-'),
              name: p.modelName,
              price: variant.priceCents ? variant.priceCents / 100 : 0,
              monthlyInstallment: p.systemMetadata?.monthlyInstallment || 0,
              image: variant.imageUrl || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400",
              type: p.systemMetadata?.type || p.categoryType,
              brand: p.brandName,
              compatibility: p.systemMetadata?.compatibility || "",
              specs: specsStr || "Standard"
            };
          });
          setProductsList(mappedProducts);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // Parse URL parameter
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      setCurrentCategory(typeParam);
      setCurrentPage(1);
    } else {
      setCurrentCategory("All Products");
    }
  }, [searchParams]);

  // Filter products by the current category
  const processedProducts = useMemo(() => {
    let list = [...productsList];
    if (currentCategory !== "All Products") {
      list = list.filter(p => p.type === currentCategory);
    }
    return list;
  }, [currentCategory, productsList]);

  // Pagination logic
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      specs: product.specs
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

  const bannerData = BANNER_MAP[currentCategory] || {
    title: "Premium Tech Delivered.",
    desc: "Experience the finest selection of genuine gadgets and accessories delivered straight to your door with confidence and swift tracking.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen bg-brand-white text-brand-black transition-colors duration-300">
      
      {/* Dynamic Header Strip */}
      <div className="bg-[#F5F5F7] dark:bg-black text-brand-black dark:text-white pt-36 pb-16 px-6 text-center border-b border-brand-border/40 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/10 dark:bg-brand-gold/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest gap-2 mb-6">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-gold">{currentCategory}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter">
            {currentCategory}
          </h1>
        </div>
      </div>

      {/* Product Grid Area (Full Width, No Sidebar) */}
      <div className="max-w-7xl mx-auto px-6 py-24 min-h-[60vh]">
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-6"></div>
            <h3 className="text-sm font-bold text-brand-black uppercase tracking-widest">Loading Catalog</h3>
          </div>
        ) : processedProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-brand-border mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-black">No products matched</h3>
            <p className="text-xs text-brand-textMuted">Check back later for newly added items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            {paginatedProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => setSelectedProduct(product)}
                className="group relative block cursor-pointer active:scale-[0.98] transition-transform duration-150"
              >
                {/* Image Frame (Sleek light-grey box matching screenshot) */}
                <div className="aspect-[4/5] bg-[#F5F5F7] dark:bg-[#1C1F22] mb-6 flex items-center justify-center relative p-8 group-hover:bg-[#ebebed] dark:group-hover:bg-[#25292D] transition-colors rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-contain w-full h-full mix-blend-darken dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Subtle hover overlay to add to cart */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, e);
                      }}
                      className="translate-y-8 group-hover:translate-y-0 transition-all duration-300 px-6 py-3 bg-brand-black text-white text-xs font-bold rounded-full shadow-xl hover:bg-gray-800"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="space-y-1.5 px-2 text-center md:text-left">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{product.brand}</p>
                  <h3 className="text-sm font-semibold text-brand-black group-hover:text-brand-gold transition-colors leading-snug">{product.name}</h3>
                  <div className="pt-1">
                    <p className="text-sm font-bold text-brand-black">
                      From {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Minimalist Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-16">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors ${currentPage === pageNum ? "text-brand-black underline underline-offset-4" : "text-gray-400 hover:text-brand-black"}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-brand-black disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Immersive Category Banner */}
      <div className="bg-[#F5F5F7] dark:bg-[#111214] text-brand-black dark:text-white py-24 px-6 relative overflow-hidden border-y border-brand-border/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative z-10">
          <div className="w-full md:w-1/2 flex justify-center">
             <div className="w-full max-w-md aspect-square relative rounded-3xl overflow-hidden bg-white/10 dark:bg-white/5 border border-brand-border p-4 shadow-2xl">
                <img src={bannerData.image} alt={bannerData.title} className="object-cover w-full h-full rounded-2xl opacity-90" />
             </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tighter leading-tight">{bannerData.title}</h2>
             <p className="text-sm md:text-base text-brand-textMuted dark:text-gray-400 max-w-lg leading-relaxed">{bannerData.desc}</p>
             <Link href="#top" className="inline-block px-8 py-3.5 bg-brand-black dark:bg-brand-gold text-white text-xs font-bold rounded-full mt-2 hover:bg-gray-800 dark:hover:bg-yellow-600 transition-colors uppercase tracking-wider">
               Shop {currentCategory}
             </Link>
          </div>
        </div>
      </div>

      {/* Call to action help banner (from previous layout) */}
      <div className="bg-brand-white py-24 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-brand-black tracking-tighter">
            Need help? Let us know how.
          </h2>
          <a 
            href="https://www.facebook.com/messages/t/marexxrepublicdavao"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-brand-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-brand-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
          >
            Contact us
          </a>
        </div>
      </div>

      <ProductDetailsModal 
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-white text-brand-black flex items-center justify-center pt-24 uppercase font-bold text-xs tracking-widest">
        Loading Products Catalog...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
