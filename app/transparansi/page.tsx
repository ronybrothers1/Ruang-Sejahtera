import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, Landmark, ReceiptText, SearchCheck } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Transparansi',
  description: 'Laporan dan dokumen transparansi Yayasan Ruang Sejahtera.',
};

const publicationChecks = [
  [SearchCheck, 'Sumber dan periode', 'Setiap angka harus memiliki sumber, rentang waktu, serta definisi yang jelas.'],
  [ReceiptText, 'Rekonsiliasi', 'Penerimaan, penyaluran, biaya, dan saldo perlu disajikan dalam hubungan yang dapat diperiksa.'],
  [FileCheck2, 'Dokumen pendukung', 'Berkas hanya ditautkan setelah otoritas, versi, serta kelayakan publikasinya dipastikan.'],
] as const;

export default function TransparencyPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparansi"
        title="Kepercayaan tumbuh ketika informasi mudah diperiksa."
        description="Ruang ini disiapkan untuk laporan keuangan, penyaluran program, metodologi, dan dokumen publik yang telah melewati pemeriksaan."
      />
      <section className="trust-page-section">
        <div className="shell trust-transparency-layout">
          <div className="trust-transparency-intro">
            <Landmark size={30} aria-hidden="true" />
            <span>Standar publikasi</span>
            <h2>Lebih baik belum menampilkan angka daripada menampilkan angka yang belum dapat dipertanggungjawabkan.</h2>
            <p>Karena itu, nominal simulasi dan dokumen contoh telah dihapus dari halaman publik. Laporan akan tersedia setelah sumber, periode, rekonsiliasi, persetujuan, dan konteksnya lengkap.</p>
            <Link href="/kebijakan-donasi" className="trust-text-link">Baca kebijakan donasi <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="trust-check-list">
            {publicationChecks.map(([Icon, title, description]) => (
              <article key={title}><span><Icon size={21} aria-hidden="true" /></span><div><h2>{title}</h2><p>{description}</p></div></article>
            ))}
          </div>
          <div id="dokumen" className="trust-transparency-empty">
            <EmptyState
              eyebrow="Laporan & dokumen"
              title="Belum ada laporan resmi yang dipublikasikan."
              description="Bagian ini akan menampilkan judul dokumen, periode, tanggal terbit, penerbit, status pemeriksaan, format, dan tautan unduh setelah semuanya terverifikasi."
            />
          </div>
        </div>
      </section>
    </>
  );
}
