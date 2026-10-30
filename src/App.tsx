import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { AllProductsPage } from './pages/AllProductsPage';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Cart } from './pages/Cart';
import { OrderPage } from './pages/OrderPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { NotFound } from './pages/NotFound';
import { STORE_CONFIG } from './config/constants';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col bg-[#FFF9F6] text-[#1F2937] overflow-x-hidden w-full max-w-full">
              {/* Sticky Navbar */}
              <Navbar />

              {/* Main Content View */}
              <main className="flex-1 w-full max-w-full overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<Home searchQuery={globalSearch} />} />
                  <Route path="/products" element={<AllProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/order" element={<OrderPage />} />
                  <Route path="/track-order" element={<OrderTrackingPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Slide-over Cart Drawer */}
              <CartDrawer />

              {/* Multi-column Premium Footer */}
              <Footer />

              {/* Floating WhatsApp Action Button */}
              <a
                href={STORE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-40 bg-[#16A34A] hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 group"
                aria-label="Chat on WhatsApp"
                title="WhatsApp-এ সরাসরি অর্ডার করুন"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="hidden sm:inline-block text-xs font-bold whitespace-nowrap pr-1">
                  WhatsApp অর্ডার
                </span>
              </a>
            </div>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
