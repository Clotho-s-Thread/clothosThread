'use client'; 

import React, { useState, useEffect } from 'react';
import { LogIn, User as UserIcon, LogOut, Star, Users, ShoppingBag, Sparkles } from 'lucide-react';
import { User } from '../types/types'; 

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onHomeClick: () => void;
  onDeckClick: () => void;
  onMastersClick: () => void;
  onMyPageClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onShopClick: () => void;
}

export const Header: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onHomeClick, 
  onDeckClick, 
  onMastersClick,
  onMyPageClick,
  onLoginClick,
  onShopClick,
  onLogout 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #16192f 0%, #2a2750 25%, #3d3a70 50%, #3a2f60 75%, #1a1435 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* ✨ 헤더 - 로고와 네비게이션 함께 */}
      <nav 
        className={`fixed top-0 w-full transition-all duration-500 ${isScrolled ? 'border-b border-[#c58e7133]' : ''}`}
        style={{
          zIndex: 999999,
          pointerEvents: 'auto',
          height: '140px',
          background: isScrolled 
          ? 'linear-gradient(135deg, rgba(22, 25, 47, 0.95) 0%, rgba(42, 39, 80, 0.95) 25%, rgba(61, 58, 112, 0.95) 50%, rgba(58, 47, 96, 0.95) 75%, rgba(26, 20, 53, 0.95) 100%)'
          : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="w-full px-20 flex justify-between items-center">
          {/* 왼쪽: 로고 */}
          <div 
            className="cursor-pointer group flex-shrink-0"
            onClick={onHomeClick}
          >
            <img 
              src="/images/logo_image.png" 
              alt="Clotho's Thread Logo" 
              className="h-32 w-auto object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
            />
          </div>

          {/* 오른쪽: 네비게이션 메뉴 */}
          <div className="flex items-center gap-10 md:gap-14 font-cinzel text-xs tracking-[0.3em]">
            <button 
              onClick={onDeckClick} 
              className="text-white/40 hover:text-[#c58e71] transition-colors uppercase hidden lg:block"
              style={{ fontSize: '16px' }}
            >
              타로 도감
            </button>
            <button 
              onClick={onMastersClick} 
              className="text-white/40 hover:text-[#c58e71] transition-colors uppercase flex items-center gap-2 font-bold"
              style={{ fontSize: '16px' }}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">전문가 상담</span>
            </button>
            
            {/* 로그인 후에만 상점 버튼과 포인트 표시 */}
            {user && (
              <>
                <button 
                  onClick={onShopClick}
                  className="text-white/40 hover:text-[#c58e71] transition-colors uppercase flex items-center gap-2 font-bold"
                  style={{ fontSize: '16px' }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">상점</span>
                </button>

                {/* 포인트 표시 */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#c58e711a] border border-[#c58e7133] rounded-lg hover:border-[#c58e71] transition-all duration-300 group/points">
                  <Sparkles className="w-4 h-4 text-[#c58e71] group-hover/points:animate-spin" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-cinzel tracking-widest uppercase">포인트</span>
                    <span className="text-sm font-bold text-[#c58e71]">{(user.points || 0).toLocaleString()} P</span>
                  </div>
                </div>
              </>
            )}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full border border-[#c58e7166] overflow-hidden bg-white/5 flex items-center justify-center transition-all p-1">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-[#c58e71]" />
                    )}
                  </div>
                  <span className="text-white group-hover:text-[#c58e71] transition-colors hidden sm:block uppercase tracking-widest text-sm">{user.name} 님</span>
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-6 w-56 border border-[#c58e7133] shadow-3xl py-4 animate-in fade-in slide-in-from-top-4 duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(22, 25, 47, 0.95) 0%, rgba(42, 39, 80, 0.95) 25%, rgba(61, 58, 112, 0.95) 50%, rgba(58, 47, 96, 0.95) 75%, rgba(26, 20, 53, 0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)'
                    }}
                  >
                    <div className="px-6 py-4 border-b border-[#c58e711a] mb-2">
                      <p className="text-[10px] text-slate-600 font-cinzel mb-2 tracking-widest uppercase">Consultant</p>
                      <p className="text-xs text-[#c58e71] font-cinzel truncate">{user.email}</p>
                      <p className="text-xs text-[#c58e71]/60 font-cinzel mt-2">
                        포인트: <span className="text-[#c58e71]">{(user.points || 0).toLocaleString()} P</span>
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        onMyPageClick();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 text-left text-[#c58e71] hover:bg-[#c58e711a] transition-colors font-cinzel flex items-center gap-3 tracking-widest"
                    >
                      <UserIcon className="w-3 h-3" /> 마이페이지
                    </button>
                    
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 text-left text-red-400 hover:bg-red-400/10 transition-colors font-cinzel flex items-center gap-3 tracking-widest"
                    >
                      <LogOut className="w-3 h-3" /> 접속 종료
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-3 text-[#c58e71] hover:text-white transition-all uppercase border border-[#c58e7166] px-8 py-2 hover:bg-[#c58e711a] tracking-[0.2em]"
                style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)' }}
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 헤더 높이만큼 상단 여백 */}
      <div style={{ height: '140px' }}></div>

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};