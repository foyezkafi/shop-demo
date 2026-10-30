import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Flame, Grid, SearchX } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  selectedCategory: string;
  searchQuery?: string;
}

type TabType = 'all' | 'top-selling';

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  selectedCategory,
  searchQuery = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Tab filter (All vs Top Selling)
      if (activeTab === 'top-selling' && !product.isTopSelling) return false;

      // Search filter if provided
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNameBn = product.nameBn.toLowerCase().includes(query);
        const matchesNameEn = product.nameEn.toLowerCase().includes(query);
        const matchesCode = product.code.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        if (!matchesNameBn && !matchesNameEn && !matchesCode && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, activeTab, searchQuery]);

  const tabs = [
    { id: 'all' as TabType, label: 'সকল পণ্য', icon: Grid },
    { id: 'top-selling' as TabType, label: 'টপ সেলিং', icon: Flame },
  ];

  return (
    <section id="products-section" className="py-12 bg-[#FFF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
              প্রিমিয়াম কোয়ালিটি কালেকশন
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight mt-1">
              আমাদের বিশেষ পণ্যসমূহ
            </h2>
          </div>

          {/* Clean Segmented Tab Filter: All and Top Selling only (Popular, New & Sort removed as requested) */}
          <div className="flex items-center gap-1 p-1 bg-white border border-stone-200 rounded-xl shadow-2xs self-start sm:self-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6B35] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Search & Filter Indicator */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
            <span>ফিল্টার প্রযোজ্য:</span>
            {selectedCategory !== 'all' && (
              <span className="font-semibold text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded">
                ক্যাটাগরি: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="font-semibold text-[#FF6B35] bg-orange-50 px-2 py-0.5 rounded">
                অনুসন্ধান: "{searchQuery}"
              </span>
            )}
            <span className="ml-auto text-stone-400">
              {filteredProducts.length}টি পণ্য রয়েছে
            </span>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              অন্য ক্যাটাগরি নির্বাচন করে চেষ্টা করুন।
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="bg-[#FF6B35] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
