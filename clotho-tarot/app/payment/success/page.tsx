'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StreamFrame from '@/components/StreamFrame';
import StreamUIOverlay from '@/components/StreamUIOverlay';
import { CheckCircle2, Loader, Home } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터 추출
  const orderId = searchParams.get('orderId') || '';
  const amount = searchParams.get('amount') || '0';
  const paymentKey = searchParams.get('paymentKey') || '';
  const points = searchParams.get('points') || '0';

  useEffect(() => {
    async function confirmPayment() {
      try {
        console.log('💳 결제 확인 중...', {
          orderId,
          amount,
          paymentKey
        });

        // ✅ Toss 결제 확인 (서버에서 검증) - 경로 수정!
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            amount: parseInt(amount),
            paymentKey,
            points: parseInt(points)
          }),
        });

        const json = await response.json();

        if (!response.ok) {
          console.error('❌ 결제 확인 실패:', json);
          setError(json.message || '결제 확인 중 오류가 발생했습니다');
          // 실패 페이지로 이동
          setTimeout(() => {
            router.push(`/payment/fail?message=${json.message || '결제 확인 실패'}&code=${json.code || 'UNKNOWN'}`);
          }, 2000);
          return;
        }

        console.log('✅ 결제 확인 완료:', json);

        // ✅ 포인트 실제 추가
        if (points && points !== '0') {
          try {
            const pointsToAdd = parseInt(points);
            
            // localStorage에서 사용자 정보 가져오기
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              const user = JSON.parse(savedUser);
              
              // 포인트 추가
              const updatedUser = {
                ...user,
                points: (user.points || 0) + pointsToAdd
              };
              
              // localStorage 업데이트
              localStorage.setItem('user', JSON.stringify(updatedUser));
              
              console.log('✅ 포인트 추가 완료:', pointsToAdd, '포인트');
            }
          } catch (pointError) {
            console.error('⚠️ 포인트 추가 중 오류:', pointError);
          }
        }

        setIsConfirmed(true);

      } catch (error: any) {
        console.error('❌ 결제 확인 에러:', error);
        setError(error.message || '결제 확인 중 오류가 발생했습니다');
      } finally {
        setIsLoading(false);
      }
    }

    // 필수 파라미터 확인
    if (!orderId || !amount || !paymentKey) {
      console.error('❌ 필수 파라미터 누락:', { orderId, amount, paymentKey });
      setError('필수 파라미터가 누락되었습니다');
      setIsLoading(false);
      return;
    }

    confirmPayment();
  }, [orderId, amount, paymentKey, points, router]);

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
        <StreamUIOverlay />
        <div className="max-w-md w-full relative z-10">
          <StreamFrame className="p-8 text-center">
            <div className="mb-8">
              <Loader className="w-8 h-8 text-[#c58e71] animate-spin mx-auto" />
            </div>
            <h2 className="font-cinzel text-2xl text-white tracking-widest uppercase mb-2">
              결제 확인 중
            </h2>
            <p className="font-playfair text-slate-400 italic">
              잠시만 기다려주세요...
            </p>
          </StreamFrame>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
        <StreamUIOverlay />
        <div className="max-w-md w-full relative z-10">
          <StreamFrame className="p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">❌</span>
              </div>
            </div>
            <h2 className="font-cinzel text-2xl text-red-500 tracking-widest uppercase mb-4">
              오류 발생
            </h2>
            <p className="font-playfair text-slate-400 italic mb-6">
              {error}
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-[#c58e71] text-slate-950 font-cinzel text-sm tracking-widest uppercase rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로
            </button>
          </StreamFrame>
        </div>
      </div>
    );
  }

  if (!isConfirmed) {
    return (
      <div className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
        <StreamUIOverlay />
        <div className="max-w-md w-full relative z-10">
          <StreamFrame className="p-8 text-center">
            <p className="text-slate-400">결제 확인 처리 중입니다...</p>
          </StreamFrame>
        </div>
      </div>
    );
  }

  // ✅ 결제 성공
  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <StreamUIOverlay />
      
      <div className="max-w-md w-full relative z-10">
        <StreamFrame className="p-8">
          {/* 성공 아이콘 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c58e71]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#c58e71]" />
            </div>
            <h1 className="font-cinzel text-3xl text-white tracking-widest uppercase mb-4">
              결제 성공
            </h1>
            <p className="font-playfair text-slate-400 italic">
              "축하합니다! 결제가 완료되었습니다."
            </p>
          </div>

          {/* 결제 정보 */}
          <div className="space-y-4 mb-8 p-6 bg-slate-800/50 border border-[#c58e711a] rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-cinzel">주문번호</span>
              <span className="text-white font-mono text-xs break-all">{orderId}</span>
            </div>
            
            <div className="h-px bg-[#c58e711a]"></div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-cinzel">결제금액</span>
              <span className="text-white font-cinzel text-lg">
                ₩{Number(amount).toLocaleString()}
              </span>
            </div>

            <div className="h-px bg-[#c58e711a]"></div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-cinzel">충전포인트</span>
              <span className="text-[#c58e71] font-cinzel text-lg">
                +{Number(points).toLocaleString()}P
              </span>
            </div>

            {paymentKey && (
              <>
                <div className="h-px bg-[#c58e711a]"></div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-cinzel text-xs">결제키</span>
                  <span className="text-slate-400 font-mono text-[10px] break-all">{paymentKey}</span>
                </div>
              </>
            )}
          </div>

          {/* 메시지 */}
          <p className="text-slate-400 text-sm mb-8 text-center font-playfair italic">
            포인트가 즉시 지급되었습니다.<br />
            지금 바로 상담을 이용할 수 있습니다.
          </p>

          {/* 버튼 */}
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-6 bg-[#c58e71] text-slate-950 font-cinzel text-sm tracking-widest uppercase rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            홈으로 돌아가기
          </button>

          <p className="text-center text-xs text-slate-600 mt-6 font-cinzel tracking-widest">
            ✓ 결제 완료됨
          </p>
        </StreamFrame>
      </div>
    </div>
  );
}