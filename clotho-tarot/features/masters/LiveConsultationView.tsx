import React from 'react';
import { X, Send, Phone } from 'lucide-react';
import StreamFrame from '../../components/StreamFrame';

interface LiveConsultationViewProps {
  selectedMaster: any;
  chatMessages: any[];
  onClose: () => void;
}

const LiveConsultationView: React.FC<LiveConsultationViewProps> = ({ selectedMaster, chatMessages, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0d0b1a] flex flex-col md:flex-row">
      {/* 사이드바: 마스터 정보 */}
      <div className="w-full md:w-80 bg-slate-900/40 border-r border-white/5 p-8 flex flex-col items-center">
        <button onClick={onClose} className="self-start p-2 text-slate-500 hover:text-white mb-12"><X /></button>
        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-rose-gold mb-6 flex items-center justify-center">
          <span className="text-3xl text-rose-gold font-cinzel">{selectedMaster?.name[0]}</span>
        </div>
        <h3 className="font-cinzel text-2xl text-white mb-2">{selectedMaster?.name}</h3>
        <p className="rose-gold-text text-xs tracking-widest uppercase mb-8">{selectedMaster?.title}</p>
        <button className="w-full py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all">
          <Phone className="w-4 h-4" /> 보이스 콜 연결
        </button>
      </div>

      {/* 메인 채팅창 */}
      <div className="flex-1 flex flex-col p-6 md:p-12">
        <div className="flex-1 overflow-y-auto space-y-6 mb-8 no-scrollbar">
          <div className="text-center py-10">
            <span className="px-4 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 uppercase tracking-widest">상담이 시작되었습니다</span>
          </div>
          {/* 메시지 렌더링 생략 (TarotResultView와 유사한 로직) */}
        </div>
        <div className="relative max-w-4xl mx-auto w-full">
          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white text-lg focus:outline-none focus:border-rose-gold transition-all" placeholder="마스터에게 메시지를 보내세요..." />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 btn-celestial p-3 rounded-xl"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

export default LiveConsultationView;