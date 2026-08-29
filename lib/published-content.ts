import { cmsActivities, cmsArticles, cmsGalleries } from '@/lib/cms/content';

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
  .map(({ slug, title, excerpt, publishedAt, category, body }) => ({
    slug,
    title,
    excerpt,
    publishedAt: publishedAt as string,
    category,
    body,
  }));

export const publishedGalleries: PublishedGallery[] = cmsGalleries
  .filter((item) => item.status === 'published' && Boolean(item.publishedAt))
  .map(({ slug, title, summary, publishedAt }) => ({
    slug,
    title,
    summary,
    publishedAt: publishedAt as string,
  }));
