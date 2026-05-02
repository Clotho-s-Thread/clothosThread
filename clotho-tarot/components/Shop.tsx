'use client';

import React from 'react';
import { ShoppingBag, Star, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import StreamFrame from './StreamFrame';
import StreamUIOverlay from './StreamUIOverlay';

interface ShopProps {
  onPointPurchaseClick: () => void;
  onSubscriptionPurchaseClick: () => void;
}

const Shop: React.FC<ShopProps> = ({ onPointPurchaseClick, onSubscriptionPurchaseClick }) => {
  return (
    <div className="fixed top-[140px] left-0 right-0 bottom-0 overflow-hidden px-6 flex flex-col items-center justify-center">
      <StreamUIOverlay />
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-6">
          <div className="flex justify-center gap-4 mb-4">
            <Star className="w-4 h-4 rose-gold-text" />
            <div className="w-20 h-[1px] bg-[#c58e714d] self-center" />
            <ShoppingBag className="w-8 h-8 text-[#c58e71]" />
            <div className="w-20 h-[1px] bg-[#c58e714d] self-center" />
            <Star className="w-4 h-4 rose-gold-text" />
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl text-white tracking-[0.2em] uppercase mb-3">신비로운 상점</h2>
          <p className="font-playfair italic text-base md:text-xl text-slate-400">"당신의 여정을 풍요롭게 할 영적인 에너지를 보충하세요."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-10">
          {/* Point Purchase Card */}
          <div 
            onClick={onPointPurchaseClick}
            className="group relative cursor-pointer p-10 border border-[#c58e7133] bg-slate-900/50 hover:border-[#c58e71] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Zap className="w-32 h-32 text-[#c58e71]" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full border border-[#c58e7133] flex items-center justify-center mb-6 group-hover:border-[#c58e71] transition-colors">
                <Zap className="w-8 h-8 text-[#c58e71]" />
              </div>
              <h3 className="font-cinzel text-2xl md:text-3xl text-white tracking-widest mb-3 uppercase">포인트 구매</h3>
              <p className="font-playfair italic text-sm md:text-base text-slate-400 mb-6">즉시 필요한 영적 에너지를 충전하세요.</p>
              <div className="flex items-center gap-4 text-[#c58e71] font-cinzel text-xs tracking-[0.3em] uppercase">
                <span>자세히 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>

          {/* Monthly Subscription Card */}
          <div 
            onClick={onSubscriptionPurchaseClick}
            className="group relative cursor-pointer p-10 border border-[#c58e7133] bg-slate-900/50 hover:border-[#c58e71] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Star className="w-32 h-32 text-[#c58e71]" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full border border-[#c58e7133] flex items-center justify-center mb-6 group-hover:border-[#c58e71] transition-colors">
                <RefreshCw className="w-8 h-8 text-[#c58e71]" />
              </div>
              <h3 className="font-cinzel text-2xl md:text-3xl text-white tracking-widest mb-3 uppercase">월정액 구독</h3>
              <p className="font-playfair italic text-sm md:text-base text-slate-400 mb-6">지속적인 성장을 위한 정기적인 축복을 받으세요.</p>
              <div className="flex items-center gap-4 text-[#c58e71] font-cinzel text-xs tracking-[0.3em] uppercase">
                <span>자세히 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border border-[#c58e711a] bg-slate-950/50 text-center w-full">
          <h4 className="font-cinzel text-xs text-white tracking-widest uppercase mb-3">상점 안내</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            모든 구매 내역은 계정에 영구적으로 기록되며, 보안 서버를 통해 안전하게 처리됩니다.
            구독 서비스는 언제든지 해지가 가능하며, 해지 시 다음 결제일부터 청구되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shop;