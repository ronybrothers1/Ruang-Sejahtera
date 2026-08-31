import { and, desc, eq, isNull } from 'drizzle-orm';
import { isDatabaseConfigured } from '@/lib/auth/config';
import { cmsActivities, cmsArticles, cmsGalleries } from '@/lib/cms/content';
import { getDb } from '@/lib/db';
import { listFinancialReports, type FinancialReportRecord } from '@/lib/finance';
import { contentItems, mediaAssets } from '@/lib/db/schema';

export type PublishedActivity = {
  slug: string;
  title: string;
  summary: string;
  activityDate: string;
  locationLabel: string;
  programSlug: string;
  body: string;
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

    const row = rows.find((item) => item.media?.type === 'image' && !item.media.deletedAt) || rows[0];
    if (!row) return null;
    return {
      slug: row.content.slug,
      title: row.content.title,
      excerpt: row.content.excerpt || '',
      publishedAt: row.content.publishedAt?.toISOString() || '',
      category: row.content.category || '',
      body: row.content.body,
      imageUrl: row.media?.type === 'image' ? row.media.externalUrl || undefined : undefined,
      imageAlt: row.media?.type === 'image' ? row.media.altText : undefined,
      imageCaption: row.media?.type === 'image' ? row.media.caption || undefined : undefined,
    };
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
      const media = row.media?.type === 'image' && !row.media.deletedAt ? row.media : null;
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
