import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { ProductSection } from '../components/ProductSection';
import { PRODUCTS } from '../data/products';
import { MessageCircle, Shield, Award, CheckCircle2 } from 'lucide-react';
import { STORE_CONFIG } from '../config/constants';

interface HomeProps {
  searchQuery?: string;
}

export const Home: React.FC<HomeProps> = ({ searchQuery = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    scrollToProducts();
  };

  useEffect(() => {
    document.title = 'Ideal Bigshop | আধুনিক হোম গার্ডেনিং ও কিচেন স্টোর';
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <Hero onShopNowClick={scrollToProducts} />

      {/* Category Filter Section */}
      <CategorySection
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Product Showcase Grid */}
      <ProductSection
        products={PRODUCTS}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      {/* Trust & Quality Assurance Section */}
      <section className="py-14 bg-white border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFF9F6] rounded-3xl p-8 sm:p-12 border border-orange-200 relative overflow-hidden">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
                কেন আমরাই সেরা?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight mt-1 mb-4">
                আইডিয়াল বিগশপের গুণগত মান ও গ্রাহক সন্তুষ্টি
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                আমরা সরাসরি নিজস্ব কারখানায় উচ্চমানের মেটাল দিয়ে চাকা স্ট্যান্ড ও ফ্লাওয়ার স্ট্যান্ড তৈরি করি। সাধারণ লোকাল স্ট্যান্ডের চেয়ে আমাদের স্ট্যান্ডে রয়েছে প্রিমিয়াম পাউডার কোটিং, যা পানি বা রোদে জং পড়ে না।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">৩৬০° হেভি ডিউটি চাকা</h4>
                    <p className="text-xs text-stone-500">মেঝেতে দাগ পড়বে না ও অনায়াসে ঘুরবে।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">অরিজিনাল নন-স্টিক মার্বেল কোটিং</h4>
                    <p className="text-xs text-stone-500">স্বাস্থ্যসম্মত রান্না ও দীর্ঘস্থায়ী স্থায়িত্ব।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">দেখে মূল্য পরিশোধের সুযোগ</h4>
                    <p className="text-xs text-stone-500">ডেলিভারি ম্যানের সামনে পণ্য চেক করে নিন।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">২৪ ঘণ্টার ভেতর দ্রুত ডিসপ্যাচ</h4>
                    <p className="text-xs text-stone-500">ঢাকার ভেতর ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৩ দিন।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating or Banner WhatsApp Assistance */}
      <section className="py-8 sm:py-10 bg-[#16A34A] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black">
              কোনো প্রশ্ন বা কাস্টম সাইজের স্ট্যান্ড প্রয়োজন?
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm">
              আমাদের প্রোডাক্ট এক্সপার্টের সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলে অর্ডার নিশ্চিত করুন।
            </p>
          </div>

          <a
            href={`${STORE_CONFIG.whatsappUrl}?text=${encodeURIComponent('আসসালামু আলাইকুম, আমি আইডিয়াল বিগশপের প্রোডাক্ট সম্পর্কে জানতে চাই।')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 w-full sm:w-auto text-center"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            <span>WhatsApp-এ সরাসরি চ্যাট করুন ({STORE_CONFIG.whatsappNumber})</span>
          </a>
        </div>
      </section>
    </div>
  );
};
