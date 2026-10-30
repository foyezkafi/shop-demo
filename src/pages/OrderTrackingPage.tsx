import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStorageItem } from '../utils/storage';
import { PlacedOrder } from '../types';
import { Search, PackageCheck, Clock, Truck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { STORE_CONFIG } from '../config/constants';

export const OrderTrackingPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<PlacedOrder[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    const allOrders = getStorageItem<PlacedOrder[]>('ideal_bigshop_orders_v1', []);
    const matched = allOrders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(cleanQuery) ||
        order.customer.phone.includes(cleanQuery)
    );

    setFoundOrders(matched);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold">অর্ডার ট্র্যাকিং</span>
        </nav>

        {/* Tracking Input Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            আপনার অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-1 mb-6">
            অর্ডারের সময় প্রাপ্ত Order ID (যেমন: IBS-1234) অথবা আপনার দেওয়া মোবাইল নম্বরটি লিখুন।
          </p>

          <form onSubmit={handleTrack} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Order ID অথবা মোবাইল নম্বর দিন..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#FFF9F6] border border-stone-200 focus:border-[#FF6B35] rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="bg-[#FF6B35] hover:bg-[#ea5825] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-xs"
            >
              ট্র্যাক করুন
            </button>
          </form>
        </div>

        {/* Results Area */}
        {hasSearched && (
          <div className="space-y-6">
            {foundOrders && foundOrders.length > 0 ? (
              foundOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                    <div>
                      <span className="text-xs text-stone-400 font-mono">অর্ডার আইডি</span>
                      <h3 className="text-lg font-black text-stone-900 font-mono">
                        {order.orderId}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">অর্ডারের তারিখ</span>
                      <span className="text-xs font-bold text-stone-700">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status Steps */}
                  <div className="py-6 border-b border-stone-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-4">
                      ডেলিভারি স্ট্যাটাস:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-emerald-50 text-emerald-800">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
                        <span className="text-xs font-bold">অর্ডার কনফার্মড</span>
                        <span className="text-[10px] text-emerald-600">গৃহীত হয়েছে</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-orange-50 text-[#FF6B35]">
                        <Clock className="w-5 h-5 text-[#FF6B35] mb-1 animate-pulse" />
                        <span className="text-xs font-bold">প্রসেসিং ও প্যাকেজিং</span>
                        <span className="text-[10px] text-stone-500">চলমান রয়েছে</span>
                      </div>
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-stone-50 text-stone-400">
                        <Truck className="w-5 h-5 mb-1" />
                        <span className="text-xs font-bold">ডেলিভারির পথে</span>
                        <span className="text-[10px]">অপেক্ষমান</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer info & items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-1">ডেলিভারি ঠিকানা:</span>
                      <p className="font-bold text-stone-800">
                        {order.customer.fullName}
                      </p>
                      <p className="text-stone-600">{order.customer.phone}</p>
                      <p className="text-stone-600">{order.customer.address}, {order.customer.district}</p>
                    </div>

                    <div className="bg-[#FFF9F6] p-3 rounded-xl border border-stone-100">
                      <span className="text-stone-400 block mb-1">পেমেন্ট বিবরণ:</span>
                      <p className="font-bold uppercase text-stone-800">
                        {order.payment.method === 'cod' ? 'ক্যাশ অন ডেলিভারি (COD)' : `${order.payment.method} পেমেন্ট`}
                      </p>
                      {order.payment.trxId && (
                        <p className="font-mono text-stone-700">TrxID: {order.payment.trxId}</p>
                      )}
                      <p className="text-sm font-black text-[#FF6B35] mt-1">
                        মোট প্রদেয়: ৳{order.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center">
                <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <h3 className="text-base font-bold text-stone-800">কোনো অর্ডার পাওয়া যায়নি</h3>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  আপনার ইনপুট করা Order ID বা নম্বরটি চেক করুন অথবা আমাদের হেল্পলাইনে যোগাযোগ করুন।
                </p>
                <a
                  href={STORE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline"
                >
                  WhatsApp-এ সরাসরি সাপোর্ট নিন
                </a>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
