'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import StreamFrame from '@/components/StreamFrame';
import StreamUIOverlay from '@/components/StreamUIOverlay';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';

export default function FailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get('code') || 'UNKNOWN';
  const message = searchParams.get('message') || '결제 중 문제가 발생했습니다';

  const handleRetry = () => {
    router.back();
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
      <StreamUIOverlay />
      
      <div className="max-w-md w-full relative z-10">
        <StreamFrame className="p-8">
          {/* 실패 아이콘 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="font-cinzel text-3xl text-red-500 tracking-widest uppercase mb-4">
              결제 실패
            </h1>
            <p className="font-playfair text-slate-400 italic">
              "죄송합니다. 결제 처리 중 문제가 발생했습니다."
            </p>
          </div>

          {/* 에러 정보 */}
          <div className="space-y-4 mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="mb-4">
                  <span className="text-slate-500 font-cinzel text-sm block mb-1">에러 코드</span>
                  <span className="text-white font-mono text-sm break-all">{code}</span>
                </div>

                <div className="h-px bg-red-500/20 my-4"></div>

                <div>
                  <span className="text-slate-500 font-cinzel text-sm block mb-1">실패 사유</span>
                  <span className="text-red-400 font-playfair italic text-sm leading-relaxed">
                    {message}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-slate-800/50 border border-[#c58e711a] rounded-lg p-4 mb-8">
            <p className="text-slate-400 text-xs font-playfair italic text-center">
              결제가 정상적으로 완료되지 않았습니다.<br />
              다시 시도하거나 고객 지원팀에 문의해주세요.
            </p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full py-3 px-6 bg-[#c58e71] text-slate-950 font-cinzel text-sm tracking-widest uppercase rounded-lg hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              다시 시도
            </button>

            <button
              onClick={handleHome}
              className="w-full py-3 px-6 border border-[#c58e7166] text-[#c58e71] font-cinzel text-sm tracking-widest uppercase rounded-lg hover:bg-[#c58e71] hover:text-slate-950 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈으로
            </button>
          </div>

          {/* 도움말 */}
          <p className="text-center text-xs text-slate-600 mt-6 font-cinzel tracking-widest">
            문제가 계속되면 관리자에 문의하세요
          </p>
        </StreamFrame>

        {/* 에러 상세 정보 (개발자용) */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
          <p className="text-[10px] text-slate-500 font-mono mb-2">📋 에러 상세 정보</p>
          <div className="space-y-1 text-[10px] text-slate-600 font-mono">
            <p>Code: <span className="text-slate-400">{code}</span></p>
            <p>Message: <span className="text-slate-400 break-all">{message}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}