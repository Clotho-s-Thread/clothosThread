'use client';

import React from 'react';
import { ChevronLeft, Sparkles, Zap, Star, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import StreamFrame from './StreamFrame';
import StreamUIOverlay from './StreamUIOverlay';

export interface PointPackage {
  id: string;
  points: number;
  bonus?: number;
  price: number;
  isPopular?: boolean;
}

interface PointPurchaseProps {
  packages: PointPackage[];
  onBack: () => void;
  onPurchase: (pointsToAdd: number) => void;
}

const PointPurchase: React.FC<PointPurchaseProps> = ({ packages, onBack, onPurchase }) => {
  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6">
      <StreamUIOverlay />
      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#c58e71] font-cinzel text-xs tracking-[0.3em] uppercase mb-12 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          상점으로 돌아가기
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-900 border border-[#c58e7133] rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Side: Info */}
          <div className="lg:col-span-4 p-12 bg-slate-950 border-r border-[#c58e711a] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#c58e711a] border border-[#c58e714d] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#c58e71]" />
                </div>
                <h2 className="font-cinzel text-3xl text-white tracking-widest uppercase">포인트 충전</h2>
              </div>
              
              <p className="font-playfair text-slate-400 italic text-xl leading-relaxed mb-12">
                "운명의 실타래를 더 깊이 탐구하기 위해 영적인 에너지를 보충하세요."
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <Zap className="w-6 h-6 text-[#c58e71] mt-1" />
                  <div>
                    <h4 className="font-cinzel text-sm text-white tracking-widest uppercase mb-2">즉시 충전</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">결제 즉시 포인트가 지급되어 바로 상담이 가능합니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Star className="w-6 h-6 text-[#c58e71] mt-1" />
                  <div>
                    <h4 className="font-cinzel text-sm text-white tracking-widest uppercase mb-2">보너스 혜택</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">대량 충전 시 최대 30%의 추가 보너스 포인트를 드립니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <ShieldCheck className="w-6 h-6 text-[#c58e71] mt-1" />
                  <div>
                    <h4 className="font-cinzel text-sm text-white tracking-widest uppercase mb-2">안전 결제</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">모든 결제 정보는 암호화되어 안전하게 처리됩니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-[#c58e711a]">
              <div className="flex items-center gap-3 text-xs text-slate-600 font-cinzel tracking-widest uppercase">
                <CreditCard className="w-4 h-4" /> Secure Payment Gateway
              </div>
            </div>
          </div>

          {/* Right Side: Packages */}
          <div className="lg:col-span-8 p-12 bg-slate-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  onClick={() => onPurchase(pkg.points + (pkg.bonus || 0))}
                  className={`relative group cursor-pointer p-8 border transition-all duration-300 hover:-translate-y-1 ${pkg.isPopular ? 'border-[#c58e71] bg-[#c58e7126]' : 'border-[#c58e7133] bg-slate-800 hover:border-[#c58e7166]'}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c58e71] text-slate-950 text-[10px] font-cinzel font-bold px-4 py-1 tracking-widest uppercase rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-cinzel text-2xl text-white tracking-widest mb-2">{(pkg.points).toLocaleString()} P</h3>
                      {pkg.bonus && (
                        <span className="text-xs text-[#c58e71] font-cinzel tracking-widest uppercase font-bold">
                          + {(pkg.bonus).toLocaleString()} Bonus
                        </span>
                      )}
                    </div>
                    <Sparkles className={`w-6 h-6 ${pkg.isPopular ? 'text-[#c58e71]' : 'text-slate-700 group-hover:text-[#c58e71] transition-colors'}`} />
                  </div>

                  <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#c58e711a]">
                    <span className="text-slate-500 font-playfair italic text-base">KRW</span>
                    <span className="text-white font-cinzel text-2xl tracking-widest">{(pkg.price).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-12 text-center text-xs text-slate-600 font-cinzel tracking-[0.2em] uppercase">
              결제 시 이용 약관 및 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointPurchase;