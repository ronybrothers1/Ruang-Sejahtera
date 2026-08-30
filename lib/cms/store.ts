import { and, desc, eq, isNull } from 'drizzle-orm';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { getDb } from '@/lib/db';
import { contentItems, contentRevisions, mediaAssets } from '@/lib/db/schema';
import type { CmsCollection, CmsMediaInput, CmsRecord } from '@/lib/cms/types';

export type CmsMutation = {
  collection: CmsCollection;
  action: 'create' | 'transition' | 'delete';
  records: CmsRecord[];
  media?: CmsMediaInput;
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

function dateValue(value: Date | null | undefined) {
  return value ? value.toISOString() : undefined;
}

export async function persistCmsMutation(mutation: CmsMutation): Promise<void> {
  if (!isDatabaseConfigured()) throw new Error('CMS_WRITE_BACKEND_UNAVAILABLE');
  if (mutation.action !== 'create' || mutation.records.length !== 1) throw new Error('CMS_MUTATION_NOT_IMPLEMENTED');

  const record = mutation.records[0];
  const db = getDb();
  const excerpt = 'excerpt' in record ? record.excerpt : 'summary' in record ? record.summary : null;
  const body = 'body' in record ? record.body : record.summary;
  const category = 'category' in record ? record.category : null;

  await db.insert(contentItems).values({
    id: record.id,
    type: contentType(mutation.collection),
    slug: record.slug,
    title: record.title,
    excerpt,
    body,
    category,
    ownerId: record.lastEditedBy,
    status: 'draft',
    currentRevision: 1,
  });

  try {
    await db.insert(contentRevisions).values({
      contentId: record.id,
      revisionNumber: 1,
      snapshot: record,
      editedBy: record.lastEditedBy,
    });

    if (mutation.media) {
      await db.insert(mediaAssets).values({
        ownerId: record.lastEditedBy,
        contentId: record.id,
        externalUrl: mutation.media.externalUrl,
        type: 'image',
        mimeType: mutation.media.mimeType,
        byteSize: mutation.media.byteSize,
        altText: mutation.media.altText,
        caption: mutation.media.caption || null,
        visibility: 'private',
        malwareScanStatus: 'pending',
        consentStatus: 'unknown',
      });
    }
  } catch (error) {
    throw error;
  }
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
