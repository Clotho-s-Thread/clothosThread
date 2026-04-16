import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  console.log("🔵 프로필 수정 요청 받음");
  try {
    const body = await req.json();
    const { email, name, profileImage } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "이메일이 필요합니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // DB에서 유저 찾기
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "사용자를 찾을 수 없습니다." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 프로필 업데이트
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: name || user.name,
        image: profileImage || user.image,
      },
    });

    console.log("✅ 프로필 수정 완료:", updatedUser.name);

    return new Response(
      JSON.stringify({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.image,
        message: "프로필이 수정되었습니다.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 프로필 수정 에러:", error);
    return new Response(
      JSON.stringify({ error: "서버 에러" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}