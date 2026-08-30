import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';
import { can } from '@/lib/auth/permissions';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { cmsActivities, cmsArticles, cmsGalleries } from '@/lib/cms/content';
import { getCmsWriteStatus, listCmsRecords } from '@/lib/cms/store';
import type { CmsRecord } from '@/lib/cms/types';
import type { PublicationStatus } from '@/lib/models';
import { StatusBadge } from '@/components/admin/StatusBadge';

function Collection({ title, items }: { title: string; items: Array<{ id: string; title: string; slug: string; status: PublicationStatus }> }) {
  return <section className="rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-center justify-between gap-4"><h2 className="font-heading text-xl font-extrabold">{title}</h2><span className="count-badge" aria-label={`${items.length} record`}>{items.length}</span></div>{items.length ? <div className="mt-5 divide-y divide-neutral-100">{items.map((item) => <div key={item.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-neutral-500">/{item.slug}</p></div><StatusBadge status={item.status} /></div>)}</div> : <p className="mt-5 text-sm leading-6 text-neutral-500">Belum ada record pada collection ini.</p>}</section>;
}

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ queued?: string }> }) {
  const session = await requireAdminSession();
  const cms = getCmsWriteStatus();
  const { queued } = await searchParams;
  const canCreate = can(session.role, 'content.create');
  const databaseRecords = cms.configured ? await listCmsRecords() : [];
  const mergeRecords = <T extends CmsRecord>(seed: T[], persisted: CmsRecord[]) => {
    const merged = new Map(seed.map((item) => [item.slug, item]));
    persisted.filter((item): item is T => (item as CmsRecord).slug.length > 0).forEach((item) => merged.set(item.slug, item));
    return Array.from(merged.values());
  };
  const articles = mergeRecords(cmsArticles, databaseRecords.filter((item) => 'category' in item));
  const activities = mergeRecords(cmsActivities, databaseRecords.filter((item) => 'programSlug' in item));
  const galleries = mergeRecords(cmsGalleries, databaseRecords.filter((item) => !('category' in item) && !('programSlug' in item)));

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">CMS Editorial</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Konten publik mengikuti kurasi, bukan tombol terbit instan.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Konten bergerak dari Draft ke Menunggu Kurasi, lalu diputuskan oleh Super Admin. Website publik hanya membaca konten berstatus Terbit.</p></div>{canCreate ? <div className="flex flex-wrap gap-2"><Link className="button-secondary" href="/admin/konten/baru/berita"><FilePlus2 size={17} aria-hidden="true" />Berita</Link><Link className="button-secondary" href="/admin/konten/baru/kegiatan"><FilePlus2 size={17} aria-hidden="true" />Kegiatan</Link><Link className="button-secondary" href="/admin/konten/baru/galeri"><FilePlus2 size={17} aria-hidden="true" />Galeri</Link></div> : null}</div>

      {queued ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Perubahan telah diterima backend. Record akan terlihat setelah persistence dan deployment berikutnya selesai.</div> : null}
      {!cms.configured ? <div role="status" className="status-message-warning mt-7 rounded-xl border p-5"><p className="font-bold">Backend tulis CMS masih fail-closed.</p><p className="mt-2 text-sm leading-6">Form dan workflow UI sudah tersedia, tetapi penyimpanan dinonaktifkan sampai persistence adapter resmi dikonfigurasi. Tidak ada data yang disimpan diam-diam di browser atau filesystem sementara.</p></div> : null}

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <Collection title="Berita" items={articles} />
        <Collection title="Kegiatan" items={activities} />
        <Collection title="Galeri" items={galleries} />
      </div>
    </div>
  );
}
