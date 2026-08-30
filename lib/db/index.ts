import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { isDatabaseConfigured } from '@/lib/auth/config';
import * as schema from '@/lib/db/schema';

function createDatabase() {
  if (!isDatabaseConfigured()) throw new Error('DATABASE_NOT_CONFIGURED');
  const sql = neon(process.env.DATABASE_URL as string);
  return drizzle(sql, { schema });
}
let database: ReturnType<typeof createDatabase> | null = null;

export function getDb() {
  if (!database) database = createDatabase();
  return database;
}
