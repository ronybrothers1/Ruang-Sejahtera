import { siteConfig } from '@/lib/site';

export function OrganizationJsonLd() {
  if (!siteConfig.url) return null;

  const sameAs = Object.values(siteConfig.social).filter(Boolean) as string[];
  const contactPoint = siteConfig.contact.email || siteConfig.contact.whatsapp
    ? [{
        '@type': 'ContactPoint',
        contactType: 'public information',
        email: siteConfig.contact.email || undefined,
        telephone: siteConfig.contact.whatsapp || undefined,
        availableLanguage: ['id'],
      }]
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url.replace(/\/$/, '')}/brand/logo-ruang-sejahtera.webp`,
    description: siteConfig.description,
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
