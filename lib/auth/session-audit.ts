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
  if (!user) return;

  await getDb().insert(auditLogs).values({
    actorUserId: user.id,
    actorRole: user.role,
    action: input.action,
    resourceType: 'session',
    resourceId: input.sessionId,
    metadata: { provider: 'clerk' },
  });
}
