'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Moon, Star, ArrowRight, Camera, ChevronLeft, Hexagon, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  points?: number;
  profileImage?: string;
}

interface TarotDeck {
  id: string;
  nameKo: string;
  name: string;
  description: string;
  thumbnail: string;
  seed: string;
}

interface ReadingHistory {
  id: string;
  question: string;
  spreadType: string;
  fullAnswer: string;
  createdAt: string;
  cards: Array<{
    cardId: number;
    position: number;
    orientation: string;
  }>;
}

interface MyPageContentProps {
  user: User | null;
  selectedDeck: TarotDeck;
  onUpdateUser: (updatedUser: User) => void;
}

const StreamUIOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="geometric-bg absolute inset-0" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[800px] h-[800px] border border-[#c58e7133] rounded-full animate-orbit flex items-center justify-center">
        <div className="w-[600px] h-[600px] border border-[#c58e7152] rounded-full" />
        <div className="absolute w-full h-[1px] bg-[#c58e7126]" />
        <div className="absolute h-full w-[1px] bg-[#c58e7126]" />
      </div>
    </div>
    <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-[#c58e7166] opacity-70" />
    <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-[#c58e7166] opacity-70" />
    <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-[#c58e7166] opacity-70" />
    <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-[#c58e7166] opacity-70" />
  </div>
);

// MyPageContent용 커스텀 StreamFrame
const MyPageStreamFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`stream-frame ${className}`}>
    <div className="corner-star -top-1 -left-1" />
    <div className="corner-star -top-1 -right-1" />
    <div className="corner-star -bottom-1 -left-1" />
    <div className="corner-star -bottom-1 -right-1" />
    <div 
      className="p-3 m-1 h-full relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'rgba(232, 232, 232, 0.08)',
        border: '1px solid rgba(197, 142, 113, 0.3)'
      }}
    >
      {children}
    </div>
  </div>
);

const MyPageContent: React.FC<MyPageContentProps> = ({ user, selectedDeck, onUpdateUser }) => {
  // ========== 프로필 편집 상태 ==========
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editProfileImage, setEditProfileImage] = useState(user?.profileImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========== 리딩 기록 상태 ==========
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedReadingDetail, setSelectedReadingDetail] = useState<ReadingHistory | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ========== 리딩 기록 조회 ==========
  useEffect(() => {
    if (user?.id) {
      fetchReadingHistory();
    }
  }, [user?.id]);

  const fetchReadingHistory = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoadingHistory(true);
      const response = await fetch(`/api/readings?userId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setReadingHistory(data);
        console.log('✅ 리딩 기록 조회 완료:', data);
      } else {
        console.error('❌ 리딩 기록 조회 실패');
      }
    } catch (error) {
      console.error('❌ 리딩 기록 조회 에러:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // ========== 프로필 파일 변경 ==========
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ========== 프로필 저장 ==========
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: editName,
          profileImage: editProfileImage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onUpdateUser({
          ...user,
          name: data.name,
          profileImage: data.profileImage,
        });
        setIsEditingProfile(false);
        console.log('✅ 프로필 저장 완료');
      } else {
        alert(data.error || '프로필 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 프로필 저장 에러:', error);
      alert('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setEditName(user?.name || '');
    setEditProfileImage(user?.profileImage || '');
    setIsEditingProfile(false);
  };

  // ========== 리딩 상세 보기 ==========
  const handleReadingClick = (reading: ReadingHistory) => {
    setSelectedReadingDetail(reading);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReadingDetail(null);
  };

  // ========== 날짜 포맷 ==========
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pt-8 px-6 max-w-4xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />
      
      {/* 제목 섹션 */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="font-cinzel text-4xl md:text-6xl text-white mb-6 tracking-[0.4em] uppercase">
          마이 페이지
        </h2>
        <p className="font-playfair text-xl text-[#c58e71] italic">
          당신의 영적 여정을 관리하세요.
        </p>
      </div>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* 왼쪽: 프로필 영역 */}
        <div className="md:col-span-1">
          <MyPageStreamFrame className="p-8 flex flex-col items-center">
            {isEditingProfile ? (
              // 프로필 수정 모드
              <div className="w-full space-y-6">
                <div className="flex flex-col items-center mb-4">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full border-2 border-[#c58e71] p-1 mb-4 relative group cursor-pointer overflow-hidden"
                  >
                    {editProfileImage ? (
                      <img 
                        src={editProfileImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-3xl">👤</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-[#c58e71] font-cinzel tracking-widest uppercase animate-pulse">
                    사진 변경하기
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-cinzel text-[10px] text-[#c58e71] tracking-widest uppercase">
                      닉네임
                    </label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-sm p-3 text-white text-sm focus:outline-none transition-colors font-playfair placeholder:text-white/30"
                      style={{
                        background: 'rgba(232, 232, 232, 0.08)',
                        border: '1px solid rgba(197, 142, 113, 0.3)'
                      }}
                      placeholder="새 닉네임 입력"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={handleSaveProfile}
                    className="flex-1 py-2 border border-[#c58e71]/50 text-[#c58e71] font-cinzel text-[10px] tracking-[0.2em] font-bold hover:bg-[#c58e71]/10 transition-colors"
                  >
                    확인
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex-1 py-2 border border-white/10 text-white/40 font-cinzel text-[10px] tracking-[0.2em] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              // 프로필 조회 모드
              <>
                <div className="w-24 h-24 rounded-full border-2 border-[#c58e71] p-1 mb-6 flex items-center justify-center bg-white/5">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                
                <h3 className="font-cinzel text-2xl text-white mb-1 tracking-widest">
                  {user?.name}
                </h3>
                <p className="font-cinzel text-xs text-[#c58e71]/60 tracking-widest mb-4">
                  {user?.email}
                </p>
                
                {user?.points !== undefined && (
                  <div className="mb-6 text-center">
                    <p className="font-cinzel text-[10px] text-white/40 tracking-widest uppercase mb-2">
                      보유 포인트
                    </p>
                    <p className="font-cinzel text-2xl text-[#c58e71] tracking-wider">
                      {(user.points || 0).toLocaleString()} P
                    </p>
                  </div>
                )}
                
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3 border border-[#c58e71]/30 text-[#c58e71] font-cinzel text-xs tracking-[0.2em] hover:bg-[#c58e71]/10 transition-colors"
                >
                  프로필 수정
                </button>
              </>
            )}
          </MyPageStreamFrame>
        </div>

        {/* 오른쪽: 최근 상담 + 타로 덱 정보 */}
        <div className="md:col-span-2 space-y-8">
          {/* 최근 상담 내역 */}
          <MyPageStreamFrame className="p-8 items-start justify-start">
            <h4 className="font-cinzel text-lg text-white mb-6 tracking-widest flex items-center gap-3">
              <Moon className="w-5 h-5 text-[#c58e71]" /> 최근 상담 내역
            </h4>
            
            {isLoadingHistory ? (
              <div className="w-full text-center py-8 text-white/40">
                <p className="font-playfair">로딩 중...</p>
              </div>
            ) : readingHistory.length === 0 ? (
              <div className="w-full text-center py-8 text-white/40">
                <p className="font-playfair">아직 리딩 기록이 없습니다.</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                {readingHistory.slice(0, 5).map((reading) => (
                  <div
                    key={reading.id}
                    onClick={() => handleReadingClick(reading)}
                    className="p-4 rounded-sm flex justify-between items-center group hover:border-[#c58e71] transition-all cursor-pointer"
                    style={{
                      background: 'rgba(232, 232, 232, 0.08)',
                      border: '1px solid rgba(197, 142, 113, 0.3)'
                    }}
                  >
                    <div>
                      <p className="text-white text-sm font-medium mb-1 tracking-wide">
                        {reading.question.substring(0, 25)}{reading.question.length > 25 ? '...' : ''}
                      </p>
                      <p className="text-xs text-white/40 font-cinzel tracking-widest">
                        {formatDate(reading.createdAt)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#c58e71]/40 group-hover:text-[#c58e71] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
                
                {readingHistory.length > 5 && (
                  <button 
                    className="w-full py-3 text-center text-[#c58e71]/50 font-cinzel text-[10px] tracking-[0.2em] hover:text-[#c58e71] transition-colors"
                    style={{
                      background: 'rgba(232, 232, 232, 0.08)',
                      border: '1px solid rgba(197, 142, 113, 0.3)'
                    }}
                  >
                    더 보기 ({readingHistory.length}개)
                  </button>
                )}
              </div>
            )}
          </MyPageStreamFrame>

          {/* 현재 사용 중인 타로 덱 */}
          <MyPageStreamFrame className="p-8 items-start justify-start">
            <h4 className="font-cinzel text-lg text-white mb-6 tracking-widest flex items-center gap-3">
              <Star className="w-5 h-5 text-[#c58e71]" /> 나의 타로 덱
            </h4>
            <div className="w-full flex items-center gap-6">
              <div 
                className="w-20 aspect-[2/3] rounded-sm flex items-center justify-center flex-shrink-0 hover:border-[#c58e71] transition-all"
                style={{
                  background: 'rgba(232, 232, 232, 0.08)',
                  border: '1px solid rgba(197, 142, 113, 0.3)'
                }}
              >
                <Hexagon className="w-8 h-8 text-[#c58e71]/40" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-1 tracking-wide font-cinzel">
                  {selectedDeck.nameKo}
                </p>
                <p className="text-xs text-[#c58e71] font-cinzel tracking-widest uppercase mb-3">
                  현재 사용 중인 덱
                </p>
                <p className="text-xs text-white/40 line-clamp-2 font-playfair">
                  {selectedDeck.description}
                </p>
              </div>
            </div>
          </MyPageStreamFrame>
        </div>
      </div>

      {/* 리딩 상세 모달 */}
      {isDetailModalOpen && selectedReadingDetail && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999999] p-6"
          onClick={closeDetailModal}
        >
          <div
            className="bg-[#0d0b1a] border border-[#c58e71]/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(13, 11, 26, 0.95) 0%, rgba(13, 11, 26, 0.95) 100%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeDetailModal}
              className="float-right text-[#c58e71] hover:text-white transition-colors mb-4"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 제목 */}
            <h3 className="font-cinzel text-2xl text-white mb-2 tracking-[0.2em] clear-both">
              리딩 상세 기록
            </h3>
            
            {/* 날짜 */}
            <p className="text-xs text-white/40 font-cinzel tracking-widest uppercase mb-6">
              {formatDate(selectedReadingDetail.createdAt)}
            </p>

            {/* 질문 */}
            <div className="mb-8 pb-6 border-b border-[#c58e71]/20">
              <p className="font-cinzel text-[10px] text-[#c58e71] tracking-widest uppercase mb-2">
                질문
              </p>
              <p className="font-playfair text-lg text-white italic">
                "{selectedReadingDetail.question}"
              </p>
            </div>

            {/* 선택된 카드 - 이미지로 표시 */}
            <div className="mb-8 pb-6 border-b border-[#c58e71]/20">
              <p className="font-cinzel text-[10px] text-[#c58e71] tracking-widest uppercase mb-6">
                선택된 카드 ({selectedReadingDetail.cards?.length || 0}장)
              </p>
              <div className="flex gap-8 flex-wrap justify-center">
                {selectedReadingDetail.cards?.map((card, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center"
                  >
                    {/* 카드 이미지 */}
                    <div 
                      className="w-28 aspect-[2/3] mb-4 rounded-lg border border-[#c58e71]/40 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center relative group"
                      style={{
                        transform: card.orientation === 'reversed' ? 'scaleY(-1)' : 'none',
                      }}
                    >
                      <img 
                        src={`/images/tarot/${String(card.cardId).padStart(3, '0')}.png`}
                        alt={`카드 #${card.cardId}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      
                      {/* 이미지 로드 실패 시 폴백 */}
                      <div className="absolute inset-0 flex items-center justify-center text-[#c58e71]/40 font-cinzel text-xs">
                        카드 #{card.cardId}
                      </div>

                      {/* 역방향 배지 */}
                      {card.orientation === 'reversed' && (
                        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] px-2 py-1 rounded-full font-cinzel tracking-widest font-bold">
                          역
                        </div>
                      )}
                    </div>
                    
                    {/* 카드 정보 */}
                    <p className="text-xs font-cinzel text-white mb-1 text-center">
                      카드 #{card.cardId}
                    </p>
                    <p className="text-[10px] text-[#c58e71] uppercase">
                      {card.orientation === 'upright' ? '정방향' : '역방향'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 해석 */}
            <div>
              <p className="font-cinzel text-[10px] text-[#c58e71] tracking-widest uppercase mb-4">
                AI 해석
              </p>
              <p className="font-playfair text-white/80 leading-relaxed text-sm">
                {selectedReadingDetail.fullAnswer}
              </p>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={closeDetailModal}
              className="w-full mt-8 py-3 border border-[#c58e71]/30 text-[#c58e71] font-cinzel text-xs tracking-[0.2em] hover:bg-[#c58e71]/10 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPageContent;