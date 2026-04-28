// app/api/readings/route.ts
// 타로 읽기 결과를 DB에 저장하는 API

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============ POST: 타로 읽기 결과 저장 ============
export async function POST(req: NextRequest) {
  const requestId = Date.now();

  console.log(`\n🚀 [${requestId}] Reading 저장 요청 시작`);
  console.log("━".repeat(60));

  try {
    // ✅ 1️⃣ 요청 데이터 파싱
    const body = await req.json();
    const { question, spreadType, fullAnswer, userId, id, cards } = body;

    // ✅ userId 또는 id 중 하나 사용
    const finalUserId = userId || id;

    console.log(`📦 [${requestId}] 받은 데이터:`);
    console.log(`  question: "${question}"`);
    console.log(`  spreadType: "${spreadType}"`);
    console.log(`  userId: "${finalUserId}"`);
    console.log(`  cards 개수: ${cards?.length || 0}`);

    // ✅ 2️⃣ 필수 데이터 검증
    if (!question || !finalUserId || !fullAnswer) {
      console.error(`❌ [${requestId}] 필수 데이터 누락`);
      return NextResponse.json(
        { error: '질문, 사용자ID, 해석이 필요합니다' },
        { status: 400 }
      );
    }

    if (!Array.isArray(cards) || cards.length === 0) {
      console.error(`❌ [${requestId}] 카드 정보 누락`);
      return NextResponse.json(
        { error: '카드 정보가 필요합니다' },
        { status: 400 }
      );
    }

    console.log(`✅ [${requestId}] 데이터 검증 완료`);

    // ✅ 3️⃣ Reading 테이블에 저장
    console.log(`📝 [${requestId}] Reading 생성 중...`);

    const reading = await prisma.reading.create({
      data: {
        question,
        spreadType,
        fullAnswer,
        userId: finalUserId
      }
    });

    console.log(`✅ [${requestId}] Reading 생성 완료: ${reading.id}`);

    // ✅ 4️⃣ ReadingCard 테이블에 각 카드 저장
    console.log(`🎴 [${requestId}] ReadingCard 저장 중...`);

    for (const card of cards) {
      console.log(`  저장 중: cardId=${card.cardId}, position=${card.position}, orientation=${card.orientation}`);

      await prisma.readingCard.create({
        data: {
          readingId: reading.id,
          cardId: card.cardId || card.id,
          position: card.position,
          orientation: card.orientation || 'upright'
        }
      });
    }

    console.log(`✅ [${requestId}] ${cards.length}개 카드 저장 완료`);

    // ✅ 5️⃣ 응답
    console.log(`📤 [${requestId}] 응답 생성 중...`);

    const response = {
      id: reading.id,
      question,
      spreadType,
      userId: finalUserId,
      cardsCount: cards.length,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ [${requestId}] 응답 준비 완료`);
    console.log("━".repeat(60) + "\n");

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error(`\n❌ [${requestId}] Reading 저장 에러 발생`);
    console.error("━".repeat(60));

    if (error instanceof Error) {
      console.error(`  에러 타입: ${error.constructor.name}`);
      console.error(`  메시지: ${error.message}`);
      console.error(`  스택:`, error.stack?.substring(0, 300));

      // Prisma 에러 분류
      if (error.message.includes('Unique constraint')) {
        console.error(`  원인: 중복된 데이터`);
      }
      if (error.message.includes('Foreign key constraint')) {
        console.error(`  원인: 사용자ID 또는 카드ID가 DB에 없음`);
      }
      if (error.message.includes('P2002')) {
        console.error(`  원인: 유니크 제약 조건 위반`);
      }
      if (error.message.includes('P2025')) {
        console.error(`  원인: 데이터를 찾을 수 없음`);
      }
    } else {
      console.error(`  에러:`, error);
    }

    console.error("━".repeat(60) + "\n");

    const errorMessage = error instanceof Error ? error.message : 'Reading 저장에 실패했습니다';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// ============ GET: 사용자의 Reading 조회 (선택사항) ============
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다' },
        { status: 400 }
      );
    }

    console.log(`📖 [GET] 사용자 ${userId}의 Reading 조회 시작`);

    const readings = await prisma.reading.findMany({
      where: { userId },
      include: {
        cards: {
          include: {
            card: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ [GET] ${readings.length}개 Reading 조회 완료`);

    return NextResponse.json(readings);

  } catch (error) {
    console.error('Reading 조회 에러:', error);
    return NextResponse.json(
      { error: 'Reading 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}