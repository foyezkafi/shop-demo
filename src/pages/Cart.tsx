import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { STORE_CONFIG } from '../config/constants';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'শপিং কার্ট | Ideal Bigshop';
  }, []);

  const freeThreshold = STORE_CONFIG.freeDeliveryThreshold;
  const isFreeDelivery = subtotal >= freeThreshold;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold">শপিং কার্ট</span>
        </nav>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-[#FF6B35]" />
              <span>আপনার শপিং কার্ট</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              মোট {totalItems}টি পণ্য কার্টে যুক্ত আছে
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto"
            >
              কার্ট খালি করুন
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 md:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              আপনার শপিং কার্ট বর্তমানে খালি রয়েছে
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
              আইডিয়াল বিগশপের আকর্ষণীয় টব, প্ল্যান্ট স্ট্যান্ড ও কিচেন কুকওয়্যার কালেকশন ঘুরে দেখুন এবং কার্টে যুক্ত করুন।
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>কেনাকাটা শুরু করুন</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Itemized Table */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery progress strip */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#FF6B35]" />
                    {isFreeDelivery ? (
                      <span className="text-emerald-600">অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!</span>
                    ) : (
                      <span>
                        আর মাত্র <strong className="text-[#FF6B35]">৳{remainingForFree.toLocaleString('en-IN')}</strong> টাকার অর্ডারে ফ্রি ডেলিভারি
                      </span>
                    )}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF6B35] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
                {items.map((item) => {
                  const itemSubtotal = item.product.price * item.quantity;
                  return (
                    <div
                      key={item.product.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Product Thumbnail & Details (All in <img> tags!) */}
                      <div className="flex items-center gap-4">
                        <Link to={`/product/${item.product.id}`} className="shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.nameBn}
                            className="w-20 h-20 rounded-xl object-cover bg-stone-100 border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                        </Link>

                        <div className="text-left">
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="text-sm font-bold text-stone-800 hover:text-[#FF6B35] transition-colors leading-snug line-clamp-1">
                              {item.product.nameBn}
                            </h3>
                          </Link>
                          <span className="text-[11px] text-stone-400 block font-mono mt-0.5">
                            কোড: {item.product.code}
                          </span>
                          <span className="text-xs text-stone-600 font-semibold mt-1 block">
                            একক মূল্য: ৳{item.product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Stepper, Subtotal, Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[80px]">
                          <span className="text-sm font-black text-[#FF6B35] tabular-nums block">
                            ৳{itemSubtotal.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping button */}
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B35] hover:text-[#ea5825] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আরও পণ্য কিনতে ফিরে যান</span>
                </Link>
              </div>
            </div>

            {/* Right 4 Cols: Order Summary & Proceed */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6 sticky top-28 text-left">
                <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
                  অর্ডার সামারি (Order Summary)
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>পণ্যের মোট সংখ্যা:</span>
                    <span className="font-bold text-stone-900">{totalItems} টি</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>পণ্যের উপমোট (Subtotal):</span>
                    <span className="font-bold text-stone-900 tabular-nums">
                      ৳{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-bold text-emerald-600">
                      {isFreeDelivery ? 'ফ্রি ডেলিভারি' : 'পরবর্তী পেজে নির্ধারণ হবে'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-stone-900">মোট প্রদেয় মূল্য:</span>
                    <span className="text-2xl font-black text-[#FF6B35] tabular-nums">
                      ৳{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/order')}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="bg-[#FFF9F6] p-3.5 rounded-xl border border-orange-100 space-y-2 text-[11px] text-stone-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>১০০% নিরাপদ চেকআউট ও পেমেন্ট</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#FF6B35] shrink-0" />
                    <span>সারাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
