import { CheckCircle2, Database, FileText, ShieldAlert } from 'lucide-react';
import { requireAdminSession, getBootstrapAuthStatus } from '@/lib/auth/admin-session';
import { cmsContentCounts } from '@/lib/cms/content';
import { getCmsWriteStatus } from '@/lib/cms/store';

function StatusCard({ label, value, detail, ok }: { label: string; value: string; detail: string; ok: boolean }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-neutral-500">{label}</p><p className="mt-3 font-heading text-2xl font-extrabold">{value}</p></div>{ok ? <CheckCircle2 className="text-emerald-600" size={22} /> : <ShieldAlert className="text-amber-600" size={22} />}</div><p className="mt-4 text-sm leading-6 text-neutral-600">{detail}</p></div>;
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const auth = getBootstrapAuthStatus();
  const cms = getCmsWriteStatus();
  const totalContent = cmsContentCounts.activities + cmsContentCounts.articles + cmsContentCounts.galleries;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Dashboard Admin</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Kontrol konten tanpa mengorbankan integritas data.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Panel ini memisahkan autentikasi, hak akses, registry publik, dan backend tulis. Fitur yang belum memiliki backend resmi tetap dinonaktifkan, bukan disimulasikan.</p></div><div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"><span className="font-bold">Role:</span> {session.role}</div></div>

      <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard label="Autentikasi" value={auth.configured ? 'Aktif' : 'Belum aktif'} detail="Bootstrap auth hanya untuk local/preview dan diblokir pada production." ok={auth.configured} />
        <StatusCard label="CMS Write" value={cms.configured ? 'Aktif' : 'Fail-closed'} detail={cms.reason} ok={cms.configured} />
        <StatusCard label="Registry" value={`${totalContent} record`} detail="Record tersimpan pada content/cms/*.json dan hanya status published yang masuk website publik." ok />
        <StatusCard label="Keamanan" value="RBAC aktif" detail="Navigasi dan operasi admin dibatasi berdasarkan matriks permission server-side." ok />
      </div>

      <section className="mt-9 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6"><FileText className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Konten editorial</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Berita</dt><dd className="font-bold">{cmsContentCounts.articles}</dd></div><div className="flex justify-between gap-4"><dt>Kegiatan</dt><dd className="font-bold">{cmsContentCounts.activities}</dd></div><div className="flex justify-between gap-4"><dt>Galeri</dt><dd className="font-bold">{cmsContentCounts.galleries}</dd></div></dl></div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6"><Database className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Source of truth</h2><p className="mt-4 text-sm leading-7 text-neutral-600">V2 tidak menyalin data dummy ke dashboard. Sampai persistence adapter produksi tersedia, repository JSON menjadi sumber baca yang deterministik dan dapat diaudit melalui Git.</p></div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6"><ShieldAlert className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Go-live gate</h2><p className="mt-4 text-sm leading-7 text-neutral-600">Production tetap membutuhkan identity provider + MFA, backend tulis CMS, storage media, backup/restore, audit log aplikasi, dan pengujian keamanan akhir.</p></div>
      </section>
    </div>
  );
}
