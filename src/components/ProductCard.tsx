import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const isWished = isInWishlist(product.id);

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate directly to dedicated Order Page with this product
    navigate(`/order?product=${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
      
      {/* Top Media Area with <img> tag */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.nameBn}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-[#FF6B35] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
            {product.discountPercentage}% ছাড়
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWished
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white shadow-xs'
          }`}
          title={isWished ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যুক্ত করুন'}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Product Code Badge */}
        <div className="absolute bottom-2 left-2.5 bg-[#1F2937]/80 backdrop-blur-xs text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded">
          {product.code}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-left">
        <div>
          {/* Bengali Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-stone-800 text-base leading-snug group-hover:text-[#FF6B35] transition-colors line-clamp-1">
              {product.nameBn}
            </h3>
          </Link>
          <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">
            {product.nameEn}
          </p>

          {/* Price Area */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg font-black text-[#FF6B35] tabular-nums">
              ৳{product.price.toLocaleString('en-IN')}
            </span>
            {product.previousPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ৳{product.previousPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Order Now */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-orange-200 bg-[#FFF9F6] hover:bg-orange-100 text-[#FF6B35] text-xs font-bold transition-colors active:scale-95"
            title="কার্টে যোগ করুন"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">কার্টে নিন</span>
          </button>

          {/* Order Now button (Instant purchase) */}
          <button
            onClick={handleOrderNow}
            className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#ea5825] text-white text-xs font-bold shadow-xs transition-colors active:scale-95"
            title="সরাসরি অর্ডার করুন"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">অর্ডার করুন</span>
          </button>
        </div>

      </div>
    </div>
  );
};
