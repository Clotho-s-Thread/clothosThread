import React from 'react';
import StreamFrame from '../../components/StreamFrame';

interface ArcanaLibraryViewProps {
  type: 'Major' | 'Minor';
}

const ArcanaLibraryView: React.FC<ArcanaLibraryViewProps> = ({ type }) => {
  return (
    <div className="pt-40 px-6 max-w-7xl mx-auto min-h-screen pb-40">
      <div className="mb-20">
        <h2 className="font-cinzel text-4xl text-white mb-4 tracking-[0.3em] uppercase">{type} Arcana</h2>
        <p className="rose-gold-text font-playfair italic text-lg">에테르의 세계에 존재하는 {type === 'Major' ? '22장의 메이저' : '56장의 마이너'} 카드를 탐색합니다.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array.from({ length: type === 'Major' ? 22 : 56 }).map((_, i) => (
          <StreamFrame key={i} className="!p-2 group cursor-pointer">
            <div className="aspect-[2/3] bg-slate-900 rounded mb-3 flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-indigo-950/20 group-hover:scale-110 transition-transform duration-700" />
            </div>
            <p className="font-cinzel text-[10px] text-center text-white/40 tracking-tighter uppercase">Coming Soon</p>
          </StreamFrame>
        ))}
      </div>
    </div>
  );
};

export default ArcanaLibraryView;