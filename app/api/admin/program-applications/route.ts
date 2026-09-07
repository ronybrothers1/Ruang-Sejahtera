import { NextResponse } from 'next/server';
import { getAdminSession, hasControlPlaneAccess } from '@/lib/auth/admin-session';
import { can } from '@/lib/auth/permissions';
import { getProgramApplication, reviewProgramApplication, type ApplicationStatus } from '@/lib/program-applications';
import { hasAllowedFormContentType, isDeclaredBodyWithinLimit } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  if (!isDeclaredBodyWithinLimit(request, 100_000)) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });

  const session = await getAdminSession();
  if (!session || !can(session.role, 'membership.review') || !(await hasControlPlaneAccess(session))) {
    return NextResponse.json({ error: 'Akses reviewer diperlukan.' }, { status: 403 });
  }

  const form = await request.formData();
  const id = String(form.get('id') || '').trim();
  const status = String(form.get('status') || '') as Exclude<ApplicationStatus, 'submitted'>;
  const allowed = new Set<ApplicationStatus>(['under_review', 'revision_required', 'approved', 'rejected']);
  if (!id || !allowed.has(status)) return NextResponse.json({ error: 'Data review tidak valid.' }, { status: 400 });

  try {
    const existing = await getProgramApplication(id);
    if (!existing) return NextResponse.json({ error: 'Pengajuan tidak ditemukan.' }, { status: 404 });
    await reviewProgramApplication({
      id,
      reviewerUserId: session.id,
      reviewerRole: session.role,
      status,
      reviewNote: String(form.get('reviewNote') || '').trim(),
    });
    return NextResponse.redirect(new URL('/admin/pengajuan?reviewed=1', request.url), 303);
  } catch {
    return NextResponse.json({ error: 'Review pengajuan gagal disimpan.' }, { status: 503 });
  }
}
