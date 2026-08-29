import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Sejarah', description: 'Sejarah Yayasan Ruang Sejahtera.' };

export default function HistoryPage() {
  const timeline = [
    ['2024','Gagasan kepedulian mulai dirumuskan','Sekelompok penggerak sosial mulai mengorganisasi bantuan berbasis kebutuhan masyarakat.'],
    ['2025','Gerakan diperluas','Kegiatan sosial berkembang dengan fokus kebutuhan dasar, pendidikan, dan respons kemanusiaan.'],
    ['2026','Penguatan tata kelola digital','Ruang Sejahtera mulai membangun pusat informasi, dokumentasi, dampak, dan transparansi publik yang lebih terstruktur.'],
  ] as const;
  return <>
    <PageHero eyebrow="Tentang Kami" title="Sejarah Yayasan" description="Timeline berikut adalah contoh sementara untuk menampilkan bagaimana perjalanan organisasi akan disajikan. Tahun dan peristiwa final harus diganti berdasarkan catatan resmi." />
    <div className="sample-note"><strong>TIMELINE CONTOH</strong><span>Tahun dan peristiwa berikut belum merupakan kronologi resmi Yayasan Ruang Sejahtera.</span></div>
    <section className="section-pad bg-[#f4f4f2]"><div className="shell history-layout"><div className="history-intro"><span className="eyebrow-v3">Perjalanan</span><h2 className="display-h2">Dari kepedulian menjadi gerakan yang lebih terstruktur.</h2><p>Sejarah final akan menghubungkan tonggak penting dengan dokumen, foto, tokoh, dan konteks yang dapat diverifikasi.</p></div><div className="history-timeline">{timeline.map(([year,title,description])=><article key={year}><span>{year}</span><div><h2>{title}</h2><p>{description}</p><small>PERISTIWA CONTOH SEMENTARA</small></div></article>)}</div></div></section>
  </>;
}
