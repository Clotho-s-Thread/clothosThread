'use client';

import React, { useRef, useState } from 'react';
import { Moon, Star, ArrowRight, Camera, ChevronLeft, Hexagon } from 'lucide-react';

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

interface MyPageContentProps {
  user: User | null;
  selectedDeck: TarotDeck;
  onUpdateUser: (updatedUser: User) => void;
}

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

const StreamFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
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

const MyPageContent: React.FC<MyPageContentProps> = ({ user, selectedDeck, onUpdateUser }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editProfileImage, setEditProfileImage] = useState(user?.profileImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // 로컬 상태 업데이트
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

  return (
    <div className="pt-32 px-6 max-w-4xl mx-auto min-h-screen pb-40">
      <StreamUIOverlay />
      
      <div className="text-center mb-16 relative z-10">
        <h2 className="font-cinzel text-4xl md:text-6xl text-white mb-6 tracking-[0.4em] uppercase">
          마이 페이지
        </h2>
        <p className="font-playfair text-xl text-white/60 italic">
          당신의 영적 여정을 관리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* 왼쪽: 프로필 영역 */}
        <div className="md:col-span-1">
          <StreamFrame className="p-8 flex flex-col items-center">
            {isEditingProfile ? (
              // 프로필 수정 모드
              <div className="w-full space-y-6">
                <div className="flex flex-col items-center mb-4">
                  {/* 숨겨진 파일 입력 */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {/* 프로필 이미지 선택 영역 */}
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
                    
                    {/* 호버 시 카메라 아이콘 */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-[#c58e71] font-cinzel tracking-widest uppercase animate-pulse">
                    사진 변경하기
                  </p>
                </div>
                
                {/* 닉네임 입력 필드 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-cinzel text-[10px] text-slate-500 tracking-widest uppercase">
                      닉네임
                    </label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white/5 border border-[#c58e71]/20 rounded-sm p-3 text-white text-sm focus:outline-none focus:border-[#c58e71] transition-colors font-playfair"
                      placeholder="새 닉네임 입력"
                    />
                  </div>
                </div>

                {/* 확인/취소 버튼 */}
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
                <p className="font-cinzel text-xs text-[#c58e71]/60 tracking-widest mb-6">
                  {user?.email}
                </p>
                
                {/* 프로필 수정 버튼 */}
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3 border border-[#c58e71]/30 text-[#c58e71] font-cinzel text-xs tracking-[0.2em] hover:bg-[#c58e71]/10 transition-colors"
                >
                  프로필 수정
                </button>
              </>
            )}
          </StreamFrame>
        </div>

        {/* 오른쪽: 최근 상담 + 타로 덱 정보 */}
        <div className="md:col-span-2 space-y-8">
          {/* 최근 상담 내역 */}
          <StreamFrame className="p-8 items-start justify-start">
            <h4 className="font-cinzel text-lg text-white mb-6 tracking-widest flex items-center gap-3">
              <Moon className="w-5 h-5 text-[#c58e71]" /> 최근 상담 내역
            </h4>
            <div className="w-full space-y-4">
              <div className="p-4 border border-white/5 bg-white/5 rounded-sm flex justify-between items-center group hover:border-[#c58e71]/30 transition-colors cursor-pointer">
                <div>
                  <p className="text-white text-sm font-medium mb-1 tracking-wide">오늘의 운세 상담</p>
                  <p className="text-xs text-white/40 font-cinzel tracking-widest">2026.03.27</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c58e71]/40 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="p-4 border border-white/5 bg-white/5 rounded-sm flex justify-between items-center group hover:border-[#c58e71]/30 transition-colors cursor-pointer opacity-50">
                <div>
                  <p className="text-white text-sm font-medium mb-1 tracking-wide">연애운 심층 분석</p>
                  <p className="text-xs text-white/40 font-cinzel tracking-widest">2026.03.20</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#c58e71]/40 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </StreamFrame>

          {/* 현재 사용 중인 타로 덱 */}
          <StreamFrame className="p-8 items-start justify-start">
            <h4 className="font-cinzel text-lg text-white mb-6 tracking-widest flex items-center gap-3">
              <Star className="w-5 h-5 text-[#c58e71]" /> 나의 타로 덱
            </h4>
            <div className="flex items-center gap-6">
              <div className="w-20 aspect-[2/3] border border-[#c58e71]/30 bg-slate-900 rounded-sm flex items-center justify-center">
                <Hexagon className="w-6 h-6 text-[#c58e71]/20" />
              </div>
              <div>
                <p className="text-white text-sm font-medium mb-1 tracking-wide">
                  {selectedDeck.nameKo}
                </p>
                <p className="text-xs text-white/40 font-cinzel tracking-widest">
                  현재 사용 중인 덱
                </p>
              </div>
            </div>
          </StreamFrame>
        </div>
      </div>
    </div>
  );
};

export default MyPageContent;