"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function RouteShell({ children, publicHeader, publicFooter, publicStructuredData }: { children: ReactNode; publicHeader: ReactNode; publicFooter: ReactNode; publicStructuredData?: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin) {
    return <main id="main-content" tabIndex={-1} className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {publicStructuredData}
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      {publicHeader}
      <main id="main-content" tabIndex={-1} className="min-h-screen">{children}</main>
      {publicFooter}
    </>
  );
}
