import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_CONFIG } from '../config/constants';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/order');
  };

  const freeDeliveryThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-[#FFF9F6]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6B35]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900">আপনার শপিং ব্যাগ</h3>
                <span className="text-xs text-stone-500 font-medium">
                  {totalItems}টি আইটেম যুক্ত রয়েছে
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-5 py-3 bg-orange-50/60 border-b border-orange-100 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 font-bold text-stone-800">
                <Truck className="w-3.5 h-3.5 text-[#FF6B35]" />
                {remainingForFreeDelivery === 0 ? (
                  <span className="text-emerald-700">অভিনন্দন! আপনি পাচ্ছেন ফ্রি ডেলিভারি!</span>
                ) : (
                  <span>
                    আর মাত্র <strong className="text-[#FF6B35]">৳{remainingForFreeDelivery.toLocaleString('en-IN')}</strong> টাকার কেনাকাটায় ফ্রি ডেলিভারি
                  </span>
                )}
              </span>
              <span className="font-bold text-stone-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#FF6B35] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-stone-800">আপনার কার্ট খালি রয়েছে</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mb-5">
                  পছন্দের পণ্যটি নির্বাচন করে কার্টে যোগ করুন এবং সহজে কেনাকাটা সম্পন্ন করুন।
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-[#FF6B35] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
                >
                  পণ্য দেখতে ক্লিক করুন
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-stone-200 bg-white shadow-2xs hover:border-orange-200 transition-colors"
                >
                  {/* Thumbnail in <img> tag */}
                  <img
                    src={item.product.image}
                    alt={item.product.nameBn}
                    className="w-18 h-18 rounded-lg object-cover bg-stone-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                          {item.product.nameBn}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-500 p-0.5 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-stone-400 block font-mono">
                        {item.product.code}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <span className="text-sm font-extrabold text-[#FF6B35] tabular-nums">
                        ৳{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 font-medium">মোট পণ্যের মূল্য (Subtotal):</span>
                <span className="text-lg font-black text-stone-900 tabular-nums">
                  ৳{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-[11px] text-stone-500">
                ডেলিভারি চার্জ পরবর্তী পেজে জেলা অনুযায়ী যুক্ত হবে।
              </p>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>অর্ডার করতে এগিয়ে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full text-center text-xs font-semibold text-stone-500 hover:text-stone-800 py-1 transition-colors"
              >
                আরও কেনাকাটা করুন
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
