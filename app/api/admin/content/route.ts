import { NextResponse } from 'next/server';
import { getAdminSession, hasControlPlaneAccess } from '@/lib/auth/admin-session';
import { can, canAccessControlPlane } from '@/lib/auth/permissions';
import { findUserByEmail, seedInitialSuperAdmin } from '@/lib/db/users';
import { hasPassedExam } from '@/lib/membership';
import { getCmsWriteStatus, persistCmsMutation } from '@/lib/cms/store';
import { CmsValidationError, isCmsCollection, parseCreateContent } from '@/lib/cms/validation';
import type { AdminSession } from '@/lib/auth/admin-session';
import type { CmsMediaInput } from '@/lib/cms/types';
import { hasAllowedFormContentType, isDeclaredBodyWithinLimit } from '@/lib/security/request-limits';
import { isSameOriginRequest } from '@/lib/security/same-origin';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_BYTES = 2_000_000;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function resolveActorId(session: AdminSession) {
  if (session.authMethod !== 'bootstrap') return session.id;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase() || '';
  if (!email) throw new Error('BOOTSTRAP_EMAIL_NOT_CONFIGURED');
  const existing = await findUserByEmail(email);
  if (existing?.role === 'super_admin' && existing.isActive && !existing.deletedAt) return existing.id;
  const admin = await seedInitialSuperAdmin({ email, fullName: 'Super Admin Ruang Sejahtera' });
  return admin.id;
}

async function readArticleImage(form: FormData): Promise<CmsMediaInput> {
  const value = form.get('imageFile');
  if (!(value instanceof File) || value.size === 0) throw new CmsValidationError('Gambar berita wajib dipilih.');
  if (!ALLOWED_IMAGE_TYPES.has(value.type)) throw new CmsValidationError('Format gambar harus JPG, PNG, atau WEBP.');
  if (value.size > MAX_IMAGE_BYTES) throw new CmsValidationError('Ukuran gambar maksimal 2 MB.');

  const altText = String(form.get('imageAlt') || '').trim();
  if (!altText) throw new CmsValidationError('Teks alternatif gambar wajib diisi.');
  if (altText.length > 160) throw new CmsValidationError('Teks alternatif gambar terlalu panjang.');
  const caption = String(form.get('imageCaption') || '').trim();
  if (caption.length > 240) throw new CmsValidationError('Keterangan gambar terlalu panjang.');

  const bytes = Buffer.from(await value.arrayBuffer());
  return {
    externalUrl: `data:${value.type};base64,${bytes.toString('base64')}`,
    mimeType: value.type,
    byteSize: value.size,
    altText,
    caption: caption || undefined,
  };
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  if (!isDeclaredBodyWithinLimit(request, 3_500_000)) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Autentikasi diperlukan.' }, { status: 401 });
  if (session.role === 'member') {
    if (!session.identityProviderId || !(await hasPassedExam(session.id))) {
      return NextResponse.json({ error: 'Anggota harus lulus tes sebelum mengirim berita.' }, { status: 403 });
    }
  } else if (!canAccessControlPlane(session.role) || !(await hasControlPlaneAccess(session))) {
    return NextResponse.json({ error: 'Akses control plane belum disetujui.' }, { status: 403 });
  }
  if (!can(session.role, 'content.create')) return NextResponse.json({ error: 'Tidak memiliki izin.' }, { status: 403 });

  const form = await request.formData();
  const collectionValue = String(form.get('collection') || '');
  const intent = String(form.get('intent') || '');
  if (!isCmsCollection(collectionValue) || intent !== 'create') return NextResponse.json({ error: 'Operasi tidak valid.' }, { status: 400 });

  try {
    const actorId = await resolveActorId(session);
    const record = parseCreateContent(collectionValue, form, actorId);
    const media = collectionValue === 'articles' ? await readArticleImage(form) : undefined;
    const status = getCmsWriteStatus();
    if (!status.configured) return NextResponse.json({ error: 'Backend tulis CMS belum dikonfigurasi.' }, { status: 503 });
    await persistCmsMutation({ collection: collectionValue, action: 'create', records: [record], media });
    return NextResponse.redirect(new URL('/admin/konten?queued=1', request.url), 303);
  } catch (error) {
    if (error instanceof CmsValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Penyimpanan konten gagal.' }, { status: 503 });
  }
}
