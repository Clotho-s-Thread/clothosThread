'use client';

import React, { useState } from 'react';
import { ChevronLeft, Sparkles, Zap, Star, ShieldCheck, CreditCard, Loader, AlertCircle } from 'lucide-react';
import StreamFrame from './StreamFrame';
import StreamUIOverlay from './StreamUIOverlay';
import { generateOrderId } from '../lib/tossPayment';

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
  user?: { email: string; name: string } | null;
}

const PointPurchase: React.FC<PointPurchaseProps> = ({ 
  packages, 
  onBack, 
  onPurchase,
  user 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'package' | 'confirm' | 'processing'>('package');
  const [selectedPackage, setSelectedPackage] = useState<PointPackage | null>(null);

  const handlePaymentClick = (pkg: PointPackage) => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }
    setSelectedPackage(pkg);
    setPaymentStep('confirm');
  };

const handleConfirmPayment = async () => {
  if (!selectedPackage || !user) return;

  setIsProcessing(true);
  setPaymentStep('processing');

  try {
    const totalPoints = selectedPackage.points + (selectedPackage.bonus || 0);

    console.log('💳 Checkout으로 이동 (포인트 미추가):', totalPoints);

    // ✅ 포인트 추가 제거!
    // onPurchase(totalPoints);  // ← 삭제됨
    
    // ✅ 바로 Checkout으로 이동만 함
    // app/page.tsx에서 CHECKOUT state로 전환하면 Checkout 컴포넌트가 렌더링됨
    
    // 아무것도 하지 않으면 부모에서 처리하도록 대기
    // setTimeout으로 약간의 딜레이 후 처리
    setTimeout(() => {
      // ✅ 부모 컴포넌트에 신호: Checkout으로 이동하라
      // 이 콜백으로 pointerCheckout() 호출
      onPurchase(0);  // ← 0을 전달하면 실제로는 포인트를 추가하지 않음
    }, 500);

  } catch (error: any) {
    console.error('❌ 결제 실패:', error);
    alert(error.message);
    setPaymentStep('confirm');
  } finally {
    setIsProcessing(false);
  }
};

  const handleCancel = () => {
    setPaymentStep('package');
    setSelectedPackage(null);
  };

  // 결제 확인 화면
  if (paymentStep === 'confirm' || paymentStep === 'processing') {
    return (
      <div className="fixed top-[140px] left-0 right-0 bottom-0 overflow-auto px-6 py-6 flex items-center justify-center">
        <StreamUIOverlay />
        <div className="max-w-md w-full relative z-10">
          {paymentStep === 'confirm' ? (
            <StreamFrame className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#c58e71]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-[#c58e71]" />
                </div>
                <h2 className="font-cinzel text-2xl text-white tracking-widest uppercase mb-4">결제 확인</h2>
                <p className="font-playfair text-slate-400 italic">정말로 결제하시겠습니까?</p>
              </div>

              <div className="space-y-4 mb-8 p-6 bg-slate-800/50 border border-[#c58e711a] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-cinzel text-sm">포인트</span>
                  <span className="text-white font-cinzel text-lg">
                    {selectedPackage?.points.toLocaleString()}P
                    {selectedPackage?.bonus && <span className="text-[#c58e71] text-sm ml-2">+{selectedPackage.bonus.toLocaleString()}</span>}
                  </span>
                </div>
                <div className="h-px bg-[#c58e711a]"></div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-cinzel text-sm">금액</span>
                  <span className="text-white font-cinzel text-lg">₩{selectedPackage?.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#c58e71] text-slate-950 font-cinzel text-sm tracking-widest uppercase rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Toss 결제로 이동 중...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Toss 결제하기
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="w-full py-3 border border-[#c58e7166] text-[#c58e71] font-cinzel text-sm tracking-widest uppercase rounded-lg hover:bg-[#c58e71] hover:text-slate-950 transition-all disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            </StreamFrame>
          ) : (
            <StreamFrame className="p-8 text-center">
              <div className="w-16 h-16 bg-[#c58e71]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-8 h-8 text-[#c58e71] animate-spin" />
              </div>
              <h2 className="font-cinzel text-2xl text-white tracking-widest uppercase mb-2">Toss 결제로 이동 중</h2>
              <p className="font-playfair text-slate-400 italic">결제 페이지를 로딩하고 있습니다...</p>
            </StreamFrame>
          )}
        </div>
      </div>
    );
  }

  // 패키지 선택 화면
  return (
    <div className="fixed top-[140px] left-0 right-0 bottom-0 overflow-auto px-6 py-6">
      <StreamUIOverlay />
      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-[#c58e71] font-cinzel text-xl md:text-2xl tracking-widest uppercase mb-10 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          상점으로 돌아가기
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-900 border border-[#c58e7133] rounded-3xl overflow-hidden shadow-2xl">
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
                    <h4 className="font-cinzel text-sm text-white tracking-widest uppercase mb-2">안전한 결제</h4>
                    <p className="text-xs text-slate-500">Toss로 안전하게 결제합니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <Star className="w-6 h-6 text-[#c58e71] mt-1" />
                  <div>
                    <h4 className="font-cinzel text-sm text-white tracking-widest uppercase mb-2">보너스</h4>
                    <p className="text-xs text-slate-500">대량 충전 시 최대 30% 보너스</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <ShieldCheck className="w-6 h-6 text-[#c58e71] mt-1" />
                  <div>
                    <h4 className="font-cinzel text-sm text-white tracking-widest uppercase mb-2">즉시 지급</h4>
                    <p className="text-xs text-slate-500">결제 후 즉시 포인트 추가</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-[#c58e711a]">
              <div className="flex items-center gap-3 text-xs text-slate-600 font-cinzel tracking-widest uppercase">
                <CreditCard className="w-4 h-4" /> Toss Payments
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 p-12 bg-slate-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`relative group p-8 border transition-all duration-300 hover:-translate-y-1 cursor-pointer ${pkg.isPopular ? 'border-[#c58e71] bg-[#c58e7126]' : 'border-[#c58e7133] bg-slate-800 hover:border-[#c58e7166]'}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c58e71] text-slate-950 text-[10px] font-cinzel font-bold px-4 py-1 tracking-widest uppercase rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-cinzel text-2xl text-white tracking-widest mb-2">{pkg.points.toLocaleString()}P</h3>
                      {pkg.bonus && (
                        <span className="text-xs text-[#c58e71] font-cinzel tracking-widest uppercase font-bold">
                          +{pkg.bonus.toLocaleString()} Bonus
                        </span>
                      )}
                    </div>
                    <Sparkles className={`w-6 h-6 ${pkg.isPopular ? 'text-[#c58e71]' : 'text-slate-700 group-hover:text-[#c58e71] transition-colors'}`} />
                  </div>

                  <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#c58e711a] mb-6">
                    <span className="text-slate-500 font-playfair italic text-base">KRW</span>
                    <span className="text-white font-cinzel text-2xl tracking-widest">{pkg.price.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => handlePaymentClick(pkg)}
                    className={`w-full py-3 border font-cinzel text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 ${
                      pkg.isPopular 
                        ? 'bg-[#c58e71] border-[#c58e71] text-slate-950 hover:bg-white hover:border-white' 
                        : 'border-[#c58e7166] text-[#c58e71] hover:bg-[#c58e71] hover:text-slate-950'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    결제하기
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

export default PointPurchase;