import { PrismaClient } from '@prisma/client';

// 전역 변수에 담아두는 로직 (Next.js에서 필수)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // 로그를 켜서 쿼리 확인
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;