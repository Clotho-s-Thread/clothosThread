// src/global.d.ts 또는 global.ts

import { PrismaClient } from "@prisma/client";

// TypeScript의 'global' 네임스페이스를 확장합니다.
declare global {
  // global.prisma의 타입을 정의합니다.
  // 이 속성은 undefined일 수도 있거나, PrismaClient를 반환하는 함수의 타입일 수 있습니다.
  var prisma: PrismaClient | undefined; 
}

// 이 파일은 모듈로 작동하기 위해 export가 하나 이상 있어야 합니다.
export {};