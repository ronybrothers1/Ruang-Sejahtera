import { absoluteSeoUrl } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export function WebsiteJsonLd() {
  const url = absoluteSeoUrl('/');
  const searchUrl = absoluteSeoUrl('/cari?q={search_term_string}');
  if (!url || !searchUrl) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url,
    inLanguage: 'id-ID',
    potentialAction: {
      '@type': 'SearchAction',
      target: searchUrl,
      'query-input': 'required name=search_term_string',
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}
