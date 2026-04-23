import type { Metadata } from "next";
import { Cinzel, Playfair_Display } from "next/font/google";
import './globals.css';
import Script from "next/script";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 5분마다 캐시 정리
setInterval(async () => {
  try {
    await prisma.$executeRawUnsafe('DEALLOCATE ALL;');
    console.log('✅ Prepared statements 정리 완료');
  } catch (error) {
    console.error('⚠️ 정리 실패:', error);
  }
}, 5 * 60 * 1000);

// 1. Cinzel 폰트 설정 (신비로운 제목용)
const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-cinzel',
});

// 2. Playfair Display 폰트 설정 (우아한 본문용)
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Clotho | The Digital Oracle",
  description: "운명의 실타래를 읽는 디지털 타로 오라클",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
    <head>
      <Script 
        src="https://js.tosspayments.com/v1/payment-widget.js"
        strategy="beforeInteractive"
      />
      <Script 
        src="https://js.tosspayments.com/v1/payment.js"
        strategy="beforeInteractive"
      />
    </head>
      <body className={`${cinzel.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}