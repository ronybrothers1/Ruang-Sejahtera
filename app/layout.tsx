import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import './responsive-preview-v8.css';
import './typography-audit-v6.css';
import './components-audit-v7.css';
import './media-audit-v8.css';
import './footer-audit-v9.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OrganizationJsonLd } from '@/components/OrganizationJsonLd';
import { WebsiteJsonLd } from '@/components/WebsiteJsonLd';
import { RouteShell } from '@/components/RouteShell';
import { IdentityProvider } from '@/components/auth/IdentityProvider';
import { siteConfig } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta', display: 'swap' });
const hasOfficialUrl = Boolean(siteConfig.url);

export const metadata: Metadata = {
  metadataBase: siteConfig.url ? new URL(siteConfig.url) : undefined,
  title: { default: siteConfig.name, template: `%s | ${siteConfig.shortName}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: 'nonprofit',
  alternates: { canonical: '/' },
  robots: { index: hasOfficialUrl, follow: hasOfficialUrl },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
    type: 'website',
    locale: 'id_ID',
    siteName: siteConfig.name,
    images: [{ url: '/brand/logo-ruang-sejahtera.webp', width: 1000, height: 453, alt: siteConfig.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/brand/logo-ruang-sejahtera.webp'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <IdentityProvider>
          <RouteShell publicHeader={<Navbar />} publicFooter={<Footer />} publicStructuredData={<><OrganizationJsonLd /><WebsiteJsonLd /></>}>
            {children}
          </RouteShell>
        </IdentityProvider>
      </body>
    </html>
  );
}
