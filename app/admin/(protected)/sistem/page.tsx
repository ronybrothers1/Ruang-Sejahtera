import { notFound } from 'next/navigation';
import { can, rolePermissions } from '@/lib/auth/permissions';
import { getBootstrapAuthStatus, requireAdminSession } from '@/lib/auth/admin-session';
import { getIdentityStatus } from '@/lib/auth/config';
import { getCmsWriteStatus } from '@/lib/cms/store';

export default async function AdminSystemPage() {
  const session = await requireAdminSession();
  if (!can(session.role, 'settings.manage') && !can(session.role, 'audit.read')) notFound();
  const auth = getBootstrapAuthStatus();
  const identity = getIdentityStatus();
  const cms = getCmsWriteStatus();
  return <div><p className="eyebrow">Sistem & Akses</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Konfigurasi yang belum aman tidak dianggap selesai.</h1><div className="mt-8 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-neutral-200 bg-white p-6"><h2 className="font-heading text-xl font-extrabold">Autentikasi</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Identity provider</dt><dd className="font-bold">{identity.clerk ? 'configured' : 'disabled'}</dd></div><div className="flex justify-between gap-4"><dt>Database</dt><dd className="font-bold">{identity.database ? 'configured' : 'disabled'}</dd></div><div className="flex justify-between gap-4"><dt>Webhook identity</dt><dd className="font-bold">{identity.productionReady ? 'configured' : 'disabled'}</dd></div><div className="flex justify-between gap-4"><dt>Bootstrap preview</dt><dd className="font-bold">{auth.configured ? 'configured' : 'disabled'}</dd></div></dl><p className="mt-5 text-sm leading-7 text-neutral-600">MFA diwajibkan pada Super Admin sebelum control plane dapat dibuka.</p></section><section className="rounded-2xl border border-neutral-200 bg-white p-6"><h2 className="font-heading text-xl font-extrabold">CMS persistence</h2><p className="mt-4 text-sm leading-7 text-neutral-600">Mode saat ini: <strong>{cms.mode}</strong>. {cms.reason}</p></section></div><section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6"><h2 className="font-heading text-xl font-extrabold">Permission efektif</h2><div className="mt-5 flex flex-wrap gap-2">{rolePermissions[session.role].map((permission) => <span key={permission} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-700">{permission}</span>)}</div></section></div>;
}
