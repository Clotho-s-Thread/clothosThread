// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: "postgresql://postgres.ottedgwhxjwilfohxmbw:ClothoThread1234@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres",
  },
});