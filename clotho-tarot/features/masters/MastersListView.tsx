import React from 'react';
import { Users, Star, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import StreamFrame from '../../components/StreamFrame';
import StreamUIOverlay from '../../components/StreamUIOverlay';

interface MastersListViewProps {
  onSelectMaster: (master: any) => void;
  onRegisterClick: () => void;
}

const MastersListView: React.FC<MastersListViewProps> = ({ onSelectMaster, onRegisterClick }) => {
  // 임시 데이터 (실제로는 API에서 가져오게 됩니다)
  const masters = [
    { id: 'm1', name: '엘라', title: '영혼의 가이드', specialization: '연애/관계', rating: 4.9, reviews: 128, isOnline: true },
    { id: 'm2', name: '카이로스', title: '운명의 기록자', specialization: '진로/직업', rating: 5.0, reviews: 89, isOnline: true },
    { id: 'm3', name: '셀레네', title: '달빛의 해석자', specialization: '심리/내면', rating: 4.8, reviews: 215, isOnline: false },
  ];

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="font-cinzel text-4xl text-white mb-4 tracking-[0.3em] uppercase">운명의 인도자</h2>
          <p className="rose-gold-text font-playfair italic text-lg">당신의 실타래를 함께 풀어낼 전문가를 만나보세요.</p>
        </div>
        <button onClick={onRegisterClick} className="btn-celestial text-sm px-6 py-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> 마스터 등록하기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {masters.map((master) => (
          <StreamFrame key={master.id} className="group hover:border-rose-gold/50 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 ${master.isOnline ? 'border-emerald-500' : 'border-slate-700'}`}>
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <div className="flex items-center gap-1 text-rose-gold">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-cinzel text-sm">{master.rating}</span>
              </div>
            </div>
            <h3 className="font-cinzel text-2xl text-white mb-1 tracking-wider">{master.name}</h3>
            <p className="rose-gold-text text-xs tracking-widest uppercase mb-4 opacity-70">{master.title}</p>
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-[#c58e711a] border border-[#c58e7133] rounded-full text-[10px] text-rose-gold uppercase tracking-tighter">
                {master.specialization}
              </span>
            </div>
            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-white font-cinzel text-sm tracking-widest group-hover:bg-rose-gold group-hover:text-slate-950 transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> 상담 시작하기
            </button>
          </StreamFrame>
        ))}
      </div>
    </div>
  );
};

export default MastersListView;