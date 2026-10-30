import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FFF9F6] p-4 text-center">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xs max-w-md w-full">
        <span className="text-6xl font-black text-[#FF6B35] block mb-2 font-mono">
          404
        </span>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          পেজটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল ছিল।
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ea5825] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>
      </div>
    </div>
  );
};
