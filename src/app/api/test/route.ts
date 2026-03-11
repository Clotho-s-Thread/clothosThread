import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // [수정 포인트 1] prisma.post -> prisma.user 로 변경
    // (이유: 우리 DB에는 post 테이블은 없고 user 테이블만 있으니까요!)
    console.log("내 Prisma 안에 있는 모델들:", Object.keys(prisma)); 
    
    const userCount = await prisma.user.count();
    
    return Response.json({ 
      status: "DB Connection Successful",
      // [수정 포인트 2] 결과 메시지도 posts -> users 로 변경 (보기 좋게)
      message: `Total users found: ${userCount}`,
      db_status: "OK"
    }, { status: 200 });

  } catch (error) {
  // ▼▼▼ 이 줄을 꼭 추가하세요! 터미널에 에러 내용을 출력하는 명령어입니다. ▼▼▼
  console.error("🚨 앱 연결 에러 발생:", error); 

  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
  return Response.json({ status: "DB Connection Failed", error: errorMessage }, { status: 500 });
  }
}