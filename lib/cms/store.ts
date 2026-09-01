import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { getDb } from '@/lib/db';
import { auditLogs, contentItems, contentReviews, contentRevisions, mediaAssets } from '@/lib/db/schema';
import { canTransitionPublication } from '@/lib/cms/workflow';
import type { CmsCollection, CmsMediaInput, CmsRecord } from '@/lib/cms/types';
import type { AdminRole, PublicationStatus } from '@/lib/models';
import { deleteStoredImage, isBlobStorageConfigured, promoteStoredImage, type StoredImage } from '@/lib/security/image-upload';
import { parseExternalVideoUrl } from '@/lib/security/external-video';

export type CmsMutation = {
  collection: CmsCollection;
  action: 'create' | 'update' | 'transition' | 'delete';
  records: CmsRecord[];
  media?: CmsMediaInput[];
  actorRole?: AdminRole;
};

export interface CmsWriteAdapter {
  persist(mutation: CmsMutation): Promise<void>;
}

export function getCmsWriteStatus() {
  return {
    configured: isDatabaseConfigured(),
    mediaConfigured: isBlobStorageConfigured(),
    mode: isDatabaseConfigured() ? 'database' as const : 'disabled' as const,
    reason: !isDatabaseConfigured()
      ? 'DATABASE_URL belum dikonfigurasi.'
      : !isBlobStorageConfigured()
        ? 'CMS tersambung ke database; BLOB_READ_WRITE_TOKEN diperlukan untuk unggah gambar.'
        : 'CMS tersambung ke database dan penyimpanan media.',
  };
}

function contentType(collection: CmsCollection) {
  return collection === 'articles' ? 'article' : collection === 'activities' ? 'activity' : 'gallery';
}

type CmsDatabase = Pick<ReturnType<typeof getDb>, 'select' | 'insert' | 'update'>;

function recordFields(record: CmsRecord) {
  return {
    slug: record.slug,
    title: record.title,
    excerpt: 'excerpt' in record ? record.excerpt : 'summary' in record ? record.summary : null,
    body: 'body' in record ? record.body : record.summary,
    category: 'category' in record ? record.category : null,
    activityDate: 'activityDate' in record ? record.activityDate : null,
    locationLabel: 'locationLabel' in record ? record.locationLabel : null,
    programSlug: 'programSlug' in record ? record.programSlug : null,
  };
}

async function writeAudit(db: CmsDatabase, actorUserId: string, actorRole: AdminRole, action: string, resourceId: string, metadata: Record<string, unknown> = {}) {
  await db.insert(auditLogs).values({
    actorUserId,
    actorRole,
    action,
    resourceType: 'content_item',
    resourceId,
    metadata,
  });
}

async function attachMedia(db: CmsDatabase, contentId: string, media: CmsMediaInput, ownerId: string) {
  await db.insert(mediaAssets).values({
    ownerId,
    contentId,
    objectKey: media.objectKey,
    externalUrl: media.externalUrl,
    type: media.type,
    mimeType: media.mimeType,
    byteSize: media.byteSize,
    width: media.width,
    height: media.height,
    altText: media.altText,
    caption: media.caption || null,
    visibility: media.visibility,
    malwareScanStatus: media.malwareScanStatus,
    consentStatus: media.consentStatus,
    containsVulnerablePerson: media.containsVulnerablePerson,
  });
}

type PreparedMediaPromotion = {
  id: string;
  previousObjectKey: string;
  promoted: StoredImage;
};

async function prepareMediaForPublication(contentId: string) {
  const db = getDb();
  const media = await db.select().from(mediaAssets)
    .where(and(eq(mediaAssets.contentId, contentId), isNull(mediaAssets.deletedAt)));
  const promotions: PreparedMediaPromotion[] = [];
  const visibilityOnlyIds: string[] = [];

  try {
    for (const item of media) {
      if (item.consentStatus !== 'confirmed' && item.consentStatus !== 'not_required') throw new Error('MEDIA_CONSENT_REQUIRED');
      if (item.containsVulnerablePerson && item.consentStatus !== 'confirmed') throw new Error('MEDIA_VULNERABLE_CONSENT_REQUIRED');
      if (item.type === 'external_video') {
        if (item.malwareScanStatus !== 'url_validated' || !item.externalUrl) throw new Error('MEDIA_VALIDATION_REQUIRED');
        if (item.visibility !== 'public') visibilityOnlyIds.push(item.id);
        continue;
      }
      if (item.type !== 'image') continue;
      if (item.malwareScanStatus !== 'signature_validated') throw new Error('MEDIA_VALIDATION_REQUIRED');
      if (item.visibility === 'public' && item.externalUrl) continue;
      if (!item.objectKey || !item.mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(item.mimeType) || !item.byteSize) {
        throw new Error('MEDIA_PRIVATE_SOURCE_INVALID');
      }
      const promoted = await promoteStoredImage({
        ownerId: item.ownerId,
        objectKey: item.objectKey,
        externalUrl: null,
        mimeType: item.mimeType as StoredImage['mimeType'],
        byteSize: item.byteSize,
        width: item.width,
        height: item.height,
        visibility: 'private',
      });
      promotions.push({ id: item.id, previousObjectKey: item.objectKey, promoted });
    }
    return { promotions, visibilityOnlyIds };
  } catch (error) {
    await Promise.allSettled(promotions.map((item) => deleteStoredImage(item.promoted.objectKey)));
    throw error;
  }
}

export async function persistCmsMutation(mutation: CmsMutation): Promise<void> {
  if (!isDatabaseConfigured()) throw new Error('CMS_WRITE_BACKEND_UNAVAILABLE');
  if (mutation.records.length !== 1) throw new Error('CMS_MUTATION_INVALID');

  const record = mutation.records[0];
  const db = getDb();
  const actorRole = mutation.actorRole || 'super_admin';

  if (mutation.action === 'create') {
    const fields = recordFields(record);
    await db.transaction(async (tx) => {
      await tx.insert(contentItems).values({
        id: record.id,
        type: contentType(mutation.collection),
        ...fields,
        ownerId: record.lastEditedBy,
        status: 'draft',
        currentRevision: 1,
      });
      await tx.insert(contentRevisions).values({
        contentId: record.id,
        revisionNumber: 1,
        snapshot: record,
        editedBy: record.lastEditedBy,
      });
      for (const media of mutation.media || []) await attachMedia(tx, record.id, media, record.lastEditedBy);
      await writeAudit(tx, record.lastEditedBy, actorRole, 'content.created', record.id, { collection: mutation.collection, status: 'draft' });
    });
    return;
  }

  const existingRows = await db.select().from(contentItems).where(and(eq(contentItems.id, record.id), isNull(contentItems.deletedAt))).limit(1);
  const existing = existingRows[0];
  if (!existing) throw new Error('CMS_RECORD_NOT_FOUND');

  if (mutation.action === 'update') {
    const fields = recordFields(record);
    const revisionNumber = existing.currentRevision + 1;
    await db.transaction(async (tx) => {
      await tx.update(contentItems).set({
        ...fields,
        status: 'draft',
        currentRevision: revisionNumber,
        reviewRequestedAt: null,
        approvedAt: null,
        approvedBy: null,
        publishedAt: null,
        publishedBy: null,
        archivedAt: null,
        updatedAt: new Date(),
      }).where(eq(contentItems.id, record.id));
      await tx.insert(contentRevisions).values({
        contentId: record.id,
        revisionNumber,
        snapshot: record,
        editedBy: record.lastEditedBy,
      });
      for (const media of mutation.media || []) {
        await tx.update(mediaAssets).set({ deletedAt: new Date(), updatedAt: new Date() }).where(and(eq(mediaAssets.contentId, record.id), eq(mediaAssets.type, media.type), isNull(mediaAssets.deletedAt)));
        await attachMedia(tx, record.id, media, record.lastEditedBy);
      }
      await writeAudit(tx, record.lastEditedBy, actorRole, 'content.updated', record.id, { collection: mutation.collection, revisionNumber });
    });
    return;
  }

  if (mutation.action === 'delete') {
    await db.transaction(async (tx) => {
      await tx.update(contentItems).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(contentItems.id, record.id));
      await writeAudit(tx, record.lastEditedBy, actorRole, 'content.deleted', record.id, { collection: mutation.collection });
    });
    return;
  }

  const toStatus = record.status as PublicationStatus;
  if (!canTransitionPublication(actorRole, existing.status, toStatus)) throw new Error('PUBLICATION_TRANSITION_NOT_ALLOWED');
  const preparedMedia = toStatus === 'published'
    ? await prepareMediaForPublication(record.id)
    : { promotions: [], visibilityOnlyIds: [] };
  const now = new Date();
  const updates: Partial<typeof contentItems.$inferInsert> = { status: toStatus, updatedAt: now };
  if (toStatus === 'pending_review') updates.reviewRequestedAt = now;
  if (toStatus === 'approved') {
    updates.approvedAt = now;
    updates.approvedBy = record.lastEditedBy;
  }
  if (toStatus === 'published') {
    updates.publishedAt = now;
    updates.publishedBy = record.lastEditedBy;
  }
  if (toStatus === 'archived') updates.archivedAt = now;
  try {
    await db.transaction(async (tx) => {
      for (const media of preparedMedia.promotions) {
        await tx.update(mediaAssets).set({
          objectKey: media.promoted.objectKey,
          externalUrl: media.promoted.externalUrl,
          byteSize: media.promoted.byteSize,
          width: media.promoted.width,
          height: media.promoted.height,
          visibility: 'public',
          updatedAt: now,
        }).where(and(eq(mediaAssets.id, media.id), isNull(mediaAssets.deletedAt)));
      }
      for (const mediaId of preparedMedia.visibilityOnlyIds) {
        await tx.update(mediaAssets).set({ visibility: 'public', updatedAt: now })
          .where(and(eq(mediaAssets.id, mediaId), isNull(mediaAssets.deletedAt)));
      }
      const updatedContent = await tx.update(contentItems).set(updates)
        .where(and(eq(contentItems.id, record.id), eq(contentItems.status, existing.status)))
        .returning({ id: contentItems.id });
      if (!updatedContent[0]) throw new Error('PUBLICATION_TRANSITION_CONFLICT');
      await tx.insert(contentReviews).values({
        contentId: record.id,
        reviewerId: record.lastEditedBy,
        fromStatus: existing.status,
        toStatus,
        note: record.reviewNote?.trim() || null,
      });
      await writeAudit(tx, record.lastEditedBy, actorRole, 'content.status_changed', record.id, { collection: mutation.collection, from: existing.status, to: toStatus });
    });
  } catch (error) {
    await Promise.allSettled(preparedMedia.promotions.map((item) => deleteStoredImage(item.promoted.objectKey)));
    throw error;
  }
  await Promise.allSettled(preparedMedia.promotions.map((item) => deleteStoredImage(item.previousObjectKey)));
}

export async function listCmsRecords(): Promise<CmsRecord[]> {
  if (!isDatabaseConfigured()) return [];
  const db = getDb();
  const rows = await db
    .select({ content: contentItems, media: mediaAssets })
    .from(contentItems)
    .leftJoin(mediaAssets, and(eq(mediaAssets.contentId, contentItems.id), isNull(mediaAssets.deletedAt)))
    .where(isNull(contentItems.deletedAt))
    .orderBy(desc(contentItems.createdAt));
  const contentIds = [...new Set(rows.map((row) => row.content.id))];
  const reviews = contentIds.length
    ? await db.select().from(contentReviews).where(inArray(contentReviews.contentId, contentIds)).orderBy(desc(contentReviews.createdAt))
    : [];
  const latestReview = new Map<string, typeof reviews[number]>();
  for (const review of reviews) {
    if (!latestReview.has(review.contentId)) latestReview.set(review.contentId, review);
  }

  const grouped = new Map<string, { content: typeof rows[number]['content']; media: NonNullable<typeof rows[number]['media']>[] }>();
  for (const row of rows) {
    const current = grouped.get(row.content.id) || { content: row.content, media: [] };
    if (row.media) current.media.push(row.media);
    grouped.set(row.content.id, current);
  }

  return Array.from(grouped.values()).map(({ content: row, media }) => {
    const review = latestReview.get(row.id);
    const base = {
      id: row.id,
      slug: row.slug,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      lastEditedBy: row.ownerId,
      reviewNote: review?.note || undefined,
      reviewedAt: review?.createdAt.toISOString(),
      reviewedBy: review?.reviewerId,
    };

    if (row.type === 'article') {
      const image = media.find((item) => item.type === 'image' && item.visibility === 'public' && item.externalUrl);
      return { ...base, title: row.title, excerpt: row.excerpt || '', category: row.category || '', body: row.body, imageUrl: image?.externalUrl || undefined, imageAlt: image?.altText, imageCaption: image?.caption || undefined };
    }
    if (row.type === 'activity') {
      const image = media.find((item) => item.type === 'image' && item.visibility === 'public' && item.externalUrl);
      const video = media.find((item) => item.type === 'external_video' && item.visibility === 'public' && item.externalUrl);
      const parsedVideo = video?.externalUrl ? parseExternalVideoUrl(video.externalUrl) : null;
      return { ...base, title: row.title, summary: row.excerpt || '', activityDate: row.activityDate || '', locationLabel: row.locationLabel || '', programSlug: row.programSlug || '', body: row.body, imageUrl: image?.externalUrl || undefined, imageAlt: image?.altText, imageCaption: image?.caption || undefined, video: parsedVideo || undefined };
    }
    return { ...base, title: row.title, summary: row.excerpt || '' };
  });
}
