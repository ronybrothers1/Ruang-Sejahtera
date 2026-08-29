import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Visi & Misi',
  description: 'Ruang publikasi visi dan misi Yayasan Ruang Sejahtera.',
};

export default function VisionMissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Visi dan misi harus mengikuti rumusan yang disahkan."
        description="Halaman ini disiapkan untuk menampilkan arah kelembagaan tanpa mengganti dokumen resmi dengan narasi contoh."
      />
      <section className="trust-page-section">
        <div className="shell trust-single-column">
          <div className="trust-icon-intro">
            <Compass size={30} aria-hidden="true" />
            <span>Arah kelembagaan</span>
            <h2>Rumusan resmi lebih penting daripada kalimat yang sekadar terdengar baik.</h2>
            <p>Visi dan misi contoh telah dihapus. Konten akan dipublikasikan setelah diselaraskan dengan dokumen dan keputusan internal yayasan.</p>
          </div>
          <EmptyState
            eyebrow="Visi & misi"
            title="Rumusan resmi belum dipublikasikan."
            description="Setelah tersedia, halaman ini akan membedakan visi sebagai arah jangka panjang dan misi sebagai pilihan tindakan kelembagaan yang dapat diterjemahkan ke dalam program."
            action={<Link href="/program" className="trust-button trust-button-ink">Lihat program yang tersedia <ArrowRight size={17} aria-hidden="true" /></Link>}
          />
        </div>
      </section>
    </>
  );
}
