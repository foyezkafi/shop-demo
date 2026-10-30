import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { STORE_CONFIG } from '../config/constants';
import {
  Heart,
  ShoppingBag,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  Check,
  Star,
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      document.title = `${product.nameBn} (${product.code}) | Ideal Bigshop`;
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
          <Link to="/products" className="text-[#FF6B35] underline mt-2 block">
            সকল পণ্যে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleOrderNow = () => {
    navigate(`/order?product=${product.id}&quantity=${quantity}`);
  };

  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  return (
    <div className="min-h-screen bg-[#FFF9F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#FF6B35]">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-[#FF6B35]">সকল পণ্য</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-semibold">{product.nameBn}</span>
        </nav>

        {/* Main Product Details Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 md:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Gallery & Main Image (All in <img> tags!) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main large image */}
              <div className="relative aspect-4/3 sm:aspect-1/1 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={selectedImage}
                  alt={product.nameBn}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-[#FF6B35] text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md">
                    {product.discountPercentage}% মূল্যছাড়
                  </div>
                )}

                {/* Product Code */}
                <div className="absolute bottom-4 left-4 bg-[#1F2937]/90 text-white text-xs font-mono px-3 py-1 rounded-lg backdrop-blur-xs">
                  কোড: {product.code}
                </div>
              </div>

              {/* Thumbnails row */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img
                          ? 'border-[#FF6B35] ring-2 ring-orange-200 scale-102'
                          : 'border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.nameBn} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Purchase Module */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                
                {/* Category & Code */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#FF6B35]">
                    ক্যাটাগরি: {product.category}
                  </span>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                      isWished
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-stone-200 text-stone-600 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-600' : ''}`} />
                    <span>{isWished ? 'সংরক্ষিত' : 'উইশলিস্টে রাখুন'}</span>
                  </button>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-tight">
                  {product.nameBn}
                </h1>
                <p className="text-sm text-stone-500 font-medium">
                  {product.nameEn}
                </p>

                {/* Rating & In Stock */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-stone-800">{product.rating}</span>
                    <span className="text-stone-400">({product.reviewsCount} রিভিউ)</span>
                  </div>
                  <span className="text-stone-300">|</span>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>স্টকে আছে (ইন স্টক)</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-orange-200 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#FF6B35] tabular-nums">
                    ৳{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.previousPrice > product.price && (
                    <span className="text-base text-stone-400 line-through tabular-nums">
                      ৳{product.previousPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md ml-auto">
                    সাশ্রয় ৳{(product.previousPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Short description */}
                <p className="text-stone-600 text-sm leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Key Features List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
                    মূল বৈশিষ্ট্যসমূহ:
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 text-xs text-stone-700">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantity selector */}
                <div className="pt-4 flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-700">পরিমাণ (Quantity):</span>
                  <div className="flex items-center border border-stone-200 rounded-xl bg-white shadow-2xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 tabular-nums">
                    মোট: <strong>৳{(product.price * quantity).toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                {/* CTA Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  {/* Order Now (Direct Checkout) */}
                  <button
                    onClick={handleOrderNow}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>সরাসরি অর্ডার করুন (Order Now)</span>
                  </button>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#FFF9F6] border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-orange-100 font-extrabold py-3 px-6 rounded-xl transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>কার্টে যোগ করুন</span>
                  </button>
                </div>

                {/* WhatsApp Quick Inquire */}
                <a
                  href={`${STORE_CONFIG.whatsappUrl}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি '${product.nameBn}' (কোড: ${product.code}, দাম: ৳${product.price}) সম্পর্কে জানতে এবং সরাসরি অর্ডার করতে চাই।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে সরাসরি কথা বলুন ({STORE_CONFIG.whatsappNumber})</span>
                </a>

                {/* Delivery & Trust Perks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#FF6B35]" />
                    <span>হোম ডেলিভারি সারাদেশে</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF6B35]" />
                    <span>{product.specs.warranty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#FF6B35]" />
                    <span>দেখে মূল্য পরিশোধ</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Specifications Table */}
          <div className="mt-12 pt-8 border-t border-stone-200">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">পণ্যের বিস্তারিত বিবরণ ও স্পেসিফিকেশন</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              {product.fullDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <div className="bg-[#FFF9F6] p-4 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-400 block">উপাদান (Material):</span>
                <span className="text-sm font-bold text-stone-800">{product.specs.material}</span>
              </div>
              <div className="bg-[#FFF9F6] p-4 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-400 block">রং ও ফিনিশিং:</span>
                <span className="text-sm font-bold text-stone-800">{product.specs.color}</span>
              </div>
              <div className="bg-[#FFF9F6] p-4 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-400 block">সাইজ / পরিমাপ:</span>
                <span className="text-sm font-bold text-stone-800">{product.specs.dimensions}</span>
              </div>
              {product.specs.weightCapacity && (
                <div className="bg-[#FFF9F6] p-4 rounded-xl border border-stone-200">
                  <span className="text-xs text-stone-400 block">ভার বহন ক্ষমতা:</span>
                  <span className="text-sm font-bold text-stone-800">{product.specs.weightCapacity}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-extrabold text-[#1F2937]">সম্পর্কিত অন্যান্য পণ্য</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
