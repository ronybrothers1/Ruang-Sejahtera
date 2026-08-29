import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Sejarah',
  description: 'Ruang publikasi sejarah Yayasan Ruang Sejahtera.',
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Sejarah harus ditulis dari catatan, bukan perkiraan."
        description="Kronologi yayasan akan dipublikasikan setelah tahun, peristiwa, tokoh, dan dokumen pendukungnya dapat diverifikasi."
      />
      <section className="trust-page-section">
        <div className="shell trust-single-column">
          <div className="trust-icon-intro">
            <Clock3 size={30} aria-hidden="true" />
            <span>Jejak kelembagaan</span>
            <h2>Timeline contoh dapat berubah menjadi informasi palsu jika dibiarkan tampil.</h2>
            <p>Karena itu, tahun dan peristiwa simulasi telah dihapus. Sejarah final harus membedakan fakta terdokumentasi, kesaksian, dan konteks yang masih memerlukan konfirmasi.</p>
          </div>
          <EmptyState
            eyebrow="Kronologi resmi"
            title="Sejarah yayasan belum dipublikasikan."
            description="Halaman ini nantinya akan menghubungkan tonggak penting dengan tanggal, dokumen, foto, serta keterangan yang cukup agar pembaca memahami konteksnya."
            action={<Link href="/tentang-kami/legalitas" className="trust-button trust-button-ink">Periksa ruang legalitas <ArrowRight size={17} aria-hidden="true" /></Link>}
          />
        </div>
      </section>
    </>
  );
}
