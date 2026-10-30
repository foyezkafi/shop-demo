import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { STORE_CONFIG } from '../config/constants';
import { CATEGORIES } from '../data/categories';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { totalItems, subtotal, toggleCartDrawer } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();

  // Navigation links: Home, All Products, Top Selling
  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'সকল পণ্য', path: '/products' },
    { name: 'টপ সেলিং', path: '/products?filter=top-selling' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-stone-200">
      {/* Main Navbar with responsive layout (compact on mobile, logo text smaller as requested) */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-1.5 sm:gap-6">
          
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-stone-700 hover:text-[#FF6B35] rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Zone 1: Brand Logo (Smaller logo text as requested) */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-xl bg-[#FF6B35] text-white flex items-center justify-center font-black text-xs sm:text-sm md:text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                IB
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-baseline gap-0.5 sm:gap-1">
                  <span className="font-extrabold text-sm sm:text-lg md:text-xl tracking-tight text-[#1F2937]">Ideal</span>
                  <span className="font-extrabold text-sm sm:text-lg md:text-xl tracking-tight text-[#FF6B35]">Bigshop</span>
                </div>
                <span className="hidden sm:block text-[8px] md:text-[10px] tracking-wider uppercase font-semibold text-stone-400 -mt-0.5">
                  Home & Garden Decor
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] pb-1 font-bold'
                      : 'text-stone-700 hover:text-[#FF6B35]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions - Wishlist Icon & Cart Button */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Wishlist Icon only */}
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 text-stone-700 hover:text-[#FF6B35] transition-colors rounded-lg sm:rounded-xl hover:bg-orange-50 shrink-0"
              title="উইশলিস্ট"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={toggleCartDrawer}
              className="relative flex items-center gap-1.5 sm:gap-2.5 bg-[#FFF9F6] border border-orange-200 hover:border-[#FF6B35] text-[#1F2937] px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl transition-all group cursor-pointer shrink-0"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#FF6B35] group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-[#FF6B35] text-white text-[9px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] text-stone-500 leading-none">কার্ট</span>
                <span className="text-xs font-bold text-stone-900 tabular-nums">
                  ৳{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-orange-50 hover:text-[#FF6B35] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Quick Categories in Mobile Menu */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 px-3 block mb-2">
              জনপ্রিয় ক্যাটাগরি
            </span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.slice(1, 5).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-[#FFF9F6] text-xs font-medium text-stone-700 hover:text-[#FF6B35] truncate"
                >
                  {cat.nameBn}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Direct WhatsApp / Phone CTAs */}
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <a
              href={STORE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#16A34A] text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার করুন</span>
            </a>
            <a
              href={`tel:${STORE_CONFIG.phone}`}
              className="flex items-center justify-center gap-2 bg-[#FFF9F6] border border-stone-200 text-stone-800 font-semibold py-2.5 rounded-xl text-sm"
            >
              <Phone className="w-4 h-4 text-[#FF6B35]" />
              <span>কল করুন: {STORE_CONFIG.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
