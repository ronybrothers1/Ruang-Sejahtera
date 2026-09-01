import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RichTextEditor } from '@/components/RichTextEditor';
import { MediaConsentFields } from '@/components/cms/MediaConsentFields';
import { requireUserSession } from '@/lib/auth/admin-session';
import { canEditContent } from '@/lib/auth/permissions';
import { listCmsRecords } from '@/lib/cms/store';
import { hasPassedExam } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export default async function MemberEditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireUserSession();
  if (session.role !== 'member' || !session.identityProviderId || !(await hasPassedExam(session.id))) notFound();
  const { id } = await params;
  const record = (await listCmsRecords()).find((item) => item.id === id);
  if (!record || !('category' in record) || !canEditContent(session.role, record.lastEditedBy, session.id) || !['draft', 'revision_required'].includes(record.status)) notFound();

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 text-brand-ink md:px-6 md:py-12">
      <main className="mx-auto w-full max-w-4xl">
        <Link href="/akun/konten" className="text-sm font-bold text-brand-red">← Kembali ke konten saya</Link>
        <p className="eyebrow mt-7">Edit berita</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight">{record.title}</h1>
        {record.reviewNote ? <div className="status-message-warning mt-6 rounded-xl border p-4 text-sm leading-6"><strong>Catatan kurator:</strong> {record.reviewNote}</div> : null}
        <p className="mt-4 max-w-2xl leading-7 text-neutral-600">Perubahan disimpan sebagai draft. Setelah selesai, kirim kembali dari halaman Konten saya untuk menjalani kurasi.</p>
        <form action="/api/admin/content" method="post" encType="multipart/form-data" className="mt-8 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="collection" value="articles" />
          <input type="hidden" name="id" value={record.id} />
          <label className="block text-sm font-bold">Judul<input name="title" required maxLength={160} defaultValue={record.title} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-bold">Slug<input name="slug" required maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={record.slug} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Kategori<input name="category" required maxLength={80} defaultValue={record.category} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label></div>
          <label className="block text-sm font-bold">Ganti gambar <span className="font-normal text-neutral-500">(opsional)</span><input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:font-semibold" /></label>
          <label className="block text-sm font-bold">Teks alternatif gambar <span className="font-normal text-neutral-500">(isi bila mengganti gambar)</span><input name="imageAlt" maxLength={160} placeholder="Contoh: Relawan membagikan paket pangan" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <label className="block text-sm font-bold">Keterangan gambar <span className="font-normal text-neutral-500">(opsional)</span><input name="imageCaption" maxLength={240} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <MediaConsentFields />
          <label className="block text-sm font-bold">Ringkasan<input name="excerpt" required maxLength={420} defaultValue={record.excerpt} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          <label className="block text-sm font-bold">Isi<RichTextEditor name="body" defaultValue={record.body} /></label>
          <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6"><button type="submit" className="button-primary">Simpan sebagai draft</button><Link href="/akun/konten" className="button-secondary">Batal</Link></div>
        </form>
      </main>
    </div>
  );
}
