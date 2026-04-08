import React from 'react';
import StreamUIOverlay from '../../components/StreamUIOverlay';
import StreamFrame from '../../components/StreamFrame';

interface QuestionInputViewProps {
  question: string;
  setQuestion: (val: string) => void;
  onNext: () => void;
}

const QuestionInputView: React.FC<QuestionInputViewProps> = ({ question, setQuestion, onNext }) => {
  return (
    <div className="pt-40 px-6 max-w-4xl mx-auto flex flex-col items-center min-h-screen">
      <StreamUIOverlay />
      <h2 className="font-cinzel text-3xl md:text-5xl text-white mb-20 tracking-[0.3em] uppercase text-center">의지의 속삭임</h2>
      <StreamFrame className="w-full">
        <textarea 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          className="w-full bg-transparent border-none focus:ring-0 text-white font-playfair text-2xl md:text-3xl leading-relaxed min-h-[300px] resize-none placeholder:text-slate-800" 
          placeholder="당신의 질문은 무엇입니까?..." 
        />
      </StreamFrame>
      <button 
        onClick={onNext} 
        disabled={!question.trim()} 
        className="mt-16 btn-celestial text-xl font-bold disabled:opacity-30"
      >
        운명의 데크로 나아가기
      </button>
    </div>
  );
};

export default QuestionInputView;