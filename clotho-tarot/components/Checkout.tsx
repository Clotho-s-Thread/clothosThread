'use client';

import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import StreamFrame from './StreamFrame';
import StreamUIOverlay from './StreamUIOverlay';
import { ChevronLeft, Loader } from "lucide-react";

interface CheckoutProps {
  user?: { email: string; name: string } | null;
  onBack: () => void;
}

export default function Checkout({ user, onBack }: CheckoutProps) {
  // ✅ orderId, orderName 등을 직접 생성 (URL 파라미터 없이)
  const [orderId] = useState(() => {
    const timestamp = Date.now();
    const uuid = Math.random().toString(36).substring(2, 10);
    return `points-${timestamp}-${uuid}`;
  });

  const amount = 1000; // 테스트용 금액
  const orderName = `CLOTHO 포인트 충전 - 100P`;
  const points = '100';

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const [paymentAmount, setPaymentAmount] = useState({
    currency: "KRW",
    value: amount,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 결제 위젯 초기화
  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        if (!clientKey) {
          console.error('❌ clientKey가 없습니다');
          return;
        }

        console.log('⏳ Toss 결제 위젯 초기화 중...');
        
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        
        setWidgets(widgets);
        console.log('✅ 결제 위젯 초기화 완료');
      } catch (error) {
        console.error('❌ 결제 위젯 초기화 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPaymentWidgets();
  }, [clientKey]);

  // ✅ 결제 UI 렌더링
  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      try {
        console.log('⏳ 결제 UI 렌더링 중...');
        
        await widgets.setAmount(paymentAmount);
        
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);
        
        setReady(true);
        console.log('✅ 결제 UI 렌더링 완료');
      } catch (error) {
        console.error('❌ 결제 UI 렌더링 실패:', error);
      }
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }
    widgets.setAmount(paymentAmount);
  }, [widgets, paymentAmount]);

  const handlePayment = async () => {
    if (!widgets) {
      alert('결제 위젯이 로드되지 않았습니다');
      return;
    }

    try {
      console.log('💳 결제 요청 중...');
      
      await widgets.requestPayment({
        orderId: orderId,
        orderName: orderName,
        successUrl: `${baseUrl}/payment/success?orderId=${orderId}&amount=${paymentAmount.value}&points=${points}`,
        failUrl: `${baseUrl}/payment/fail`,
        customerEmail: user?.email || 'guest@example.com',
        customerName: user?.name || '고객',
      });

      console.log('✅ 결제 성공');
    } catch (error: any) {
      console.error('❌ 결제 실패:', error);
      
      if (error.code !== 'USER_CANCELLED') {
        alert(`결제 실패: ${error.message || '다시 시도해주세요'}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StreamUIOverlay />
        <StreamFrame className="p-8 text-center">
          <Loader className="w-8 h-8 text-[#c58e71] animate-spin mx-auto mb-4" />
          <h2 className="font-cinzel text-xl text-white tracking-widest uppercase">
            결제 페이지 로딩 중...
          </h2>
        </StreamFrame>
      </div>
    );
  }

  if (!clientKey || !baseUrl) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <StreamUIOverlay />
        <StreamFrame className="p-8 text-center">
          <h2 className="font-cinzel text-xl text-red-500 tracking-widest uppercase">
            환경 변수 설정 오류
          </h2>
          <p className="text-slate-400 mt-4">
            NEXT_PUBLIC_TOSS_CLIENT_KEY와 NEXT_PUBLIC_BASE_URL을 확인해주세요
          </p>
        </StreamFrame>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6">
      <StreamUIOverlay />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#c58e71] font-cinzel text-xs tracking-[0.3em] uppercase mb-12 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          뒤로가기
        </button>

        <StreamFrame className="p-8 md:p-12">
          <div className="mb-8 pb-8 border-b border-[#c58e711a]">
            <h1 className="font-cinzel text-3xl text-white tracking-widest uppercase mb-6">
              결제하기
            </h1>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-cinzel text-sm">상품명</span>
                <span className="text-white font-playfair">{orderName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-500 font-cinzel text-sm">금액</span>
                <span className="text-white font-cinzel text-lg">
                  ₩{paymentAmount.value.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-cinzel text-sm">포인트</span>
                <span className="text-[#c58e71] font-cinzel text-lg">+{points}P</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-cinzel text-sm text-slate-400 tracking-widest uppercase mb-4">
              결제 방법
            </h2>
            <div 
              id="payment-method"
              className="min-h-[200px] bg-slate-800/30 rounded-lg p-4"
            />
          </div>

          <div className="mb-8">
            <h2 className="font-cinzel text-sm text-slate-400 tracking-widest uppercase mb-4">
              이용약관
            </h2>
            <div 
              id="agreement"
              className="min-h-[100px] bg-slate-800/30 rounded-lg p-4"
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={!ready}
            className="w-full py-4 bg-[#c58e71] text-slate-950 font-cinzel text-sm tracking-widest uppercase rounded-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {!ready ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                로딩 중...
              </>
            ) : (
              '결제하기'
            )}
          </button>

          <p className="text-center text-xs text-slate-600 mt-6 font-playfair italic">
            결제하면 이용약관에 동의하게 됩니다
          </p>
        </StreamFrame>
      </div>
    </div>
  );
}