import type { Metadata } from 'next';
import { ArrowUpRight, BarChart3, MapPin, Users } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { sampleStats } from '@/lib/content';

export const metadata: Metadata = { title: 'Dampak', description: 'Data dampak dan metodologi pelaporan Yayasan Ruang Sejahtera.' };

export default function ImpactPage() {
  const icons = [Users, BarChart3, MapPin, ArrowUpRight];
  return (
    <>
      <PageHero eyebrow="Dampak" title="Dampak bukan sekadar angka. Ia harus menunjukkan perubahan." description="Untuk kebutuhan evaluasi desain, halaman ini menggunakan indikator dan angka contoh. Seluruh nilai akan diganti setelah dataset dampak resmi tersedia." />
      <div className="sample-note"><strong>METRIK CONTOH</strong><span>Angka berikut bukan data resmi dan hanya digunakan untuk membangun dashboard dampak yang utuh.</span></div>
      <section className="section-pad bg-[#f4f4f2]"><div className="shell impact-number-grid">{sampleStats.map((item,index) => { const Icon=icons[index]; return <article key={item.label}><Icon size={23}/><strong>{item.value}</strong><h2>{item.label}</h2><p>Periode contoh: Januari–Mei 2026. Sumber dan metodologi akan dicantumkan pada data final.</p></article>; })}</div></section>
      <section className="section-pad section-white"><div className="shell impact-story-layout"><div><span className="eyebrow-v3">Cara membaca dampak</span><h2 className="display-h2">Dari output menuju perubahan yang terukur.</h2><p className="section-description">Dashboard final tidak hanya menampilkan berapa bantuan yang disalurkan. Setiap metrik akan diberi definisi, periode, sumber, cakupan wilayah, metode deduplikasi, dan catatan perubahan agar publik memahami apa yang sebenarnya diukur.</p></div><div className="impact-ladder">{[['01','Input','Dana, relawan, logistik, dan sumber daya.'],['02','Output','Kegiatan, paket bantuan, layanan, dan jangkauan.'],['03','Outcome','Perubahan yang dirasakan penerima manfaat.'],['04','Evidence','Dokumen, data sumber, evaluasi, dan laporan.']].map(([n,t,d])=><div key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</div></div></section>
    </>
  );
}
