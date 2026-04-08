import { ReadingType, TarotCard } from '../types/types';

// ✨ 아까 next.config.ts에 설정한 '우회로(Proxy)' 주소를 사용합니다.
// (실제로는 https://clotho-server-vyw7.vercel.app/api/tarot/chat 으로 날아갑니다!)
const SERVER_API_URL = '/api/server/tarot/chat';

// 1. 처음 타로 카드를 뽑았을 때 해석 요청
export const interpretTarot = async (question: string, type: ReadingType, cards: TarotCard[]) => {
  try {
    const response = await fetch(SERVER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 💡 서버팀에게 '질문'과 '뽑은 카드 번호'를 포장해서 보냅니다.
      body: JSON.stringify({
        messages: [{ role: 'user', content: question }],
        selectedCards: cards.map(c => c.number), 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("서버팀 API 에러 상세:", errorText);
      throw new Error(`서버 에러: ${response.status}`);
    }

    const data = await response.json();
    
    // 🚨 주의: 서버팀이 완성된 답변을 'text', 'reply', 'answer' 중 어떤 이름으로 보내는지 확인이 필요합니다!
    return data.text || data.reply || data.answer || "해석을 불러오지 못했습니다.";

  } catch (error) {
    console.error("타로 해석 요청 실패:", error);
    return "운명의 실타래가 엉켰습니다. 잠시 후 다시 시도해주세요.";
  }
};

// 2. 타로 해석 후 이어서 채팅할 때 요청
export const chatAboutReading = async (messages: any[], newMsg: string, context: string) => {
  try {
    const response = await fetch(SERVER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content: newMsg }],
        context: context
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("채팅 API 에러 상세:", errorText);
      throw new Error(`서버 에러: ${response.status}`);
    }

    const data = await response.json();
    return data.text || data.reply || data.answer || "응답을 불러오지 못했습니다.";

  } catch (error) {
    console.error("채팅 요청 실패:", error);
    return "운명의 실타래가 엉켰습니다. 잠시 후 다시 시도해주세요.";
  }
};