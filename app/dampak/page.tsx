import type { Metadata } from 'next';
import { ArrowUpRight, BarChart3, FileSearch, MapPin, Users } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { sampleStats } from '@/lib/content';

export const metadata: Metadata = { title: 'Dampak', description: 'Data dampak dan metodologi pelaporan Yayasan Ruang Sejahtera.' };

const evidenceLayers = [
  ['01', 'Input', 'Dana, waktu relawan, logistik, dan sumber daya yang digunakan.', FileSearch],
  ['02', 'Output', 'Kegiatan, bantuan, layanan, dan wilayah yang dijangkau.', MapPin],
  ['03', 'Outcome', 'Perubahan yang dialami penerima manfaat pada periode terukur.', Users],
  ['04', 'Evidence', 'Definisi, sumber, metode deduplikasi, dan catatan keterbatasan.', BarChart3],
] as const;

export default function ImpactPage() {
  const icons = [Users, BarChart3, MapPin, ArrowUpRight];
  return (
    <>
      <PageHero eyebrow="Dampak" title="Dampak bukan sekadar angka. Ia harus menunjukkan perubahan." description="Dashboard mempertahankan indikator dan angka contoh agar sistem visualnya dapat dinilai sebelum dataset resmi menggantikannya." />
      <PreviewNotice label="Metrik contoh">Nilai berikut bukan data resmi. Struktur, definisi, periode, sumber, dan metodologi telah disiapkan untuk data final.</PreviewNotice>
      <section className="trust-page-section trust-impact-preview">
        <div className="shell">
          <div className="trust-impact-stat-grid">{sampleStats.map((item, index) => { const Icon = icons[index]; return <article key={item.label}><Icon size={23} aria-hidden="true" /><strong>{item.value}</strong><h2>{item.label}</h2><p>Periode contoh Januari sampai Mei 2026. Sumber dan metodologi akan dicantumkan pada data final.</p></article>; })}</div>
          <div className="trust-impact-method"><div><span>Kerangka pengukuran</span><h2>Dari sumber daya menuju perubahan yang terukur.</h2><p>Dashboard final membedakan apa yang digunakan, apa yang dikerjakan, siapa yang dijangkau, dan perubahan apa yang didukung bukti.</p></div><div className="trust-evidence-grid">{evidenceLayers.map(([number, title, description, Icon]) => <article key={number}><span>{number}</span><Icon size={24} aria-hidden="true" /><h2>{title}</h2><p>{description}</p></article>)}</div></div>
        </div>
      </section>
    </>
  );
}
