const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const productionSiteUrl = process.env.VERCEL_ENV === 'production'
  ? 'https://www.ruangsejahtera.web.id'
  : null;

export const siteConfig = {
  name: 'Yayasan Ruang Sejahtera',
  shortName: 'Ruang Sejahtera',
  description:
    'Platform resmi Yayasan Ruang Sejahtera untuk informasi program, kegiatan sosial, dampak, transparansi, dan dukungan publik.',
  url: configuredSiteUrl || productionSiteUrl,
  locale: 'id_ID',
  contact: {
    address: process.env.NEXT_PUBLIC_OFFICIAL_ADDRESS || null,
    whatsapp: process.env.NEXT_PUBLIC_OFFICIAL_WHATSAPP || '+62822131313',
    email: process.env.NEXT_PUBLIC_OFFICIAL_EMAIL || null,
    mapUrl: process.env.NEXT_PUBLIC_OFFICIAL_MAP_URL || null,
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/ruangsejahtera.idn',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@ruangsejahtera.idn',
  },
} as const;

export function absoluteUrl(path = '/') {
  if (!siteConfig.url) return null;
  return new URL(path, siteConfig.url).toString();
}

export function whatsappUrl(message?: string) {
  const number = siteConfig.contact.whatsapp?.replace(/\D/g, '');
  if (!number) return null;
  const baseUrl = `https://wa.me/${number}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}
