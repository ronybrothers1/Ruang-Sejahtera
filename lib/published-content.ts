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

/**
 * Public registries intentionally start empty.
 * Production adapters must populate these only from records that have passed
 * the editorial/publication workflow. Do not seed this file with fictional
 * activities, dates, locations, beneficiary stories, images, or statistics.
 */
export const publishedActivities: PublishedActivity[] = [];
export const publishedArticles: PublishedArticle[] = [];
export const publishedGalleries: PublishedGallery[] = [];
