// app/api/tarot/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// ============ GET: 타로 카드 조회 ============
export async function GET() {
  try {
    const cards = await prisma.tarotCard.findMany({
      orderBy: { number: 'asc' }
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('카드 조회 에러:', error);
    return NextResponse.json(
      { error: '카드를 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

// ============ POST: 타로 해석 (스트리밍) ============
export async function POST(req: NextRequest) {
  try {
    const { messages, selectedCards } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: '메시지가 필요합니다' },
        { status: 400 }
      );
    }

    // 마지막 사용자 메시지 추출
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== 'user') {
      return NextResponse.json(
        { error: '마지막 메시지는 사용자 메시지여야 합니다' },
        { status: 400 }
      );
    }

    // Gemini 모델 초기화
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 프롬프트 작성
    const systemPrompt = `당신은 신비로운 타로 카드 해석가입니다. 
    사용자의 질문에 대해 깊이 있고 영감을 주는 타로 해석을 제공하세요.
    타로 카드의 상징성과 의미를 활용하여 사용자의 인생 경로를 조명해주세요.
    응답은 한국어로 하며, 신비로운 분위기를 유지하세요.`;

    const userPrompt = `${systemPrompt}\n\n사용자 질문: ${lastUserMessage.content}`;

    // 스트리밍 응답 생성
    const stream = await model.generateContentStream(userPrompt);

    // ReadableStream 생성
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            const text = chunk.text();
            // 텍스트를 그대로 스트리밍
            controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('타로 해석 에러:', error);
    
    const errorMessage = error instanceof Error ? error.message : '타로 해석에 실패했습니다';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}