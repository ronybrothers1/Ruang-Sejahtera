import type { Metadata } from 'next';
import { BarChart3, FileSearch, MapPin, Users } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Dampak',
  description: 'Kerangka data dampak dan metodologi pelaporan Yayasan Ruang Sejahtera.',
};

const evidenceLayers = [
  ['01', 'Input', 'Dana, waktu relawan, logistik, dan sumber daya yang digunakan.', FileSearch],
  ['02', 'Output', 'Kegiatan, bantuan, layanan, dan wilayah yang benar-benar dijangkau.', MapPin],
  ['03', 'Outcome', 'Perubahan yang dialami penerima manfaat dalam periode yang dijelaskan.', Users],
  ['04', 'Evidence', 'Definisi, sumber, metode deduplikasi, dokumen, dan catatan keterbatasan.', BarChart3],
] as const;

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Dampak"
        title="Angka hanya bermakna jika cara menghitungnya dapat dijelaskan."
        description="Halaman dampak dirancang untuk memuat indikator yang memiliki definisi, periode, cakupan, sumber, dan metodologi yang dapat diperiksa."
      />
      <section className="trust-page-section">
        <div className="shell trust-evidence-layout">
          <div className="trust-page-intro">
            <div><span>Kerangka pengukuran</span><h2>Dari sumber daya menuju perubahan.</h2></div>
            <p>Pelaporan yang sehat membedakan apa yang digunakan, apa yang dikerjakan, siapa yang dijangkau, dan perubahan apa yang benar-benar dapat didukung bukti.</p>
          </div>
          <div className="trust-evidence-grid">
            {evidenceLayers.map(([number, title, description, Icon]) => (
              <article key={number}><span>{number}</span><Icon size={24} aria-hidden="true" /><h2>{title}</h2><p>{description}</p></article>
            ))}
          </div>
          <EmptyState
            eyebrow="Dataset dampak"
            title="Belum ada metrik dampak yang dipublikasikan."
            description="Kami tidak menampilkan jumlah penerima, kegiatan, wilayah, atau nilai penyaluran sebelum dataset sumber, periode, definisi indikator, dan metode perhitungannya tersedia."
          />
        </div>
      </section>
    </>
  );
}
