// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 1. 글로벌 객체에 prisma 타입을 선언합니다.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. 이미 있으면 그것을 쓰고, 없으면 새로 생성합니다. (싱글톤의 핵심)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // 터미널에서 SQL 쿼리를 볼 수 있어 개발에 유리합니다.
  });

// 3. 개발 환경(development)에서만 글로벌 객체에 담아 재사용합니다.
// 프로덕션(production)에서는 Next.js가 인스턴스를 하나만 유지하므로 안전합니다.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;