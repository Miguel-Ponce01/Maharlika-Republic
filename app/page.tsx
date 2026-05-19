import StoreMap from "@/components/map/StoreMap";

export default function Home() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/10 text-brand-gold px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
            </span>
            <span>Davao City's Premier Apple Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-brand-black mb-6 max-w-4xl">
            Beyond Innovation. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-600">
              True Premium Retail.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-brand-grey mb-10 max-w-2xl">
            Experience the finest selection of high-end Apple gadgets and accessories, 
            delivered with unparalleled service at Maharlika Republic.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="px-8 py-4 bg-brand-black text-brand-white rounded-full font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto shadow-xl shadow-black/10">
              Shop The Collection
            </button>
            <button className="px-8 py-4 bg-white text-brand-black border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
              Visit Showroom
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-brand-black">Our Showroom</h2>
              <p className="text-brand-grey max-w-xl">
                Locate us in the heart of Davao City. Use the interactive map below to explore our physical location and view the internal store layout.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="font-medium text-brand-black">Maharlika Republic</p>
              <p className="text-brand-grey text-sm">Davao City, Philippines</p>
            </div>
          </div>
          
          <StoreMap />
        </div>
      </section>
    </div>
  );
}
