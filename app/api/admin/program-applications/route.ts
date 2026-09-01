import { NextResponse } from 'next/server';
import { getAdminSession, hasControlPlaneAccess } from '@/lib/auth/admin-session';
import { can } from '@/lib/auth/permissions';
import { findUserByEmail, seedInitialSuperAdmin } from '@/lib/db/users';
import { getProgramApplication, reviewProgramApplication, type ApplicationStatus } from '@/lib/program-applications';
import type { AdminSession } from '@/lib/auth/admin-session';
import { hasAllowedFormContentType, readFormDataWithinLimit, RequestBodyTooLargeError } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

async function resolveActorId(session: AdminSession) {
  if (session.authMethod !== 'bootstrap') return session.id;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase() || '';
  const existing = email ? await findUserByEmail(email) : null;
  if (existing?.role === 'super_admin' && existing.isActive && !existing.deletedAt) return existing.id;
  const admin = await seedInitialSuperAdmin({ email, fullName: 'Super Admin Ruang Sejahtera' });
  return admin.id;
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });

  const session = await getAdminSession();
  if (!session || !can(session.role, 'membership.review') || !(await hasControlPlaneAccess(session))) {
    return NextResponse.json({ error: 'Akses reviewer diperlukan.' }, { status: 403 });
  }

  let form: FormData;
  try {
    form = await readFormDataWithinLimit(request, 100_000);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });
    return NextResponse.json({ error: 'Formulir tidak valid.' }, { status: 400 });
  }
  const id = String(form.get('id') || '').trim();
  const status = String(form.get('status') || '') as Exclude<ApplicationStatus, 'submitted'>;
  const allowed = new Set<ApplicationStatus>(['under_review', 'revision_required', 'approved', 'rejected']);
  if (!id || !allowed.has(status)) return NextResponse.json({ error: 'Data review tidak valid.' }, { status: 400 });

  try {
    const existing = await getProgramApplication(id);
    if (!existing) return NextResponse.json({ error: 'Pengajuan tidak ditemukan.' }, { status: 404 });
    const reviewerUserId = await resolveActorId(session);
    await reviewProgramApplication({
      id,
      reviewerUserId,
      reviewerRole: session.role,
      status,
      reviewNote: String(form.get('reviewNote') || '').trim(),
    });
    return NextResponse.redirect(new URL('/admin/pengajuan?reviewed=1', request.url), 303);
  } catch (error) {
    const reason = error instanceof Error ? error.message : '';
    if (reason === 'APPLICATION_NOTE_REQUIRED') return NextResponse.json({ error: 'Catatan wajib untuk permintaan perbaikan atau penolakan.' }, { status: 400 });
    if (reason === 'APPLICATION_TRANSITION_NOT_ALLOWED') return NextResponse.json({ error: 'Status pengajuan sudah berubah dan tidak dapat ditimpa.' }, { status: 409 });
    return NextResponse.json({ error: 'Review pengajuan gagal disimpan.' }, { status: 503 });
  }
}
