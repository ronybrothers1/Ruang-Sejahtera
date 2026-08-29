import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Nilai Kami',
  description: 'Ruang publikasi nilai kelembagaan Yayasan Ruang Sejahtera.',
};

export default function ValuesPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Nilai bukan hiasan. Ia harus terlihat dalam keputusan."
        description="Rumusan nilai kelembagaan akan ditampilkan setelah sah, konsisten dengan tata kelola, dan dapat diterjemahkan ke perilaku kerja."
      />
      <section className="trust-page-section">
        <div className="shell trust-single-column">
          <div className="trust-icon-intro">
            <ShieldCheck size={30} aria-hidden="true" />
            <span>Nilai kelembagaan</span>
            <h2>Website tidak boleh menetapkan nilai atas nama yayasan.</h2>
            <p>Daftar nilai contoh telah dihapus. Rumusan final perlu berasal dari otoritas internal dan menjelaskan makna, perilaku yang diharapkan, serta batas yang dijaga.</p>
          </div>
          <EmptyState
            eyebrow="Rumusan nilai"
            title="Nilai kelembagaan resmi belum dipublikasikan."
            description="Sementara itu, standar website tetap menjaga kejujuran data, aksesibilitas, privasi, keamanan, dan pemisahan antara draf internal dengan informasi publik."
            action={<Link href="/tentang-kami" className="trust-button trust-button-ink">Kembali ke profil <ArrowRight size={17} aria-hidden="true" /></Link>}
          />
        </div>
      </section>
    </>
  );
}
