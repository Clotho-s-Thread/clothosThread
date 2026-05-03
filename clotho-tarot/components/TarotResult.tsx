'use client';
import React from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { ReadingResult, TarotDeck } from '../types/types';
import StreamFrame from './StreamFrame';
import StreamUIOverlay from './StreamUIOverlay';

interface TarotResultProps {
  readingResult: ReadingResult | null;
  selectedDeck: TarotDeck;
  isLoading: boolean;
  resetReading: () => void;
  renderChatSection: () => React.ReactNode;
}

const TarotResult: React.FC<TarotResultProps> = ({
  readingResult,
  selectedDeck,
  isLoading,
  resetReading,
  renderChatSection
}) => {
  // 로딩 중일 때
  if (isLoading || !readingResult) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0d0b1a]/50 z-40">
        <StreamUIOverlay />
        <div className="relative z-50 flex flex-col items-center gap-8">
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

  // 해석이 나온 후
  return (
    <div className="pt-3 px-6 max-w-5xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />
      
      {/* 뒤로가기 버튼 */}
      <button
        onClick={resetReading}
        className="flex items-center gap-2 text-rose-gold hover:text-white transition-colors font-cinzel text-sm tracking-widest uppercase mb-8 relative z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>다시 읽기</span>
      </button>

      {/* 질문 */}
      <div className="relative z-10 mb-12">
        <p className="font-playfair text-white/60 italic text-lg mb-3">당신의 질문</p>
        <h2 className="font-cinzel text-3xl md:text-4xl text-white tracking-[0.3em] mb-8">
          {readingResult.question}
        </h2>
      </div>

      {/* 선택된 카드 */}
      <div className="relative z-10 mb-16">
        <h3 className="font-cinzel text-xl text-rose-gold tracking-[0.3em] uppercase mb-8">선택된 카드</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {readingResult.cards.map((card, idx) => (
            <div key={idx} className="relative group">
              <StreamFrame className="h-full flex flex-col items-center p-4 hover:bg-[#c58e710a] transition-all">
                <div className="aspect-[2/3] w-full mb-6 overflow-hidden relative rounded-lg bg-slate-900/40">
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    style={{ filter: selectedDeck.cssFilter }}
                    className="w-full h-full object-cover"
                  />
                  {card.isReversed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="font-cinzel text-white tracking-[0.2em] text-sm uppercase">역위치</span>
                    </div>
                  )}
                </div>
                <h4 className="font-cinzel text-white text-sm tracking-widest uppercase text-center mb-2">
                  {card.name}
                </h4>
                <p className="font-cinzel text-rose-gold text-xs tracking-widest uppercase text-center">
                  {card.nameKo}
                </p>
              </StreamFrame>
            </div>
          ))}
        </div>
      </div>

      {/* 운명의 판결 */}
      <div className="relative z-10">
        <h3 className="font-cinzel text-xl text-rose-gold tracking-[0.3em] uppercase mb-8">운명의 판결</h3>
        <StreamFrame className="p-8 md:p-12">
          <p className="font-playfair text-white text-xl md:text-2xl leading-relaxed whitespace-pre-line">
            {readingResult.interpretation}
          </p>
        </StreamFrame>
      </div>

      {/* 채팅 섹션 */}
      {renderChatSection()}
    </div>
  );
};

export default TarotResult;