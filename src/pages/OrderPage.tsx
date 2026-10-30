import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS, BANGLADESH_DISTRICTS } from '../data/products';
import { STORE_CONFIG } from '../config/constants';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';
import { setStorageItem, getStorageItem } from '../utils/storage';
import { CartItem, PlacedOrder } from '../types';
import confetti from 'canvas-confetti';
import {
  Truck,
  MessageCircle,
  Copy,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Plus,
  Minus,
  ChevronRight,
  Tag,
} from 'lucide-react';

export const OrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const { showToast } = useToast();

  const directProductId = searchParams.get('product');
  const directQuantityParam = searchParams.get('quantity');

  // Determine active ordered items
  const [orderedItems, setOrderedItems] = useState<CartItem[]>(() => {
    if (directProductId) {
      const foundProduct = PRODUCTS.find((p) => p.id === directProductId);
      if (foundProduct) {
        const qty = directQuantityParam ? parseInt(directQuantityParam, 10) || 1 : 1;
        return [{ product: foundProduct, quantity: qty }];
      }
    }
    return cartItems.length > 0 ? [...cartItems] : [{ product: PRODUCTS[0], quantity: 1 }];
  });

  // Product Code Input state (requested: "ey j code number ase eta ekhane ekta lekhar moton option rakhba jate kore kon product ta order dicche seta buja jai")
  const [productCodeInput, setProductCodeInput] = useState(() => {
    return orderedItems.map((i) => `${i.product.code} (${i.product.nameBn})`).join(', ');
  });

  // Keep productCodeInput synced when ordered items change
  useEffect(() => {
    if (orderedItems.length > 0) {
      setProductCodeInput(
        orderedItems.map((i) => `${i.product.code} - ${i.product.nameBn}`).join(', ')
      );
    }
  }, [orderedItems]);

  // Customer Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState(BANGLADESH_DISTRICTS[0]);
  const [upazila, setUpazila] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Form state
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');

  // Validation & Modal state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placedOrderDetails, setPlacedOrderDetails] = useState<PlacedOrder | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'অর্ডার কনফার্ম করুন | Ideal Bigshop';
    window.scrollTo(0, 0);
  }, []);

  // Sync WhatsApp with Phone if checked
  useEffect(() => {
    if (sameAsPhone) {
      setWhatsapp(phone);
    }
  }, [phone, sameAsPhone]);

  // Subtotal & Delivery Calculation
  const subtotal = useMemo(() => {
    return orderedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [orderedItems]);

  const deliveryFee = useMemo(() => {
    if (subtotal >= STORE_CONFIG.freeDeliveryThreshold) {
      return 0;
    }
    const isDhaka = district.toLowerCase().includes('dhaka') || district.includes('ঢাকা');
    return isDhaka ? STORE_CONFIG.deliveryFeeInsideDhaka : STORE_CONFIG.deliveryFeeOutsideDhaka;
  }, [subtotal, district]);

  const totalAmount = subtotal + deliveryFee;

  // Quantity updates on the Order Page
  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setOrderedItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Copy number to clipboard with toast
  const handleCopyNumber = (num: string, provider: string) => {
    navigator.clipboard.writeText(num);
    showToast(`${provider} নম্বর (${num}) সফলভাবে কপি করা হয়েছে!`, 'success');
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'আপনার পূর্ণ নাম লিখুন';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      newErrors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)';
    }

    if (!address.trim()) {
      newErrors.address = 'সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাসা/রোড/এলাকা)';
    }

    if (!district) {
      newErrors.district = 'আপনার জেলা নির্বাচন করুন';
    }

    if (!upazila.trim()) {
      newErrors.upazila = 'থানা বা উপজেলা উল্লেখ করুন';
    }

    // Payment validation if bKash / Nagad
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      if (!trxId.trim()) {
        newErrors.trxId = `${paymentMethod.toUpperCase()} ট্রানজেকশন আইডি (TrxID) লিখুন`;
      }
      const cleanSender = senderNumber.replace(/[^0-9]/g, '');
      if (!cleanSender || cleanSender.length < 11) {
        newErrors.senderNumber = 'যে নম্বর থেকে টাকা পাঠিয়েছেন সেই সঠিক মোবাইল নম্বর দিন';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Trigger WhatsApp order (The primary and sole confirmation method)
  const handleConfirmViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('অনুগ্রহ করে প্রয়োজনীয় সকল তথ্য সঠিকভাবে পূরণ করুন', 'error');
      return;
    }

    const orderId = `IBS-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      customer: {
        fullName,
        phone,
        whatsapp: whatsapp || phone,
        address,
        district,
        upazila,
        deliveryNotes,
      },
      items: orderedItems,
      subtotal,
      deliveryFee,
      total: totalAmount,
      payment: {
        method: paymentMethod,
        trxId: paymentMethod !== 'cod' ? trxId : undefined,
        senderNumber: paymentMethod !== 'cod' ? senderNumber : undefined,
        amount: totalAmount,
      },
      orderId,
      productCodeNote: productCodeInput || undefined,
    };

    // Save to local storage for tracking
    const existingOrders = getStorageItem<PlacedOrder[]>('ideal_bigshop_orders_v1', []);
    const newOrder: PlacedOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: payload.customer,
      payment: payload.payment,
      items: orderedItems,
      subtotal,
      deliveryFee,
      total: totalAmount,
      status: 'Pending Verification',
    };
    setStorageItem('ideal_bigshop_orders_v1', [newOrder, ...existingOrders]);

    // Clear cart if direct order was from cart
    if (!directProductId) {
      clearCart();
    }

    // Launch WhatsApp directly with prefilled message
    const url = getWhatsAppOrderUrl(payload);
    window.open(url, '_blank', 'noopener,noreferrer');

    // Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {}

    setPlacedOrderDetails(newOrder);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#FF6B35]">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-[#FF6B35]">পণ্য</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold">অর্ডার পেজ</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#FF6B35] text-xs font-bold mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>সহজ ও দ্রুত অর্ডার ফর্ম</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              অর্ডার চূড়ান্ত করুন (Complete Your Order)
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              ডেলিভারি ঠিকানা দিন এবং হোয়াটসঅ্যাপে সরাসরি অর্ডার কনফার্ম করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-600 bg-[#FFF9F6] p-3 rounded-2xl border border-orange-100">
            <Truck className="w-5 h-5 text-[#FF6B35] shrink-0" />
            <div>
              <span className="font-bold text-stone-900 block">ক্যাশ অন ডেলিভারি সুবিধা</span>
              <span>পণ্য হাতে পেয়ে দেখে মূল্য দিন</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 7 Columns: Customer Form & Payment Method */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Step 1: Customer Information Form */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-sm">
                  ১
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">ডেলিভারির প্রয়োজনীয় তথ্য দিন</h2>
                  <p className="text-xs text-stone-500">আপনার নাম ও সঠিক ঠিকানা দিন যাতে পার্সেল নিরাপদে পৌঁছে যায়</p>
                </div>
              </div>

              <div className="space-y-4">
                
                {/* Product Code / Name Input Option as specifically requested */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>অর্ডারকৃত পণ্যের কোড নম্বর বা নাম</span>
                      <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">স্বয়ংক্রিয়ভাবে শনাক্ত</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: IBS-001 - ৩ পিস চাকা স্ট্যান্ড"
                    value={productCodeInput}
                    onChange={(e) => setProductCodeInput(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none transition-all shadow-2xs"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    আপনি কোন পণ্যটি অর্ডার করছেন তা সহজে নিশ্চিত করার জন্য কোড নম্বরটি এখানে প্রদর্শিত হচ্ছে।
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: মোঃ সাকিব হাসান"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                      errors.fullName
                        ? 'border-rose-400 bg-rose-50/50'
                        : 'border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white'
                    }`}
                  />
                  {errors.fullName && (
                    <span className="text-xs text-rose-500 mt-1 block flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Mobile Number & WhatsApp Number Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/50'
                          : 'border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-xs text-rose-500 mt-1 block flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={whatsapp}
                      disabled={sameAsPhone}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white px-4 py-2.5 text-sm outline-none disabled:opacity-60"
                    />
                    <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => setSameAsPhone(e.target.checked)}
                        className="rounded text-[#FF6B35] focus:ring-[#FF6B35] w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-stone-500 font-medium">
                        মোবাইল নম্বরই আমার হোয়াটসঅ্যাপ নম্বর
                      </span>
                    </label>
                  </div>
                </div>

                {/* District & Upazila Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* District */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      জেলা (District) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white px-3.5 py-2.5 text-sm outline-none font-medium text-stone-800"
                    >
                      {BANGLADESH_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila / Thana */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      থানা / উপজেলা (Upazila/Thana) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: বাড্ডা / ধানমন্ডি / সদর"
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                        errors.upazila
                          ? 'border-rose-400 bg-rose-50/50'
                          : 'border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white'
                      }`}
                    />
                    {errors.upazila && (
                      <span className="text-xs text-rose-500 mt-1 block flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.upazila}
                      </span>
                    )}
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    সম্পূর্ণ ঠিকানা (বাসা/হোল্ডিং, রোড নম্বর, এলাকা) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="যেমন: বাসা #৪৫, রোড #৩, ব্লক-সি, আফতাবনগর, ঢাকা।"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                      errors.address
                        ? 'border-rose-400 bg-rose-50/50'
                        : 'border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white'
                    }`}
                  />
                  {errors.address && (
                    <span className="text-xs text-rose-500 mt-1 block flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                    </span>
                  )}
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    বিশেষ কোনো নির্দেশনা থাকলে লিখুন (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: কল দিয়ে আসবেন / বিকেলে ডেলিভারি দিন"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FFF9F6] focus:border-[#FF6B35] focus:bg-white px-4 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-sm">
                  ২
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">পেমেন্ট মেথড নির্বাচন করুন</h2>
                  <p className="text-xs text-stone-500">ক্যাশ অন ডেলিভারি অথবা বিকাশ/নগদে অগ্রিম পেমেন্টের সুবিধা</p>
                </div>
              </div>

              {/* Payment Method Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#FF6B35] bg-orange-50/70 ring-2 ring-[#FF6B35]/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-stone-800">
                      ক্যাশ অন ডেলিভারি
                    </span>
                    {paymentMethod === 'cod' && (
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানের কাছে মূল্য দিন।
                  </p>
                </button>

                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-pink-50/60 ring-2 ring-[#E2136E]/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-xs text-[#E2136E]">
                      bKash (বিকাশ)
                    </span>
                    {paymentMethod === 'bkash' && (
                      <CheckCircle2 className="w-4 h-4 text-[#E2136E]" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    বিকাশে সেন্ড মানি করে TrxID দিয়ে নিশ্চিত করুন।
                  </p>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F7941D] bg-amber-50/60 ring-2 ring-[#F7941D]/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-xs text-[#F7941D]">
                      Nagad (নগদ)
                    </span>
                    {paymentMethod === 'nagad' && (
                      <CheckCircle2 className="w-4 h-4 text-[#F7941D]" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    নগদে সেন্ড মানি করে TrxID দিয়ে নিশ্চিত করুন।
                  </p>
                </button>
              </div>

              {/* bKash / Nagad Payment Details Box */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Provider Card with Copy Button */}
                  <div
                    className={`p-5 rounded-2xl border ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-200 bg-pink-50/40'
                        : 'border-amber-200 bg-amber-50/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider block mb-1 text-stone-700">
                          {paymentMethod === 'bkash' ? 'বিকাশ পার্সোনাল নম্বর' : 'নগদ পার্সোনাল নম্বর'}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-stone-900">
                            {paymentMethod === 'bkash' ? STORE_CONFIG.bkashNumber : STORE_CONFIG.nagadNumber}
                          </span>
                          <span className="text-xs font-semibold text-stone-500">
                            (Send Money)
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleCopyNumber(
                            paymentMethod === 'bkash'
                              ? STORE_CONFIG.bkashNumber
                              : STORE_CONFIG.nagadNumber,
                            paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'
                          )
                        }
                        className="inline-flex items-center gap-1.5 bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>নম্বর কপি করুন</span>
                      </button>
                    </div>

                    {/* Instructions in Bengali */}
                    <div className="mt-4 pt-4 border-t border-stone-200/60 text-xs text-stone-700 space-y-1.5">
                      <span className="font-bold text-stone-900 block mb-1">পেমেন্ট করার নিয়মাবলী:</span>
                      <ol className="list-decimal list-inside space-y-1 leading-relaxed text-stone-600">
                        <li>১. প্রথমে উপরের নম্বরে Send Money করুন।</li>
                        <li>২. পেমেন্ট সম্পন্ন হলে Transaction ID সংগ্রহ করুন।</li>
                        <li>৩. নিচের ফর্মে Transaction ID লিখুন।</li>
                        <li>৪. আপনার অর্ডার নিশ্চিত করতে WhatsApp বাটনে ক্লিক করুন।</li>
                      </ol>
                    </div>
                  </div>

                  {/* Clean Payment Verification Form Fields (Screenshot upload & warning notice removed as requested) */}
                  <div className="p-5 rounded-2xl border border-stone-200 bg-[#FFF9F6] space-y-4">
                    <span className="text-xs font-extrabold text-stone-900 block uppercase tracking-wider">
                      পেমেন্ট ভেরিফিকেশন তথ্য
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* TrxID */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Transaction ID (TrxID) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: 9J4K2L8M"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-mono font-bold uppercase outline-none focus:border-[#FF6B35]"
                        />
                        {errors.trxId && (
                          <span className="text-xs text-rose-500 mt-1 block">
                            {errors.trxId}
                          </span>
                        )}
                      </div>

                      {/* Sender Number */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          প্রেরক মোবাইল নম্বর (Sender Number) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-[#FF6B35]"
                        />
                        {errors.senderNumber && (
                          <span className="text-xs text-rose-500 mt-1 block">
                            {errors.senderNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment Amount */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        পরিশোধিত টাকার পরিমাণ (Amount)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`৳${totalAmount.toLocaleString('en-IN')}`}
                        className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-2 text-xs font-bold text-stone-800"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Submission Section: Place Order on Website removed as requested; WhatsApp is the sole action */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <button
                type="button"
                onClick={handleConfirmViaWhatsApp}
                className="w-full flex items-center justify-center gap-2.5 bg-[#16A34A] hover:bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl shadow-md transition-all active:scale-95 text-base sm:text-lg cursor-pointer"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Confirm Order via WhatsApp (হোয়াটসঅ্যাপে নিশ্চিত করুন)</span>
              </button>
            </div>

          </div>

          {/* Right 5 Columns: Product Information Card & Bill Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Product Information Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs text-left">
              <h2 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center justify-between">
                <span>অর্ডারকৃত পণ্য তালিকা</span>
                <span className="text-xs font-semibold text-stone-400">
                  {orderedItems.length}টি পণ্য
                </span>
              </h2>

              <div className="space-y-4 divide-y divide-stone-100">
                {orderedItems.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div key={item.product.id} className="pt-3 first:pt-0">
                      <div className="flex gap-3.5 items-start">
                        {/* Product Image in <img> tag */}
                        <img
                          src={item.product.image}
                          alt={item.product.nameBn}
                          className="w-18 h-18 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                            {item.product.nameBn}
                          </h4>
                          <span className="text-[11px] text-stone-500 font-mono font-bold block mt-0.5">
                            কোড: {item.product.code}
                          </span>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-stone-600 font-semibold">
                              একক: ৳{item.product.price.toLocaleString('en-IN')}
                            </span>

                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-dashed border-stone-100 text-xs">
                        <span className="text-stone-500 font-medium">উপমোট:</span>
                        <span className="font-extrabold text-[#FF6B35] tabular-nums">
                          ৳{lineTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bill Summary */}
              <div className="mt-6 pt-4 border-t border-stone-200 space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>পণ্যের মোট মূল্য:</span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    ৳{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600 items-center">
                  <span>
                    ডেলিভারি চার্জ ({district.includes('ঢাকা') || district.includes('Dhaka') ? 'ঢাকার ভেতর' : 'ঢাকার বাইরে'}):
                  </span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-extrabold">ফ্রি ডেলিভারি</span>
                    ) : (
                      `৳${deliveryFee.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-stone-900">সর্বমোট প্রদেয় মূল্য:</span>
                  <span className="text-2xl font-black text-[#FF6B35] tabular-nums">
                    ৳{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Free delivery prompt if applicable */}
              {subtotal < STORE_CONFIG.freeDeliveryThreshold && (
                <div className="mt-4 p-2.5 rounded-xl bg-orange-50/70 border border-orange-100 text-[11px] text-stone-600">
                  আর মাত্র{' '}
                  <strong className="text-[#FF6B35]">
                    ৳{(STORE_CONFIG.freeDeliveryThreshold - subtotal).toLocaleString('en-IN')}
                  </strong>{' '}
                  টাকার পণ্য যুক্ত করলে সম্পূর্ণ ফ্রি ডেলিভারি পাবেন!
                </div>
              )}
            </div>

            {/* Helpline box */}
            <div className="bg-[#1F2937] text-white p-5 rounded-3xl shadow-xs text-left space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-400">
                অর্ডারে কোনো সমস্যা হচ্ছে?
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                সরাসরি আমাদের নম্বরে কল করুন অথবা হোয়াটসঅ্যাপে জানান। আমরা তাৎক্ষণিক সহায়তা করব।
              </p>
              <div className="pt-2 flex flex-col gap-1.5 font-bold text-sm">
                <a
                  href={`tel:${STORE_CONFIG.phone}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  📞 কল করুন: {STORE_CONFIG.phone}
                </a>
                <a
                  href={STORE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  💬 WhatsApp: {STORE_CONFIG.whatsappNumber}
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Order Success Confirmation Modal */}
        {isConfirmModalOpen && placedOrderDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
                অভিনন্দন! আপনার অর্ডার প্রেরিত হয়েছে
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                অর্ডার আইডি: <strong className="font-mono text-[#FF6B35]">{placedOrderDetails.orderId}</strong>
              </p>

              {/* Order Summary receipt */}
              <div className="bg-[#FFF9F6] p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-stone-500">গ্রাহকের নাম:</span>
                  <span className="font-bold text-stone-800">{placedOrderDetails.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">মোবাইল নম্বর:</span>
                  <span className="font-bold text-stone-800">{placedOrderDetails.customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">ডেলিভারি ঠিকানা:</span>
                  <span className="font-bold text-stone-800 max-w-[200px] truncate text-right">
                    {placedOrderDetails.customer.address}, {placedOrderDetails.customer.district}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">পেমেন্ট মেথড:</span>
                  <span className="font-bold uppercase text-stone-800">
                    {placedOrderDetails.payment.method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : placedOrderDetails.payment.method}
                  </span>
                </div>
                {placedOrderDetails.payment.trxId && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">TrxID:</span>
                    <span className="font-mono font-bold text-[#FF6B35]">
                      {placedOrderDetails.payment.trxId}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm">
                  <span>মোট বিল:</span>
                  <span className="text-[#FF6B35] tabular-nums">
                    ৳{placedOrderDetails.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="space-y-3">
                <a
                  href={getWhatsAppOrderUrl({
                    customer: placedOrderDetails.customer,
                    items: placedOrderDetails.items,
                    subtotal: placedOrderDetails.subtotal,
                    deliveryFee: placedOrderDetails.deliveryFee,
                    total: placedOrderDetails.total,
                    payment: placedOrderDetails.payment,
                    orderId: placedOrderDetails.orderId,
                    productCodeNote: productCodeInput || undefined,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে মেসেজ পাঠান</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    navigate('/');
                  }}
                  className="w-full bg-[#FF6B35] hover:bg-[#ea5825] text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  হোম পেজে ফিরে যান
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
