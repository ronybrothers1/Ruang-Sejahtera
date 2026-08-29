import Link from 'next/link';
import { FileText, Gauge, Settings, ShieldCheck } from 'lucide-react';
import type { AdminRole } from '@/lib/models';
import { can } from '@/lib/auth/permissions';

export function AdminNav({ role }: { role: AdminRole }) {
  const items = [
    { href: '/admin', label: 'Dashboard', icon: Gauge, show: true },
    { href: '/admin/konten', label: 'Konten', icon: FileText, show: can(role, 'content.read') },
    { href: '/admin/transparansi', label: 'Transparansi', icon: ShieldCheck, show: can(role, 'finance.read') || can(role, 'reports.publish') },
    { href: '/admin/sistem', label: 'Sistem', icon: Settings, show: can(role, 'settings.manage') || can(role, 'audit.read') },
  ];

  return (
    <nav aria-label="Navigasi admin" className="flex flex-wrap gap-2">
      {items.filter((item) => item.show).map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-700 hover:border-red-200 hover:text-brand-red">
          <Icon size={17} aria-hidden="true" />{label}
        </Link>
      ))}
    </nav>
  );
}
