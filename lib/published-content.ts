import { and, desc, eq, isNull } from 'drizzle-orm';
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

function mapActivity(row: typeof contentItems.$inferSelect, media: (typeof mediaAssets.$inferSelect)[]) {
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

export async function getPublishedFinancialReports(): Promise<PublishedFinancialReport[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    return await listFinancialReports({ publishedOnly: true });
  } catch {
    return [];
  }
}

export async function getPublishedArticleBySlug(slug: string): Promise<PublishedArticle | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const rows = await getDb()
      .select({ content: contentItems, media: mediaAssets })
      .from(contentItems)
      .leftJoin(mediaAssets, eq(mediaAssets.contentId, contentItems.id))
      .where(and(
        eq(contentItems.type, 'article'),
        eq(contentItems.slug, slug),
        eq(contentItems.status, 'published'),
        isNull(contentItems.deletedAt),
      ));

    const row = rows.find((item) => isPublishableMedia(item.media)) || rows[0];
    if (!row) return null;
    const media = isPublishableMedia(row.media) ? row.media : null;
    return {
      slug: row.content.slug,
      title: row.content.title,
      excerpt: row.content.excerpt || '',
      publishedAt: row.content.publishedAt?.toISOString() || '',
      category: row.content.category || '',
      body: row.content.body,
      imageUrl: media?.externalUrl || undefined,
      imageAlt: media?.altText,
      imageCaption: media?.caption || undefined,
    };
  } catch {
    return null;
  }
}

export async function getPublishedActivities(): Promise<PublishedActivity[]> {
  if (!isDatabaseConfigured()) return publishedActivities;
  try {
    const rows = await getDb().select({ content: contentItems, media: mediaAssets }).from(contentItems)
      .leftJoin(mediaAssets, and(eq(mediaAssets.contentId, contentItems.id), isNull(mediaAssets.deletedAt)))
      .where(and(eq(contentItems.type, 'activity'), eq(contentItems.status, 'published'), isNull(contentItems.deletedAt)))
      .orderBy(desc(contentItems.activityDate), desc(contentItems.publishedAt));
    const grouped = new Map<string, { content: typeof rows[number]['content']; media: NonNullable<typeof rows[number]['media']>[] }>();
    for (const row of rows) {
      const current = grouped.get(row.content.id) || { content: row.content, media: [] };
      if (row.media) current.media.push(row.media);
      grouped.set(row.content.id, current);
    }
    const activities = Array.from(grouped.values()).map(({ content, media }) => mapActivity(content, media));
    return activities.length ? activities : publishedActivities;
  } catch {
    return publishedActivities;
  }
}

export async function getPublishedActivityBySlug(slug: string): Promise<PublishedActivity | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const rows = await getDb().select({ content: contentItems, media: mediaAssets }).from(contentItems)
      .leftJoin(mediaAssets, and(eq(mediaAssets.contentId, contentItems.id), isNull(mediaAssets.deletedAt)))
      .where(and(eq(contentItems.type, 'activity'), eq(contentItems.slug, slug), eq(contentItems.status, 'published'), isNull(contentItems.deletedAt)));
    if (!rows.length) return null;
    return mapActivity(rows[0].content, rows.flatMap((row) => row.media ? [row.media] : []));
  } catch {
    return null;
  }
}


export async function getPublishedArticles(): Promise<PublishedArticle[]> {
  if (!isDatabaseConfigured()) return publishedArticles;
  try {
    const rows = await getDb()
      .select({ content: contentItems, media: mediaAssets })
      .from(contentItems)
      .leftJoin(mediaAssets, eq(mediaAssets.contentId, contentItems.id))
      .where(and(
        eq(contentItems.type, 'article'),
        eq(contentItems.status, 'published'),
        isNull(contentItems.deletedAt),
      ))
      .orderBy(desc(contentItems.publishedAt));

    const articles = new Map<string, PublishedArticle>();
    for (const row of rows) {
      const media = isPublishableMedia(row.media) ? row.media : null;
      const current = articles.get(row.content.slug);
      if (current && current.imageUrl) continue;
      articles.set(row.content.slug, {
        slug: row.content.slug,
        title: row.content.title,
        excerpt: row.content.excerpt || '',
        publishedAt: row.content.publishedAt?.toISOString() || '',
        category: row.content.category || '',
        body: row.content.body,
        imageUrl: media?.externalUrl || current?.imageUrl,
        imageAlt: media?.altText || current?.imageAlt,
        imageCaption: media?.caption || current?.imageCaption,
      });
    }

    const dynamicArticles = Array.from(articles.values());
    const dynamicSlugs = new Set(dynamicArticles.map((item) => item.slug));
    return dynamicArticles.length ? dynamicArticles : publishedArticles;
  } catch {
    return publishedArticles;
  }
}
