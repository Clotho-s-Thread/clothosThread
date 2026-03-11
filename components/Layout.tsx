
import React, { useState, useEffect } from 'react';
import { LogIn, User as UserIcon, LogOut, Star, Users } from 'lucide-react';
import { User } from '../types/types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onHomeClick: () => void;
  onDeckClick: () => void;
  onMastersClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onHomeClick, 
  onDeckClick, 
  onMastersClick,
  onLoginClick,
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
    <div className="min-h-screen">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-xl py-4 border-b border-[#c58e7133]' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="relative">
               <Star className="w-8 h-8 text-[#c58e71] transition-all duration-700 group-hover:rotate-90" />
               <div className="absolute inset-0 bg-[#c58e7133] blur-md rounded-full" />
            </div>
            <h1 className="font-cinzel text-3xl tracking-[0.4em] text-white group-hover:text-[#c58e71] transition-colors">CLOTHO</h1>
          </div>
          
          <div className="flex items-center gap-8 md:gap-12 font-cinzel text-xs tracking-[0.3em]">
            <button onClick={onDeckClick} className="text-white/40 hover:text-[#c58e71] transition-colors uppercase hidden lg:block">타로 도감</button>
            <button onClick={onMastersClick} className="text-white/40 hover:text-[#c58e71] transition-colors uppercase flex items-center gap-2 font-bold">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">전문가 상담</span>
            </button>
            
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
                  <span className="text-white group-hover:text-[#c58e71] transition-colors hidden sm:block uppercase tracking-widest">{user.name} 님</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-6 w-56 bg-slate-950 border border-[#c58e7133] shadow-3xl py-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-6 py-4 border-b border-[#c58e711a] mb-2">
                      <p className="text-[10px] text-slate-600 font-cinzel mb-2 tracking-widest uppercase">Consultant</p>
                      <p className="text-xs text-[#c58e71] font-cinzel truncate">{user.email}</p>
                    </div>
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
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};
