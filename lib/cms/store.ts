import { and, desc, eq, isNull } from 'drizzle-orm';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { getDb } from '@/lib/db';
import { auditLogs, contentItems, contentReviews, contentRevisions, mediaAssets } from '@/lib/db/schema';
import { canTransitionPublication } from '@/lib/cms/workflow';
import type { CmsCollection, CmsMediaInput, CmsRecord } from '@/lib/cms/types';
import type { AdminRole, PublicationStatus } from '@/lib/models';

export type CmsMutation = {
  collection: CmsCollection;
  action: 'create' | 'update' | 'transition' | 'delete';
  records: CmsRecord[];
  media?: CmsMediaInput;
  actorRole?: AdminRole;
};

export interface CmsWriteAdapter {
  persist(mutation: CmsMutation): Promise<void>;
}

export function getCmsWriteStatus() {
  return {
    configured: isDatabaseConfigured(),
    mode: isDatabaseConfigured() ? 'database' as const : 'disabled' as const,
    reason: isDatabaseConfigured()
      ? 'CMS tersambung ke database.'
      : 'DATABASE_URL belum dikonfigurasi.',
  };
}

function contentType(collection: CmsCollection) {
  return collection === 'articles' ? 'article' : collection === 'activities' ? 'activity' : 'gallery';
}

function recordFields(record: CmsRecord) {
  return {
    slug: record.slug,
    title: record.title,
    excerpt: 'excerpt' in record ? record.excerpt : 'summary' in record ? record.summary : null,
    body: 'body' in record ? record.body : record.summary,
    category: 'category' in record ? record.category : null,
  };
}

async function writeAudit(actorUserId: string, actorRole: AdminRole, action: string, resourceId: string, metadata: Record<string, unknown> = {}) {
  await getDb().insert(auditLogs).values({
    actorUserId,
    actorRole,
    action,
    resourceType: 'content_item',
    resourceId,
    metadata,
  });
}

async function attachMedia(contentId: string, media: CmsMediaInput, ownerId: string) {
  await getDb().insert(mediaAssets).values({
    ownerId,
    contentId,
    externalUrl: media.externalUrl,
    type: 'image',
    mimeType: media.mimeType,
    byteSize: media.byteSize,
    altText: media.altText,
    caption: media.caption || null,
    visibility: 'private',
    malwareScanStatus: 'pending',
    consentStatus: 'unknown',
  });
}

export async function persistCmsMutation(mutation: CmsMutation): Promise<void> {
  if (!isDatabaseConfigured()) throw new Error('CMS_WRITE_BACKEND_UNAVAILABLE');
  if (mutation.records.length !== 1) throw new Error('CMS_MUTATION_INVALID');

  const record = mutation.records[0];
  const db = getDb();
  const actorRole = mutation.actorRole || 'super_admin';

  if (mutation.action === 'create') {
    const fields = recordFields(record);
    await db.insert(contentItems).values({
      id: record.id,
      type: contentType(mutation.collection),
      ...fields,
      ownerId: record.lastEditedBy,
      status: 'draft',
      currentRevision: 1,
    });
    await db.insert(contentRevisions).values({
      contentId: record.id,
      revisionNumber: 1,
      snapshot: record,
      editedBy: record.lastEditedBy,
    });
    if (mutation.media) await attachMedia(record.id, mutation.media, record.lastEditedBy);
    await writeAudit(record.lastEditedBy, actorRole, 'content.created', record.id, { collection: mutation.collection, status: 'draft' });
    return;
  }

  const existingRows = await db.select().from(contentItems).where(and(eq(contentItems.id, record.id), isNull(contentItems.deletedAt))).limit(1);
  const existing = existingRows[0];
  if (!existing) throw new Error('CMS_RECORD_NOT_FOUND');

  if (mutation.action === 'update') {
    const fields = recordFields(record);
    const revisionNumber = existing.currentRevision + 1;
    await db.update(contentItems).set({
      ...fields,
      currentRevision: revisionNumber,
      updatedAt: new Date(),
    }).where(eq(contentItems.id, record.id));
    await db.insert(contentRevisions).values({
      contentId: record.id,
      revisionNumber,
      snapshot: record,
      editedBy: record.lastEditedBy,
    });
    if (mutation.media) await attachMedia(record.id, mutation.media, record.lastEditedBy);
    await writeAudit(record.lastEditedBy, actorRole, 'content.updated', record.id, { collection: mutation.collection, revisionNumber });
    return;
  }

  if (mutation.action === 'delete') {
    await db.update(contentItems).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(contentItems.id, record.id));
    await writeAudit(record.lastEditedBy, actorRole, 'content.deleted', record.id, { collection: mutation.collection });
    return;
  }

  const toStatus = record.status as PublicationStatus;
  if (!canTransitionPublication(actorRole, existing.status, toStatus)) throw new Error('PUBLICATION_TRANSITION_NOT_ALLOWED');
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
  await db.update(contentItems).set(updates).where(eq(contentItems.id, record.id));
  await db.insert(contentReviews).values({
    contentId: record.id,
    reviewerId: record.lastEditedBy,
    fromStatus: existing.status,
    toStatus,
    note: null,
  });
  await writeAudit(record.lastEditedBy, actorRole, 'content.status_changed', record.id, { collection: mutation.collection, from: existing.status, to: toStatus });
}

export async function listCmsRecords(): Promise<CmsRecord[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await getDb()
    .select()
    .from(contentItems)
    .where(isNull(contentItems.deletedAt))
    .orderBy(desc(contentItems.createdAt));

  return rows.map((row) => {
    const base = {
      id: row.id,
      slug: row.slug,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      lastEditedBy: row.ownerId,
    };

    if (row.type === 'article') {
      return { ...base, title: row.title, excerpt: row.excerpt || '', category: row.category || '', body: row.body };
    }
    if (row.type === 'activity') {
      return { ...base, title: row.title, summary: row.excerpt || '', activityDate: '', locationLabel: '', programSlug: '', body: row.body };
    }
    return { ...base, title: row.title, summary: row.excerpt || '' };
  });
}
