import { NextResponse } from 'next/server';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { requireSuperAdminSession } from '@/lib/auth/admin-session';
import { createCoreManager, findUserByEmail } from '@/lib/db/users';
import { hasAllowedFormContentType, isDeclaredBodyWithinLimit } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

function redirectToSystem(request: Request, status: string) {
  const url = new URL('/admin/sistem', request.url);
  url.searchParams.set('manager', status);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  }
  if (!hasAllowedFormContentType(request)) {
    return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  }
  if (!isDeclaredBodyWithinLimit(request, 8_192)) {
    return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });
  }

  const session = await requireSuperAdminSession();
  if (!isDatabaseConfigured()) return redirectToSystem(request, 'database');

  try {
    const form = await request.formData();
    const fullName = String(form.get('fullName') || '');
    const email = String(form.get('email') || '');

    let actorUserId: string | null = session.authMethod === 'clerk' ? session.id : null;
    if (session.authMethod === 'bootstrap') {
      const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim() || '';
      const bootstrapUser = bootstrapEmail ? await findUserByEmail(bootstrapEmail) : null;
      actorUserId = bootstrapUser?.role === 'super_admin' ? bootstrapUser.id : null;
    }

    await createCoreManager({ fullName, email, actorUserId });
    return redirectToSystem(request, 'created');
  } catch (error) {
    const reason = error instanceof Error ? error.message : '';
    const status = reason === 'CORE_MANAGER_INPUT_INVALID'
      ? 'invalid'
      : reason === 'CORE_MANAGER_EMAIL_RESERVED'
        ? 'reserved'
        : reason === 'CORE_MANAGER_MEMBERSHIP_BLOCKED'
          ? 'blocked'
          : 'error';
    return redirectToSystem(request, status);
  }
}
