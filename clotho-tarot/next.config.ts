import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✨ CORS 에러 우회를 위한 Proxy 설정
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          // 프론트엔드에서 이 주소로 요청을 보내면
          source: '/api/server/:path*', 
          // Next.js 서버가 몰래 Vercel 서버로 토스해 줍니다
          destination: 'https://clotho-server-vyw7.vercel.app/api/:path*', 
        },
      ]
    };
  },
};

export default nextConfig;