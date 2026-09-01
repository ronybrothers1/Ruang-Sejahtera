import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FilePlus2, Pencil, Send, Archive } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { can } from '@/lib/auth/permissions';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { getFinancialReport, listFinancialReports, formatRupiah } from '@/lib/finance';
import { isDatabaseConfigured } from '@/lib/auth/config';

const errorLabels: Record<string, string> = {
  database: 'Database belum tersambung. Laporan belum dapat disimpan.',
  save: 'Laporan belum tersimpan. Periksa koneksi database lalu coba lagi.',
  finance_period_invalid: 'Periode wajib diisi dan maksimal 80 karakter.',
  finance_date_invalid: 'Tanggal laporan wajib diisi dengan format yang valid.',
  finance_title_invalid: 'Judul wajib diisi dan maksimal 180 karakter.',
  finance_description_invalid: 'Uraian kegiatan wajib diisi dan maksimal 5.000 karakter.',
  finance_amount_invalid: 'Semua nominal harus berupa angka bulat nol atau lebih.',
  finance_report_not_found: 'Laporan tidak ditemukan.',
  operation: 'Operasi laporan tidak dikenali.',
  'not-found': 'Laporan tidak ditemukan.',
};

function dateLabel(value: string | null) {
  if (!value) return 'Belum diterbitkan';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));
}

export default async function AdminTransparencyPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string; published?: string; archived?: string; error?: string }> }) {
  const session = await requireAdminSession();
  if (!can(session.role, 'finance.read') && !can(session.role, 'reports.publish')) notFound();
  const query = await searchParams;
  const configured = isDatabaseConfigured();
  const reports = configured ? await listFinancialReports() : [];
  const editing = query.edit && configured ? await getFinancialReport(query.edit) : null;
  const canManage = session.role === 'super_admin' && can(session.role, 'finance.manage');

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Transparansi</p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">Laporan keuangan siap dikelola.</h1>
          <p className="mt-4 max-w-3xl leading-7 text-neutral-600">Super Admin dapat membuat, mengubah, menyimpan sebagai draft, menerbitkan, dan mengarsipkan laporan. Hanya laporan berstatus Terbit yang tampil di halaman publik.</p>
        </div>
        {canManage ? <Link href="/admin/transparansi" className="button-primary shrink-0"><FilePlus2 size={17} aria-hidden="true" />Laporan baru</Link> : null}
      </div>

      {!configured ? <div role="status" className="status-message-warning mt-7 rounded-xl border p-5"><p className="font-bold">Database belum tersambung.</p><p className="mt-2 text-sm leading-6">Form akan aktif setelah DATABASE_URL tersedia pada environment yang sedang digunakan.</p></div> : null}
      {query.error ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">{errorLabels[query.error] || 'Terjadi kesalahan pada laporan.'}</div> : null}
      {query.saved ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Laporan tersimpan sebagai draft.</div> : null}
      {query.published ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Laporan diterbitkan dan sudah dapat dibaca halaman publik.</div> : null}
      {query.archived ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Laporan diarsipkan dan tidak lagi tampil sebagai laporan aktif.</div> : null}

      {canManage ? <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <p className="eyebrow">{editing ? 'Edit laporan' : 'Laporan baru'}</p>
        <h2 className="font-heading text-2xl font-extrabold">{editing ? editing.title : 'Isi laporan keuangan'}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">Masukkan nominal rupiah tanpa titik atau simbol. Saldo dihitung otomatis dari penerimaan dikurangi penyaluran dan operasional.</p>
        <form action="/api/admin/financial-reports" method="post" className="mt-6 space-y-5">
          <input type="hidden" name="intent" value={editing ? 'update' : 'create'} />
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <div className="grid gap-5 md:grid-cols-3">
            <label className="text-sm font-bold">Tanggal laporan<input name="reportDate" type="date" required defaultValue={editing?.reportDate || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <label className="text-sm font-bold">Periode<input name="period" required maxLength={80} defaultValue={editing?.period || ''} placeholder="Contoh: Januari–Maret 2026" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <label className="text-sm font-bold">Judul laporan<input name="title" required maxLength={180} defaultValue={editing?.title || ''} placeholder="Contoh: Laporan Keuangan Triwulan I 2026" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          </div>
          <label className="block text-sm font-bold">Uraian kegiatan dan penggunaan dana<textarea name="description" required maxLength={5000} rows={5} defaultValue={editing?.description || ''} placeholder="Jelaskan kegiatan, penerima manfaat, lokasi, dan penggunaan dana pada periode ini." className="mt-2 w-full rounded-xl border border-neutral-300 p-4 font-normal leading-7" /><span className="mt-2 block text-xs font-normal text-neutral-500">Uraian ini ikut tampil pada halaman Transparansi setelah laporan diterbitkan.</span></label>
          <div className="grid gap-5 md:grid-cols-3">
            <label className="text-sm font-bold">Total penerimaan<input name="totalIncome" required inputMode="numeric" pattern="[0-9]+" defaultValue={editing?.totalIncome ?? ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <label className="text-sm font-bold">Total penyaluran<input name="totalDisbursement" required inputMode="numeric" pattern="[0-9]+" defaultValue={editing?.totalDisbursement ?? ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
            <label className="text-sm font-bold">Biaya operasional<input name="operationalCost" required inputMode="numeric" pattern="[0-9]+" defaultValue={editing?.operationalCost ?? ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-5"><button type="submit" className="button-primary">{editing ? 'Simpan perubahan' : 'Simpan sebagai draft'}</button>{editing ? <Link href="/admin/transparansi" className="button-secondary">Batal edit</Link> : null}</div>
        </form>
      </section> : null}

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Data laporan</p><h2 className="font-heading text-2xl font-extrabold">Riwayat laporan keuangan</h2></div><span className="count-badge">{reports.length}</span></div>
        {reports.length ? <div className="mt-6 space-y-4">{reports.map((report) => <article key={report.id} className="rounded-xl border border-neutral-200 p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h3 className="font-bold">{report.title}</h3><StatusBadge status={report.status} /></div><p className="mt-1 text-sm text-neutral-500">Tanggal {dateLabel(report.reportDate)} · {report.period} · diperbarui {dateLabel(report.updatedAt)}</p><p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{report.description}</p><div className="mt-4 grid gap-3 text-sm sm:grid-cols-4"><span><small className="block text-neutral-500">Penerimaan</small><strong>{formatRupiah(report.totalIncome)}</strong></span><span><small className="block text-neutral-500">Penyaluran</small><strong>{formatRupiah(report.totalDisbursement)}</strong></span><span><small className="block text-neutral-500">Operasional</small><strong>{formatRupiah(report.operationalCost)}</strong></span><span><small className="block text-neutral-500">Saldo</small><strong>{formatRupiah(report.balance)}</strong></span></div></div>{canManage ? <div className="flex flex-wrap gap-2"><Link href={`/admin/transparansi?edit=${report.id}`} className="button-secondary"><Pencil size={15} aria-hidden="true" />Edit</Link>{report.status !== 'published' ? <form action="/api/admin/financial-reports" method="post"><input type="hidden" name="intent" value="publish" /><input type="hidden" name="id" value={report.id} /><button type="submit" className="button-primary"><Send size={15} aria-hidden="true" />Terbitkan</button></form> : <form action="/api/admin/financial-reports" method="post"><input type="hidden" name="intent" value="archive" /><input type="hidden" name="id" value={report.id} /><button type="submit" className="button-secondary"><Archive size={15} aria-hidden="true" />Arsipkan</button></form>}</div> : null}</div></article>)}</div> : <p className="mt-5 text-sm leading-6 text-neutral-500">Belum ada laporan. Buat laporan pertama untuk mengaktifkan integrasi transparansi publik.</p>}
      </section>
    </div>
  );
}
