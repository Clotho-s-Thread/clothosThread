"use client";
import React, { useState } from 'react';
import { X, Mail, Lock} from 'lucide-react';
import { FaGithub, FaGoogle } from "react-icons/fa";

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
    // 💡 핵심 1: 테일윈드 클래스 대신 style={{ zIndex: 999999 }}로 브라우저에 레이어 최상단을 강제 명령합니다!
    <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center p-4">
      
      {/* 화면 전체를 덮는 어두운 블러 배경 (클릭 시 닫힘) */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* 💡 핵심 2: 뒤가 절대 비치지 않는 고급스러운 밤하늘 단색 배경 유지 */}
      <div 
        style={{ backgroundColor: '#0d0b1a' }}
        className="relative w-full max-w-md border border-[#c58e714d] rounded-3xl shadow-2xl p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300"
      >
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
          <div className="flex items-center w-full bg-white/5 border border-white/10 rounded-xl px-4 py-1 focus-within:border-[#c58e71] transition-colors">
            <Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="w-full bg-transparent py-3 pl-4 pr-2 text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center w-full bg-white/5 border border-white/10 rounded-xl px-4 py-1 focus-within:border-[#c58e71] transition-colors">
            <Lock className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <input 
              type="password" 
              required
              placeholder="비밀번호"
              className="w-full bg-transparent py-3 pl-4 pr-2 text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          {!isSignUp && (
            <div className="text-right">
              <button type="button" className="text-xs text-[#c58e71]/70 hover:text-[#c58e71] transition-colors font-cinzel pt-2">비밀번호를 잊으셨나요?</button>
            </div>
          )}

          <button 
            type="submit"
            style={{ backgroundColor: '#c58e71' }}
            className="w-full text-slate-950 hover:opacity-90 font-cinzel font-bold py-3 mt-4 rounded-xl tracking-[0.2em] transition-all transform active:scale-95 shadow-lg shadow-[#c58e71]/20 uppercase"
          >
            {isSignUp ? '회원가입' : '로그인'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-white/10" />
            <span 
              style={{ backgroundColor: '#0d0b1a' }}
              className="absolute px-4 text-[10px] text-slate-500 font-cinzel tracking-widest uppercase"
            >
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <FaGoogle className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-cinzel uppercase">GOOGLE</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <FaGithub className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-cinzel uppercase">GITHUB</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 font-playfair">
          {isSignUp ? '이미 계정이 있으신가요?' : '아직 회원이 아니신가요?'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-[#c58e71] font-cinzel tracking-wider underline underline-offset-4 uppercase hover:text-white transition-colors"
          >
            {isSignUp ? '로그인' : '회원가입'}
          </button>
        </p>
      </div>
    </div>
  );
};
export default LoginModal;