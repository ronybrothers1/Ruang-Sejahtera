import { createHash, createHmac } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { getDb } from '@/lib/db';
import { adminLoginAttempts } from '@/lib/db/schema';

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

function requestFingerprint(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address = forwarded || request.headers.get('x-real-ip')?.trim() || 'unknown-address';
  const material = address;
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  return secret
    ? createHmac('sha256', secret).update(material).digest('hex')
    : createHash('sha256').update(material).digest('hex');
}

export type AdminLoginRateLimit = {
  allowed: boolean;
  retryAfterSeconds?: number;
};

export async function checkAdminLoginRateLimit(request: Request): Promise<AdminLoginRateLimit> {
  if (!isDatabaseConfigured()) {
    return process.env.NODE_ENV === 'production' ? { allowed: false, retryAfterSeconds: 60 } : { allowed: true };
  }

  const keyHash = requestFingerprint(request);
  const row = (await getDb().select().from(adminLoginAttempts).where(eq(adminLoginAttempts.keyHash, keyHash)).limit(1))[0];
  if (!row?.blockedUntil || row.blockedUntil.getTime() <= Date.now()) return { allowed: true };
  return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((row.blockedUntil.getTime() - Date.now()) / 1000)) };
}

export async function recordAdminLoginFailure(request: Request) {
  if (!isDatabaseConfigured()) return;
  const db = getDb();
  const keyHash = requestFingerprint(request);
  const now = new Date();
  const windowStartedAt = new Date(now.getTime() - WINDOW_MS);
  const blockedUntil = new Date(now.getTime() + BLOCK_MS);

  await db.insert(adminLoginAttempts).values({
    keyHash,
    failures: 1,
    windowStartedAt: now,
  }).onConflictDoUpdate({
    target: adminLoginAttempts.keyHash,
    set: {
      failures: sql`CASE WHEN ${adminLoginAttempts.windowStartedAt} <= ${windowStartedAt} THEN 1 ELSE ${adminLoginAttempts.failures} + 1 END`,
      windowStartedAt: sql`CASE WHEN ${adminLoginAttempts.windowStartedAt} <= ${windowStartedAt} THEN ${now} ELSE ${adminLoginAttempts.windowStartedAt} END`,
      blockedUntil: sql`CASE WHEN ${adminLoginAttempts.windowStartedAt} <= ${windowStartedAt} THEN NULL WHEN ${adminLoginAttempts.failures} + 1 >= ${MAX_FAILURES} THEN ${blockedUntil} ELSE ${adminLoginAttempts.blockedUntil} END`,
      updatedAt: now,
    },
  });
}

export async function clearAdminLoginFailures(request: Request) {
  if (!isDatabaseConfigured()) return;
  await getDb().delete(adminLoginAttempts).where(eq(adminLoginAttempts.keyHash, requestFingerprint(request)));
}
