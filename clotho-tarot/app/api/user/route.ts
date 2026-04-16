import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return new Response(
        JSON.stringify({ error: "이메일이 필요합니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // DB에서 유저 정보 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "사용자를 찾을 수 없습니다." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log('✅ 유저 정보 조회:', user.name);

    return new Response(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        point: user.point,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 유저 조회 에러:", error);
    return new Response(
      JSON.stringify({ error: "서버 에러" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}