import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { STORE_CONFIG } from '../config/constants';

interface HeroProps {
  onShopNowClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNowClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F6] pb-8 sm:pb-10 border-b border-stone-200">
      {/* Full-screen edge-to-edge banner image without rounded shape */}
      <div className="relative w-full overflow-hidden bg-stone-900 min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex items-center">
        
        {/* Banner image stretching across the full screen width */}
        <img
          src="/src/assets/images/hero_bigshop_showcase_1793360871474.jpg"
          alt="Ideal Bigshop Home & Garden Showcase Banner"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-right"
          referrerPolicy="no-referrer"
          loading="eager"
        />

        {/* Gradient scrim for clear text readability on mobile and desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/85 to-stone-950/40 sm:bg-gradient-to-r sm:from-stone-950/95 sm:via-stone-950/80 sm:to-transparent" />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-8 sm:py-12">
          <div className="max-w-xl text-left space-y-4 sm:space-y-5">
            
            {/* Offer Tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF6B35]/25 border border-[#FF6B35]/40 text-orange-200 font-bold text-[10px] sm:text-xs tracking-wide backdrop-blur-xs max-w-full">
              <span className="truncate">ধামাকা অফার: প্রিমিয়াম কালেকশনে ৩০% পর্যন্ত ছাড়</span>
            </div>

            {/* Responsive Main Headline (Smaller and beautifully wrapped on mobile) */}
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-[46px] font-extrabold text-white leading-snug sm:leading-tight tracking-tight">
              আপনার গৃহকোণ ও ব্যালকনি সাজান{' '}
              <span className="text-[#FF6B35] relative inline-block">
                নান্দনিক ডিজাইনে
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg font-normal">
              আইডিয়াল বিগশপের হেভি-ডিউটি চাকা স্ট্যান্ড, আধুনিক ফ্লাওয়ার স্ট্যান্ড ও প্রিমিয়াম নন-স্টিক মার্বেল কুকওয়্যার দিয়ে ঘরকে করুন আরও সুসজ্জিত।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              {onShopNowClick ? (
                <button
                  onClick={onShopNowClick}
                  className="inline-flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 text-xs sm:text-sm cursor-pointer"
                >
                  <span>এখনই কেনাকাটা করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 text-xs sm:text-sm"
                >
                  <span>এখনই কেনাকাটা করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <a
                href={`${STORE_CONFIG.whatsappUrl}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আইডিয়াল বিগশপের প্রোডাক্ট সম্পর্কে বিস্তারিত জানতে এবং অর্ডার করতে চাই।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl shadow-md transition-all transform active:scale-95 text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে অর্ডার</span>
              </a>
            </div>

            {/* Starting price indicator */}
            <div className="pt-1 flex items-center gap-2 text-xs text-stone-300">
              <span className="font-medium text-stone-400">স্পেশাল অফার শুরু:</span>
              <span className="text-sm sm:text-base font-extrabold text-[#FF6B35] tabular-nums">৳১,১৯০</span>
              <span className="text-stone-400 line-through text-xs tabular-nums">৳১,৫৯০</span>
            </div>

          </div>
        </div>

      </div>

      {/* 3 Pillars strip below the full-screen banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B35] shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-stone-900">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-[11px] text-stone-500">সারাদেশে দ্রুত হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B35] shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-stone-900">১০০% টেকসই মেটাল</h4>
              <p className="text-[11px] text-stone-500">জং-রোধী কোটিং ও দীর্ঘস্থায়ী</p>
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B35] shrink-0">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-stone-900">সহজ রিটার্ন সুবিধা</h4>
              <p className="text-[11px] text-stone-500">দেখে চেক করে নেওয়ার সুযোগ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
