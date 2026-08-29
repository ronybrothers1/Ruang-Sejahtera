import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2 } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Legalitas',
  description: 'Ruang publikasi legalitas Yayasan Ruang Sejahtera.',
};

export default function LegalityPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Legalitas harus jelas tanpa membuka data yang dilindungi."
        description="Nomor, penerbit, tanggal, status, dan salinan dokumen hanya ditampilkan setelah diverifikasi serta dinilai aman untuk akses publik."
      />
      <section className="trust-page-section">
        <div className="shell trust-single-column">
          <div className="trust-icon-intro">
            <FileCheck2 size={30} aria-hidden="true" />
            <span>Identitas hukum</span>
            <h2>Placeholder legalitas telah dihapus dari halaman publik.</h2>
            <p>Nomor akta, pengesahan, perpajakan, dan dokumen administratif contoh dapat disalahpahami sebagai identitas resmi. Versi final dapat menggunakan metadata atau salinan yang telah direduksi bila diperlukan.</p>
          </div>
          <EmptyState
            eyebrow="Dokumen legal"
            title="Informasi legalitas resmi belum dipublikasikan."
            description="Setelah tersedia, setiap entri akan memuat jenis dokumen, nomor atau metadata yang layak ditampilkan, penerbit, tanggal, status, dan keterangan mengenai akses salinannya."
            action={<Link href="/kontak" className="trust-button trust-button-ink">Ajukan klarifikasi <ArrowRight size={17} aria-hidden="true" /></Link>}
          />
        </div>
      </section>
    </>
  );
}
