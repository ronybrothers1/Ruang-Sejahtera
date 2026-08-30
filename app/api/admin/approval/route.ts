import { NextResponse } from 'next/server';
import {
  CONTROL_PLANE_APPROVAL_COOKIE,
  createControlPlaneApprovalToken,
  controlPlaneApprovalCookieOptions,
  getControlPlaneSecurityStatus,
  verifyControlPlaneApprovalKey,
} from '@/lib/auth/control-plane-gate';
import { getAdminSession } from '@/lib/auth/admin-session';
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

  const session = await getAdminSession();
  if (!session || session.authMethod !== 'clerk' || session.role !== 'super_admin' || !session.identityProviderId || !session.sessionId) {
    return NextResponse.json({ error: 'Autentikasi Super Admin diperlukan.' }, { status: 403 });
  }

  const security = getControlPlaneSecurityStatus();
  if (security.mode !== 'approval' || !security.configured || security.configurationError) {
    return NextResponse.json({ error: 'Approval sementara belum dikonfigurasi.' }, { status: 503 });
  }

  const form = await request.formData();
  const approvalKey = String(form.get('approvalKey') || '');
  if (approvalKey.length > 512 || !verifyControlPlaneApprovalKey(approvalKey)) {
    return NextResponse.redirect(new URL('/admin/approval?error=invalid', request.url), 303);
  }

  const approval = createControlPlaneApprovalToken({
    subject: session.identityProviderId,
    sessionId: session.sessionId,
  });
  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.cookies.set(
    CONTROL_PLANE_APPROVAL_COOKIE,
    approval.token,
    controlPlaneApprovalCookieOptions(approval.expiresAt),
  );
  return response;
}
