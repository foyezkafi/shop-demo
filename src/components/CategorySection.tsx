import React from 'react';
import { CATEGORIES } from '../data/categories';
import { Layers, ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-10 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6B35] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>জনপ্রিয় কালেকশন</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              ক্যাটাগরি অনুযায়ী পণ্য দেখুন
            </h2>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-[#FF6B35] hover:text-[#ea5825] flex items-center gap-1 transition-colors"
          >
            <span>সকল পণ্য একসাথে দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'border-[#FF6B35] bg-orange-50/70 shadow-md ring-2 ring-[#FF6B35]/20 -translate-y-1'
                    : 'border-stone-200 bg-white hover:border-orange-300 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                {/* Category Thumbnail Image in <img> tag */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 bg-stone-100 border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.nameBn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <span
                  className={`text-xs sm:text-sm font-bold leading-snug transition-colors line-clamp-1 ${
                    isSelected ? 'text-[#FF6B35]' : 'text-stone-800 group-hover:text-[#FF6B35]'
                  }`}
                >
                  {cat.nameBn}
                </span>

                {/* Active indicator bar */}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6B35] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
