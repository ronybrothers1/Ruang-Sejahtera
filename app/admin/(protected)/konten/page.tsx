import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';
import { can } from '@/lib/auth/permissions';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { cmsActivities, cmsArticles, cmsGalleries } from '@/lib/cms/content';
import { getCmsWriteStatus } from '@/lib/cms/store';
import type { PublicationStatus } from '@/lib/models';

const statusLabel: Record<PublicationStatus, string> = {
  draft: 'Draft',
  review: 'Review',
  published: 'Published',
  archived: 'Archived',
};

function Collection({ title, items }: { title: string; items: Array<{ id: string; title: string; slug: string; status: PublicationStatus }> }) {
  return <section className="rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-center justify-between gap-4"><h2 className="font-heading text-xl font-extrabold">{title}</h2><span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">{items.length}</span></div>{items.length ? <div className="mt-5 divide-y divide-neutral-100">{items.map((item) => <div key={item.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-neutral-500">/{item.slug}</p></div><span className="w-fit rounded-full border border-neutral-200 px-3 py-1 text-xs font-bold text-neutral-600">{statusLabel[item.status]}</span></div>)}</div> : <p className="mt-5 text-sm leading-6 text-neutral-500">Belum ada record pada collection ini.</p>}</section>;
}

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ queued?: string }> }) {
  const session = await requireAdminSession();
  const cms = getCmsWriteStatus();
  const { queued } = await searchParams;
  const canCreate = can(session.role, 'content.create');

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">CMS Editorial</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Konten publik mengikuti workflow, bukan tombol publish instan.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Registry menyimpan draft, review, published, dan archived. Website publik hanya membaca record berstatus published.</p></div>{canCreate ? <div className="flex flex-wrap gap-2"><Link className="button-secondary" href="/admin/konten/baru/berita"><FilePlus2 size={17} />Berita</Link><Link className="button-secondary" href="/admin/konten/baru/kegiatan"><FilePlus2 size={17} />Kegiatan</Link><Link className="button-secondary" href="/admin/konten/baru/galeri"><FilePlus2 size={17} />Galeri</Link></div> : null}</div>

      {queued ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Perubahan telah diterima backend. Record akan terlihat setelah persistence dan deployment berikutnya selesai.</div> : null}
      {!cms.configured ? <div role="status" className="status-message-warning mt-7 rounded-xl border p-5"><p className="font-bold">Backend tulis CMS masih fail-closed.</p><p className="mt-2 text-sm leading-6">Form dan workflow UI sudah tersedia, tetapi penyimpanan dinonaktifkan sampai persistence adapter resmi dikonfigurasi. Tidak ada data yang disimpan diam-diam di browser atau filesystem sementara.</p></div> : null}

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <Collection title="Berita" items={cmsArticles} />
        <Collection title="Kegiatan" items={cmsActivities} />
        <Collection title="Galeri" items={cmsGalleries} />
      </div>
    </div>
  );
}
