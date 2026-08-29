import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administrasi',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div data-admin-root className="min-h-screen bg-neutral-100 text-brand-ink">{children}</div>;
}
