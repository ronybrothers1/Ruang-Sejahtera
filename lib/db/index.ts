import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { isDatabaseConfigured } from '@/lib/auth/config';
import * as schema from '@/lib/db/schema';

function createDatabase() {
  if (!isDatabaseConfigured()) throw new Error('DATABASE_NOT_CONFIGURED');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
  return drizzle(pool, { schema });
}
let database: ReturnType<typeof createDatabase> | null = null;

export function getDb() {
  if (!database) database = createDatabase();
  return database;
}
