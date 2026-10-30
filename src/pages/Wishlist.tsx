import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingBag, ArrowRight, Zap, ChevronRight } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'পছন্দের তালিকা (Wishlist) | Ideal Bigshop';
  }, []);

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const handleOrderNow = (productId: string) => {
    navigate(`/order?product=${productId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold">উইশলিস্ট</span>
        </nav>

        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] flex items-center gap-2.5">
              <Heart className="w-7 h-7 text-[#FF6B35] fill-orange-100" />
              <span>পছন্দের তালিকা (Wishlist)</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              আপনার সংরক্ষিত {items.length}টি পণ্য রয়েছে
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto"
            >
              সব মুছে ফেলুন
            </button>
          )}
        </div>

        {/* Items Grid or Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 md:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              আপনার পছন্দের তালিকা এখনো খালি
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
              আইডিয়াল বিগশপের আকর্ষণীয় কালেকশন ঘুরে দেখুন এবং পছন্দের পণ্যের হার্ট আইকনে ক্লিক করে সেভ করে রাখুন।
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-colors"
            >
              <span>পণ্য দেখতে ক্লিক করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image in <img> tag */}
                <div className="relative aspect-4/3 bg-stone-100">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.nameBn}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-400 hover:text-rose-600 shadow-xs flex items-center justify-center transition-colors"
                    title="তালিকা থেকে বাদ দিন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {product.code}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-left">
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h4 className="font-bold text-stone-800 text-sm hover:text-[#FF6B35] line-clamp-1">
                        {product.nameBn}
                      </h4>
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-black text-[#FF6B35] tabular-nums">
                        ৳{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.previousPrice > product.price && (
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          ৳{product.previousPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Move to Cart & Order Now */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-orange-200 bg-[#FFF9F6] text-[#FF6B35] hover:bg-orange-100 text-xs font-bold transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>কার্টে স্থানান্তর করুন</span>
                    </button>

                    <button
                      onClick={() => handleOrderNow(product.id)}
                      className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#FF6B35] hover:bg-[#ea5825] text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>সরাসরি অর্ডার করুন</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
