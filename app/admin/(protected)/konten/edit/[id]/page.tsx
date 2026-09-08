import Link from 'next/link';
import { notFound } from 'next/navigation';
import { canEditContent } from '@/lib/auth/permissions';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { listCmsRecords } from '@/lib/cms/store';
import { programs } from '@/lib/content';
import { RichTextEditor } from '@/components/RichTextEditor';

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  const { id } = await params;
  const record = (await listCmsRecords()).find((item) => item.id === id);
  if (!record || !canEditContent(session.role, record.lastEditedBy, session.id)) notFound();
  const isArticle = 'category' in record;
  const isActivity = 'programSlug' in record;
  if (!isArticle && !isActivity) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/konten" className="text-sm font-bold text-brand-red">← Kembali ke konten</Link>
      <p className="eyebrow mt-7">Edit {isArticle ? 'Berita' : 'Kegiatan'}</p>
      <h1 className="font-heading text-4xl font-extrabold tracking-tight">{record.title}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-neutral-600">Perubahan disimpan sebagai draft baru dan harus melewati kurasi sebelum tampil kembali di halaman publik.</p>
      <form action="/api/admin/content" method="post" encType="multipart/form-data" className="mt-8 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <input type="hidden" name="intent" value="update" />
        <input type="hidden" name="collection" value={isArticle ? 'articles' : 'activities'} />
        <input type="hidden" name="id" value={record.id} />
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold">Judul<input name="title" required maxLength={160} defaultValue={record.title} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <label className="text-sm font-bold">Slug<input name="slug" required maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={record.slug} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
        </div>
        {isArticle ? <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold">Kategori<input name="category" required maxLength={80} defaultValue={record.category} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <label className="text-sm font-bold">Ganti gambar <span className="font-normal text-neutral-500">(opsional)</span><input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:font-semibold" /><span className="mt-2 block text-xs font-normal text-neutral-500">Jika dipilih, isi teks alternatif gambar di bawah.</span></label>
        </div> : <>
          <label className="block text-sm font-bold">Ringkasan<input name="summary" required maxLength={500} defaultValue={record.summary} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-bold">Tanggal kegiatan<input name="activityDate" type="date" required defaultValue={record.activityDate} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Lokasi<input name="locationLabel" required maxLength={180} defaultValue={record.locationLabel} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label></div>
          <label className="block text-sm font-bold">Program<select name="programSlug" required defaultValue={record.programSlug} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 font-normal"><option value="">Pilih program</option>{programs.map((program) => <option key={program.slug} value={program.slug}>{program.name}</option>)}</select></label>
          <div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-bold">Ganti foto <span className="font-normal text-neutral-500">(opsional)</span><input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:font-semibold" /></label><label className="text-sm font-bold">URL video TikTok/Instagram <span className="font-normal text-neutral-500">(opsional)</span><input name="videoUrl" type="url" placeholder="https://..." className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label></div>
        </>}
        {isArticle ? <>
        <label className="block text-sm font-bold">Teks alternatif gambar <span className="font-normal text-neutral-500">(isi bila mengganti gambar)</span><input name="imageAlt" maxLength={160} placeholder="Contoh: Relawan membagikan paket pangan" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
        <label className="block text-sm font-bold">Keterangan gambar <span className="font-normal text-neutral-500">(opsional)</span><input name="imageCaption" maxLength={240} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
        <label className="block text-sm font-bold">Ringkasan<input name="excerpt" required maxLength={420} defaultValue={record.excerpt} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
        <label className="block text-sm font-bold">Isi<RichTextEditor name="body" defaultValue={record.body} /></label>
        </> : <>
          <div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-bold">Teks alternatif foto<input name="imageAlt" maxLength={160} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Keterangan foto<input name="imageCaption" maxLength={240} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label></div>
          <label className="block text-sm font-bold">Isi<RichTextEditor name="body" defaultValue={record.body} /></label>
        </>}
        <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6"><button type="submit" className="button-primary">Simpan sebagai Draft</button><Link href="/admin/konten" className="button-secondary">Batal</Link></div>
      </form>
    </div>
  );
}
