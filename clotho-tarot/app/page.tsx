'use client';
import React, { useState, useRef, useEffect } from 'react';
import { AppState, ReadingType, TarotCard, ReadingResult, ChatMessage, User, TarotMaster } from '../../types/types';
import { Header } from '../../components/Layout';
import { LoginModal } from '../../components/LoginModal';
import { TAROT_CARDS, TAROT_MASTERS } from '../../constants/constants';
import { interpretTarot, chatAboutReading } from '../../lib/geminiService';
import { Moon, Sparkles, RefreshCw, ArrowRight, Star, Compass, Sun, Eye, ChevronDown, Send, Hexagon, ChevronLeft, ChevronRight, User as UserIcon, MessageCircle, UserPlus, Info } from 'lucide-react';

const StreamUIOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="geometric-bg absolute inset-0" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[800px] h-[800px] border border-[#c58e711a] rounded-full animate-orbit flex items-center justify-center">
         <div className="w-[600px] h-[600px] border border-[#c58e712a] rounded-full" />
         <div className="absolute w-full h-[1px] bg-[#c58e710d]" />
         <div className="absolute h-full w-[1px] bg-[#c58e710d]" />
      </div>
    </div>
    <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-[#c58e714d] opacity-50" />
    <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-[#c58e714d] opacity-50" />
    <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-[#c58e714d] opacity-50" />
    <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-[#c58e714d] opacity-50" />
  </div>
);

interface StreamFrameProps {
  children: React.ReactNode;
  className?: string;
}

const StreamFrame: React.FC<StreamFrameProps> = ({ children, className = "" }) => (
  <div className={`stream-frame ${className}`}>
    <div className="corner-star -top-1 -left-1" />
    <div className="corner-star -top-1 -right-1" />
    <div className="corner-star -bottom-1 -left-1" />
    <div className="corner-star -bottom-1 -right-1" />
    <div className="p-3 border border-[#c58e7133] m-1 h-full relative overflow-hidden flex flex-col items-center justify-center">
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);
  const [question, setQuestion] = useState('');
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [readingResult, setReadingResult] = useState<ReadingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  
  const [masters, setMasters] = useState<TarotMaster[]>(TAROT_MASTERS);
  const [selectedMaster, setSelectedMaster] = useState<TarotMaster | null>(null);
  const [regData, setRegData] = useState({ name: '', title: '', description: '', specialization: '' });

  const spreadSectionRef = useRef<HTMLDivElement>(null);
  const deckSectionRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const TOTAL_DECK_SIZE = 78;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const startReading = (type: ReadingType) => {
    setSelectedType(type);
    setState(AppState.QUESTION_INPUT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePickCard = (index: number) => {
    if (!selectedType) return;
    const maxCards = selectedType === ReadingType.YES_NO ? 1 : 3;
    
    setPickedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length < maxCards) {
        return [...prev, index];
      }
      return prev;
    });
  };

  const handleSendMessage = async (isConsultationMode: boolean = false) => {
    if (!userInput.trim() || isLoading) return;
    
    const newMsg: ChatMessage = { role: 'user', content: userInput };
    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);
    
    try {
      let response = '';
      if (isConsultationMode && selectedMaster) {
        response = await chatAboutReading(
          // 💡 수정됨: 복잡한 parts 객체 대신 심플한 content로 변경!
          updatedMessages.map(m => ({ 
            role: m.role === 'assistant' ? 'model' : 'user', 
            content: m.content 
          })),
          newMsg.content,
          `이 대화는 타로 마스터 ${selectedMaster.name}(${selectedMaster.title})와 사용자의 1:1 상담입니다. 마스터 분야: ${selectedMaster.specialization.join(', ')}. 성격: ${selectedMaster.description}`
        );
      } else if (readingResult) {
        response = await chatAboutReading(
          // 💡 수정됨: 여기도 content로 심플하게 변경!
          updatedMessages.map(m => ({ 
            role: m.role === 'assistant' ? 'model' : 'user', 
            content: m.content 
          })),
          newMsg.content,
          readingResult.interpretation
        );
      }
      
      if (response) {
        setChatMessages([...updatedMessages, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeSelection = async () => {
    if (!selectedType) return;
    const requiredCards = selectedType === ReadingType.YES_NO ? 1 : 3;
    if (pickedIndices.length < requiredCards) return;
    
    setIsLoading(true);
    setState(AppState.RESULT);

    const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
    const finalPickedCards = shuffled.slice(0, pickedIndices.length);

    try {
      const interpretation = await interpretTarot(question, selectedType, finalPickedCards);
      setReadingResult({
        question,
        type: selectedType,
        cards: finalPickedCards,
        interpretation: interpretation || '운명을 읽는 도중 오류가 발생했습니다.'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetReading = () => {
    setState(AppState.HOME);
    setPickedIndices([]);
    setQuestion('');
    setReadingResult(null);
    setChatMessages([]);
    setSelectedMaster(null);
  };

  const scrollDeck = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleRegisterMaster = (e: React.FormEvent) => {
    e.preventDefault();
    const newMaster: TarotMaster = {
      id: `m-custom-${Date.now()}`,
      name: regData.name,
      title: regData.title,
      description: regData.description,
      specialization: regData.specialization.split(',').map(s => s.trim()),
      image: user?.profileImage || `https://picsum.photos/seed/${regData.name}/300/400`,
      rating: 5.0,
      isOnline: true
    };
    setMasters([newMaster, ...masters]);
    setState(AppState.MASTERS_VIEW);
    setRegData({ name: '', title: '', description: '', specialization: '' });
  };

  const startConsultation = (master: TarotMaster) => {
    setSelectedMaster(master);
    setChatMessages([
      { role: 'assistant', content: `별의 축복이 함께하기를. 저는 ${master.title} ${master.name}입니다. 당신의 어떤 고민을 함께 나누어 볼까요?` }
    ]);
    setState(AppState.LIVE_CONSULTATION);
  };

  const renderHome = () => (
    <div className="relative">
      <StreamUIOverlay />
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

      <section ref={spreadSectionRef} className="relative min-h-screen py-32 px-6 flex flex-col items-center bg-slate-950/20 backdrop-blur-sm">
        <div className="mb-20 flex items-center gap-6">
           <div className="w-24 md:w-32 h-[1px] bg-[#c58e714d]" />
           <h2 className="font-cinzel text-2xl md:text-4xl text-white tracking-[0.4em] uppercase text-center">운명의 정렬</h2>
           <div className="w-24 md:w-32 h-[1px] bg-[#c58e714d]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl w-full">
           {[
             { type: ReadingType.YES_NO, name: '태양의 줄기', sub: '단일 실타래', desc: '현재 당신의 길에 비추는 명확하고 집중된 답변을 제공합니다.' },
             { type: ReadingType.PAST_PRESENT_FUTURE, name: '달의 주기', sub: '세 개의 실타래', desc: '과거, 현재, 그리고 미래로 이어지는 운명의 진화 과정을 밝혀냅니다.' }
           ].map((item, idx) => (
             <div key={idx} onClick={() => startReading(item.type)} className="group cursor-pointer">
                <StreamFrame className="h-[500px] flex flex-col items-center justify-center transition-all group-hover:scale-[1.02] group-hover:bg-[#c58e710a]">
                   <div className="mb-12 relative">
                      <div className="w-32 h-32 border border-[#c58e714d] rotate-45 flex items-center justify-center group-hover:border-rose-gold transition-colors">
                         <div className="rotate-[-45deg]">
                            {idx === 0 ? <Sun className="w-12 h-12 rose-gold-text" /> : <Moon className="w-12 h-12 rose-gold-text" />}
                         </div>
                      </div>
                   </div>
                   <h3 className="font-cinzel text-4xl text-white mb-2 tracking-[0.2em]">{item.name}</h3>
                   <p className="rose-gold-text font-cinzel text-sm tracking-widest mb-8 uppercase">{item.sub}</p>
                   <p className="text-slate-400 font-playfair italic text-center text-xl max-w-xs">{item.desc}</p>
                </StreamFrame>
             </div>
           ))}
        </div>
      </section>

      <section ref={deckSectionRef} className="relative min-h-screen py-32 px-6 flex flex-col items-center">
        <h2 className="font-cinzel text-3xl md:text-5xl text-white tracking-[0.5em] mb-24 uppercase text-center">아르카나 도감</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-7xl w-full">
          {TAROT_CARDS.map(card => (
            <div key={card.id} className="relative group cursor-pointer aspect-[2/3] overflow-hidden">
               <div className="absolute inset-0 border border-[#c58e7133] z-10 group-hover:border-rose-gold transition-colors" />
               <img src={card.image} alt={card.name} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100" />
               <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 p-2 text-center transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="font-cinzel text-[10px] rose-gold-text tracking-widest uppercase">{card.nameKo}</p>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderMasters = () => (
    <div className="pt-40 px-6 max-w-7xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />
      <div className="text-center mb-16">
        <h2 className="font-cinzel text-3xl md:text-5xl text-white tracking-[0.5em] mb-6 uppercase">천상의 마스터들</h2>
        <div className="flex flex-col items-center gap-6">
           <div className="flex items-center gap-6">
              <div className="w-16 md:w-24 h-[1px] bg-[#c58e714d]" />
              <p className="font-playfair text-slate-400 italic text-xl md:text-2xl">운명을 엮는 마스터들과의 깊은 상담을 시작하세요</p>
              <div className="w-16 md:w-24 h-[1px] bg-[#c58e714d]" />
           </div>
           <button 
             onClick={() => user ? setState(AppState.MASTER_REGISTRATION) : setIsLoginModalOpen(true)}
             className="btn-celestial flex items-center gap-3 text-sm px-10 py-3"
           >
              <UserPlus className="w-4 h-4" />
              전문가로 등록하기
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {masters.map((master) => (
          <div key={master.id} className="group cursor-pointer">
            <StreamFrame className="h-full flex flex-col items-stretch p-0">
               <div className="relative aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={master.image} alt={master.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${master.isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-slate-500'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b1a] via-transparent to-transparent opacity-60" />
               </div>
               
               <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-cinzel text-2xl text-white tracking-widest uppercase">{master.name}</h3>
                     <div className="flex items-center gap-1 rose-gold-text">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-cinzel">{master.rating}</span>
                     </div>
                  </div>
                  <p className="font-cinzel text-[10px] rose-gold-text tracking-widest uppercase mb-4 opacity-70">{master.title}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {master.specialization.map((spec, i) => (
                      <span key={i} className="text-[9px] font-cinzel tracking-widest text-slate-500 border border-slate-800 px-2 py-1 uppercase">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-400 font-playfair italic text-sm mb-8 line-clamp-2">
                    {master.description}
                  </p>

                  <button 
                    onClick={(e) => { e.stopPropagation(); startConsultation(master); }}
                    className="w-full btn-celestial py-2 text-xs mt-auto group-hover:bg-rose-gold group-hover:text-slate-950 transition-colors flex items-center justify-center gap-2 font-bold"
                  >
                    <MessageCircle className="w-3 h-3" />
                    상담 시작하기
                  </button>
               </div>
            </StreamFrame>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMasterRegistration = () => (
    <div className="pt-40 px-6 max-w-3xl mx-auto min-h-screen pb-40">
       <StreamUIOverlay />
       <div className="text-center mb-16">
          <h2 className="font-cinzel text-4xl md:text-5xl text-white tracking-[0.3em] mb-4 uppercase">전문가 자격 증명</h2>
          <p className="font-playfair text-slate-400 italic text-xl">클로토의 도서관에 당신의 지혜를 등록하세요</p>
       </div>

       <StreamFrame className="p-6 md:p-10">
          <form onSubmit={handleRegisterMaster} className="w-full space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="font-cinzel text-xs text-rose-gold tracking-widest uppercase">마스터 성함</label>
                   <input 
                     required
                     value={regData.name}
                     onChange={(e) => setRegData({...regData, name: e.target.value})}
                     className="w-full bg-white/5 border border-rose-gold/20 rounded-lg p-4 text-white focus:outline-none focus:border-rose-gold transition-colors font-playfair" 
                     placeholder="성함을 입력하세요"
                   />
                </div>
                <div className="space-y-3">
                   <label className="font-cinzel text-xs text-rose-gold tracking-widest uppercase">마스터 칭호</label>
                   <input 
                     required
                     value={regData.title}
                     onChange={(e) => setRegData({...regData, title: e.target.value})}
                     className="w-full bg-white/5 border border-rose-gold/20 rounded-lg p-4 text-white focus:outline-none focus:border-rose-gold transition-colors font-playfair" 
                     placeholder="예: 태양의 예언자"
                   />
                </div>
             </div>

             <div className="space-y-3">
                <label className="font-cinzel text-xs text-rose-gold tracking-widest uppercase">전문 분야 (쉼표로 구분)</label>
                <input 
                  required
                  value={regData.specialization}
                  onChange={(e) => setRegData({...regData, specialization: e.target.value})}
                  className="w-full bg-white/5 border border-rose-gold/20 rounded-lg p-4 text-white focus:outline-none focus:border-rose-gold transition-colors font-playfair" 
                  placeholder="예: 연애, 재물, 진로, 과거사"
                />
             </div>

             <div className="space-y-3">
                <label className="font-cinzel text-xs text-rose-gold tracking-widest uppercase">마스터 소개 및 철학</label>
                <textarea 
                  required
                  value={regData.description}
                  onChange={(e) => setRegData({...regData, description: e.target.value})}
                  className="w-full bg-white/5 border border-rose-gold/20 rounded-lg p-4 text-white focus:outline-none focus:border-rose-gold transition-colors font-playfair min-h-[150px] resize-none" 
                  placeholder="당신의 타로 해석 스타일과 철학을 설명해 주세요."
                />
             </div>

             <div className="flex items-center gap-4 p-4 bg-rose-gold/5 border border-rose-gold/20 rounded-xl">
                <Info className="w-5 h-5 text-rose-gold flex-shrink-0" />
                <p className="text-xs text-slate-400 font-playfair">현재 로그인한 계정의 프로필 이미지가 전문가 사진으로 자동 사용됩니다.</p>
             </div>

             <div className="pt-8 flex flex-col md:flex-row justify-center gap-6">
                <button type="button" onClick={() => setState(AppState.MASTERS_VIEW)} className="text-slate-500 font-cinzel tracking-widest uppercase hover:text-white transition-colors">취소</button>
                <button type="submit" className="btn-celestial text-lg px-12">마스터 등록 완료</button>
             </div>
          </form>
       </StreamFrame>
    </div>
  );

  const renderLiveConsultation = () => (
    <div className="pt-32 px-6 max-w-6xl mx-auto min-h-screen pb-40">
       <StreamUIOverlay />
       
       <div className="flex flex-col lg:flex-row gap-10 h-[auto] lg:h-[800px]">
          <div className="lg:w-1/3 flex flex-col gap-6">
             <StreamFrame className="h-full flex flex-col p-0">
                <div className="relative aspect-[3/4] overflow-hidden grayscale">
                   <img src={selectedMaster?.image} alt={selectedMaster?.name} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                   <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-cinzel text-3xl text-white tracking-widest uppercase">{selectedMaster?.name}</h3>
                      <p className="font-cinzel text-xs text-rose-gold tracking-[0.3em] uppercase">{selectedMaster?.title}</p>
                   </div>
                </div>
                <div className="p-8 space-y-8 flex-1 overflow-y-auto no-scrollbar">
                   <div>
                      <h4 className="font-cinzel text-[10px] text-slate-500 tracking-[0.4em] uppercase mb-4">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMaster?.specialization.map((spec, i) => (
                           <span key={i} className="px-3 py-1 border border-rose-gold/20 text-[10px] font-cinzel text-rose-gold uppercase">{spec}</span>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h4 className="font-cinzel text-[10px] text-slate-500 tracking-[0.4em] uppercase mb-4">Expert Philosophy</h4>
                      <p className="font-playfair text-slate-300 italic text-sm leading-relaxed">{selectedMaster?.description}</p>
                   </div>
                </div>
             </StreamFrame>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-6 min-h-[500px]">
             <StreamFrame className="flex-1 flex flex-col h-full bg-slate-950/40 relative">
                <div className="p-6 border-b border-rose-gold/20 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-cinzel text-xs text-white tracking-widest uppercase">Live Consultation Active</span>
                   </div>
                   <button onClick={() => setState(AppState.MASTERS_VIEW)} className="text-[10px] font-cinzel text-slate-500 hover:text-white uppercase tracking-widest">상담 종료</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar">
                   {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                         <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {msg.role !== 'user' && <div className="w-10 h-10 rounded-full border border-rose-gold/30 bg-white/5 flex-shrink-0" />}
                            <div className={`p-6 ${msg.role === 'user' ? 'bg-rose-gold/10 border border-rose-gold/30 rounded-t-2xl rounded-bl-2xl text-amber-50' : 'bg-slate-900/80 border border-white/5 rounded-t-2xl rounded-br-2xl text-slate-200'}`}>
                               <p className="font-playfair text-lg leading-relaxed">{msg.content}</p>
                            </div>
                         </div>
                      </div>
                   ))}
                   {isLoading && (
                      <div className="flex justify-start">
                         <div className="p-4 bg-slate-900/40 rounded-full border border-white/5">
                            <RefreshCw className="w-4 h-4 text-rose-gold animate-spin" />
                         </div>
                      </div>
                   )}
                   <div ref={chatEndRef} />
                </div>

                <div className="p-6 border-t border-rose-gold/20">
                   <div className="relative">
                      <input 
                        type="text" 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(true)}
                        placeholder="마스터에게 고민을 털어놓으세요..." 
                        className="w-full bg-slate-900/60 border border-rose-gold/30 rounded-2xl px-6 py-4 md:px-8 md:py-5 text-white font-playfair text-lg md:text-xl focus:outline-none focus:border-rose-gold transition-colors placeholder:text-slate-700 shadow-inner"
                      />
                      <button 
                        onClick={() => handleSendMessage(true)} 
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-rose-gold rounded-xl text-slate-950 hover:bg-white transition-colors flex items-center justify-center shadow-lg"
                      >
                         <Send className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                   </div>
                </div>
             </StreamFrame>
          </div>
       </div>
    </div>
  );

  const renderResult = () => (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen pb-40">
       <StreamUIOverlay />
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 flex flex-col gap-8">
             {readingResult?.cards.map((card, i) => (
                <StreamFrame key={i} className="animate-in fade-in slide-in-from-left duration-1000">
                   <div className="aspect-[3/2] overflow-hidden mb-6">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                   </div>
                   <h3 className="font-cinzel text-2xl text-white mb-2 tracking-widest text-center">{card.nameKo}</h3>
                   <p className="rose-gold-text font-cinzel text-xs tracking-widest uppercase text-center">{card.name}</p>
                </StreamFrame>
             ))}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-12">
             <StreamFrame className="min-h-[400px]">
                <div className="flex items-center gap-6 mb-12 border-b border-[#c58e7133] pb-6">
                   <Compass className="w-8 h-8 rose-gold-text" />
                   <h4 className="font-cinzel text-2xl md:text-3xl text-white tracking-[0.3em] uppercase">운명의 판결</h4>
                </div>
                {isLoading && !readingResult ? (
                   <div className="flex flex-col items-center justify-center h-64">
                      <RefreshCw className="w-12 h-12 rose-gold-text animate-spin mb-8" />
                      <p className="font-cinzel text-xl rose-gold-text tracking-widest uppercase">운명의 실타래를 엮는 중...</p>
                   </div>
                ) : (
                   <div className="prose prose-invert max-w-none text-slate-200 font-playfair text-xl md:text-2xl leading-[1.8] whitespace-pre-wrap">
                     {readingResult?.interpretation}
                   </div>
                )}
             </StreamFrame>

             {!isLoading && readingResult && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-1000 delay-300">
                  {[
                    { icon: <Sun className="w-6 h-6" />, title: "태양의 영향", content: "현재 질문에 대한 가장 강력한 긍정적 흐름입니다." },
                    { icon: <Moon className="w-6 h-6" />, title: "달의 그림자", content: "주의해야 할 잠재적인 장애물 또는 무의식의 경고입니다." },
                    { icon: <Star className="w-6 h-6" />, title: "별의 지향점", content: "앞으로 나아가야 할 궁극적인 지향점이자 희망입니다." }
                  ].map((item, idx) => (
                    <StreamFrame key={idx} className="text-center group hover:bg-[#c58e710a] transition-all">
                       <div className="flex justify-center mb-6 rose-gold-text group-hover:scale-110 transition-transform">{item.icon}</div>
                       <h5 className="font-cinzel text-sm text-white mb-4 tracking-[0.4em] uppercase">{item.title}</h5>
                       <p className="font-playfair text-slate-400 italic text-lg leading-relaxed">{item.content}</p>
                    </StreamFrame>
                  ))}
               </div>
             )}

             <StreamFrame className="flex flex-col h-[500px]">
                <div className="text-center mb-8">
                   <span className="font-cinzel text-sm rose-gold-text tracking-[0.4em] uppercase font-bold">아카이브에 질문하기</span>
                </div>
                <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-6 no-scrollbar">
                   {chatMessages.map((msg, i) => (
                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-6 ${msg.role === 'user' ? 'bg-[#c58e711a] border border-[#c58e714d] text-amber-50' : 'bg-slate-900/60 border border-white/5 text-slate-300'}`}>
                           <p className="text-lg font-playfair">{msg.content}</p>
                        </div>
                     </div>
                   ))}
                   {isLoading && chatMessages.length > 0 && (
                      <div className="flex justify-start">
                         <div className="p-4 bg-slate-900/60 border border-white/5">
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
                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(false)}
                     placeholder="예언자에게 더 궁금한 점을 물어보세요..." 
                     className="w-full bg-slate-950/80 border border-[#c58e714d] px-8 py-5 text-white font-playfair text-lg focus:outline-none focus:border-rose-gold transition-colors placeholder:text-slate-800"
                   />
                   <button 
                     onClick={() => handleSendMessage(false)} 
                     className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-gold hover:text-white transition-colors"
                   >
                      <Send className="w-5 h-5" />
                   </button>
                </div>
             </StreamFrame>

             <button onClick={resetReading} className="btn-celestial self-center font-bold">새로운 탐색 시작</button>
          </div>
       </div>
    </div>
  );

  return (
    <Header 
      user={user} 
      onHomeClick={resetReading} 
      onDeckClick={() => {
        setState(AppState.HOME);
        setTimeout(() => deckSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }} 
      onMastersClick={() => setState(AppState.MASTERS_VIEW)}
      onLoginClick={() => setIsLoginModalOpen(true)} 
      onLogout={() => setUser(null)}
    >
      <div className="relative">
        {state === AppState.HOME && renderHome()}
        {state === AppState.MASTERS_VIEW && renderMasters()}
        {state === AppState.MASTER_REGISTRATION && renderMasterRegistration()}
        {state === AppState.LIVE_CONSULTATION && renderLiveConsultation()}
        
        {state === AppState.QUESTION_INPUT && (
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
             <button onClick={() => setState(AppState.CARD_PICKING)} disabled={!question.trim()} className="mt-16 btn-celestial text-xl font-bold">운명의 데크로 나아가기</button>
          </div>
        )}

        {state === AppState.CARD_PICKING && (
          <div className="pt-32 flex flex-col items-center min-h-screen pb-40 overflow-hidden relative">
             <StreamUIOverlay />
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
                          
                          <div className="absolute inset-0 opacity-10 pointer-events-none">
                             <div className="w-full h-full border border-dashed border-rose-gold/20 m-1 rounded-sm" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                        </StreamFrame>
                      </div>
                    );
                  })}
                </div>
                
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#0d0b1a] to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#0d0b1a] to-transparent z-20 pointer-events-none" />
             </div>

             <div className="mt-20 flex flex-col md:flex-row items-center gap-10 relative z-10">
                <button 
                  onClick={() => setPickedIndices([])} 
                  className="font-cinzel rose-gold-text tracking-[0.3em] hover:text-white transition-colors uppercase text-sm border-b border-[#c58e714d] pb-1"
                >
                   실타래 다시 섞기
                </button>
                <button 
                  onClick={finalizeSelection} 
                  disabled={pickedIndices.length < (selectedType === ReadingType.YES_NO ? 1 : 3)} 
                  className="btn-celestial text-xl disabled:opacity-20 disabled:cursor-not-allowed group font-bold"
                >
                   운명 엮기 <ArrowRight className="inline-block ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
             
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rose-gold-text/40 font-cinzel text-[10px] tracking-[0.3em] uppercase whitespace-nowrap px-4">
                <ChevronLeft className="w-3 h-3" /> 스와이프하여 덱을 탐색하세요 <ChevronRight className="w-3 h-3" />
             </div>
          </div>
        )}

        {state === AppState.RESULT && renderResult()}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={(email) => setUser({ id: 'u1', name: email.split('@')[0], email })} />
    </Header>
  );
};

export default App;
