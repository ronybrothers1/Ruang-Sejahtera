import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createBootstrapSessionToken,
  getBootstrapAuthStatus,
  verifyBootstrapAccessKey,
} from '@/lib/auth/admin-session';
import { hasAllowedFormContentType, isDeclaredBodyWithinLimit } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

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

  if (!getBootstrapAuthStatus().configured) {
    return NextResponse.json({ error: 'Akses admin belum dikonfigurasi.' }, { status: 503 });
  }

  const form = await request.formData();
  const accessKey = String(form.get('accessKey') || '');
  if (accessKey.length > 512 || !verifyBootstrapAccessKey(accessKey)) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url), 303);
  }

  const session = createBootstrapSessionToken();
  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.cookies.set(ADMIN_SESSION_COOKIE, session.token, adminSessionCookieOptions(session.expiresAt));
  return response;
}
