import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

console.log("현재 인식된 DB 주소:", process.env.DATABASE_URL);

export async function POST(req: Request) {
  try {
    const { messages, selectedCards } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. 유저 확인 (임시 테스트용)
    let testUser = await prisma.user.findFirst({ where: { name: "TestGuest" } });
    if (!testUser) {
        testUser = await prisma.user.create({ data: { name: "TestGuest", email: "guest@example.com" } });
    }
    const currentUserId = testUser.id;

    let systemPrompt = "당신은 운명의 실을 잣는 신비로운 타로 마스터 클로토입니다. 이전 대화 맥락을 기억하고 다정하게 답변하세요.";
    let drawnCards: any[] = []; 
    
    // 2. 카드 정보 가져오기 & 방향 결정
    if (selectedCards && selectedCards.length > 0) {
        // DB에서 카드 정보 조회 (순서가 뒤죽박죽일 수 있음)
        const cardsFromDB = await prisma.tarotCard.findMany({
            where: { number: { in: selectedCards } }
        });

        // ✨ 핵심: 사용자가 뽑은 순서(selectedCards)대로 다시 정렬하고 방향 결정하기
        drawnCards = selectedCards.map((selectedNumber: number) => {
            const card = cardsFromDB.find(c => c.number === selectedNumber);
            if (!card) return null;

            const isReversed = Math.random() < 0.5; // 50% 확률
            return {
                ...card,
                orientation: isReversed ? "reversed" : "upright", 
                directionName: isReversed ? "역방향" : "정방향",   
                currentMeaning: isReversed && card.meaningRev ? card.meaningRev : card.meaningUp 
            };
        }).filter(Boolean); // 혹시 모를 null 값 제거

        // AI에게 넘겨줄 텍스트
        const cardInfoText = drawnCards.map((card, index) => 
            `${index + 1}번째 카드: ${card.nameKo} (${card.name}) - [${card.directionName}]\n- 원래 의미: ${card.currentMeaning}`
        ).join("\n\n");

        systemPrompt = `
        [역할 및 페르소나]
        당신은 운명의 실을 잣는 타로 마스터 '클로토(Clotho)'입니다.
        
        [가장 중요한 대화 톤 규칙 - 감정 동기화]
        - ☀️ 흐름이 긍정적일 때: 아주 활기차고, 밝고, 기뻐하는 텐션으로 말해주세요! 이모지도 듬뿍 쓰고 축하해주는 느낌을 줍니다.
        - 🌧️ 흐름이 부정적일 때: 깊이 공감하고, 다치거나 지친 마음을 따뜻하게 꼭 안아주는(🫂) 다정한 말투로 위로해주세요.

        [답변 구조]
        1. 🔮 클로토의 첫인사
        2. 🃏 운명의 실타래 해석
           (⚠️중요: 카드를 소개할 때는 반드시 "### 🃏 [N] 번째 카드, [질문과 연관된 의미]를 나타내는 카드로 [카드이름 - 방향]이 나왔습니다!" 형식으로 마크다운 '###'를 써서 크고 임팩트 있게 한 문장으로 작성하세요.)
        3. ✨ 클로토의 조언
        4. 🌙 축복의 마무리

        ---
        [실제 상담 진행]
        사용자가 뽑은 카드:
        ${cardInfoText}
        
        위의 규칙을 철저히 지키고, 카드를 소개할 때는 반드시 '###' 태그를 사용하여 한 문장으로 크고 명확하게 등장시켜주세요.
        만약 [역방향] 카드가 나왔다면, 그 에너지가 지연되거나 내면으로 향하고 있음을 자연스럽게 해석에 녹여내세요.
        `;
    }

    // 3. Gemini API 초기화 및 프롬프트 주입
    // .env.local에 설정한 변수명으로 수정 (예: NEXT_PUBLIC_GEMINI_API_KEY 또는 GEMINI_API_KEY)
    // 원래 코드 지우고 이렇게 직접 키를 넣어봅니다 (따옴표 필수)
    const apiKey = "AIzaSyD9a8d1qlhtCaM2H32_R1fvZxbpKIDMpJM";
    if (!apiKey) throw new Error("API 키가 설정되지 않았습니다.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt, // ✨ 최신 SDK의 깔끔한 프롬프트 주입 방식!
        generationConfig: { maxOutputTokens: 5000 }
    });

    // 4. 대화 세션 생성 (System 프롬프트는 뺐으므로 순수 대화만 들어감)
    const chatSession = model.startChat({
        history: messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }))
    });
    
    // 5. AI 응답 생성
    const result = await chatSession.sendMessage(lastMessage);
    const aiResponse = result.response.text();

    // 6. [DB 저장] AI 응답 후 저장
    if (selectedCards && selectedCards.length > 0 && drawnCards.length > 0) {
        await prisma.reading.create({
            data: {
                userId: currentUserId,
                question: lastMessage,
                fullAnswer: aiResponse,
                spreadType: "three-card", 
                cards: {
                    create: drawnCards.map((card, idx) => ({
                        cardId: card.id,        
                        position: idx,
                        orientation: card.orientation 
                    }))
                }
            }
        });
        console.log("✅ DB 저장 완료: Reading + ReadingCard");
    }

    return NextResponse.json({ text: aiResponse });

  } catch (error: any) {
    console.error("에러:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}