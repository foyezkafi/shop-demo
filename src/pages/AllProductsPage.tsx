import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/ProductCard';
import { Search, ArrowUpDown, Filter, ChevronRight, SearchX } from 'lucide-react';

export const AllProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    document.title = 'সকল পণ্য | Ideal Bigshop';
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search !== null) setSearchTerm(search);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (initialFilter === 'top-selling' && !product.isTopSelling) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesNameBn = product.nameBn.toLowerCase().includes(query);
        const matchesNameEn = product.nameEn.toLowerCase().includes(query);
        const matchesCode = product.code.toLowerCase().includes(query);
        if (!matchesNameBn && !matchesNameEn && !matchesCode) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, searchTerm, sortBy, initialFilter]);

  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold">সকল পণ্য</span>
        </nav>

        {/* Page Title & Controls */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
                {initialFilter === 'top-selling' ? 'টপ সেলিং কালেকশন' : 'আইডিয়াল বিগশপের সকল পণ্য'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                মোট {filteredProducts.length}টি পণ্য প্রদর্শিত হচ্ছে
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#FFF9F6] border border-stone-200 rounded-xl px-3.5 py-2 text-xs">
              <ArrowUpDown className="w-4 h-4 text-[#FF6B35]" />
              <span className="font-medium text-stone-600">সাজান:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-stone-800 outline-none cursor-pointer"
              >
                <option value="default">জনপ্রিয়তা অনুযায়ী</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          {/* Search & Category Chips */}
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="পণ্যের নাম বা কোড (যেমন: IBS-001) দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FFF9F6] border border-stone-200 focus:border-[#FF6B35] rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-800 outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-stone-400 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>ক্যাটাগরি:</span>
              </span>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchParams((prev) => {
                        if (cat.id === 'all') {
                          prev.delete('category');
                        } else {
                          prev.set('category', cat.id);
                        }
                        return prev;
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[#FF6B35] text-white shadow-xs'
                        : 'bg-[#FFF9F6] border border-stone-200 text-stone-700 hover:border-orange-300'
                    }`}
                  >
                    {cat.nameBn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              অনুসন্ধানের শব্দ পরিবর্তন করে অথবা ফিল্টার ক্লিয়ার করে দেখুন।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setSearchParams({});
              }}
              className="bg-[#FF6B35] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
            >
              সব ফিল্টার মুছুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
