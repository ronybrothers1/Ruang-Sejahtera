import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { programs } from '@/lib/db/program-schema';

export async function listActivePrograms() {
  const db = getDb();
  return db.select().from(programs).where(eq(programs.isActive, true)).orderBy(asc(programs.sortOrder));
}

export async function findActiveProgramBySlug(slug: string) {
  const db = getDb();
  const rows = await db.select().from(programs).where(and(eq(programs.slug, slug), eq(programs.isActive, true))).limit(1);
  return rows[0] ?? null;
}
