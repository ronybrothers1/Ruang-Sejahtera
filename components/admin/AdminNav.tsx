"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardCheck, FileText, Gauge, Settings, ShieldCheck } from 'lucide-react';
import type { AdminRole } from '@/lib/models';
import { can } from '@/lib/auth/permissions';

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const items = [
    { href: '/admin', label: 'Dashboard', icon: Gauge, show: true },
    { href: '/admin/konten', label: 'Konten', icon: FileText, show: can(role, 'content.read') },
    { href: '/admin/pengajuan', label: 'Pengajuan', icon: ClipboardCheck, show: can(role, 'membership.review') },
    { href: '/admin/transparansi', label: 'Transparansi', icon: ShieldCheck, show: can(role, 'finance.read') || can(role, 'reports.publish') },
    { href: '/admin/sistem', label: 'Sistem', icon: Settings, show: can(role, 'settings.manage') || can(role, 'audit.read') },
  ];

  return (
    <nav aria-label="Navigasi admin" className="flex flex-wrap gap-2">
      {items.filter((item) => item.show).map(({ href, label, icon: Icon }) => {
        const isCurrent = href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        const currentType = isCurrent ? (pathname === href ? 'page' : 'location') : undefined;
        return (
          <Link key={href} href={href} aria-current={currentType} className={`admin-nav-link inline-flex min-h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-700 hover:border-red-200 hover:text-brand-red ${isCurrent ? 'is-active' : ''}`}>
            <Icon size={17} aria-hidden="true" />{label}
          </Link>
        );
      })}
    </nav>
  );
}
