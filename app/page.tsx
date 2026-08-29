import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileCheck2, HeartHandshake, MapPinned, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { EmptyState } from '@/components/EmptyState';
import { SectionHeading } from '@/components/SectionHeading';
import { programs, trustPrinciples } from '@/lib/content';

export default function Home() {
  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="absolute inset-y-0 right-0 w-[42%] bg-brand-red max-lg:hidden" aria-hidden="true" />
        <div className="absolute right-[29%] top-0 h-full w-px rotate-[24deg] bg-white/15 max-lg:hidden" aria-hidden="true" />
        <div className="shell relative grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
          <div className="relative z-10 max-w-3xl">
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[.18em] text-red-300">Yayasan sosial & kemanusiaan</p>
            <h1 className="font-heading text-5xl font-extrabold leading-[1.02] tracking-[-.055em] sm:text-6xl lg:text-7xl">Ruang untuk berbagi. Kerja sosial yang dapat dilihat dan dipertanggungjawabkan.</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-neutral-300 md:text-lg">Ruang Sejahtera membangun kepercayaan melalui program yang jelas, dokumentasi yang patut, data yang dapat ditelusuri, dan transparansi yang tidak mengandalkan klaim kosong.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/kegiatan" className="button-primary">Lihat Kegiatan <ArrowRight size={18} /></Link>
              <Link href="/transparansi" className="button-secondary border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">Lihat Transparansi</Link>
            </div>
          </div>
          <div className="relative z-10 lg:pl-10">
            <div className="brand-grid mx-auto max-w-md border border-white/15 bg-white p-7 shadow-2xl lg:ml-auto">
              <BrandLogo />
              <div className="mt-6 border-t border-neutral-200 pt-5 text-sm leading-7 text-neutral-600">Identitas visual menggunakan logo resmi yang diberikan yayasan. Logo tidak digambar ulang dan tidak diubah proporsinya.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white py-10">
        <div className="shell grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustPrinciples.map(([title, description], index) => {
            const icons = [HeartHandshake, FileCheck2, ShieldCheck, CheckCircle2];
            const Icon = icons[index];
            return <div key={title} className="border-l-2 border-brand-red pl-4"><Icon size={19} className="mb-3 text-brand-red" /><h2 className="font-bold text-brand-ink">{title}</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p></div>;
          })}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell">
          <SectionHeading eyebrow="Program" title="Fokus kerja yang mudah dipahami" description="Setiap program memiliki halaman sendiri agar publik dapat menelusuri tujuan, kegiatan terkait, dokumentasi, dampak, dan laporan ketika data resminya tersedia." action={<Link className="button-secondary" href="/program">Semua Program <ArrowRight size={17} /></Link>} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => <Link key={program.slug} href={`/program/${program.slug}`} className="group border border-neutral-200 bg-white p-7 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"><div className="mb-8 flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">{program.focus}</span><span className="font-heading text-2xl font-extrabold text-neutral-300">0{index + 1}</span></div><h3 className="font-heading text-xl font-bold tracking-tight text-brand-ink group-hover:text-brand-red">{program.name}</h3><p className="mt-3 text-sm leading-7 text-neutral-600">{program.summary}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">Lihat program <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-20 md:py-28">
        <div className="shell">
          <SectionHeading eyebrow="Kegiatan" title="Bukti kerja ditempatkan sebelum klaim" description="Kegiatan terbaru akan ditampilkan berdasarkan data resmi yang telah melalui proses editorial. Sistem tidak mengisi kegiatan, foto, tanggal, atau penerima manfaat secara otomatis." />
          <EmptyState title="Belum ada kegiatan yang dipublikasikan di sistem V2" description="Setelah data kegiatan resmi dimigrasikan melalui CMS, bagian ini akan menampilkan tanggal, lokasi, program, ringkasan, serta dokumentasi yang memiliki status publikasi dan persetujuan yang sesuai." action={<Link href="/kegiatan" className="button-secondary">Buka Arsip Kegiatan</Link>} />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div><p className="eyebrow">Dampak</p><h2 className="section-title">Angka tidak boleh lebih cepat daripada bukti.</h2><p className="section-description">Dashboard dampak V2 hanya akan menampilkan angka setelah sumber data, periode, dan metodologinya tersedia. Tidak ada angka penerima manfaat, kegiatan, wilayah, atau donatur yang dibuat untuk mengisi tampilan.</p><Link href="/dampak" className="button-primary mt-7">Metodologi Dampak <ArrowRight size={17} /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Penerima manfaat', 'Kegiatan sosial', 'Wilayah terjangkau', 'Donatur'].map((label) => <div key={label} className="stat-placeholder"><p className="text-sm font-bold text-neutral-500">{label}</p><p className="mt-5 font-heading text-2xl font-extrabold text-brand-ink">Belum dipublikasikan</p><p className="mt-2 text-xs leading-5 text-neutral-500">Menunggu sumber data resmi.</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-brand-black py-20 text-white md:py-28">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center">
          <div><p className="mb-3 text-xs font-extrabold uppercase tracking-[.16em] text-red-300">Transparansi</p><h2 className="font-heading text-4xl font-extrabold tracking-[-.04em] md:text-5xl">Lebih baik kosong daripada angka yang tidak dapat dibuktikan.</h2><p className="mt-6 max-w-xl text-base leading-8 text-neutral-300">Halaman transparansi disiapkan untuk laporan penerimaan, penyaluran, biaya operasional, program, dan dokumen. Sampai data resmi tersedia, sistem menampilkan status kosong yang jujur.</p></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="border border-white/15 bg-white/5 p-6"><FileCheck2 className="text-red-300" /><h3 className="mt-5 font-bold">Dokumen terhubung</h3><p className="mt-2 text-sm leading-6 text-neutral-400">Setiap laporan dapat memiliki periode, tanggal publikasi, status, dan berkas pendukung.</p></div><div className="border border-white/15 bg-white/5 p-6"><MapPinned className="text-red-300" /><h3 className="mt-5 font-bold">Dapat ditelusuri</h3><p className="mt-2 text-sm leading-6 text-neutral-400">Data dapat dihubungkan ke program dan kegiatan agar konteks penggunaan dana tidak terputus.</p></div><Link href="/transparansi" className="button-primary sm:col-span-2">Buka Transparansi <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="py-20 md:py-28"><div className="shell border border-red-100 bg-red-50 p-8 md:p-12"><div className="max-w-3xl"><p className="eyebrow">Dukungan publik</p><h2 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">Donasi online hanya diaktifkan setelah kanal pembayaran resmi siap.</h2><p className="mt-4 leading-8 text-neutral-700">Website tidak menampilkan rekening, QRIS, status keamanan transaksi, atau payment gateway fiktif. Halaman donasi saat ini menjelaskan alur dan standar keamanan yang akan digunakan.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/donasi" className="button-primary">Pelajari Donasi</Link><Link href="/kontak" className="button-secondary">Hubungi Yayasan</Link></div></div></div></section>
    </div>
  );
}
