import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, Headphones, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F2937] text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value badges top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-[#FF6B35] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">সারাদেশে ডেলিভারি</h4>
              <p className="text-xs text-stone-400">দ্রুত ও নির্ভরযোগ্য হোম ডেলিভারি সার্ভিস</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-[#FF6B35] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">১০০% কোয়ালিটি গ্যারান্টি</h4>
              <p className="text-xs text-stone-400">উন্নত মেটেরিয়াল ও প্রিমিয়াম ফিনিশিং</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-[#FF6B35] flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">সহজে WhatsApp অর্ডার</h4>
              <p className="text-xs text-stone-400">হোয়াটসঅ্যাপে দ্রুত মেসেজ পাঠিয়ে কনফার্ম করুন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-[#FF6B35] flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">কাস্টমার সাপোর্ট</h4>
              <p className="text-xs text-stone-400">সকাল ৯টা থেকে রাত ১০টা পর্যন্ত সক্রিয়</p>
            </div>
          </div>
        </div>

        {/* Main Columns: Contact column removed as requested, using real social media icons */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-stone-800">
          
          {/* Column 1: Brand Info with Real Social Media Icons */}
          <div className="md:col-span-6 lg:col-span-6 space-y-4 text-left">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
                IB
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Ideal <span className="text-[#FF6B35]">Bigshop</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">
                  Modern E-Commerce Store
                </span>
              </div>
            </Link>

            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              আইডিয়াল বিগশপ বাংলাদেশে আধুনিক হোম গার্ডেনিং, হেভি-ডিউটি চাকা ও ফ্লাওয়ার স্ট্যান্ড এবং প্রিমিয়াম কিচেন কুকওয়্যার বিক্রির একটি বিশ্বস্ত প্রতিষ্ঠান। সততা ও প্রিমিয়াম কোয়ালিটিই আমাদের মূল লক্ষ্য।
            </p>

            {/* Real Social Media SVG Icons */}
            <div className="flex items-center gap-3 pt-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-[#1877F2] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="Facebook"
                title="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-[#E4405F] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-[#FF0000] text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="YouTube"
                title="YouTube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
                aria-label="TikTok"
                title="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3 text-left">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">দ্রুত লিংক</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-[#FF6B35] transition-colors">
                  হোম পেজ
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#FF6B35] transition-colors">
                  সকল পণ্য
                </Link>
              </li>
              <li>
                <Link to="/products?filter=top-selling" className="hover:text-[#FF6B35] transition-colors">
                  টপ সেলিং পণ্য
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#FF6B35] transition-colors">
                  পছন্দের তালিকা (Wishlist)
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FF6B35] transition-colors">
                  শপিং কার্ট
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3 text-left">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">কাস্টমার পলিসি</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="text-stone-300">ডেলিভারি তথ্য: ঢাকা ৭০৳ / ঢাকার বাইরে ১৩০৳</span>
              </li>
              <li>
                <span className="text-stone-300">রিটার্ন পলিসি: পণ্য দেখে চেক করে মূল্য পরিশোধ</span>
              </li>
              <li>
                <span className="text-stone-300">১০০% কোয়ালিটি নিশ্চয়তা ও নির্ভরযোগ্য সার্ভিস</span>
              </li>
              <li>
                <span className="text-stone-300">নিরাপদ ক্যাশ অন ডেলিভারি সুবিধা</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Ideal Bigshop. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            <span>Made with care for home & garden lovers in Bangladesh</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6B35] fill-[#FF6B35]" />
          </p>
        </div>

      </div>
    </footer>
  );
};
