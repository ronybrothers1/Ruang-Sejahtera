import { createHash } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { findUserByIdentityProviderId } from '@/lib/db/users';

export type IdentitySessionAuditAction = 'identity.login' | 'identity.logout' | 'identity.session_revoked';

function identityProviderIdHash(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

async function identityWasDeleted(identityProviderId: string) {
  const hash = identityProviderIdHash(identityProviderId);
  const rows = await getDb().select({ id: auditLogs.id })
    .from(auditLogs)
    .where(and(
      eq(auditLogs.action, 'identity.user_deleted'),
      eq(auditLogs.resourceType, 'user'),
      sql`${auditLogs.metadata}->>'identityProviderIdHash' = ${hash}`,
    ))
    .limit(1);
  return Boolean(rows[0]);
}

export async function auditIdentitySession(input: {
  identityProviderId: string;
  sessionId: string;
  action: IdentitySessionAuditAction;
}) {
  const user = await findUserByIdentityProviderId(input.identityProviderId);
  if (!user) {
    // A terminal session event may legitimately arrive after Clerk's user.deleted
    // event has already unlinked the external identity. The deletion audit proves
    // that this identity was known and intentionally removed, so no retry is needed.
    if (input.action !== 'identity.login' && await identityWasDeleted(input.identityProviderId)) return;

    // Otherwise the most likely cause is webhook ordering: ask Clerk to retry after
    // user.created/user.updated (or synchronous session sync) persists the user.
    throw new Error('SESSION_AUDIT_USER_NOT_SYNCED');
  }

  const db = getDb();
  const existing = await db.select({ id: auditLogs.id })
    .from(auditLogs)
    .where(and(
      eq(auditLogs.action, input.action),
      eq(auditLogs.resourceType, 'session'),
      eq(auditLogs.resourceId, input.sessionId),
    ))
    .limit(1);

  if (existing[0]) return;

  await db.insert(auditLogs).values({
    actorUserId: user.id,
    actorRole: user.role,
    action: input.action,
    resourceType: 'session',
    resourceId: input.sessionId,
    metadata: { provider: 'clerk' },
  });
}
