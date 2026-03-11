import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // ▼ 안드로이드/외부 접속 허용 설정 (500 에러 해결 시도)
  experimental: {
    serverActions: {
      allowedOrigins: ["*"], // 모든 주소에서 접속 허용
    },
  },

  // 혹시 나중에 이미지를 쓴다면 이런 설정도 필요할 수 있음 (참고용)
  // images: { unoptimized: true }, 
};

export default nextConfig;