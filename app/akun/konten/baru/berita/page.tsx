import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import { requireUserSession } from '@/lib/auth/admin-session';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import { getCmsWriteStatus } from '@/lib/cms/store';
import { hasPassedExam } from '@/lib/membership';
import { RichTextEditor } from '@/components/RichTextEditor';
import { MediaConsentFields } from '@/components/cms/MediaConsentFields';

export const dynamic = 'force-dynamic';

export default async function MemberNewsPage() {
  const session = await requireUserSession();
  if (session.role !== 'member' || !session.identityProviderId) {
    return <div className="grid min-h-screen place-items-center bg-neutral-100 p-6"><Link href="/akun" className="button-primary">Kembali ke akun</Link></div>;
  }

  const profile = await findUserByIdentityProviderId(session.identityProviderId);
  const passed = Boolean(profile && await hasPassedExam(profile.id));
  const cms = getCmsWriteStatus();

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 text-brand-ink md:px-6 md:py-12">
      <main className="mx-auto w-full max-w-4xl">
        <Link href="/akun/konten" className="text-sm font-bold text-brand-red">← Kembali ke konten saya</Link>
        <p className="eyebrow mt-7">Konten anggota</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight">Kirim berita untuk dikurasi.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-neutral-600">Berita yang Anda kirim masuk sebagai draft dan akan diperiksa melalui alur kurasi. Berita belum langsung tampil di website publik.</p>

        {!passed ? (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <LockKeyhole className="text-amber-700" size={24} />
            <h2 className="mt-4 font-heading text-2xl font-extrabold">Fitur ini terbuka setelah lulus tes.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">Selesaikan tes dasar keanggotaan terlebih dahulu.</p>
            <Link href="/akun/keanggotaan" className="button-primary mt-5 inline-flex">Ikuti tes</Link>
          </section>
        ) : !cms.configured ? (
          <section className="status-message-warning mt-8 rounded-2xl border p-6"><p className="font-bold">Penyimpanan berita belum aktif.</p><p className="mt-2 text-sm leading-6">Hubungkan database sebelum berita dapat disimpan.</p></section>
        ) : (
          <form action="/api/admin/content" method="post" encType="multipart/form-data" className="mt-8 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
            <input type="hidden" name="intent" value="create" />
            <input type="hidden" name="collection" value="articles" />
            <label className="block text-sm font-bold">Judul<input name="title" required maxLength={160} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="text-sm font-bold">Slug<input name="slug" required maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="contoh-berita-kegiatan" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
              <label className="text-sm font-bold">Kategori<input name="category" required maxLength={80} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            </div>
            <label className="block text-sm font-bold">Gambar berita<input name="imageFile" type="file" required accept="image/jpeg,image/png,image/webp" className="mt-2 block min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:font-semibold" /><span className="mt-2 block text-xs font-normal text-neutral-500">JPG, PNG, atau WEBP, maksimal 2 MB.</span></label>
            <label className="block text-sm font-bold">Teks alternatif gambar<input name="imageAlt" required maxLength={160} placeholder="Contoh: Relawan membagikan bantuan" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <label className="block text-sm font-bold">Keterangan gambar <span className="font-normal text-neutral-500">(opsional)</span><input name="imageCaption" maxLength={240} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <MediaConsentFields required />
            <label className="block text-sm font-bold">Ringkasan<input name="excerpt" required maxLength={420} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <label className="block text-sm font-bold">Isi<RichTextEditor name="body" /></label>
            <button type="submit" className="button-primary">Simpan berita sebagai draft</button>
          </form>
        )}
      </main>
    </div>
  );
}
