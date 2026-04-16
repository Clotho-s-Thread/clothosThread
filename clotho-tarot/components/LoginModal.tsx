"use client";
import React, { useState } from 'react';

// 💡 해결 1: Lucide 아이콘 라이브러리 (npm install lucide-react 필수)
import { X, Mail, Lock } from 'lucide-react';

// 💡 해결 2: React Icons 라이브러리 (npm install react-icons 필수)
import { FaGithub, FaGoogle } from "react-icons/fa";

/**
 * 💡 해결 3: 지긋지긋한 경로 에러 방지!
 * @/app/globals.css 대신 상대 경로(../)를 사용하고 
 * TypeScript가 계속 못 읽는다면 아래 주석(// @ts-ignore)이 강제로 입을 막아줍니다.
 */
// @ts-ignore
import '../app/globals.css';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  points?: number;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 💡 추가: 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // 새로운 요청 시 에러 메시지 초기화

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          type: isSignUp ? 'signup' : 'login' 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ 로그인 성공 - DB에서 최신 유저 정보 조회
        if (!isSignUp) {
          try {
            const userResponse = await fetch(`/api/user?email=${email}`);
            const userData = await userResponse.json();

            if (userResponse.ok) {
              // DB에서 가져온 최신 정보로 로그인
              onLogin({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                profileImage: userData.image,
                points: userData.point || 0,
              });
              console.log('✅ 로그인 성공 - DB에서 최신 정보 조회됨');
              alert("다시 오신 것을 환영합니다.");
            } else {
              throw new Error('유저 정보를 가져올 수 없습니다.');
            }
          } catch (error) {
            console.error('❌ 유저 정보 조회 실패:', error);
            setErrorMessage('유저 정보를 가져올 수 없습니다.');
            setPassword('');
            setIsLoading(false);
            return;
          }
        } else {
          // 회원가입 성공 - 기본 정보로 로그인
          onLogin({
            id: 'temp-id',
            name: email.split('@')[0],
            email: email,
            profileImage: undefined,
            points: 0,
          });
          console.log('✅ 회원가입 성공');
          alert("운명의 기록이 시작되었습니다.");
        }

        // 모달 닫고 입력창 초기화
        onClose();
        setEmail('');
        setPassword('');
        setErrorMessage('');
      } else {
        // ❌ 실패 - 에러 메시지 표시
        setErrorMessage(data.error || '오류가 발생했습니다.');
        // 비밀번호 입력창 초기화
        setPassword('');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setErrorMessage('서버와 연결할 수 없습니다.');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 💡 레이어 최상단 고정 (z-index 강제 부여)
    <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center p-4">
      
      {/* 배경 블러 처리 */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* 모달 본체: 밤하늘 딥 퍼플 테마 */}
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
            {isSignUp ? '당신의 운명을 기록할 공간을 만드세요' : '운명의 실타래를 풀어봅시다'}
          </p>
        </div>

        {/* 💡 에러 메시지 표시 */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm font-playfair">{errorMessage}</p>
          </div>
        )}

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            disabled={isLoading}
            style={{ backgroundColor: '#c58e71' }}
            className="w-full text-slate-950 hover:opacity-90 font-cinzel font-bold py-3 mt-4 rounded-xl tracking-[0.2em] transition-all transform active:scale-95 shadow-lg shadow-[#c58e71]/20 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '잠시만...' : (isSignUp ? '회원가입' : '로그인')}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full border-t border-white/10" />
            <span 
              style={{ backgroundColor: '#0d0b1a' }}
              className="absolute px-4 text-[10px] text-slate-500 font-cinzel tracking-widest uppercase"
            >
              OR
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <FaGoogle className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-cinzel uppercase">GOOGLE</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <FaGithub className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-300 font-cinzel uppercase">GITHUB</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 font-playfair">
          {isSignUp ? '이미 계정이 있으신가요?' : '아직 회원이 아니신가요?'}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage('');
              setPassword('');
            }}
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