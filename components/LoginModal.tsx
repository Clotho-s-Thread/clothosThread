
import React, { useState } from 'react';
import { X, Mail, Lock, Github, Chrome } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email || 'Guest');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-200/20 rounded-3xl shadow-2xl p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="font-cinzel text-3xl text-white tracking-widest mb-2 uppercase">
            {isSignUp ? '가입하기' : '반갑습니다'}
          </h2>
          <p className="font-playfair text-slate-400 italic">
            {isSignUp ? '당신의 운명을 기록할 공간을 만드세요' : '다시 운명의 실타래를 이어가볼까요?'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-200/50 transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="password" 
              required
              placeholder="비밀번호"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-200/50 transition-colors"
            />
          </div>

          {!isSignUp && (
            <div className="text-right">
              <button type="button" className="text-xs text-amber-200/60 hover:text-amber-200 transition-colors font-cinzel">비밀번호를 잊으셨나요?</button>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-amber-200 hover:bg-amber-100 text-slate-950 font-cinzel font-bold py-3 rounded-xl tracking-[0.2em] transition-all transform active:scale-95 shadow-lg shadow-amber-200/10 uppercase"
          >
            {isSignUp ? '회원가입' : '로그인'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-white/5" />
            <span className="absolute px-4 bg-slate-900 text-[10px] text-slate-600 font-cinzel tracking-widest uppercase">또는 다음으로 계속하기</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <Chrome className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-cinzel uppercase">GOOGLE</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <Github className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-cinzel uppercase">GITHUB</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 font-playfair">
          {isSignUp ? '이미 계정이 있으신가요?' : '아직 회원이 아니신가요?'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-amber-200 font-cinzel tracking-wider underline underline-offset-4 uppercase"
          >
            {isSignUp ? '로그인' : '회원가입'}
          </button>
        </p>
      </div>
    </div>
  );
};
