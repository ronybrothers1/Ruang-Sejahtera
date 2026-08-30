import { migrate } from 'drizzle-orm/neon-http/migrator';
import { getDb } from '../lib/db';

if (!process.env.DATABASE_URL?.trim()) throw new Error('DATABASE_URL is required.');

await migrate(getDb(), { migrationsFolder: './db/migrations' });
console.log('Database migrations applied successfully.');
