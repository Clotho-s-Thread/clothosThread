"use client";
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Hexagon, ArrowRight } from 'lucide-react';
import { ReadingType } from '../../types/types';
import StreamUIOverlay from '../../components/StreamUIOverlay';
import StreamFrame from '../../components/StreamFrame';

interface CardPickingViewProps {
  selectedType: ReadingType | null;
  pickedIndices: number[];
  setPickedIndices: React.Dispatch<React.SetStateAction<number[]>>;
  onFinalize: () => void;
}

const TOTAL_DECK_SIZE = 78; // 전체 카드 수

const CardPickingView: React.FC<CardPickingViewProps> = ({
  selectedType,
  pickedIndices,
  setPickedIndices,
  onFinalize
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 덱 스크롤 제어
  const scrollDeck = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 카드 선택 핸들러
  const handlePickCard = (idx: number) => {
    const maxCards = selectedType === ReadingType.YES_NO ? 1 : 3;
    
    if (pickedIndices.includes(idx)) {
      setPickedIndices(pickedIndices.filter(i => i !== idx));
    } else if (pickedIndices.length < maxCards) {
      setPickedIndices([...pickedIndices, idx]);
    }
  };

  return (
    <div className="pt-32 flex flex-col items-center min-h-screen pb-40 overflow-hidden relative">
      <StreamUIOverlay />
      
      {/* 상단 타이틀 섹션 */}
      <div className="text-center mb-20 relative z-10 px-6">
        <h2 className="font-cinzel text-3xl md:text-4xl text-white mb-4 tracking-[0.4em] uppercase">수평선 스프레드</h2>
        <div className="flex items-center justify-center gap-4 rose-gold-text font-cinzel text-sm tracking-widest">
          <div className="w-12 h-[1px] bg-[#c58e714d]" />
          <span className="bg-[#0d0b1a] px-4">
            {pickedIndices.length} / {selectedType === ReadingType.YES_NO ? 1 : 3} 개의 실타래가 선택됨
          </span>
          <div className="w-12 h-[1px] bg-[#c58e714d]" />
        </div>
      </div>
      
      {/* 카드 덱 영역 */}
      <div className="relative w-full max-w-[1800px] z-10 group">
        <button 
          onClick={() => scrollDeck('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-slate-950/80 border border-rose-gold/30 rounded-full text-rose-gold hover:bg-rose-gold hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={() => scrollDeck('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-slate-950/80 border border-rose-gold/30 rounded-full text-rose-gold hover:bg-rose-gold hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar py-20 px-[20vw] gap-1 cursor-grab active:cursor-grabbing"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {Array.from({ length: TOTAL_DECK_SIZE }).map((_, idx) => {
            const isPicked = pickedIndices.includes(idx);
            const pickOrder = pickedIndices.indexOf(idx) + 1;
            
            return (
              <div 
                key={idx} 
                onClick={() => handlePickCard(idx)} 
                className={`relative flex-shrink-0 w-32 md:w-44 aspect-[2/3] cursor-pointer transition-all duration-500 transform 
                  ${isPicked ? 'scale-110 -translate-y-12 z-20' : 'hover:-translate-y-6 hover:z-10 opacity-60 hover:opacity-100'}
                  first:ml-0 -ml-12 md:-ml-20`}
                style={{ scrollSnapAlign: 'center' }}
              >
                <StreamFrame className={`h-full flex items-center justify-center transition-all shadow-2xl
                  ${isPicked ? 'border-rose-gold shadow-[0_0_40px_rgba(197,142,113,0.6)] bg-[#c58e712a]' : 'border-[#c58e712a] bg-slate-900/40'}`}>
                  
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    {isPicked ? (
                      <div className="flex flex-col items-center animate-pulse scale-150">
                        <span className="font-cinzel text-3xl rose-gold-text font-bold mb-1">{pickOrder}</span>
                        <Star className="w-4 h-4 rose-gold-text" />
                      </div>
                    ) : (
                      <Hexagon className="w-8 h-8 text-[#c58e711a]" />
                    )}
                  </div>
                  
                  {/* 카드 장식 요소 */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="w-full h-full border border-dashed border-rose-gold/20 m-1 rounded-sm" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                </StreamFrame>
              </div>
            );
          })}
        </div>
        
        {/* 사이드 그라데이션 페이드 */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#0d0b1a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#0d0b1a] to-transparent z-20 pointer-events-none" />
      </div>

      {/* 하단 컨트롤 바 */}
      <div className="mt-20 flex flex-col md:flex-row items-center gap-10 relative z-10">
        <button 
          onClick={() => setPickedIndices([])} 
          className="font-cinzel rose-gold-text tracking-[0.3em] hover:text-white transition-colors uppercase text-sm border-b border-[#c58e714d] pb-1"
        >
          실타래 다시 섞기
        </button>
        <button 
          onClick={onFinalize} 
          disabled={pickedIndices.length < (selectedType === ReadingType.YES_NO ? 1 : 3)} 
          className="btn-celestial text-xl disabled:opacity-20 disabled:cursor-not-allowed group font-bold"
        >
          운명 풀어내기 <ArrowRight className="inline-block ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rose-gold-text/40 font-cinzel text-[10px] tracking-[0.3em] uppercase whitespace-nowrap px-4">
        <ChevronLeft className="w-3 h-3" /> 스와이프하여 덱을 탐색하세요 <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  );
};

export default CardPickingView;