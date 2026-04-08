"use client";

import React from 'react';
import { Star, Sun, Moon, ChevronDown, RefreshCw } from 'lucide-react';
import { AppState, ReadingType, TarotDeck } from '../../../types/types';
import StreamFrame from '../../../components/StreamFrame';
import StreamUIOverlay from '../../../components/StreamUIOverlay';

interface HomeViewProps {
  selectedDeck: TarotDeck;
  onStartReading: (type: ReadingType) => void;
  onDeckSelectClick: () => void;
  onArcanaViewClick: (state: AppState) => void;
  spreadSectionRef: React.RefObject<HTMLDivElement | null>;
  deckSectionRef: React.RefObject<HTMLDivElement | null>;
}

const HomeView: React.FC<HomeViewProps> = ({
  selectedDeck,
  onStartReading,
  onDeckSelectClick,
  onArcanaViewClick,
  spreadSectionRef,
  deckSectionRef,
}) => {
  return (
    <div className="relative">
      <StreamUIOverlay />
      
      {/* --- 히어로 섹션 --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="text-center relative z-10 px-6">
          <div className="flex justify-center gap-4 mb-8">
            <Star className="w-4 h-4 rose-gold-text" />
            <div className="w-20 h-[1px] bg-[#c58e714d] self-center" />
            <Star className="w-6 h-6 rose-gold-text" />
            <div className="w-20 h-[1px] bg-[#c58e714d] self-center" />
            <Star className="w-4 h-4 rose-gold-text" />
          </div>
          
          <h1 className="font-cinzel text-6xl md:text-9xl lg:text-[10rem] tracking-[0.1em] text-white leading-none mb-4">
            CLOTHO
          </h1>
          
          <div className="flex items-center justify-center gap-8 mb-16">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#c58e71]" />
            <span className="font-playfair italic text-2xl md:text-3xl rose-gold-text tracking-[0.2em]">The Digital Oracle</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#c58e71]" />
          </div>
          
          {/* 덱 테마 선택 위젯 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-4 px-6 py-3 bg-rose-gold/5 border border-rose-gold/20 rounded-full">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-gold/40 bg-slate-900">
                <img 
                  src={selectedDeck.thumbnail} 
                  alt={selectedDeck.name} 
                  style={{ filter: selectedDeck.cssFilter }} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-cinzel text-rose-gold/60 tracking-widest uppercase">현재 선택된 덱</p>
                <p className="text-sm font-cinzel text-white tracking-widest uppercase">{selectedDeck.nameKo}</p>
              </div>
              <button 
                onClick={onDeckSelectClick}
                className="ml-4 p-2 hover:bg-rose-gold/10 rounded-full transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-rose-gold" />
              </button>
            </div>
          </div>

          <button 
            onClick={() => spreadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-celestial text-xl md:text-2xl font-bold"
          >
            운명의 타로 시작하기
          </button>
        </div>
        
        <div className="absolute bottom-12 flex flex-col items-center animate-bounce opacity-40">
           <span className="font-cinzel text-xs tracking-widest rose-gold-text mb-2 uppercase text-center px-4">아래로 스크롤하여 운명을 확인하세요</span>
           <ChevronDown className="w-5 h-5 rose-gold-text" />
        </div>
      </section>

      {/* --- 운명의 정렬 (스프레드 선택) --- */}
      <section ref={spreadSectionRef} className="relative min-h-screen py-32 px-6 flex flex-col items-center bg-slate-950/20 backdrop-blur-sm">
        <div className="mb-20 flex items-center gap-6">
           <div className="w-24 md:w-32 h-[1px] bg-[#c58e714d]" />
           <h2 className="font-cinzel text-2xl md:text-4xl text-white tracking-[0.4em] uppercase text-center">운명의 정렬</h2>
           <div className="w-24 md:w-32 h-[1px] bg-[#c58e714d]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl w-full">
           <div onClick={() => onStartReading(ReadingType.YES_NO)} className="group cursor-pointer">
              <StreamFrame className="h-[500px] flex flex-col items-center justify-center transition-all group-hover:scale-[1.02] group-hover:bg-[#c58e710a]">
                 <div className="mb-12 relative">
                    <div className="w-32 h-32 border border-[#c58e714d] rotate-45 flex items-center justify-center group-hover:border-rose-gold transition-colors">
                       <div className="rotate-[-45deg]"><Sun className="w-12 h-12 rose-gold-text" /></div>
                    </div>
                 </div>
                 <h3 className="font-cinzel text-4xl text-white mb-2 tracking-[0.2em]">태양의 줄기</h3>
                 <p className="rose-gold-text font-cinzel text-sm tracking-widest mb-8 uppercase">단일 실타래</p>
                 <p className="text-slate-400 font-playfair italic text-center text-xl max-w-xs">현재 당신의 길에 비추는 명확하고 집중된 답변을 제공합니다.</p>
              </StreamFrame>
           </div>

           <div onClick={() => onStartReading(ReadingType.PAST_PRESENT_FUTURE)} className="group cursor-pointer">
              <StreamFrame className="h-[500px] flex flex-col items-center justify-center transition-all group-hover:scale-[1.02] group-hover:bg-[#c58e710a]">
                 <div className="mb-12 relative">
                    <div className="w-32 h-32 border border-[#c58e714d] rotate-45 flex items-center justify-center group-hover:border-rose-gold transition-colors">
                       <div className="rotate-[-45deg]"><Moon className="w-12 h-12 rose-gold-text" /></div>
                    </div>
                 </div>
                 <h3 className="font-cinzel text-4xl text-white mb-2 tracking-[0.2em]">달의 주기</h3>
                 <p className="rose-gold-text font-cinzel text-sm tracking-widest mb-8 uppercase">세 개의 실타래</p>
                 <p className="text-slate-400 font-playfair italic text-center text-xl max-w-xs">과거, 현재, 그리고 미래로 이어지는 운명의 진화 과정을 밝혀냅니다.</p>
              </StreamFrame>
           </div>
        </div>
      </section>

      {/* --- 아르카나 도감 --- */}
      <section ref={deckSectionRef} className="relative min-h-screen py-32 px-6 flex flex-col items-center">
        <h2 className="font-cinzel text-3xl md:text-5xl text-white tracking-[0.5em] mb-24 uppercase text-center">아르카나 도감</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full relative z-10">
           <div onClick={() => onArcanaViewClick(AppState.MAJOR_ARCANA_VIEW)} className="group cursor-pointer">
              <StreamFrame className="h-64 flex flex-col items-center justify-center transition-all group-hover:scale-[1.05] group-hover:bg-[#c58e710a]">
                 <h3 className="font-cinzel text-3xl text-white mb-2 tracking-[0.2em] group-hover:text-rose-gold transition-colors">메이저 아르카나</h3>
                 <p className="text-slate-400 font-playfair italic text-lg">운명의 거대한 흐름</p>
                 <div className="mt-6 w-12 h-[1px] bg-rose-gold/30 group-hover:w-24 transition-all" />
              </StreamFrame>
           </div>
           <div onClick={() => onArcanaViewClick(AppState.MINOR_ARCANA_VIEW)} className="group cursor-pointer">
              <StreamFrame className="h-64 flex flex-col items-center justify-center transition-all group-hover:scale-[1.05] group-hover:bg-[#c58e710a]">
                 <h3 className="font-cinzel text-3xl text-white mb-2 tracking-[0.2em] group-hover:text-rose-gold transition-colors">마이너 아르카나</h3>
                 <p className="text-slate-400 font-playfair italic text-lg">운명의 세밀한 흐름</p>
                 <div className="mt-6 w-12 h-[1px] bg-rose-gold/30 group-hover:w-24 transition-all" />
              </StreamFrame>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;