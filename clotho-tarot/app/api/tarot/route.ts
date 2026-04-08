import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// 🔮 [1] 사용자의 질문과 카드를 받아 AI 해석을 해주는 POST API
export async function POST(req: Request) {
  try {
    const { messages, selectedCards } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. 유저 확인 (테스트용)
    let testUser = await prisma.user.findFirst({ where: { name: "TestGuest" } });
    if (!testUser) {
        testUser = await prisma.user.create({ data: { name: "TestGuest", email: "guest@example.com" } });
    }
    const currentUserId = testUser.id;

    let systemPrompt = "당신은 운명의 실을 잣는 신비로운 타로 마스터 클로토입니다.";
    let drawnCards: any[] = []; 
    
    // 2. 카드 정보 가져오기 & 순서 및 방향 결정
    if (selectedCards && selectedCards.length > 0) {
        const cardsFromDB = await prisma.tarotCard.findMany({
            where: { number: { in: selectedCards } }
        });

        // ✨ 핵심: 사용자가 클릭한 번호 순서(selectedCards)대로 정확히 재배열
        drawnCards = selectedCards.map((selectedNumber: number, index: number) => {
            const card = cardsFromDB.find(c => c.number === selectedNumber);
            if (!card) return null;

            const isReversed = Math.random() < 0.5; // 50% 확률로 역방향
            
            // 3장 스프레드일 때 위치 명칭 부여
            let positionName = "현재";
            if (selectedCards.length === 3) {
                positionName = index === 0 ? "과거" : index === 1 ? "현재" : "미래";
            }

            return {
                ...card,
                positionName, // 과거/현재/미래
                orientation: isReversed ? "reversed" : "upright", 
                directionName: isReversed ? "역방향" : "정방향",   
                currentMeaning: isReversed && card.meaningRev ? card.meaningRev : card.meaningUp 
            };
        }).filter(Boolean);

        // AI에게 전달할 카드 정보 문자열 생성
        const cardInfoText = drawnCards.map((card, index) => 
            `[${card.positionName}] 카드: ${card.nameKo} (${card.name}) - [${card.directionName}]\n- 키워드 의미: ${card.currentMeaning}`
        ).join("\n\n");

        systemPrompt = `
        [역할] 당신은 타로 마스터 '클로토'입니다.
        [상황] 사용자가 뽑은 카드의 순서는 절대적입니다. 1번째 카드는 과거, 2번째는 현재, 3번째는 미래로 해석하세요.
        [방향성] '역방향' 카드가 나왔다면 에러나 지연, 내면의 문제를 강조하여 다정하게 설명하세요.
        
        [답변 구조]
        1. 🔮 클로토의 신비로운 인사
        2. 🃏 운명의 실타래 해석 
           (반드시 각 카드마다 '### [과거/현재/미래] - [카드이름] ([방향])' 형식의 헤더를 사용하세요.)
        3. ✨ 종합적인 조언과 축복
        
        [뽑힌 카드 리스트]
        ${cardInfoText}
        `;
    }

    // 3. Gemini API 초기화 (환경변수 권장)
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("API KEY가 없습니다.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash", 
        systemInstruction: systemPrompt, 
    });

    const chatSession = model.startChat({
        history: messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }))
    });
    
    const result = await chatSession.sendMessage(lastMessage);
    const aiResponse = result.response.text();

    // 4. DB 저장
    if (selectedCards && selectedCards.length > 0 && drawnCards.length > 0) {
        await prisma.reading.create({
            data: {
                userId: currentUserId,
                question: lastMessage,
                fullAnswer: aiResponse,
                spreadType: selectedCards.length === 3 ? "past-present-future" : "single", 
                cards: {
                    create: drawnCards.map((card, idx) => ({
                        cardId: card.id,        
                        position: idx,
                        orientation: card.orientation 
                    }))
                }
            }
        });
    }

    // 🌟 [중요] 프론트엔드에 텍스트와 함께 '순서/방향이 결정된 카드 데이터'를 보냅니다.
    return NextResponse.json({ text: aiResponse, cards: drawnCards });

  } catch (error: any) {
    console.error("API 에러:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cards = await prisma.tarotCard.findMany({ orderBy: { number: 'asc' } });
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: "카드 목록 에러" }, { status: 500 });
  }
}