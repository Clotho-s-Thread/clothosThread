import type { Metadata } from "next";
import { Cinzel, Playfair_Display } from "next/font/google";
import './globals.css';

// 1. Cinzel 폰트 설정 (신비로운 제목용)
const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-cinzel', // Tailwind에서 쓸 이름
});

// 2. Playfair Display 폰트 설정 (우아한 본문용)
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  style: ['normal', 'italic'], // 이탤릭체도 사용하므로 추가
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
    // 3. body 태그에 두 폰트의 변수를 적용해 줍니다.
    <html lang="ko">
      <body className={`${cinzel.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}