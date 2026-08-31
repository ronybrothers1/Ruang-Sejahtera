import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { getDb } from '../lib/db';

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is required.');
  }

  await migrate(getDb(), { migrationsFolder: './db/migrations' });
  console.log('Database migrations applied successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
