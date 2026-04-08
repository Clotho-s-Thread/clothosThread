import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import StreamFrame from '../../../components/StreamFrame';

interface MasterRegisterViewProps {
  regData: any;
  setRegData: (data: any) => void;
  onCancel: () => void;
}

const MasterRegisterView: React.FC<MasterRegisterViewProps> = ({ regData, setRegData, onCancel }) => {
  return (
    <div className="pt-40 px-6 max-w-3xl mx-auto min-h-screen">
      <button onClick={onCancel} className="flex items-center gap-2 text-rose-gold mb-10 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Masters
      </button>
      <StreamFrame>
        <div className="text-center mb-12">
          <ShieldCheck className="w-12 h-12 rose-gold-text mx-auto mb-6" />
          <h2 className="font-cinzel text-3xl text-white mb-2 tracking-widest">마스터 등록</h2>
          <p className="text-slate-400 font-playfair italic">당신의 통찰력을 세상과 나누어주세요.</p>
        </div>
        <div className="space-y-8">
          {[
            { label: '활동명', key: 'name', placeholder: '예: 달빛술사' },
            { label: '한 줄 타이틀', key: 'title', placeholder: '예: 당신의 미래를 비추는 등불' },
            { label: '전문 분야', key: 'specialization', placeholder: '예: 연애, 재물, 커리어' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block font-cinzel text-xs text-rose-gold tracking-widest uppercase mb-3">{field.label}</label>
              <input 
                type="text" 
                value={regData[field.key]}
                onChange={(e) => setRegData({...regData, [field.key]: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-rose-gold transition-colors"
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <div>
            <label className="block font-cinzel text-xs text-rose-gold tracking-widest uppercase mb-3">상세 소개</label>
            <textarea 
              value={regData.description}
              onChange={(e) => setRegData({...regData, description: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-rose-gold transition-colors min-h-[150px] resize-none"
              placeholder="당신의 상담 스타일과 경력을 소개해 주세요..."
            />
          </div>
          <button className="w-full btn-celestial py-5 text-lg font-bold mt-4">등록 신청하기</button>
        </div>
      </StreamFrame>
    </div>
  );
};

export default MasterRegisterView;