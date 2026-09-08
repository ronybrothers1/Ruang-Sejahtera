import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextResponse, type NextRequest } from 'next/server';
import { deactivateIdentityUser } from '@/lib/db/users';
import { syncClerkUser } from '@/lib/auth/identity-sync';
import { auditIdentitySession } from '@/lib/auth/session-audit';
import { isDatabaseConfigured } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Database belum dikonfigurasi.' }, { status: 503 });

  let event: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json({ error: 'Signature webhook tidak valid.' }, { status: 400 });
  }

  try {
    if (event.type === 'user.created' || event.type === 'user.updated') {
      await syncClerkUser(event.data);
    } else if (event.type === 'user.deleted' && event.data.id) {
      await deactivateIdentityUser(event.data.id);
    } else if (event.type === 'session.created') {
      await auditIdentitySession({
        identityProviderId: event.data.user_id,
        sessionId: event.data.id,
        action: 'identity.login',
      });
    } else if (event.type === 'session.ended') {
      await auditIdentitySession({
        identityProviderId: event.data.user_id,
        sessionId: event.data.id,
        action: 'identity.logout',
      });
    } else if (event.type === 'session.revoked') {
      await auditIdentitySession({
        identityProviderId: event.data.user_id,
        sessionId: event.data.id,
        action: 'identity.session_revoked',
      });
    }

    return NextResponse.json({ received: true });
  } catch {
    // Return a retryable server error for persistence/synchronization failures.
    // This deliberately differs from signature failures, which are permanent 400s.
    return NextResponse.json({ error: 'Pemrosesan webhook belum berhasil.' }, { status: 503 });
  }
}
