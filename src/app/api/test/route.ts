// src/app/api/test/route.ts

import prisma from '@/lib/prisma'; // 또는 위에서 생성한 PrismaClient 인스턴스를 가져옵니다.

export async function GET(request: Request) {
  try {
    const postCount = await prisma.post.count();
    
    return Response.json({ 
      status: "DB Connection Successful",
      message: `Total posts found: ${postCount}`,
      db_status: "OK"
    }, { status: 200 });

  } catch (error) {
    // ... 오류 처리 로직
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return Response.json({ status: "DB Connection Failed", error: errorMessage }, { status: 500 });
  }
}
