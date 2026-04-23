import { ReadingType, TarotCard } from '../types/types';

// ✨ 아까 next.config.ts에 설정한 '우회로(Proxy)' 주소를 사용합니다.
// (실제로는 https://clotho-server-vyw7.vercel.app/api/tarot 으로 날아갑니다!)
const SERVER_API_URL = '/api/server/tarot/chat';

// 1. 처음 타로 카드를 뽑았을 때 해석 요청
export const interpretTarot = async (question: string, type: ReadingType, cards: TarotCard[]) => {
  try {
    console.log("⏳ [interpretTarot] 요청 시작");
    console.log("📤 요청 URL:", SERVER_API_URL);
    console.log("📤 요청 본문:", JSON.stringify({
      messages: [{ role: 'user', content: question }],
      selectedCards: cards.map(c => c.number), 
    }, null, 2));

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

    console.log("📡 응답 상태:", response.status);
    console.log("📡 응답 헤더 (Content-Type):", response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 서버팀 API 에러 상세:", errorText);
      throw new Error(`서버 에러: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("📡 응답 본문 (원본, 처음 300자):", responseText.substring(0, 300));

    try {
      const data = JSON.parse(responseText);
      console.log("✅ JSON 파싱 성공");
      console.log("📦 파싱된 데이터:", data);
      
      // ✅ 서버에서 'text' 필드로 응답합니다
      const result = data.text || "해석을 불러오지 못했습니다.";
      console.log("🎉 최종 결과:", result.substring(0, 100));
      return result;
    } catch (parseError) {
      console.error("❌ JSON 파싱 실패:", parseError);
      console.error("❌ 파싱 시도한 텍스트:", responseText);
      throw parseError;
    }

  } catch (error) {
    console.error("❌ [interpretTarot] 전체 에러:", error);
    return "운명의 실타래가 엉켰습니다. 잠시 후 다시 시도해주세요.";
  }
};

// 2. 타로 해석 후 이어서 채팅할 때 요청
export const chatAboutReading = async (messages: any[], newMsg: string, context: string) => {
  try {
    console.log("⏳ [chatAboutReading] 요청 시작");
    console.log("📤 요청 URL:", SERVER_API_URL);
    console.log("📤 요청 본문:", JSON.stringify({
      messages: [...messages, { role: 'user', content: newMsg }],
      context: context
    }, null, 2));

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

    console.log("📡 응답 상태:", response.status);
    console.log("📡 응답 헤더 (Content-Type):", response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 채팅 API 에러 상세:", errorText);
      throw new Error(`서버 에러: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("📡 응답 본문 (원본, 처음 300자):", responseText.substring(0, 300));

    try {
      const data = JSON.parse(responseText);
      console.log("✅ JSON 파싱 성공");
      console.log("📦 파싱된 데이터:", data);
      
      // ✅ 서버에서 'text' 필드로 응답합니다
      const result = data.text || "응답을 불러오지 못했습니다.";
      console.log("🎉 최종 결과:", result.substring(0, 100));
      return result;
    } catch (parseError) {
      console.error("❌ JSON 파싱 실패:", parseError);
      console.error("❌ 파싱 시도한 텍스트:", responseText);
      throw parseError;
    }

  } catch (error) {
    console.error("❌ [chatAboutReading] 전체 에러:", error);
    return "운명의 실타래가 엉켰습니다. 잠시 후 다시 시도해주세요.";
  }
};