import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export const metadata: Metadata = {
  title: 'Yayasan Ruang Sejahtera',
  description: 'Ruang untuk Berbagi, Jalan untuk Sejahtera. Yayasan sosial dan kemanusiaan.',
  openGraph: {
    title: 'Yayasan Ruang Sejahtera',
    description: 'Ruang untuk Berbagi, Jalan untuk Sejahtera. Yayasan sosial dan kemanusiaan.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yayasan Ruang Sejahtera',
    description: 'Ruang untuk Berbagi, Jalan untuk Sejahtera. Yayasan sosial dan kemanusiaan.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
