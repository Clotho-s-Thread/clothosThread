import React from 'react';
import { Sparkles, User, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onHomeClick: () => void;
  onDeckClick: () => void;
  onMastersClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ user, onHomeClick, onDeckClick, onMastersClick, onLoginClick, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-[#0d0b1a] text-slate-200 font-playfair selection:bg-rose-gold/30">
      <nav className="fixed top-0 w-full z-[100] px-8 py-6 flex justify-between items-center bg-gradient-to-b from-[#0d0b1a] to-transparent">
        <div className="flex items-center gap-12">
          <button onClick={onHomeClick} className="font-cinzel text-2xl text-white tracking-[0.4em] uppercase hover:text-rose-gold transition-colors">
            CLOTHO
          </button>
          <div className="hidden md:flex gap-8 font-cinzel text-xs tracking-widest uppercase text-slate-400">
            <button onClick={onDeckClick} className="hover:text-rose-gold transition-colors">The Decks</button>
            <button onClick={onMastersClick} className="hover:text-rose-gold transition-colors">The Masters</button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-cinzel text-[10px] text-rose-gold tracking-widest uppercase">{user.name}</span>
              <button onClick={onLogout} className="p-2 text-slate-500 hover:text-white transition-colors"><LogOut className="w-4 h-4" /></button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="flex items-center gap-2 font-cinzel text-[10px] text-white tracking-widest uppercase border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition-all">
              <User className="w-3 h-3" /> Login
            </button>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Header;