import React from 'react';
import StreamFrame from '../../../components/StreamFrame';
import StreamUIOverlay from '../../../components/StreamUIOverlay';

interface DeckSelectionViewProps {
  onSelect: (deck: any) => void;
}

const DeckSelectionView: React.FC<DeckSelectionViewProps> = ({ onSelect }) => {
  const decks = [
    { id: 'ethereal', name: 'Ethereal Cats', description: '신비로운 고양이들과 함께하는 영혼의 탐구', cssFilter: 'sepia(0.5) hue-rotate(-20deg) saturate(1.2)' },
    { id: 'classic', name: 'Celestial Gold', description: '황금빛 성좌가 안내하는 고전적인 지혜', cssFilter: 'contrast(1.1) brightness(1.1)' }
  ];

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen">
      <StreamUIOverlay />
      <h2 className="font-cinzel text-4xl text-white mb-20 tracking-[0.4em] uppercase text-center">데크 선택</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {decks.map(deck => (
          <StreamFrame key={deck.id} className="group cursor-pointer hover:border-rose-gold transition-all">
             <div className="aspect-video bg-slate-900 rounded-lg mb-8 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-indigo-900/20 to-rose-900/20 group-hover:scale-110 transition-transform duration-1000" />
             </div>
             <h3 className="font-cinzel text-2xl text-white mb-4 tracking-widest">{deck.name}</h3>
             <p className="text-slate-400 font-playfair italic">{deck.description}</p>
          </StreamFrame>
        ))}
      </div>
    </div>
  );
};

export default DeckSelectionView;