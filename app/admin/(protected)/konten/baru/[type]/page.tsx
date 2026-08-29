import Link from 'next/link';
import { notFound } from 'next/navigation';
import { can } from '@/lib/auth/permissions';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { getCmsWriteStatus } from '@/lib/cms/store';
import { programs } from '@/lib/content';
import type { CmsCollection } from '@/lib/cms/types';

const typeMap: Record<string, { label: string; collection: CmsCollection }> = {
  berita: { label: 'Berita', collection: 'articles' },
  kegiatan: { label: 'Kegiatan', collection: 'activities' },
  galeri: { label: 'Galeri', collection: 'galleries' },
};

export default async function NewContentPage({ params }: { params: Promise<{ type: string }> }) {
  const session = await requireAdminSession();
  if (!can(session.role, 'content.create')) notFound();
  const { type } = await params;
  const config = typeMap[type];
  if (!config) notFound();
  const cms = getCmsWriteStatus();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/konten" className="text-sm font-bold text-brand-red">← Kembali ke konten</Link>
      <p className="eyebrow mt-7">Record Baru</p>
      <h1 className="font-heading text-4xl font-extrabold tracking-tight">Buat {config.label}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-neutral-600">Record baru selalu dimulai sebagai draft. Publikasi harus melalui workflow dan permission terpisah.</p>

      {!cms.configured ? <div className="status-message-warning mt-7 rounded-xl border p-5 text-sm leading-6"><strong>Mode baca saja.</strong> Backend tulis CMS belum tersedia sehingga tombol simpan dinonaktifkan. Form ini tetap menunjukkan schema input produksi tanpa menyimpan data ke penyimpanan sementara.</div> : null}

      <form action="/api/admin/content" method="post" className="mt-8 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <input type="hidden" name="intent" value="create" />
        <input type="hidden" name="collection" value={config.collection} />
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold">Judul<input name="title" required maxLength={160} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <label className="text-sm font-bold">Slug<input name="slug" required maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="contoh-judul-kegiatan" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
        </div>

        {config.collection === 'articles' ? <>
          <label className="block text-sm font-bold">Kategori<input name="category" required maxLength={80} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <label className="block text-sm font-bold">Ringkasan<input name="excerpt" required maxLength={420} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <label className="block text-sm font-bold">Isi<textarea name="body" required maxLength={20000} rows={14} className="mt-2 w-full rounded-xl border border-neutral-300 p-4 font-normal leading-7" /></label>
        </> : null}

        {config.collection === 'activities' ? <>
          <label className="block text-sm font-bold">Ringkasan<input name="summary" required maxLength={500} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-bold">Tanggal kegiatan<input name="activityDate" type="date" required className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Lokasi<input name="locationLabel" required maxLength={180} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label></div>
          <label className="block text-sm font-bold">Program<select name="programSlug" required className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 font-normal"><option value="">Pilih program</option>{programs.map((program) => <option key={program.slug} value={program.slug}>{program.name}</option>)}</select></label>
          <label className="block text-sm font-bold">Isi<textarea name="body" required maxLength={20000} rows={12} className="mt-2 w-full rounded-xl border border-neutral-300 p-4 font-normal leading-7" /></label>
        </> : null}

        {config.collection === 'galleries' ? <label className="block text-sm font-bold">Ringkasan<textarea name="summary" required maxLength={700} rows={6} className="mt-2 w-full rounded-xl border border-neutral-300 p-4 font-normal leading-7" /></label> : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-6"><button type="submit" className="button-primary disabled:cursor-not-allowed disabled:opacity-45" disabled={!cms.configured}>Simpan sebagai Draft</button><Link href="/admin/konten" className="button-secondary">Batal</Link></div>
      </form>
    </div>
  );
}
