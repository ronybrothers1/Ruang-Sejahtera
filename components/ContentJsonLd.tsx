import { absoluteSeoImage, absoluteSeoUrl } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

type ArticleJsonLdProps = {
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  imagePath?: string;
};

export function ArticleJsonLd({ path, title, description, publishedAt, imagePath }: ArticleJsonLdProps) {
  const url = absoluteSeoUrl(path);
  if (!url) return null;

  const image = imagePath ? absoluteSeoImage(imagePath) : undefined;
  const datePublished = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(publishedAt) ? publishedAt : undefined;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: siteConfig.name, url: absoluteSeoUrl('/') },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: absoluteSeoUrl('/'),
      logo: { '@type': 'ImageObject', url: absoluteSeoImage('/brand/logo-ruang-sejahtera.webp') },
    },
    image: image ? [image] : undefined,
    inLanguage: 'id-ID',
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}

type ActivityJsonLdProps = {
  path: string;
  title: string;
  description: string;
  activityDate: string;
  location: string;
  imagePath?: string;
};

export function ActivityJsonLd({ path, title, description, activityDate, location, imagePath }: ActivityJsonLdProps) {
  const url = absoluteSeoUrl(path);
  if (!url || !/^\d{4}-\d{2}-\d{2}$/.test(activityDate)) return null;

  const image = imagePath ? absoluteSeoImage(imagePath) : undefined;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description,
    startDate: `${activityDate}T00:00:00+07:00`,
    location: { '@type': 'Place', name: location },
    organizer: { '@type': 'Organization', name: siteConfig.name, url: absoluteSeoUrl('/') },
    url,
    image: image ? [image] : undefined,
    inLanguage: 'id-ID',
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}
