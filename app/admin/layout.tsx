"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { logout } from "./login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-brand-white text-brand-black flex admin-theme">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-brand-card border-r border-brand-border z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-brand-border flex items-center justify-between">
            <Link href="/admin" className="font-heading font-black text-xl tracking-tighter text-brand-black">
              MAHARLIKA<span className="text-brand-gold">ADMIN</span>
            </Link>
            <button className="md:hidden" onClick={() => setIsMobileOpen(false)}>
              <X className="w-5 h-5 text-brand-textMuted" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? "bg-brand-gold/10 text-brand-gold" 
                      : "text-brand-textMuted hover:bg-brand-white hover:text-brand-black"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-brand-border">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-brand-card/80 backdrop-blur-md border-b border-brand-border flex items-center px-6 md:hidden">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-brand-black">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-heading font-bold text-brand-black ml-2">Admin Portal</span>
        </header>
        <div className="flex-1 overflow-auto bg-transparent p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
