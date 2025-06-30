import { Pool } from '@neondatabase/serverless';

// Optional: enable web fetch if needed for edge environments

const globalForPool = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForPool.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') globalForPool.pool = pool;
