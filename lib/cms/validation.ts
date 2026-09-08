import { randomUUID } from 'node:crypto';
import { programs } from '@/lib/content';
import type { CmsActivity, CmsArticle, CmsCollection, CmsGallery, CmsRecord } from '@/lib/cms/types';
import { richTextPlainLength, sanitizeRichText } from '@/lib/security/rich-text';
import { parseExternalVideoUrl } from '@/lib/security/external-video';

export class CmsValidationError extends Error {}

function text(form: FormData, key: string, max: number) {
  const value = String(form.get(key) || '').trim();
  if (!value) throw new CmsValidationError(`${key} wajib diisi.`);
  if (value.length > max) throw new CmsValidationError(`${key} melebihi batas panjang.`);
  return value;
}

function slug(form: FormData) {
  const value = text(form, 'slug', 120).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new CmsValidationError('Slug tidak valid.');
  return value;
}

function isoDate(form: FormData, key: string) {
  const value = text(form, key, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) throw new CmsValidationError(`${key} tidak valid.`);
  return value;
}

function richText(form: FormData) {
  const value = String(form.get('body') || '').trim();
  if (!value || richTextPlainLength(value) === 0) throw new CmsValidationError('Isi konten wajib diisi.');
  if (value.length > 30000) throw new CmsValidationError('Isi konten melebihi batas panjang.');
  return sanitizeRichText(value);
}

function base(form: FormData, actorId: string) {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    slug: slug(form),
    status: 'draft' as const,
    createdAt: now,
    updatedAt: now,
    lastEditedBy: actorId,
  };
}

export function parseCreateContent(collection: CmsCollection, form: FormData, actorId: string): CmsRecord {
  if (collection === 'articles') {
    const record: CmsArticle = {
      ...base(form, actorId),
      title: text(form, 'title', 160),
      excerpt: text(form, 'excerpt', 420),
      category: text(form, 'category', 80),
      body: richText(form),
    };
    return record;
  }

  if (collection === 'activities') {
    const programSlug = text(form, 'programSlug', 120);
    if (!programs.some((program) => program.slug === programSlug)) throw new CmsValidationError('Program tidak dikenali.');
    const record: CmsActivity = {
      ...base(form, actorId),
      title: text(form, 'title', 160),
      summary: text(form, 'summary', 500),
      activityDate: isoDate(form, 'activityDate'),
      locationLabel: text(form, 'locationLabel', 180),
      programSlug,
      body: richText(form),
      imageAlt: String(form.get('imageAlt') || '').trim() || undefined,
      imageCaption: String(form.get('imageCaption') || '').trim() || undefined,
      video: (() => {
        const value = String(form.get('videoUrl') || '').trim();
        if (!value) return undefined;
        const parsed = parseExternalVideoUrl(value);
        if (!parsed) throw new CmsValidationError('URL video TikTok atau Instagram tidak valid.');
        return parsed;
      })(),
    };
    return record;
  }

  const record: CmsGallery = {
    ...base(form, actorId),
    title: text(form, 'title', 160),
    summary: text(form, 'summary', 700),
  };
  return record;
}

export function parseUpdateContent(collection: CmsCollection, form: FormData, actorId: string, existing: CmsRecord): CmsRecord {
  const parsed = parseCreateContent(collection, form, actorId);
  return {
    ...parsed,
    id: existing.id,
    status: existing.status,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function isCmsCollection(value: string): value is CmsCollection {
  return value === 'articles' || value === 'activities' || value === 'galleries';
}
