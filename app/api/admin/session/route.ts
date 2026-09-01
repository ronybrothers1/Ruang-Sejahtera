import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createBootstrapSessionToken,
  getBootstrapAuthStatus,
  verifyBootstrapAccessKey,
} from '@/lib/auth/admin-session';
import { hasAllowedFormContentType, readFormDataWithinLimit, RequestBodyTooLargeError } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';
import { checkAdminLoginRateLimit, clearAdminLoginFailures, recordAdminLoginFailure } from '@/lib/security/admin-login-rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  }
  if (!hasAllowedFormContentType(request)) {
    return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  }

  if (!getBootstrapAuthStatus().configured) {
    return NextResponse.json({ error: 'Akses admin belum dikonfigurasi.' }, { status: 503 });
  }

  const rateLimit = await checkAdminLoginRateLimit(request);
  if (!rateLimit.allowed) {
    const response = NextResponse.json({ error: 'Terlalu banyak percobaan. Silakan coba lagi nanti.' }, { status: 429 });
    response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds || 60));
    return response;
  }

  let form: FormData;
  try {
    form = await readFormDataWithinLimit(request, 8_192);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });
    return NextResponse.json({ error: 'Formulir tidak valid.' }, { status: 400 });
  }
  const accessKey = String(form.get('accessKey') || '');
  if (accessKey.length > 512 || !verifyBootstrapAccessKey(accessKey)) {
    await recordAdminLoginFailure(request);
    return NextResponse.redirect(new URL('/admin/login?error=invalid', request.url), 303);
  }

  await clearAdminLoginFailures(request);
  const session = createBootstrapSessionToken();
  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.cookies.set(ADMIN_SESSION_COOKIE, session.token, adminSessionCookieOptions(session.expiresAt));
  return response;
}
