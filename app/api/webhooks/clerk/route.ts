import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextResponse, type NextRequest } from 'next/server';
import { deactivateIdentityUser } from '@/lib/db/users';
import { syncClerkUser } from '@/lib/auth/identity-sync';
import { isDatabaseConfigured } from '@/lib/auth/config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: 'Database belum dikonfigurasi.' }, { status: 503 });

  try {
    const event = await verifyWebhook(request);
    if (event.type === 'user.created' || event.type === 'user.updated') {
      await syncClerkUser(event.data);
    } else if (event.type === 'user.deleted' && event.data.id) {
      await deactivateIdentityUser(event.data.id);
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Signature webhook tidak valid.' }, { status: 400 });
  }
}
