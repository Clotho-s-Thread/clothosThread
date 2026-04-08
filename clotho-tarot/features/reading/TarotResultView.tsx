"use client";
import React, { useEffect, useRef } from 'react';
import { Compass, Sun, Moon, Star, RefreshCw, Send } from 'lucide-react';
import { ReadingType, ChatMessage } from '../../types/types';
import StreamUIOverlay from '../../components/StreamUIOverlay';
import StreamFrame from '../../components/StreamFrame';

interface TarotResultViewProps {
  readingResult: any;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedDeck: any;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  userInput: string;
  setUserInput: (input: string) => void;
  pickedIndices: number[];
  setReadingResult: (result: any) => void;
  onReset: () => void;
}

const TarotResultView: React.FC<TarotResultViewProps> = ({
  readingResult,
  isLoading,
  setIsLoading,
  selectedDeck,
  chatMessages,
  setChatMessages,
  userInput,
  setUserInput,
  pickedIndices,
  setReadingResult,
  onReset
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 답변이 올 때마다 채팅창 하단으로 스크롤
  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // 💬 AI 채팅 메시지 전송 함수
  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userContent = userInput.trim();
    const newMsg: ChatMessage = { role: 'user', content: userContent };
    const updatedMessages = [...chatMessages, newMsg];

    setChatMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          })),
          selectedCards: pickedIndices 
        })
      });

      const data = await res.json();

      if (data.text) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
        if (data.cards && data.cards.length > 0) {
          setReadingResult((prev: any) => ({
            ...prev,
            interpretation: data.text,
            cards: data.cards
          }));
        }
      }
    } catch (error) {
      console.error("채팅 전송 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isThreeCard = readingResult?.type === ReadingType.PAST_PRESENT_FUTURE || readingResult?.cards.length === 3;

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />

      {/* --- 🔮 카드 레이아웃 섹션 --- */}
      <div className={isThreeCard ? "flex flex-col gap-12" : "grid grid-cols-1 lg:grid-cols-12 gap-12"}>
        
        {/* 카드 렌더링 영역 */}
        <div className={isThreeCard ? "grid grid-cols-1 md:grid-cols-3 gap-8" : "lg:col-span-4 flex flex-col gap-8"}>
          {readingResult?.cards.map((card: any, i: number) => {
            const isReversed = card.orientation?.toLowerCase() === 'reversed' || card.isReversed === true;
            return (
              <div 
                key={`${i}-${isReversed}-${card.id || card.name}`} 
                className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-1000"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {isThreeCard && (
                  <div className="text-center font-cinzel text-rose-gold tracking-[0.3em] uppercase text-sm font-bold">
                    {i === 0 ? 'Past (과거)' : i === 1 ? 'Present (현재)' : 'Future (미래)'}
                  </div>
                )}
                <StreamFrame className="!p-4">
                  <div className="aspect-[2/3] overflow-hidden mb-6 w-full flex items-center justify-center bg-black/20 rounded-lg">
                    <img 
                      src={card.imageUrl || card.image} 
                      alt={card.name} 
                      style={{ 
                        filter: selectedDeck?.cssFilter,
                        transform: isReversed ? 'rotate(180deg)' : 'none',
                      }}
                      className="max-w-full max-h-full w-auto h-auto object-contain hover:scale-105" 
                    />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-2 tracking-widest text-center">
                    {card.nameKo}
                    {isReversed && <span className="text-xs text-rose-gold ml-2 opacity-60">(역방향)</span>}
                  </h3>
                  <p className="rose-gold-text font-cinzel text-xs tracking-widest uppercase text-center opacity-80">{card.name}</p>
                </StreamFrame>
              </div>
            );
          })}
        </div>

        {/* 해석 및 채팅 영역 */}
        <div className={isThreeCard ? "flex flex-col gap-12 w-full max-w-4xl mx-auto" : "lg:col-span-8 flex flex-col gap-12"}>
          <StreamFrame className="min-h-[300px]">
            <div className="flex items-center gap-6 mb-12 border-b border-[#c58e7133] pb-6">
              <Compass className="w-8 h-8 rose-gold-text" />
              <h4 className="font-cinzel text-2xl md:text-3xl text-white tracking-[0.3em] uppercase">운명의 판결</h4>
            </div>
            {isLoading && !readingResult ? (
              <div className="flex flex-col items-center justify-center h-48">
                <RefreshCw className="w-10 h-10 rose-gold-text animate-spin mb-6" />
                <p className="font-cinzel text-lg rose-gold-text tracking-widest uppercase">운명의 실타래를 풀어내는 중...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-slate-200 font-playfair text-xl md:text-2xl leading-[1.8] whitespace-pre-wrap">
                {readingResult?.interpretation}
              </div>
            )}
          </StreamFrame>

          {/* 보조 조언 섹션 */}
          {!isLoading && readingResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-1000 delay-300 mt-4">
              {[
                { icon: <Sun className="w-6 h-6" />, title: "운명의 조력", content: "현재 질문에 대한 가장 강력한 긍정적 흐름이자 기회입니다." },
                { icon: <Moon className="w-6 h-6" />, title: "경계의 신호", content: "주의해야 할 잠재적인 장애물 또는 무의식의 경고입니다." },
                { icon: <Star className="w-6 h-6" />, title: "행동의 지침", content: "앞으로 나아가야 할 궁극적인 지향점이자 취해야 할 태도입니다." }
              ].map((item, idx) => (
                <StreamFrame key={idx} className="text-center group hover:bg-[#c58e710a] transition-all">
                  <div className="flex justify-center mb-6 rose-gold-text group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h5 className="font-cinzel text-sm text-white mb-4 tracking-[0.4em] uppercase font-bold">{item.title}</h5>
                  <p className="font-playfair text-slate-400 italic text-lg leading-relaxed px-2">{item.content}</p>
                </StreamFrame>
              ))}
            </div>
          )}

          {/* AI 채팅 아카이브 섹션 */}
          <StreamFrame className="flex flex-col h-[500px] mt-12">
            <div className="text-center mb-8">
              <span className="font-cinzel text-sm rose-gold-text tracking-[0.4em] uppercase font-bold">아카이브에 질문하기</span>
            </div>
            <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-6 no-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-6 rounded-2xl ${msg.role === 'user' ? 'bg-[#c58e711a] border border-[#c58e714d] text-amber-50' : 'bg-slate-900/60 border border-white/5 text-slate-300'}`}>
                    <p className="text-lg font-playfair leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && chatMessages.length > 0 && (
                <div className="flex justify-start">
                  <div className="p-4 bg-slate-900/60 border border-white/5 rounded-full">
                    <RefreshCw className="w-5 h-5 rose-gold-text animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="더 궁금한 점을 물어보세요" 
                className="w-full bg-slate-950/80 border border-[#c58e714d] rounded-xl px-8 py-5 text-white font-playfair text-lg focus:outline-none focus:border-rose-gold transition-colors placeholder:text-slate-800"
              />
              <button onClick={handleSendMessage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-gold hover:text-white transition-colors">
                <Send className="w-6 h-6" />
              </button>
            </div>
          </StreamFrame>

          <button onClick={onReset} className="btn-celestial self-center font-bold px-12 py-4 mt-8">새로운 탐색 시작</button>
        </div>
      </div>
    </div>
  );
};

export default TarotResultView;