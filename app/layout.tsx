import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import './responsive-preview-v8.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OrganizationJsonLd } from '@/components/OrganizationJsonLd';
import { RouteShell } from '@/components/RouteShell';
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
  alternates: hasOfficialUrl ? { canonical: '/' } : undefined,
  robots: { index: hasOfficialUrl, follow: hasOfficialUrl },
  openGraph: { title: siteConfig.name, description: siteConfig.description, type: 'website', locale: 'id_ID', siteName: siteConfig.name },
  twitter: { card: 'summary_large_image', title: siteConfig.name, description: siteConfig.description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <RouteShell publicHeader={<Navbar />} publicFooter={<Footer />} publicStructuredData={<OrganizationJsonLd />}>
          {children}
        </RouteShell>
      </body>
    </html>
  );
}
