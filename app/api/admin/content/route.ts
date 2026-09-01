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
import { deleteStoredImage, storeValidatedImage, validateImageFile } from '@/lib/security/image-upload';
import { parseExternalVideoUrl } from '@/lib/security/external-video';

export const dynamic = 'force-dynamic';

async function resolveActorId(session: AdminSession) {
  if (session.authMethod !== 'bootstrap') return session.id;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase() || '';
  if (!email) throw new Error('BOOTSTRAP_EMAIL_NOT_CONFIGURED');
  const existing = await findUserByEmail(email);
  if (existing?.role === 'super_admin' && existing.isActive && !existing.deletedAt) return existing.id;
  const admin = await seedInitialSuperAdmin({ email, fullName: 'Super Admin Ruang Sejahtera' });
  return admin.id;
}

async function readArticleImage(form: FormData, ownerId: string): Promise<CmsMediaInput> {
  const value = form.get('imageFile');
  if (!(value instanceof File) || value.size === 0) throw new CmsValidationError('Gambar berita wajib dipilih.');

  const altText = String(form.get('imageAlt') || '').trim();
  if (!altText) throw new CmsValidationError('Teks alternatif gambar wajib diisi.');
  if (altText.length > 160) throw new CmsValidationError('Teks alternatif gambar terlalu panjang.');
  const caption = String(form.get('imageCaption') || '').trim();
  if (caption.length > 240) throw new CmsValidationError('Keterangan gambar terlalu panjang.');

  let image;
  try {
    image = await validateImageFile(value);
  } catch (error) {
    const reason = error instanceof Error ? error.message : '';
    if (reason === 'IMAGE_FILE_INVALID') throw new CmsValidationError('Ukuran gambar harus lebih dari 0 dan maksimal 2 MB.');
    if (reason === 'IMAGE_DIMENSIONS_INVALID') throw new CmsValidationError('Dimensi gambar terlalu besar.');
    throw new CmsValidationError('Isi file tidak cocok dengan format JPG, PNG, atau WEBP.');
  }
  const stored = await storeValidatedImage({ image, ownerId, visibility: 'public' });
  return {
    type: 'image',
    objectKey: stored.objectKey,
    externalUrl: stored.externalUrl,
    mimeType: stored.mimeType,
    byteSize: stored.byteSize,
    width: stored.width,
    height: stored.height,
    altText,
    caption: caption || undefined,
    visibility: 'public',
    consentStatus: 'not_required',
    malwareScanStatus: 'signature_validated',
  };
}

async function readActivityMedia(form: FormData, ownerId: string): Promise<CmsMediaInput[]> {
  const media: CmsMediaInput[] = [];
  const imageValue = form.get('imageFile');
  if (imageValue instanceof File && imageValue.size > 0) {
    const altText = String(form.get('imageAlt') || '').trim();
    if (!altText || altText.length > 160) throw new CmsValidationError('Teks alternatif gambar kegiatan wajib diisi dan maksimal 160 karakter.');
    const caption = String(form.get('imageCaption') || '').trim();
    if (caption.length > 240) throw new CmsValidationError('Keterangan gambar terlalu panjang.');
    let image;
    try {
      image = await validateImageFile(imageValue);
    } catch {
      throw new CmsValidationError('Isi file kegiatan tidak cocok dengan format JPG, PNG, atau WEBP.');
    }
    const stored = await storeValidatedImage({ image, ownerId, visibility: 'public' });
    media.push({ type: 'image', objectKey: stored.objectKey, externalUrl: stored.externalUrl, mimeType: stored.mimeType, byteSize: stored.byteSize, width: stored.width, height: stored.height, altText, caption: caption || undefined, visibility: 'public', consentStatus: 'not_required', malwareScanStatus: 'signature_validated' });
  }

  const videoValue = String(form.get('videoUrl') || '').trim();
  if (videoValue) {
    const video = parseExternalVideoUrl(videoValue);
    if (!video) throw new CmsValidationError('URL video hanya boleh berasal dari TikTok atau Instagram dan harus berupa URL HTTPS yang valid.');
    media.push({ type: 'external_video', objectKey: null, externalUrl: video.sourceUrl, mimeType: 'text/uri-list', byteSize: 0, width: null, height: null, altText: `Video dokumentasi kegiatan dari ${video.provider}`, visibility: 'public', consentStatus: 'not_required', malwareScanStatus: 'url_validated' });
  }
  return media;
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

  let uploadedObjectKeys: string[] = [];
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
      const media = collectionValue === 'articles' ? [await readArticleImage(form, actorId)] : collectionValue === 'activities' ? await readActivityMedia(form, actorId) : [];
      uploadedObjectKeys = media.flatMap((item) => item.objectKey ? [item.objectKey] : []);
      await persistCmsMutation({ collection: collectionValue, action: 'create', records: [record], media, actorRole: session.role });
      uploadedObjectKeys = [];
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
        ? [await readArticleImage(form, actorId)]
        : collectionValue === 'activities' ? await readActivityMedia(form, actorId) : [];
      uploadedObjectKeys = media.flatMap((item) => item.objectKey ? [item.objectKey] : []);
      await persistCmsMutation({ collection: collectionValue, action: 'update', records: [updatedRecord], media, actorRole: session.role });
      uploadedObjectKeys = [];
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
    for (const objectKey of uploadedObjectKeys) await deleteStoredImage(objectKey);
    if (error instanceof CmsValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: 'Penyimpanan konten gagal.' }, { status: 503 });
  }
}
