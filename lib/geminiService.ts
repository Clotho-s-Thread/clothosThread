import { TarotCard, ReadingType } from "../types/types";

/**
 * 프론트엔드(화면)에서 백엔드(route.ts)로 요청을 보내는 서비스 파일입니다.
 * 이제 API 키 노출 없이 안전하게 통신합니다.
 */

// 1. 타로 결과 첫 해석 요청
export const interpretTarot = async (
  question: string,
  type: ReadingType, 
  cards: TarotCard[]
) => {
  // 백엔드가 요구하는 형식에 맞춰 데이터 가공
  const messages = [{ role: 'user', content: question }];
  const selectedCards = cards.map(c => c.number); // 카드의 번호만 추출해서 전달

  // 💡 만약 route.ts를 `app/api/route.ts`에 만들었다면 주소를 '/api'로 변경하세요!
  const response = await fetch('/api/tarot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, selectedCards })
  });

  if (!response.ok) {
    throw new Error('운명의 실타래를 읽는 중 오류가 발생했습니다.');
  }

  const data = await response.json();
  return data.text;
};


// 2. 타로 결과에 대한 추가 질문 (전문가 1:1 상담 및 채팅 모드)
export const chatAboutReading = async (
  history: { role: 'user' | 'assistant' | 'model', content: string }[],
  newQuestion: string,
  readingContext: string // page.tsx 기존 코드와의 호환성을 위해 남겨둠
) => {
  // 기존 대화 기록 맨 끝에 새로운 질문 추가
  const messages = [
    ...history,
    { role: 'user', content: newQuestion }
  ];

  // 추가 채팅일 때는 이미 뽑은 카드 정보 없이 메시지 묶음만 보냅니다
  const response = await fetch('/api/tarot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  if (!response.ok) {
    throw new Error('클로토와 대화하는 중 오류가 발생했습니다.');
  }

  const data = await response.json();
  return data.text;
};