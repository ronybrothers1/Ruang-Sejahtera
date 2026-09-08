import { and, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { findUserByIdentityProviderId } from '@/lib/db/users';

export type IdentitySessionAuditAction = 'identity.login' | 'identity.logout' | 'identity.session_revoked';

export async function auditIdentitySession(input: {
  identityProviderId: string;
  sessionId: string;
  action: IdentitySessionAuditAction;
}) {
  const user = await findUserByIdentityProviderId(input.identityProviderId);
  if (!user) {
    // Clerk webhook delivery is asynchronous and event order is not guaranteed.
    // Failing here lets the webhook endpoint return 503 so Clerk can retry after
    // the user.created/user.updated event (or synchronous session sync) persists
    // the application user.
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
