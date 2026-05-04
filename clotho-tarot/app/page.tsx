'use client';
import React, { useState, useRef, useEffect } from 'react';
import { AppState, ReadingType, TarotCard, ReadingResult, ChatMessage, User, TarotMaster, TarotDeck } from '../types/types';
import { Header } from '../components/Layout';
import { LoginModal } from '../components/LoginModal';
import MyPageContent from '../components/MyPageContent';
import { TAROT_MASTERS, TAROT_DECKS, POINT_PACKAGES, SUBSCRIPTION_PACKAGES } from '../constants/constants'; 
import { interpretTarot, chatAboutReading } from '../lib/geminiService';
import StreamFrame from '../components/StreamFrame';
import StreamUIOverlay from '../components/StreamUIOverlay';
import TarotResult from "../components/TarotResult";
import HomeView from '../features/home/HomeView';
import Shop from '../components/Shop';
import PointPurchase from '../components/PointPurchase';
import Checkout from '../components/Checkout';
import SubscriptionPurchase from '../components/SubscriptionPurchase';
import { Moon, Sparkles, RefreshCw, ArrowRight, Star, Compass, Sun, Eye, ChevronDown, Send, Hexagon, ChevronLeft, ChevronRight, User as UserIcon, MessageCircle, UserPlus, Info, Lock } from 'lucide-react';

// ==========================================
// 📌 카드 뒷면 디자인 데이터
// ==========================================
const CARD_BACK_DESIGNS = [
  {
    id: 'mystical-soul',
    name: '신비로운 영혼',
    description: '고양이와 달로 이루어진 신비로운 디자인',
    imageUrl: '/images/card-back2.png',
    cssFilter: 'brightness(1) saturate(1)'
  },
  {
    id: 'classic',
    name: '클래식',
    description: '기본 타로 카드 디자인',
    imageUrl: '/images/card-back.png',
    cssFilter: 'brightness(1) saturate(1)'
  }
];

const CARD_BACK_IMAGE_MAP: Record<string, string> = {
  'mystical-soul': '/images/card-back2.png',
  'classic': '/images/card-back.png'
};

const App: React.FC = () => {
  // ==========================================
  // 📍 상태 정의
  // ==========================================
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [selectedType, setSelectedType] = useState<ReadingType | null>(null);
  const [question, setQuestion] = useState('');
  const [pickedIndices, setPickedIndices] = useState<{index: number, isReversed: boolean}[]>([]);
  const [readingResult, setReadingResult] = useState<ReadingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  
  const [masters, setMasters] = useState<TarotMaster[]>(TAROT_MASTERS);
  const [selectedMaster, setSelectedMaster] = useState<TarotMaster | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<TarotDeck>(TAROT_DECKS[0]);
  const [regData, setRegData] = useState({ name: '', title: '', description: '', specialization: '' });

  const [dbCards, setDbCards] = useState<any[]>([]);
  const [minorSuitTab, setMinorSuitTab] = useState<'All' | 'Wands' | 'Swords' | 'Cups' | 'Pentacles'>('All');

  const spreadSectionRef = useRef<HTMLDivElement>(null);
  const deckSectionRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ 뒷면 카드 디자인 상태
  const [selectedCardBackDesign, setSelectedCardBackDesign] = useState<string>('mystical-soul');
  const [deckTab, setDeckTab] = useState<'front' | 'back'>('front');
  const [selectedCardDetail, setSelectedCardDetail] = useState<any>(null);

  const TOTAL_DECK_SIZE = 78;

  // ==========================================
  // 📍 리딩 상태 초기화 함수 (방법 2)
  // ==========================================
  const resetReadingState = () => {
    setSelectedType(null);
    setQuestion('');
    setPickedIndices([]);
    setReadingResult(null);
    setChatMessages([]);
    setUserInput('');
    // ✅ 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    console.log('✅ 리딩 상태 초기화됨');
  };

  // ==========================================
  // 📍 useEffect: 페이지 로드 시 사용자 정보 복원
  // ==========================================
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('✅ 저장된 사용자 정보 복원됨:', parsedUser.name);
      } catch (error) {
        console.error('저장된 사용자 정보 파싱 실패:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ==========================================
  // 📍 useEffect: DB에서 타로 카드 로드
  // ==========================================
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/tarot');
        if (response.ok) {
          const data = await response.json();
          setDbCards(data);
        }
      } catch (error) {
        console.error('DB 카드 로딩 에러:', error);
      }
    };
    fetchCards();
  }, []);

  // ==========================================
  // 📍 useEffect: 채팅 메시지 스크롤
  // ==========================================
  useEffect(() => {
    if (chatMessages.length > 0 && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  // ==========================================
  // 🛠️ 유틸리티: 카드 슈트 판정
  // ==========================================
  const getCardSuit = (num: number) => {
    if (num < 100) return 'Major';
    const prefix = String(num).substring(0, 2);
    if (prefix === '10') return 'Wands';
    if (prefix === '11') return 'Cups';
    if (prefix === '12') return 'Swords';
    if (prefix === '13') return 'Pentacles';
    return 'Major';
  };

  // ==========================================
  // 🎯 DB 저장 함수 1️⃣: 타로 읽기 결과 저장
  // ==========================================
const saveReadingResult = async (reading: ReadingResult) => {
  if (!user || !user.id) {
    console.error('❌ 사용자 정보 없음');
    console.log('user:', user);
    return null;
  }

  try {
    console.log('📤 타로 읽기 결과 저장 시작...');
    console.log('📝 user.id:', user.id);
    
    const response = await fetch('/api/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: reading.question,
        spreadType: reading.type === ReadingType.YES_NO ? 'one-card' : 'three-card',
        fullAnswer: reading.interpretation,
        userId: user.id,
        cards: reading.cards.map((card: any, index: number) => ({
          cardId: card.id || card.number,
          position: index + 1,
          orientation: card.isReversed ? 'reversed' : 'upright'
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`저장 실패: ${response.status}`);
    }

    const savedReading = await response.json();
    console.log('✅ 타로 읽기 결과 저장 완료:', savedReading.id);
    
    return savedReading;
  } catch (error) {
    console.error('❌ 타로 읽기 저장 실패:', error);
    alert('타로 읽기 결과 저장에 실패했습니다.');
    return null;
  }
};

  // ==========================================
  // 🎯 DB 저장 함수 2️⃣: 포인트 충전
  // ==========================================
  const handlePurchasePoints = async (pointsToAdd: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      console.log('📤 포인트 충전 시작:', pointsToAdd);

      const response = await fetch(`/api/users/${user.id}/points`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: pointsToAdd,
          reason: '포인트 충전'
        })
      });

      if (!response.ok) {
        throw new Error(`포인트 업데이트 실패: ${response.status}`);
      }

      const updatedUser = await response.json();

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      console.log('✅ 포인트 충전 완료:', pointsToAdd, '포인트');
      alert(`${pointsToAdd.toLocaleString()} 포인트가 충전되었습니다.`);
      setState(AppState.SHOP);
    } catch (error) {
      console.error('❌ 포인트 충전 실패:', error);
      alert('포인트 충전에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // ==========================================
  // 🎯 DB 저장 함수 3️⃣: 전문가 마스터 등록
  // ==========================================
  const handleRegisterMaster = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      console.log('📤 전문가 등록 시작...');

      const response = await fetch('/api/expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          nickname: regData.name,
          intro: regData.description,
          specialty: regData.specialization,
          pricePerChat: 10000
        })
      });

      if (!response.ok) {
        throw new Error(`전문가 등록 실패: ${response.status}`);
      }

      const expertProfile = await response.json();

      const newMaster: TarotMaster = {
        id: `m-${expertProfile.id}`,
        name: regData.name,
        title: '타로 마스터',
        description: regData.description,
        specialization: regData.specialization.split(',').map(s => s.trim()),
        image: user?.profileImage || `https://picsum.photos/seed/${regData.name}/300/400`,
        rating: 5.0,
        isOnline: true
      };

      setMasters([newMaster, ...masters]);
      setState(AppState.MASTERS_VIEW);
      setRegData({ name: '', title: '', description: '', specialization: '' });

      console.log('✅ 전문가 등록 완료:', expertProfile.id);
      alert('전문가로 등록되었습니다!');
    } catch (error) {
      console.error('❌ 전문가 등록 실패:', error);
      alert('전문가 등록에 실패했습니다.');
    }
  };

  // ==========================================
  // 🎯 타로 읽기 최종 실행
  // ==========================================
  const finalizeSelection = async () => {
    console.log("🚀 [finalizeSelection] 함수 시작");
    
    if (!selectedType) {
      console.error("❌ selectedType이 없음");
      alert("읽기 타입을 선택하세요");
      return;
    }

    const requiredCards = selectedType === ReadingType.YES_NO ? 1 : 3;

    if (pickedIndices.length < requiredCards) {
      alert(`${requiredCards}개의 카드를 선택하세요`);
      return;
    }

    if (!question.trim()) {
      alert("질문을 입력하세요");
      return;
    }

    setIsLoading(true);
    setState(AppState.RESULT);

    try {
      const requestData = {
        messages: [{ 
          role: 'user', 
          content: question.trim() 
        }],
        selectedCards: pickedIndices
      };

      const res = await fetch('https://clotho-server-vyw7.vercel.app/api/tarot', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestData)
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("❌ JSON 파싱 실패:", parseError);
        alert("API 응답을 파싱할 수 없습니다");
        return;
      }

      if (!res.ok) {
        alert(`타로 읽기 실패: ${data.error || '알 수 없는 오류'}`);
        setState(AppState.QUESTION_INPUT);
        return;
      }

      if (!data.text || !data.cards || data.cards.length === 0) {
        alert("API 응답이 불완전합니다");
        return;
      }

      const reading: ReadingResult = {
        question,
        type: selectedType,
        cards: data.cards,
        interpretation: data.text
      };

      if (user) {
        const savedReading = await saveReadingResult(reading);
        if (savedReading) {
          reading.id = savedReading.id;
        }
      }

      setReadingResult(reading);

      // ✅ [수정 1] 최초 해석 결과를 채팅 히스토리 첫 항목으로 저장
      // 후속 질문 시 서버가 이 히스토리를 컨텍스트로 활용함
      setChatMessages([
        { role: 'user', content: question.trim() },
        { role: 'assistant', content: data.text }
      ]);

      console.log("✅ [finalizeSelection] 완료");

    } catch (error) {
      console.error("❌ [finalizeSelection] 에러:", error);
      alert("타로 읽기 중 오류가 발생했습니다");
      setState(AppState.QUESTION_INPUT);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 🎯 나머지 함수들
  // ==========================================

  const startReading = (type: ReadingType) => {
    setSelectedType(type);
    setState(AppState.QUESTION_INPUT);
    window.scrollTo(0, 0);
  };

  const handlePickCard = (index: number) => {
    if (!selectedType) return;
    const maxCards = selectedType === ReadingType.YES_NO ? 1 : 3;
    const realNumber = dbCards[index]?.number ?? index;

    setPickedIndices(prev => {
      if (prev.find(p => p.index === realNumber)) {
        return prev.filter(p => p.index !== realNumber);
      }
      if (prev.length < maxCards) {
        return [...prev, { index: realNumber, isReversed: Math.random() < 0.5 }];
      }
      return prev;
    });
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

  const startConsultation = (master: TarotMaster) => {
    setSelectedMaster(master);
    setChatMessages([
      { role: 'assistant', content: `별의 축복이 함께하기를. 저는 ${master.title} ${master.name}입니다. 당신의 어떤 고민을 함께 나누어 볼까요?` }
    ]);
    setState(AppState.LIVE_CONSULTATION);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    setUser(null);
    setState(AppState.HOME);
    console.log('✅ 로그아웃 완료');
  };

  const handleSubscribe = (pkg: any) => {
    if (user) {
      alert(`${pkg.name} 구독이 시작되었습니다. 매월 ₩${pkg.price.toLocaleString()}이 결제됩니다.`);
      setState(AppState.SHOP);
    }
  };

  // ==========================================
  // 🎯 [수정 2] 후속 질문 전송 함수
  // - 최초 해석 히스토리를 포함해서 서버에 전송
  // - 스트리밍 제거 (서버가 JSON으로 응답하므로)
  // ==========================================
  const handleSendMessage = async (isConsultationMode: boolean = false) => {
    if (!userInput.trim() || isLoading) return;

    const userContent = userInput.trim();
    const newMsg: ChatMessage = { role: 'user', content: userContent };

    // chatMessages에는 이미 최초 해석 히스토리가 담겨있음:
    // [{ role: 'user', content: 최초질문 }, { role: 'assistant', content: 최초해석 }, ...]
    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setUserInput('');
    setIsLoading(true);

    console.log(`📤 [handleSendMessage] 전송 messages 수: ${updatedMessages.length}개`);
    console.log(`📤 [handleSendMessage] 후속 질문 여부: ${updatedMessages.length >= 2 ? '✅ 후속' : '🆕 최초'}`);

    try {
      const res = await fetch('https://clotho-server-vyw7.vercel.app/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ✅ 최초 해석 히스토리 + 새 질문 전체 전송
          messages: updatedMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content
          })),
          // ✅ 뽑은 카드 정보도 항상 함께 전송
          selectedCards: pickedIndices
        })
      });

      if (!res.ok) {
        throw new Error(`서버 에러: ${res.status}`);
      }

      const data = await res.json();
      const aiText = data.text || '응답을 받지 못했습니다.';

      // ✅ AI 응답도 히스토리에 추가 (다음 질문 시 컨텍스트로 활용)
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiText }]);

    } catch (error) {
      console.error('❌ 채팅 전송 에러:', error);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: '요청 처리 중 오류가 발생했습니다.' }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // 렌더링 함수들...
  const renderArcanaView = (type: 'Major' | 'Minor') => (
    <div className="pt-8 px-6 max-w-7xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />
      <div className="text-center mb-20 relative z-10">
        <button 
          onClick={() => {
            resetReadingState();
            window.scrollTo(0, 0);
            setState(AppState.HOME);
            setMinorSuitTab('All');
            setTimeout(() => deckSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-rose-gold hover:text-white transition-colors font-cinzel text-sm tracking-widest uppercase"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <h2 className="font-cinzel text-4xl md:text-6xl text-white mb-6 tracking-[0.4em] uppercase">
          {type === 'Major' ? '메이저 아르카나' : '마이너 아르카나'}
        </h2>
        <p className="font-playfair text-xl text-white/60 italic">
          {type === 'Major' ? '운명의 거대한 흐름을 관장하는 22장의 카드' : '운명의 세밀한 흐름 담아내는 56장의 카드'}
        </p>

        {type === 'Minor' && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12">
            {(['All', 'Wands', 'Swords', 'Cups', 'Pentacles'] as const).map((suit) => (
              <button
                key={suit}
                onClick={() => setMinorSuitTab(suit)}
                className={`font-cinzel tracking-[0.2em] uppercase text-xs md:text-sm pb-2 border-b-2 transition-all ${minorSuitTab === suit ? 'border-rose-gold text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                {suit === 'All' ? '전체' : suit === 'Wands' ? '완드' : suit === 'Swords' ? '소드' : suit === 'Cups' ? '컵' : '펜타클'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 relative z-10">
        {dbCards.filter(card => {
          const cardSuit = getCardSuit(card.number);
          if (type === 'Major') return cardSuit === 'Major';
          if (minorSuitTab === 'All') return cardSuit !== 'Major';
          return cardSuit === minorSuitTab;
        }).map(card => (
          <div 
            key={card.id} 
            className="relative group cursor-pointer aspect-[2/3] rounded-xl" 
            style={{ perspective: '1000px' }}
            onClick={() => setSelectedCardDetail(card)}
          >
            <div className="absolute inset-0 border border-[#c58e7133] z-10 group-hover:border-rose-gold transition-all duration-300 rounded-xl group-hover:shadow-[0_0_50px_rgba(197,142,113,0.8)]" />
            <img 
              src={card.imageUrl} 
              alt={card.name} 
              style={{ filter: selectedDeck.cssFilter }} 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 rounded-xl group-hover:shadow-[0_0_50px_rgba(197,142,113,0.8)]" 
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 text-center rounded-b-xl">
              <p className="font-cinzel text-xs rose-gold-text tracking-widest uppercase mb-1">{card.name}</p>
              <p className="font-cinzel text-[10px] text-white/60 tracking-widest uppercase">{card.nameKo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 카드 상세 모달 */}
      {selectedCardDetail && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6" 
          onClick={() => setSelectedCardDetail(null)}
        >
          <div 
            className="relative w-full max-w-md" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCardDetail(null)}
              className="absolute -top-12 right-0 text-white hover:text-rose-gold text-2xl font-bold z-60"
            >
              ✕
            </button>
            <div className="flex flex-col items-center gap-6">
              <img 
                src={selectedCardDetail.imageUrl} 
                alt={selectedCardDetail.name}
                style={{ filter: selectedDeck.cssFilter }}
                className="w-full max-w-sm h-auto rounded-xl shadow-[0_0_60px_rgba(197,142,113,0.8)]"
              />
              <div className="text-center text-white w-full px-4">
                <h3 className="font-cinzel text-2xl mb-2 tracking-widest">{selectedCardDetail.name}</h3>
                <p className="font-cinzel text-base text-rose-gold tracking-widest">{selectedCardDetail.nameKo}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDeckSelection = () => (
    <div className="pt-8 px-6 max-w-7xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />
      <div className="text-center mb-20 relative z-10">
        <h2 className="font-cinzel text-4xl md:text-6xl text-white mb-6 tracking-[0.4em] uppercase">타로 덱 선택</h2>
        <p className="font-playfair text-xl text-white/60 italic">당신의 영혼과 공명하는 실타래를 선택하세요.</p>
      </div>

      {/* 앞면/뒷면 탭 */}
      <div className="flex justify-center gap-8 mb-16 relative z-10">
        <button
          onClick={() => setDeckTab('front')}
          className={`font-cinzel tracking-[0.3em] uppercase text-lg pb-4 border-b-2 transition-all ${
            deckTab === 'front'
              ? 'text-white border-rose-gold'
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          앞면 카드 테마
        </button>
        <button
          onClick={() => setDeckTab('back')}
          className={`font-cinzel tracking-[0.3em] uppercase text-lg pb-4 border-b-2 transition-all ${
            deckTab === 'back'
              ? 'text-white border-rose-gold'
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          뒷면 카드 테마
        </button>
      </div>

      {/* 앞면 카드 테마 */}
      {deckTab === 'front' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto">
          {TAROT_DECKS.map((deck) => {
            const isComingSoon = deck.id !== 'deck-classic';

            return (
              <div 
                key={deck.id}
                className={`group transition-all duration-500 ${
                  isComingSoon 
                    ? 'cursor-not-allowed opacity-50' 
                    : selectedDeck.id === deck.id 
                      ? 'scale-105' 
                      : 'hover:scale-102 opacity-80 hover:opacity-100'
                }`}
              >
                <StreamFrame className={`h-full flex flex-col items-center p-6 transition-all ${
                  isComingSoon
                    ? 'border-[#c58e711a] bg-slate-900/30'
                    : selectedDeck.id === deck.id 
                      ? 'border-rose-gold shadow-[0_0_30px_rgba(197,142,113,0.3)] bg-[#c58e711a]' 
                      : 'border-[#c58e7133] hover:border-[#c58e7166]'
                }`}>
                  <div 
                    onClick={() => {
                      if (!isComingSoon) {
                        setSelectedDeck(deck);
                      }
                    }}
                    className="w-full aspect-[2/3] mb-6 overflow-hidden relative bg-[#0a0812] border border-rose-gold/10 flex flex-col items-center justify-center rounded-lg cursor-pointer"
                  >
                    {isComingSoon ? (
                      <div className="flex flex-col items-center justify-center text-slate-600 gap-4">
                        <Lock className="w-8 h-8 opacity-30" />
                        <span className="font-cinzel tracking-[0.3em] text-[10px] uppercase opacity-50">Coming Soon</span>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={deck.thumbnail} 
                          alt={deck.name} 
                          style={{ filter: deck.cssFilter }}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b1a] via-transparent to-transparent opacity-60" />
                        {selectedDeck.id === deck.id && (
                          <div className="absolute top-4 right-4 bg-rose-gold text-slate-950 p-2 rounded-full shadow-lg">
                            <Star className="w-4 h-4" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <h3 className={`font-cinzel text-xl mb-2 tracking-widest text-center transition-colors ${
                    isComingSoon ? 'text-slate-600' : 'text-white'
                  }`}>
                    {isComingSoon ? ' ' : deck.nameKo}
                  </h3>
                  
                  <p className={`font-playfair text-xs text-center leading-relaxed italic ${
                    isComingSoon ? 'text-slate-700' : 'text-white/40'
                  }`}>
                    {isComingSoon ? '새로운 운명의 실타래를 풀어내고 있습니다. 곧 만나보실 수 있습니다.' : deck.description}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-[#c58e711a] w-full flex justify-center">
                    <div className={`px-4 py-1 text-[10px] font-cinzel tracking-[0.2em] uppercase border ${
                      isComingSoon 
                        ? 'border-slate-800/50 text-slate-600' 
                        : selectedDeck.id === deck.id 
                          ? 'bg-rose-gold text-slate-950 border-rose-gold' 
                          : 'text-rose-gold border-rose-gold/30'
                    }`}>
                      {isComingSoon ? '준비 중' : selectedDeck.id === deck.id ? '현재 선택됨' : '선택하기'}
                    </div>
                  </div>
                </StreamFrame>
              </div>
            );
          })}
        </div>
      )}

      {/* 뒷면 카드 테마 */}
      {deckTab === 'back' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 max-w-5xl mx-auto">
          {CARD_BACK_DESIGNS.map((backDesign) => (
            <div
              key={backDesign.id}
              onClick={() => {
                setSelectedCardBackDesign(backDesign.id);
              }}
              className={`group transition-all duration-500 cursor-pointer ${
                selectedCardBackDesign === backDesign.id
                  ? 'scale-105'
                  : 'hover:scale-102 opacity-80 hover:opacity-100'
              }`}
            >
              <StreamFrame className={`h-full flex flex-col items-center p-6 transition-all ${
                selectedCardBackDesign === backDesign.id
                  ? 'border-rose-gold shadow-[0_0_30px_rgba(197,142,113,0.3)] bg-[#c58e711a]'
                  : 'border-[#c58e7133] hover:border-[#c58e7166]'
              }`}>
                <div className="w-full aspect-[2/3] mb-6 overflow-hidden relative bg-[#0a0812] border border-rose-gold/10 flex flex-col items-center justify-center rounded-lg">
                  <img
                    src={backDesign.imageUrl}
                    alt={backDesign.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: backDesign.cssFilter }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b1a] via-transparent to-transparent opacity-40" />
                  {selectedCardBackDesign === backDesign.id && (
                    <div className="absolute top-4 right-4 bg-rose-gold text-slate-950 p-2 rounded-full shadow-lg">
                      <Star className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-cinzel text-xl mb-2 tracking-widest text-center transition-colors text-white">
                  {backDesign.name}
                </h3>
                
                <p className="font-playfair text-xs text-center leading-relaxed italic text-white/40">
                  {backDesign.description}
                </p>
                
                <div className="mt-6 pt-6 border-t border-[#c58e711a] w-full flex justify-center">
                  <div className={`px-4 py-1 text-[10px] font-cinzel tracking-[0.2em] uppercase border ${
                    selectedCardBackDesign === backDesign.id
                      ? 'bg-rose-gold text-slate-950 border-rose-gold'
                      : 'text-rose-gold border-rose-gold/30'
                  }`}>
                    {selectedCardBackDesign === backDesign.id ? '현재 선택됨' : '선택하기'}
                  </div>
                </div>
              </StreamFrame>
            </div>
          ))}
        </div>
      )}
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
                <textarea 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)} 
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(true);
                    }
                  }}
                  placeholder="마스터에게 고민을 털어놓으세요..." 
                  className="w-full bg-slate-900/60 border border-rose-gold/30 rounded-2xl px-12 md:px-16 py-4 md:py-5 text-white font-playfair text-base md:text-lg focus:outline-none focus:border-rose-gold transition-colors placeholder:text-slate-600 pr-20 resize-none min-h-[50px] max-h-[100px] overflow-y-auto"
                />
                <button 
                  onClick={() => handleSendMessage(true)} 
                  className="absolute right-6 bottom-4 w-10 h-10 md:w-12 md:h-12 bg-rose-gold rounded-xl text-slate-950 hover:bg-white transition-colors flex items-center justify-center shadow-lg"
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

  const renderSecondaryInfo = () => {
    if (isLoading || !readingResult) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-1000 delay-300 mt-12">
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
    );
  };

  const renderChatSection = () => {
    if (!readingResult) return null;
    return (
      <div className="flex flex-col gap-0 mt-8 w-full max-w-full h-[700px]">
        {/* 전체 컨테이너 */}
        <StreamFrame className="flex flex-col w-full h-full rounded-b-none overflow-hidden">
          {/* 상단: 제목 */}
          <div className="text-center py-4 px-8 border-b border-[#c58e7133] flex-shrink-0">
            <span className="font-cinzel text-sm rose-gold-text tracking-[0.4em] uppercase font-bold">아카이브에 질문하기</span>
          </div>

          {/* 중간: 메시지 영역 (스크롤 가능, 역방향) */}
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 no-scrollbar p-8 md:p-10 flex flex-col-reverse">
            <div ref={chatEndRef} />
            {isLoading && chatMessages.length > 2 && (
              <div className="flex justify-start">
                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-full">
                  <RefreshCw className="w-5 h-5 rose-gold-text animate-spin" />
                </div>
              </div>
            )}
            {chatMessages.slice(2).map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-rose-gold/20 border border-rose-gold/40 text-amber-50' : 'bg-slate-800/60 border border-slate-700 text-slate-200'}`}>
                  <p className="font-playfair text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 하단: 입력 영역 (고정) */}
          <div className="flex-shrink-0 border-t border-[#c58e7133] p-4 md:p-6 bg-slate-950/40">
            <div className="relative">
              <textarea 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(false);
                  }
                }}
                placeholder="더 궁금한 점을 물어보세요" 
                className="w-full bg-slate-950/80 border border-[#c58e714d] rounded-3xl px-12 md:px-16 py-4 md:py-5 text-white font-playfair text-base md:text-lg focus:outline-none focus:border-rose-gold transition-colors placeholder:text-slate-600 pr-20 resize-none min-h-[50px] max-h-[100px] overflow-y-auto"
              />
              <button 
                onClick={() => handleSendMessage(false)} 
                className="absolute right-8 bottom-4 p-3 text-rose-gold hover:text-white transition-colors"
              >
                <Send className="w-7 h-7" />
              </button>
            </div>
          </div>
        </StreamFrame>
      </div>
    );
  };

  return (
    <Header 
      user={user}
      onHomeClick={() => {
        resetReadingState();
        window.scrollTo(0, 0);
        setState(AppState.HOME);
      }}
      onDeckClick={() => {
        resetReadingState();
        setState(AppState.HOME);
        setTimeout(() => deckSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }}
      onMastersClick={() => {
        resetReadingState();
        window.scrollTo(0, 0);
        setState(AppState.MASTERS_VIEW);
      }}
      onMyPageClick={() => {
        resetReadingState();
        window.scrollTo(0, 0);
        setState(AppState.MY_PAGE);
      }}
      onLoginClick={() => setIsLoginModalOpen(true)}
      onLogout={handleLogout}
      onShopClick={() => {
        resetReadingState();
        window.scrollTo(0, 0);
        setState(AppState.SHOP);
      }}
    >
      <div className="relative">
        {state === AppState.HOME && (
          <HomeView 
            selectedDeck={selectedDeck}
            onStartReading={startReading}
            onDeckSelectClick={() => {
              resetReadingState();
              window.scrollTo(0, 0);
              setState(AppState.DECK_SELECTION);
            }}
            onArcanaViewClick={(targetState) => {
              resetReadingState();
              window.scrollTo(0, 0);
              setState(targetState);
              setMinorSuitTab('All');
            }}
            spreadSectionRef={spreadSectionRef}
            deckSectionRef={deckSectionRef}
          />
        )}
        {state === AppState.MAJOR_ARCANA_VIEW && renderArcanaView('Major')}
        {state === AppState.MINOR_ARCANA_VIEW && renderArcanaView('Minor')}
        {state === AppState.DECK_SELECTION && renderDeckSelection()}
        {state === AppState.MASTERS_VIEW && renderMasters()}
        {state === AppState.MASTER_REGISTRATION && renderMasterRegistration()}
        {state === AppState.LIVE_CONSULTATION && renderLiveConsultation()}
        {state === AppState.MY_PAGE && (
          <MyPageContent 
            user={user}
            selectedDeck={selectedDeck}
            onUpdateUser={(updatedUser) => setUser(updatedUser)}
          />
        )}
        {state === AppState.SHOP && (
          <Shop 
            onPointPurchaseClick={() => setState(AppState.POINT_PURCHASE)}
            onSubscriptionPurchaseClick={() => setState(AppState.SUBSCRIPTION_PURCHASE)}
          />
        )}
        {state === AppState.POINT_PURCHASE && (
          <PointPurchase 
            packages={POINT_PACKAGES}
            onBack={() => setState(AppState.SHOP)}
            onPurchase={(points) => {
              if (points > 0) {
                handlePurchasePoints(points);
              } else {
                setState(AppState.CHECKOUT);
              }
            }}
            user={user}
          />
        )}
        {state === AppState.SUBSCRIPTION_PURCHASE && (
          <SubscriptionPurchase 
            packages={SUBSCRIPTION_PACKAGES}
            onBack={() => setState(AppState.SHOP)}
            onSubscribe={handleSubscribe}
          />
        )}
        {state === AppState.CHECKOUT && (
          <Checkout 
            user={user}
            onBack={() => setState(AppState.SHOP)}
          />
        )}

        {state === AppState.QUESTION_INPUT && (
          <div className="fixed top-[140px] left-0 right-0 bottom-0 overflow-hidden px-6 flex flex-col items-center justify-center">
            <StreamUIOverlay />
            
            <button
              onClick={() => {
                resetReadingState();
                setState(AppState.HOME);
              }}
              className="absolute top-6 left-6 flex items-center gap-2 text-[#c58e71] hover:text-white transition-colors font-cinzel text-lg tracking-widest uppercase"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>홈으로 나가기</span>
            </button>

            <h2 className="font-cinzel text-3xl md:text-5xl text-white mb-10 tracking-[0.3em] uppercase text-center">의지의 속삭임</h2>
            <StreamFrame className="w-full max-w-4xl">
              <textarea 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                className="w-full bg-transparent border-none focus:ring-0 text-white font-playfair text-xl md:text-2xl leading-relaxed min-h-[320px] resize-none placeholder:text-slate-700" 
                placeholder="당신의 질문은 무엇입니까?..." 
              />
            </StreamFrame>
            <button onClick={() => setState(AppState.CARD_PICKING)} disabled={!question.trim()} className="mt-8 btn-celestial text-lg font-bold">운명의 데크로 나아가기</button>
          </div>
        )}

        {state === AppState.CARD_PICKING && (
          <div className="fixed top-[140px] left-0 right-0 bottom-0 overflow-x-auto overflow-y-hidden flex flex-col bg-transparent">
            <StreamUIOverlay />
            
            <div className="text-center pt-4 pb-3 px-6 flex-shrink-0 z-10 space-y-3 relative">
              <button
                onClick={() => {
                  resetReadingState();
                  setState(AppState.HOME);
                }}
                className="absolute left-6 top-4 flex items-center gap-2 text-[#c58e71] hover:text-white transition-colors font-cinzel text-lg tracking-widest uppercase"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>홈으로 나가기</span>
              </button>
              <p className="font-playfair text-sm md:text-base text-rose-gold/80 italic">
                스와이프하여 지정된 카드 갯수만큼 선택해 주세요
              </p>
              <h2 className="font-cinzel text-3xl md:text-4xl text-white tracking-[0.4em] uppercase font-bold">수평선 스프레드</h2>
              <div className="flex items-center justify-center gap-3 rose-gold-text font-cinzel text-lg md:text-xl tracking-widest">
                <div className="w-8 h-[1px] bg-[#c58e714d]" />
                <span className="px-3 font-bold">
                  {pickedIndices.length} / {selectedType === ReadingType.YES_NO ? 1 : 3}
                </span>
                <div className="w-8 h-[1px] bg-[#c58e714d]" />
              </div>
            </div>
            
            <div className="relative w-full z-10 group flex-1 flex items-center overflow-hidden">
              <button 
                onClick={() => scrollDeck('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-950/80 border border-rose-gold/30 rounded-full text-rose-gold hover:bg-rose-gold hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollDeck('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-slate-950/80 border border-rose-gold/30 rounded-full text-rose-gold hover:bg-rose-gold hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto no-scrollbar py-0 px-4 gap-3 cursor-grab active:cursor-grabbing w-full h-full items-center justify-center"
                style={{ scrollSnapType: 'x proximity' }}
              >
                {Array.from({ length: TOTAL_DECK_SIZE }).map((_, idx) => {
                  const realNumber = dbCards[idx]?.number ?? idx;
                  const cardData = dbCards[idx];
                  const isPicked = pickedIndices.find(p => p.index === realNumber);
                  const pickOrder = pickedIndices.findIndex(p => p.index === realNumber) + 1;
                  
                  const cardBackImageUrl = CARD_BACK_IMAGE_MAP[selectedCardBackDesign];
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => handlePickCard(idx)} 
                      className={`relative flex-shrink-0 w-32 md:w-44 aspect-[2/3] cursor-pointer transition-all duration-500 transform 
                        ${isPicked ? 'scale-110 -translate-y-8 z-20' : 'hover:-translate-y-6 hover:z-10 opacity-60 hover:opacity-100'}`}
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      <div className={`h-full flex items-center justify-center transition-all shadow-xl rounded-lg overflow-hidden border-2
                        ${isPicked ? 'border-[#c58e71] shadow-[0_0_30px_rgba(197,142,113,0.6)]' : 'border-[#c58e7133] hover:border-[#c58e71]'}`}>
                        
                        {cardData?.imageUrl ? (
                          <img 
                            src={cardBackImageUrl}
                            alt="Card Back"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-slate-900 to-slate-950">
                            <Hexagon className="w-8 h-8 text-[#c58e711a]" />
                          </div>
                        )}
                      </div>

                      {isPicked && (
                        <div className="absolute -top-3 -right-3 bg-[#c58e71] text-slate-950 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg border-2 border-white/20 animate-in zoom-in-75 duration-300">
                          <span className="font-cinzel text-xs md:text-sm font-bold">{pickOrder}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-[#0d0b1a] to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-[#0d0b1a] to-transparent z-20 pointer-events-none" />
            </div>

            <div className="flex items-center justify-center gap-8 px-6 py-4 flex-shrink-0 z-10">
              <button 
                onClick={() => setPickedIndices([])} 
                className="font-cinzel rose-gold-text tracking-[0.2em] hover:text-white transition-colors uppercase text-sm md:text-base border-b-2 border-[#c58e714d] pb-1 whitespace-nowrap font-bold"
              >
                다시섞기
              </button>
              <button 
                onClick={finalizeSelection} 
                disabled={pickedIndices.length < (selectedType === ReadingType.YES_NO ? 1 : 3)} 
                className="btn-celestial text-sm md:text-base disabled:opacity-20 disabled:cursor-not-allowed group font-bold px-8 py-3 whitespace-nowrap"
              >
                운명풀기 <ArrowRight className="inline-block ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {state === AppState.RESULT && (
          <TarotResult 
            readingResult={readingResult}
            selectedDeck={selectedDeck}
            isLoading={isLoading}
            resetReading={resetReading}
            renderChatSection={renderChatSection}
          />
        )}
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={(user) => {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('✅ 사용자 로그인:', user.name);
        }}
      />
    </Header>
  );
};

export default App;