'use client';

import React from 'react';
import { ChevronLeft, Star, CreditCard, CheckCircle2 } from 'lucide-react';
import StreamFrame from './StreamFrame';
import StreamUIOverlay from './StreamUIOverlay';

export interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
  isPopular?: boolean;
}

interface SubscriptionPurchaseProps {
  packages: SubscriptionPackage[];
  onBack: () => void;
  onSubscribe: (pkg: SubscriptionPackage) => void;
}

const SubscriptionPurchase: React.FC<SubscriptionPurchaseProps> = ({ packages, onBack, onSubscribe }) => {
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
          <div className="lg:col-span-3 p-12 bg-slate-950 border-r border-[#c58e711a] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#c58e711a] border border-[#c58e714d] flex items-center justify-center">
                  <Star className="w-6 h-6 text-[#c58e71]" />
                </div>
                <h2 className="font-cinzel text-2xl text-white tracking-widest uppercase">월간 구독</h2>
              </div>
              
              <p className="font-playfair text-slate-400 italic text-lg leading-relaxed mb-12">
                "지속적인 영적 성장을 위해 클로토의 정기적인 축복을 받으세요."
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#c58e71] mt-1" />
                  <div>
                    <h4 className="font-cinzel text-[11px] text-white tracking-widest uppercase mb-2">매월 포인트 지급</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">매월 정기적으로 대량의 포인트가 자동 충전됩니다.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#c58e71] mt-1" />
                  <div>
                    <h4 className="font-cinzel text-[11px] text-white tracking-widest uppercase mb-2">영구 할인</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">구독 기간 동안 모든 상담 비용이 할인됩니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-[#c58e711a]">
              <div className="flex items-center gap-3 text-[10px] text-slate-600 font-cinzel tracking-widest uppercase">
                <CreditCard className="w-4 h-4" /> Recurring Billing
              </div>
            </div>
          </div>

          {/* Right Side: Packages */}
          <div className="lg:col-span-9 p-12 bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`relative flex flex-col p-10 border transition-all duration-500 ${pkg.isPopular ? 'border-[#c58e71] bg-[#c58e7126]' : 'border-[#c58e7133] bg-slate-800'}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c58e71] text-slate-950 text-[10px] font-cinzel font-bold px-4 py-1.5 tracking-widest uppercase rounded-full shadow-lg">
                      Best Value
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="font-cinzel text-2xl text-white tracking-widest mb-2">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 font-playfair italic leading-relaxed">{pkg.description}</p>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-cinzel text-white">₩ {(pkg.price).toLocaleString()}</span>
                      <span className="text-xs text-slate-500 font-cinzel tracking-widest">/ MONTH</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-5 mb-12">
                    {pkg.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-[#c58e71] mt-0.5" />
                        <span className="text-xs text-slate-300 font-cinzel tracking-wider leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onSubscribe(pkg)}
                    className={`w-full py-5 border font-cinzel text-xs tracking-[0.3em] uppercase transition-all ${pkg.isPopular ? 'bg-[#c58e71] border-[#c58e71] text-slate-950 hover:bg-white hover:border-white' : 'border-[#c58e7166] text-[#c58e71] hover:bg-[#c58e71] hover:text-slate-950'}`}
                  >
                    구독하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPurchase;