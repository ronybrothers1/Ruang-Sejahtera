import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { BrandLogo } from '@/components/BrandLogo';
import { requireAdminSession } from '@/lib/auth/admin-session';

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-2"><BrandLogo compact /></div>
            <div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Control Plane</p><p className="mt-1 text-sm font-bold text-neutral-700">{session.role.replace('_', ' ')}</p></div>
          </div>
          <AdminNav role={session.role} />
          <div className="flex items-center gap-3">
            <Link href="/" className="button-secondary">Lihat Website</Link>
            <form action="/api/admin/logout" method="post"><button className="icon-button" type="submit" aria-label="Keluar dari admin"><LogOut size={18} aria-hidden="true" /></button></form>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">{children}</div>
    </div>
  );
}
