"use client";

import React, { useEffect } from "react";
import { Compass, RefreshCw } from "lucide-react"; // 아이콘 라이브러리 확인 필요
import StreamFrame from "./StreamFrame";
import StreamUIOverlay from "./StreamUIOverlay";

interface TarotResultProps {
  readingResult: any; // 나중에 정확한 타입으로 교체 권장
  selectedDeck: any;
  isLoading: boolean;
  resetReading: () => void;
  renderChatSection?: () => React.ReactNode;
}

const TarotResult = ({
  readingResult,
  selectedDeck,
  isLoading,
  resetReading,
  renderChatSection,
}: TarotResultProps) => {
  
  // 📍 컴포넌트 마운트 시 화면 위에서부터 시작
  useEffect(() => {
    // 스크롤 금지
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflow = 'hidden';
    
    // 즉시 스크롤 (최상단)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // setTimeout으로 렌더링 후 다시 스크롤
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    
    // cleanup: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.scrollBehavior = 'smooth';
    };
  }, []);
  
  // 로딩 중일 때 - 화면 가운데 표시
  if (isLoading && !readingResult?.interpretation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0d0b1a]/50 z-40">
        <StreamUIOverlay />
        <div className="relative z-50">
          <div className="w-96 h-96 flex items-center justify-center">
            <StreamFrame className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <RefreshCw className="w-12 h-12 text-rose-gold animate-spin" />
                <p className="font-cinzel text-white tracking-[0.3em] uppercase text-sm">
                  운명을 읽고 있습니다...
                </p>
              </div>
            </StreamFrame>
          </div>
        </div>
      </div>
    );
  }
  
  // 3장 스프레드인지 확인
  const isThreeCard =
    readingResult?.type === "PAST_PRESENT_FUTURE" ||
    readingResult?.cards.length === 3;

  // 공통 카드 렌더링 컴포넌트 (내부 헬퍼)
  const RenderCard = ({ card, i, layoutType }: { card: any; i: number; layoutType: "1" | "3" }) => {
    const c = card as any;
    // 역방향 판정 로직 (보내주신 코드 그대로 유지)
    const isReversed =
      c.orientation?.toLowerCase() === "reversed" ||
      c.direction?.toLowerCase() === "reversed" ||
      c.isReversed === true ||
      c.is_reversed === true;

      console.log(`card:`, card);
      console.log(`c:`, c);
      console.log(`orientation:`, c.orientation, card.orientation);
      console.log(`isReversed:`, isReversed);

    const label = layoutType === "3" 
      ? (i === 0 ? "Past (과거)" : i === 1 ? "Present (현재)" : "Future (미래)") 
      : null;

    return (
      <div
        key={`${i}-${isReversed}-${c.id || c.name}`}
        className={`flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-1000`}
        style={{ animationDelay: `${i * 200}ms` }}
      >
        {label && (
          <div className="text-center font-cinzel text-rose-gold tracking-[0.3em] uppercase text-sm font-bold">
            {label}
          </div>
        )}
        <StreamFrame className="!p-4">
          <div className="aspect-[2/3] overflow-hidden mb-6 w-full flex items-center justify-center bg-black/20 rounded-lg">
            <img
              src={card.imageUrl || card.image}
              alt={card.name}
              style={{
                filter: selectedDeck?.cssFilter,
                transform: isReversed ? "rotate(180deg)" : "none",
              }}
              className="max-w-full max-h-full w-auto h-auto object-contain hover:scale-105"
            />
          </div>
          <h3 className="font-cinzel text-xl text-white mb-2 tracking-widest text-center">
            {card.nameKo}
            {isReversed && (
              <span className="text-xs text-rose-gold ml-2 opacity-60">(역방향)</span>
            )}
          </h3>
          <p className="rose-gold-text font-cinzel text-xs tracking-widest uppercase text-center opacity-80">
            {card.name}
          </p>
        </StreamFrame>
      </div>
    );
  };

  return (
    <div className="pt-3 px-6 max-w-7xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />

      {isThreeCard ? (
        /* --- 🔮 3장 스프레드 레이아웃 --- */
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {readingResult?.cards.map((card: any, i: number) => (
              <RenderCard key={i} card={card} i={i} layoutType="3" />
            ))}
          </div>

          <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto">
            <StreamFrame className="min-h-[300px]">
              <div className="flex items-center gap-6 mb-12 border-b border-[#c58e7133] pb-6">
                <Compass className="w-8 h-8 rose-gold-text" />
                <h4 className="font-cinzel text-2xl md:text-3xl text-white tracking-[0.3em] uppercase">
                  운명의 판결
                </h4>
              </div>
              {isLoading && !readingResult ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <RefreshCw className="w-10 h-10 rose-gold-text animate-spin mb-6" />
                  <p className="font-cinzel text-lg rose-gold-text tracking-widest uppercase">
                    운명의 실타래를 풀어내는 중...
                  </p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-slate-200 font-playfair text-xl md:text-2xl leading-[1.8] whitespace-pre-wrap">
                  {readingResult?.interpretation}
                </div>
              )}
            </StreamFrame>
            {renderChatSection && renderChatSection()}
            <button
              onClick={resetReading}
              className="btn-celestial self-center font-bold px-12 py-4 mt-8"
            >
              새로운 탐색 시작
            </button>
          </div>
        </div>
      ) : (
        /* --- 🃏 1장 스프레드 레이아웃 --- */
        <div className="flex flex-col gap-12">
          {/* 카드와 리딩 결과를 나란히 배치 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* 카드 영역 */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              {readingResult?.cards.map((card: any, i: number) => (
                <RenderCard key={i} card={card} i={i} layoutType="1" />
              ))}
            </div>

            {/* 리딩 결과 영역 */}
            <div className="lg:col-span-2">
              <StreamFrame className="min-h-[400px]">
                <div className="flex items-center gap-6 mb-12 border-b border-[#c58e7133] pb-6">
                  <Compass className="w-8 h-8 rose-gold-text" />
                  <h4 className="font-cinzel text-2xl md:text-3xl text-white tracking-[0.3em] uppercase">
                    리딩 결과
                  </h4>
                </div>
                {isLoading && !readingResult ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <RefreshCw className="w-12 h-12 rose-gold-text animate-spin mb-8" />
                    <p className="font-cinzel text-xl rose-gold-text tracking-widest uppercase">
                      운명의 실타래를 풀어내는 중...
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-slate-200 font-playfair text-xl md:text-2xl leading-[1.8] whitespace-pre-wrap">
                    {readingResult?.interpretation}
                  </div>
                )}
              </StreamFrame>
            </div>
          </div>

          {/* 아카이브 질문하기 - 아래 전체 너비 */}
          {renderChatSection && renderChatSection()}

          {/* 새로운 탐색 시작 버튼 - 아카이브 아래 */}
          <button
            onClick={resetReading}
            className="btn-celestial self-center font-bold px-12 py-4 w-full md:w-auto"
          >
            새로운 탐색 시작
          </button>
        </div>
      )}
    </div>
  );
};

export default TarotResult;