import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { cache } from 'react';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { cmsActivities, cmsArticles, cmsGalleries } from '@/lib/cms/content';
import { getDb } from '@/lib/db';
import { listFinancialReports, type FinancialReportRecord } from '@/lib/finance';
import { contentItems, mediaAssets } from '@/lib/db/schema';
import { parseExternalVideoUrl } from '@/lib/security/external-video';

function isPublishableMedia(media: typeof mediaAssets.$inferSelect | null) {
  return Boolean(
    media
    && media.type === 'image'
    && !media.deletedAt
    && media.visibility === 'public'
    && media.malwareScanStatus === 'signature_validated'
    && (media.consentStatus === 'confirmed' || media.consentStatus === 'not_required'),
  );
}

function isPublishableExternalVideo(media: typeof mediaAssets.$inferSelect | null) {
  return Boolean(media && media.type === 'external_video' && !media.deletedAt && media.visibility === 'public' && media.malwareScanStatus === 'url_validated' && media.externalUrl && parseExternalVideoUrl(media.externalUrl));
}

export type PublishedActivity = {
  slug: string;
  title: string;
  summary: string;
  activityDate: string;
  locationLabel: string;
  programSlug: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  video?: { provider: 'tiktok' | 'instagram'; sourceUrl: string; embedUrl: string };
};

export type PublishedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export type PublishedGallery = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export const publishedActivities: PublishedActivity[] = cmsActivities
  .filter((item) => item.status === 'published')
  .map(({ slug, title, summary, activityDate, locationLabel, programSlug, body }) => ({
    slug,
    title,
    summary,
    activityDate,
    locationLabel,
    programSlug,
    body,
  }));

function mapActivity(row: PublishedActivityContent, media: (typeof mediaAssets.$inferSelect)[]) {
  const image = media.find((item) => isPublishableMedia(item));
  const video = media.find((item) => isPublishableExternalVideo(item));
  const parsedVideo = video?.externalUrl ? parseExternalVideoUrl(video.externalUrl) : null;
  return {
    slug: row.slug,
    title: row.title,
    summary: row.excerpt || '',
    activityDate: row.activityDate || '',
    locationLabel: row.locationLabel || '',
    programSlug: row.programSlug || '',
    body: row.body,
    imageUrl: image?.externalUrl || undefined,
    imageAlt: image?.altText,
    imageCaption: image?.caption || undefined,
    video: parsedVideo || undefined,
  } satisfies PublishedActivity;
}

export const publishedArticles: PublishedArticle[] = cmsArticles
  .filter((item) => item.status === 'published' && Boolean(item.publishedAt))
  .map(({ slug, title, excerpt, publishedAt, category, body, imageUrl, imageAlt, imageCaption }) => ({
    slug,
    title,
    excerpt,
    publishedAt: publishedAt as string,
    category,
    body,
    imageUrl,
    imageAlt,
    imageCaption,
  }));

export const publishedGalleries: PublishedGallery[] = cmsGalleries
  .filter((item) => item.status === 'published' && Boolean(item.publishedAt))
  .map(({ slug, title, summary, publishedAt }) => ({
    slug,
    title,
    summary,
    publishedAt: publishedAt as string,
  }));


export type PublishedFinancialReport = FinancialReportRecord;

export async function getPublishedFinancialReports(options: { limit?: number } = {}): Promise<PublishedFinancialReport[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    return await listFinancialReports({ publishedOnly: true, limit: options.limit });
  } catch {
    return [];
  }
}

type PublishedArticleContent = Pick<typeof contentItems.$inferSelect, 'id' | 'slug' | 'title' | 'excerpt' | 'publishedAt' | 'category' | 'body'>;
type PublishedActivityContent = Pick<typeof contentItems.$inferSelect, 'id' | 'slug' | 'title' | 'excerpt' | 'activityDate' | 'locationLabel' | 'programSlug' | 'body'>;
type PublishedGalleryContent = Pick<typeof contentItems.$inferSelect, 'id' | 'slug' | 'title' | 'excerpt' | 'publishedAt'>;

function mediaByContentId(media: (typeof mediaAssets.$inferSelect)[]) {
  const grouped = new Map<string, (typeof mediaAssets.$inferSelect)[]>();
  for (const item of media) {
    if (!item.contentId) continue;
    const current = grouped.get(item.contentId) || [];
    current.push(item);
    grouped.set(item.contentId, current);
  }
  return grouped;
}

function mapArticle(row: PublishedArticleContent, media: (typeof mediaAssets.$inferSelect)[]) {
  const image = media.find((item) => isPublishableMedia(item));
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    publishedAt: row.publishedAt?.toISOString() || '',
    category: row.category || '',
    body: row.body,
    imageUrl: image?.externalUrl || undefined,
    imageAlt: image?.altText,
    imageCaption: image?.caption || undefined,
  } satisfies PublishedArticle;
}

function mapGallery(row: PublishedGalleryContent, media: (typeof mediaAssets.$inferSelect)[] = []): PublishedGallery {
  const image = media.find((item) => isPublishableMedia(item));
  return {
    slug: row.slug,
    title: row.title,
    summary: row.excerpt || '',
    publishedAt: row.publishedAt?.toISOString() || '',
    imageUrl: image?.externalUrl || undefined,
    imageAlt: image?.altText,
    imageCaption: image?.caption || undefined,
  };
}

export const getPublishedArticleBySlug = cache(async (slug: string): Promise<PublishedArticle | null> => {
  if (!isDatabaseConfigured()) return null;
  try {
    const contentRows = await getDb()
      .select({
        id: contentItems.id,
        slug: contentItems.slug,
        title: contentItems.title,
        excerpt: contentItems.excerpt,
        publishedAt: contentItems.publishedAt,
        category: contentItems.category,
        body: contentItems.body,
      })
      .from(contentItems)
      .where(and(
        eq(contentItems.type, 'article'),
        eq(contentItems.slug, slug),
        eq(contentItems.status, 'published'),
        isNull(contentItems.deletedAt),
      ))
      .limit(1);
    const content = contentRows[0];
    if (!content) return null;
    const media = await getDb().select().from(mediaAssets).where(and(
      eq(mediaAssets.contentId, content.id),
      isNull(mediaAssets.deletedAt),
    ));
    return mapArticle(content, media);
  } catch {
    return null;
  }
});

export async function getPublishedActivities(options: { limit?: number } = {}): Promise<PublishedActivity[]> {
  if (!isDatabaseConfigured()) return publishedActivities;
  try {
    const query = getDb().select({
      id: contentItems.id,
      slug: contentItems.slug,
      title: contentItems.title,
      excerpt: contentItems.excerpt,
      activityDate: contentItems.activityDate,
      locationLabel: contentItems.locationLabel,
      programSlug: contentItems.programSlug,
      body: contentItems.body,
    }).from(contentItems)
      .where(and(eq(contentItems.type, 'activity'), eq(contentItems.status, 'published'), isNull(contentItems.deletedAt)))
      .orderBy(desc(contentItems.activityDate), desc(contentItems.publishedAt));
    const contentRows = options.limit && options.limit > 0 ? await query.limit(options.limit) : await query;
    if (!contentRows.length) return publishedActivities;
    const media = await getDb().select().from(mediaAssets).where(and(
      inArray(mediaAssets.contentId, contentRows.map((row) => row.id)),
      isNull(mediaAssets.deletedAt),
    ));
    const groupedMedia = mediaByContentId(media);
    const activities = contentRows.map((content) => mapActivity(content, groupedMedia.get(content.id) || []));
    return activities.length ? activities : publishedActivities;
  } catch {
    return publishedActivities;
  }
}

export const getPublishedActivityBySlug = cache(async (slug: string): Promise<PublishedActivity | null> => {
  if (!isDatabaseConfigured()) return null;
  try {
    const contentRows = await getDb().select({
      id: contentItems.id,
      slug: contentItems.slug,
      title: contentItems.title,
      excerpt: contentItems.excerpt,
      activityDate: contentItems.activityDate,
      locationLabel: contentItems.locationLabel,
      programSlug: contentItems.programSlug,
      body: contentItems.body,
    }).from(contentItems)
      .where(and(eq(contentItems.type, 'activity'), eq(contentItems.slug, slug), eq(contentItems.status, 'published'), isNull(contentItems.deletedAt)))
      .limit(1);
    const content = contentRows[0];
    if (!content) return null;
    const media = await getDb().select().from(mediaAssets).where(and(
      eq(mediaAssets.contentId, content.id),
      isNull(mediaAssets.deletedAt),
    ));
    return mapActivity(content, media);
  } catch {
    return null;
  }
});


export async function getPublishedArticles(options: { limit?: number } = {}): Promise<PublishedArticle[]> {
  if (!isDatabaseConfigured()) return publishedArticles;
  try {
    const query = getDb()
      .select({
        id: contentItems.id,
        slug: contentItems.slug,
        title: contentItems.title,
        excerpt: contentItems.excerpt,
        publishedAt: contentItems.publishedAt,
        category: contentItems.category,
        body: contentItems.body,
      })
      .from(contentItems)
      .where(and(
        eq(contentItems.type, 'article'),
        eq(contentItems.status, 'published'),
        isNull(contentItems.deletedAt),
      ))
      .orderBy(desc(contentItems.publishedAt));
    const contentRows = options.limit && options.limit > 0 ? await query.limit(options.limit) : await query;
    if (!contentRows.length) return publishedArticles;
    const media = await getDb().select().from(mediaAssets).where(and(
      inArray(mediaAssets.contentId, contentRows.map((row) => row.id)),
      isNull(mediaAssets.deletedAt),
    ));
    const groupedMedia = mediaByContentId(media);
    const dynamicArticles = contentRows.map((content) => mapArticle(content, groupedMedia.get(content.id) || []));
    return dynamicArticles.length ? dynamicArticles : publishedArticles;
  } catch {
    return publishedArticles;
  }
}

export async function getPublishedGalleries(options: { limit?: number } = {}): Promise<PublishedGallery[]> {
  if (!isDatabaseConfigured()) return publishedGalleries;
  try {
    const query = getDb()
      .select({
        id: contentItems.id,
        slug: contentItems.slug,
        title: contentItems.title,
        excerpt: contentItems.excerpt,
        publishedAt: contentItems.publishedAt,
      })
      .from(contentItems)
      .where(and(
        eq(contentItems.type, 'gallery'),
        eq(contentItems.status, 'published'),
        isNull(contentItems.deletedAt),
      ))
      .orderBy(desc(contentItems.publishedAt));
    const contentRows = options.limit && options.limit > 0 ? await query.limit(options.limit) : await query;
    if (!contentRows.length) return publishedGalleries;
    const media = await getDb().select().from(mediaAssets).where(and(
      inArray(mediaAssets.contentId, contentRows.map((row) => row.id)),
      isNull(mediaAssets.deletedAt),
    ));
    const groupedMedia = mediaByContentId(media);
    return contentRows.map((content) => mapGallery(content, groupedMedia.get(content.id) || []));
  } catch {
    return publishedGalleries;
  }
}

export const getPublishedGalleryBySlug = cache(async (slug: string): Promise<PublishedGallery | null> => {
  if (!isDatabaseConfigured()) return null;
  try {
    const contentRows = await getDb()
      .select({
        id: contentItems.id,
        slug: contentItems.slug,
        title: contentItems.title,
        excerpt: contentItems.excerpt,
        publishedAt: contentItems.publishedAt,
      })
      .from(contentItems)
      .where(and(
        eq(contentItems.type, 'gallery'),
        eq(contentItems.slug, slug),
        eq(contentItems.status, 'published'),
        isNull(contentItems.deletedAt),
      ))
      .limit(1);
    const content = contentRows[0];
    if (!content) return null;
    const media = await getDb().select().from(mediaAssets).where(and(
      eq(mediaAssets.contentId, content.id),
      isNull(mediaAssets.deletedAt),
    ));
    return mapGallery(content, media);
  } catch {
    return null;
  }
});
