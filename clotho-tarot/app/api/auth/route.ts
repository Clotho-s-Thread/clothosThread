import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
export async function POST(req: Request) {
  console.log("🔵 POST 요청 받음");
  try {
    const body = await req.json();
    console.log("📦 요청 바디:", body);
    
    const { email, password, type } = body;
 
    if (!email || !password) {
      console.log("❌ 이메일 또는 비밀번호 없음");
      return new Response(JSON.stringify({ error: "정보를 모두 입력해주세요." }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
 
    // 회원가입
    if (type === 'signup') {
      console.log("📝 회원가입 시도:", email);
      const existingUser = await prisma.user.findUnique({ where: { email } });
      
      if (existingUser) {
        console.log("❌ 이미 가입된 계정");
        return new Response(JSON.stringify({ error: "이미 가입된 계정입니다." }), { 
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
 
      const newUser = await prisma.user.create({
        data: { 
          email, 
          password, 
          name: email.split("@")[0] 
        }
      });
      
      console.log("✅ 회원가입 성공");
      return new Response(JSON.stringify({ email: newUser.email, message: "가입 성공" }), { 
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    }
 
    // 로그인
    if (type === 'login') {
      console.log("🔐 로그인 시도:", email);
      const user = await prisma.user.findUnique({ where: { email } });
      console.log("👤 찾은 유저:", user);
      
      if (!user || user.password !== password) {
        return new Response(JSON.stringify({ error: "이메일 또는 비밀번호가 틀렸습니다." }), { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      console.log("✅ 로그인 성공");
      return new Response(JSON.stringify({ email: user.email, name: user.name }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
 
    return new Response(JSON.stringify({ error: "잘못된 요청 타입" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
 
  } catch (error) {
    console.error("💥 서버 에러:", error);
    return new Response(JSON.stringify({ error: "서버 에러" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}