import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { requireUserSession } from '@/lib/auth/admin-session';
import { getCmsWriteStatus, listCmsRecords } from '@/lib/cms/store';
import { hasPassedExam } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export default async function MemberContentPage({ searchParams }: { searchParams: Promise<{ queued?: string; updated?: string; transitioned?: string; error?: string }> }) {
  const session = await requireUserSession();
  const query = await searchParams;
  const passed = session.role === 'member' && Boolean(session.identityProviderId) && await hasPassedExam(session.id);
  const cms = getCmsWriteStatus();
  const records = passed && cms.configured
    ? (await listCmsRecords()).filter((record) => 'category' in record && record.lastEditedBy === session.id)
    : [];

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 text-brand-ink md:px-6 md:py-12">
      <main className="mx-auto w-full max-w-5xl">
        <Link href="/akun" className="text-sm font-bold text-brand-red">← Kembali ke akun</Link>
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Konten anggota</p><h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight">Berita dan status kurasi Anda.</h1><p className="mt-4 max-w-2xl leading-7 text-neutral-600">Edit draft, tindak lanjuti permintaan revisi, dan pantau berita sampai diterbitkan.</p></div>
          {passed ? <Link href="/akun/konten/baru/berita" className="button-primary"><FilePlus2 size={17} aria-hidden="true" /> Buat berita</Link> : null}
        </div>

        {query.queued ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Draft berita berhasil disimpan.</div> : null}
        {query.updated ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Perubahan berhasil disimpan sebagai draft.</div> : null}
        {query.transitioned ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Berita berhasil dikirim untuk kurasi.</div> : null}
        {query.error ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Operasi konten belum berhasil. Silakan periksa kembali data Anda.</div> : null}
        {!passed ? <section className="status-message-warning mt-8 rounded-2xl border p-6"><h2 className="font-heading text-2xl font-extrabold">Lulus tes untuk mengelola berita.</h2><Link href="/akun/keanggotaan" className="button-primary mt-5 inline-flex">Buka keanggotaan & ujian</Link></section> : null}
        {passed && !cms.configured ? <section className="status-message-warning mt-8 rounded-2xl border p-6"><h2 className="font-heading text-2xl font-extrabold">Penyimpanan konten belum aktif.</h2><p className="mt-3 text-sm leading-6">Hubungkan database agar draft dapat disimpan dan dilacak.</p></section> : null}

        {passed && cms.configured ? <section className="mt-8 space-y-4" aria-label="Daftar berita milik Anda">
          {records.length ? records.map((record) => <article key={record.id} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-heading text-xl font-extrabold">{record.title}</h2><p className="mt-1 text-sm text-neutral-500">/{record.slug}</p></div><StatusBadge status={record.status} /></div>
            {record.reviewNote ? <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Catatan kurator:</strong> {record.reviewNote}</div> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              {record.status === 'draft' || record.status === 'revision_required' ? <Link href={`/akun/konten/edit/${record.id}`} className="button-secondary">Edit berita</Link> : null}
              {record.status === 'draft' || record.status === 'revision_required' ? <form action="/api/admin/content" method="post"><input type="hidden" name="intent" value="transition" /><input type="hidden" name="collection" value="articles" /><input type="hidden" name="id" value={record.id} /><input type="hidden" name="toStatus" value="pending_review" /><button type="submit" className="button-primary">Kirim untuk kurasi</button></form> : null}
              {record.status === 'published' ? <Link href={`/berita/${record.slug}`} className="button-secondary">Lihat terbitan</Link> : null}
            </div>
          </article>) : <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center"><h2 className="font-heading text-2xl font-extrabold">Belum ada berita.</h2><p className="mt-3 text-sm text-neutral-600">Buat draft pertama Anda untuk memulai alur kurasi.</p></div>}
        </section> : null}
      </main>
    </div>
  );
}
