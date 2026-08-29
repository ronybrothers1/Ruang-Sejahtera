import type { Metadata } from 'next';
import { Accessibility, BarChart3, HeartHandshake, Scale, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Nilai Kami', description: 'Prinsip yang menjadi arah Yayasan Ruang Sejahtera.' };

export default function ValuesPage() {
  const values = [
    [HeartHandshake,'Kemanusiaan','Menempatkan martabat manusia dan kebutuhan masyarakat sebagai pusat setiap keputusan.'],
    [ShieldCheck,'Transparansi','Menyajikan jejak program dan informasi penggunaan sumber daya dengan bahasa yang dapat dipahami.'],
    [Scale,'Akuntabilitas','Menjaga tanggung jawab yang jelas dari perencanaan, pelaksanaan, dokumentasi, hingga laporan.'],
    [BarChart3,'Dampak','Mengukur hasil menggunakan definisi, periode, dan sumber data yang dapat ditelusuri.'],
    [Accessibility,'Aksesibilitas','Membuat informasi dan layanan digital dapat digunakan oleh sebanyak mungkin orang.'],
  ] as const;
  return <>
    <PageHero eyebrow="Tentang Kami" title="Nilai yang hidup dalam cara kami bekerja." description="Nilai berikut adalah contoh penyajian draft untuk menguji identitas visual dan struktur informasi. Rumusan final akan diselaraskan dengan prinsip resmi yayasan." />
    <div className="sample-note"><strong>RUMUSAN DRAFT</strong><span>Redaksi nilai masih dapat berubah mengikuti dokumen internal yayasan.</span></div>
    <section className="section-pad bg-[#f4f4f2]"><div className="shell values-editorial-grid">{values.map(([Icon,title,description],index)=><article className={index===0?'value-feature':''} key={title}><div className="value-number">0{index+1}</div><Icon size={28}/><h2>{title}</h2><p>{description}</p></article>)}</div></section>
  </>;
}
