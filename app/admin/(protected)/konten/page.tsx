import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';
import { can } from '@/lib/auth/permissions';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { cmsActivities, cmsArticles, cmsGalleries } from '@/lib/cms/content';
import { getCmsWriteStatus, listCmsRecords } from '@/lib/cms/store';
import type { CmsRecord } from '@/lib/cms/types';
import { allowedPublicationTransitions, canTransitionPublication, transitionLabel } from '@/lib/cms/workflow';
import type { PublicationStatus } from '@/lib/models';
import { StatusBadge } from '@/components/admin/StatusBadge';

type CollectionItem = { id: string; title: string; slug: string; status: PublicationStatus; persisted?: boolean };

function WorkflowActions({ item, role, collection }: { item: CollectionItem; role: Parameters<typeof canTransitionPublication>[0]; collection: 'articles' | 'activities' | 'galleries' }) {
  if (!item.persisted) return <span className="text-xs text-neutral-400">Preview repository</span>;
  const transitions = allowedPublicationTransitions[item.status].filter((status) => canTransitionPublication(role, item.status, status));
  if (!transitions.length) return null;
  return <div className="flex flex-wrap gap-2">{transitions.map((toStatus) => <form action="/api/admin/content" method="post" key={toStatus}><input type="hidden" name="intent" value="transition" /><input type="hidden" name="collection" value={collection} /><input type="hidden" name="id" value={item.id} /><input type="hidden" name="toStatus" value={toStatus} /><button type="submit" className={toStatus === 'published' ? 'button-primary' : 'button-secondary'}>{transitionLabel(item.status, toStatus)}</button></form>)}</div>;
}

function Collection({ title, items, role, collection }: { title: string; items: CollectionItem[]; role: Parameters<typeof canTransitionPublication>[0]; collection: 'articles' | 'activities' | 'galleries' }) {
  return <section className="rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-center justify-between gap-4"><h2 className="font-heading text-xl font-extrabold">{title}</h2><span className="count-badge" aria-label={`${items.length} record`}>{items.length}</span></div>{items.length ? <div className="mt-5 divide-y divide-neutral-100">{items.map((item) => <div key={item.id} className="flex flex-col gap-3 py-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-neutral-500">/{item.slug}</p></div><StatusBadge status={item.status} /></div><WorkflowActions item={item} role={role} collection={collection} /></div>)}</div> : <p className="mt-5 text-sm leading-6 text-neutral-500">Belum ada record pada collection ini.</p>}</section>;
}

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ queued?: string; transitioned?: string; deleted?: string; error?: string }> }) {
  const session = await requireAdminSession();
  const cms = getCmsWriteStatus();
  const query = await searchParams;
  const canCreate = can(session.role, 'content.create');
  const databaseRecords = cms.configured ? await listCmsRecords() : [];
  const mergeRecords = <T extends CmsRecord>(seed: T[], persisted: CmsRecord[]) => {
    const merged = new Map<string, T & { persisted?: boolean }>(seed.map((item) => [item.slug, { ...item, persisted: false }]));
    persisted.filter((item) => item.slug.length > 0).forEach((item) => merged.set(item.slug, { ...item as T, persisted: true }));
    return Array.from(merged.values());
  };
  const articles = mergeRecords(cmsArticles, databaseRecords.filter((item) => 'category' in item));
  const activities = mergeRecords(cmsActivities, databaseRecords.filter((item) => 'programSlug' in item));
  const galleries = mergeRecords(cmsGalleries, databaseRecords.filter((item) => !('category' in item) && !('programSlug' in item)));

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">CMS Editorial</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Konten publik mengikuti kurasi.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Buat draft, kirim untuk kurasi, setujui, lalu terbitkan. Website publik hanya membaca konten berstatus Terbit dari database.</p></div>{canCreate ? <div className="flex flex-wrap gap-2"><Link className="button-secondary" href="/admin/konten/baru/berita"><FilePlus2 size={17} aria-hidden="true" />Berita</Link><Link className="button-secondary" href="/admin/konten/baru/kegiatan"><FilePlus2 size={17} aria-hidden="true" />Kegiatan</Link><Link className="button-secondary" href="/admin/konten/baru/galeri"><FilePlus2 size={17} aria-hidden="true" />Galeri</Link></div> : null}</div>
      {query.queued ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Draft tersimpan di database.</div> : null}
      {query.transitioned ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Status konten diperbarui. Jika sudah Terbit, konten akan masuk ke halaman publik.</div> : null}
      {query.deleted ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Konten diarsipkan dari daftar aktif.</div> : null}
      {query.error ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Operasi konten belum berhasil. Silakan coba lagi.</div> : null}
      {!cms.configured ? <div role="status" className="status-message-warning mt-7 rounded-xl border p-5"><p className="font-bold">Backend tulis CMS masih nonaktif.</p><p className="mt-2 text-sm leading-6">Form baru aktif setelah DATABASE_URL tersedia. Data contoh tetap diberi label Preview repository agar tidak tertukar dengan konten resmi.</p></div> : null}
      <div className="mt-8 grid gap-5 xl:grid-cols-3"><Collection title="Berita" items={articles} role={session.role} collection="articles" /><Collection title="Kegiatan" items={activities} role={session.role} collection="activities" /><Collection title="Galeri" items={galleries} role={session.role} collection="galleries" /></div>
    </div>
  );
}
