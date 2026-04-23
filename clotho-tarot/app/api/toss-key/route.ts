import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });
}