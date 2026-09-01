import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';

type SocialMetadataInput = {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  imageAlt?: string;
  openGraphType?: 'website' | 'article';
};

function cleanPath(path: string) {
  try {
    return new URL(path).toString();
  } catch {
    // Relative paths are resolved against metadataBase by Next.js.
  }
  return path.startsWith('/') ? path : `/${path}`;
}

export function createPageMetadata({ title, description, path, imagePath, imageAlt, openGraphType = 'website' }: SocialMetadataInput): Metadata {
  const canonicalPath = cleanPath(path);
  const imageUrl = imagePath || '/brand/logo-ruang-sejahtera.webp';
  const image = {
    url: imageUrl,
    alt: imageAlt || `${siteConfig.name} - ${title}`,
  };

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: openGraphType,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function absoluteSeoUrl(path: string) {
  if (!siteConfig.url) return undefined;
  return new URL(cleanPath(path), siteConfig.url).toString();
}

export function absoluteSeoImage(path: string) {
  return absoluteSeoUrl(path);
}
