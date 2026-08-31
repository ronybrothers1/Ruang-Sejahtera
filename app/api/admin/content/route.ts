import { NextResponse } from 'next/server';
import { getAdminSession, hasControlPlaneAccess } from '@/lib/auth/admin-session';
import { can, canAccessControlPlane, canEditContent } from '@/lib/auth/permissions';
import { findUserByEmail, seedInitialSuperAdmin } from '@/lib/db/users';
import { hasPassedExam } from '@/lib/membership';
import { getCmsWriteStatus, listCmsRecords, persistCmsMutation } from '@/lib/cms/store';
import { CmsValidationError, isCmsCollection, parseCreateContent, parseUpdateContent } from '@/lib/cms/validation';
import { canTransitionPublication } from '@/lib/cms/workflow';
import type { AdminSession } from '@/lib/auth/admin-session';
import type { CmsMediaInput, CmsRecord } from '@/lib/cms/types';
import { publicationStatuses } from '@/lib/cms/types';
import type { PublicationStatus } from '@/lib/models';
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

function collectionForRecord(record: CmsRecord) {
  if ('category' in record) return 'articles' as const;
  if ('programSlug' in record) return 'activities' as const;
  return 'galleries' as const;
}

function redirectWith(request: Request, query: string) {
  return NextResponse.redirect(new URL(`/admin/konten?${query}`, request.url), 303);
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Permintaan ditolak.' }, { status: 403 });
  if (!hasAllowedFormContentType(request)) return NextResponse.json({ error: 'Content-Type tidak didukung.' }, { status: 415 });
  if (!isDeclaredBodyWithinLimit(request, 3_500_000)) return NextResponse.json({ error: 'Payload terlalu besar.' }, { status: 413 });

  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Autentikasi diperlukan.' }, { status: 401 });

  const form = await request.formData();
  const collectionValue = String(form.get('collection') || '');
  const intent = String(form.get('intent') || '');
  if (!isCmsCollection(collectionValue)) return NextResponse.json({ error: 'Collection tidak valid.' }, { status: 400 });
  const status = getCmsWriteStatus();
  if (!status.configured) return NextResponse.json({ error: 'Backend tulis CMS belum dikonfigurasi.' }, { status: 503 });

  try {
    const actorId = await resolveActorId(session);

    if (intent === 'create') {
      if (session.role === 'member') {
        if (!session.identityProviderId || !(await hasPassedExam(session.id))) {
          return NextResponse.json({ error: 'Anggota harus lulus tes sebelum mengirim berita.' }, { status: 403 });
        }
      } else if (!canAccessControlPlane(session.role) || !(await hasControlPlaneAccess(session))) {
        return NextResponse.json({ error: 'Akses control plane belum disetujui.' }, { status: 403 });
      }
      if (!can(session.role, 'content.create')) return NextResponse.json({ error: 'Tidak memiliki izin.' }, { status: 403 });
      const record = parseCreateContent(collectionValue, form, actorId);
      const media = collectionValue === 'articles' ? await readArticleImage(form) : undefined;
      await persistCmsMutation({ collection: collectionValue, action: 'create', records: [record], media, actorRole: session.role });
      return redirectWith(request, 'queued=1');
    }

    if (!canAccessControlPlane(session.role) || !(await hasControlPlaneAccess(session))) {
      return NextResponse.json({ error: 'Akses control plane belum disetujui.' }, { status: 403 });
    }
    const id = String(form.get('id') || '').trim();
    const records = await listCmsRecords();
    const record = records.find((item) => item.id === id);
    if (!record) return redirectWith(request, 'error=record-not-found');

    if (intent === 'update') {
      if (!canEditContent(session.role, record.lastEditedBy, actorId)) {
        return NextResponse.json({ error: 'Tidak memiliki izin mengedit konten ini.' }, { status: 403 });
      }
      const updatedRecord = parseUpdateContent(collectionValue, form, actorId, record);
      const imageValue = form.get('imageFile');
      const media = collectionValue === 'articles' && imageValue instanceof File && imageValue.size > 0
        ? await readArticleImage(form)
        : undefined;
      await persistCmsMutation({ collection: collectionValue, action: 'update', records: [updatedRecord], media, actorRole: session.role });
      return redirectWith(request, 'updated=1');
    }

    if (intent === 'transition') {
      const toStatusValue = String(form.get('toStatus') || '');
      if (!publicationStatuses.includes(toStatusValue as PublicationStatus)) return redirectWith(request, 'error=transition-invalid');
      if (!canTransitionPublication(session.role, record.status, toStatusValue as PublicationStatus)) {
        return NextResponse.json({ error: 'Transisi publikasi tidak diizinkan.' }, { status: 403 });
      }
      const nextRecord = { ...record, status: toStatusValue as PublicationStatus, lastEditedBy: actorId };
      await persistCmsMutation({ collection: collectionForRecord(record), action: 'transition', records: [nextRecord], actorRole: session.role });
      return redirectWith(request, 'transitioned=1');
    }

    if (intent === 'delete') {
      if (!can(session.role, 'content.delete_any')) return NextResponse.json({ error: 'Tidak memiliki izin.' }, { status: 403 });
      await persistCmsMutation({ collection: collectionForRecord(record), action: 'delete', records: [{ ...record, lastEditedBy: actorId }], actorRole: session.role });
      return redirectWith(request, 'deleted=1');
    }

    return NextResponse.json({ error: 'Operasi tidak valid.' }, { status: 400 });
  } catch (error) {
    if (error instanceof CmsValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Penyimpanan konten gagal.' }, { status: 503 });
  }
}
