import type { Metadata } from 'next';
import Image from 'next/image';
import { HeartHandshake, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { programs } from '@/lib/content';

export const metadata: Metadata = { title: 'Tentang Kami', description: 'Profil dan komitmen Yayasan Ruang Sejahtera.' };

export default function AboutPage() {
  const values = [[HeartHandshake,'Kemanusiaan','Menempatkan martabat dan kebutuhan masyarakat sebagai pusat keputusan.'],[ShieldCheck,'Akuntabilitas','Membangun jejak informasi yang dapat diperiksa dari program hingga laporan.'],[Scale,'Keadilan','Mengutamakan kebutuhan dan akses yang proporsional bagi kelompok rentan.'],[Sparkles,'Kolaborasi','Menghubungkan relawan, donatur, masyarakat, dan mitra dalam aksi yang terarah.']] as const;
  return (
    <>
      <PageHero eyebrow="Tentang Kami" title="Ruang untuk kepedulian. Sistem untuk menjaga kepercayaan." description="Konten profil pada draft ini merupakan contoh narasi desain dan akan diselaraskan dengan dokumen resmi yayasan sebelum publikasi final." />
      <div className="sample-note"><strong>PROFIL DRAFT</strong><span>Narasi profil, angka, wilayah, dan foto adalah contoh sementara.</span></div>
      <section className="section-pad section-white"><div className="shell about-editorial"><div className="about-photo"><Image src={programs[1].image} alt="Foto contoh kegiatan sosial" fill sizes="(max-width: 900px) 100vw, 48vw"/><span>FOTO CONTOH</span></div><div className="about-copy"><span className="eyebrow-v3">Siapa kami</span><h2 className="display-h2">Kebaikan perlu bergerak dengan hati—dan dikelola dengan disiplin.</h2><p>Yayasan Ruang Sejahtera dibayangkan sebagai ruang kolaborasi sosial yang dekat dengan kebutuhan masyarakat: kebutuhan dasar, pendidikan, hunian, tanggap kemanusiaan, dan pemberdayaan.</p><p>Website ini dirancang bukan hanya sebagai etalase, tetapi sebagai pusat bukti kerja: program, kegiatan, cerita, dampak, dokumentasi, struktur organisasi, dan transparansi publik berada dalam satu alur yang mudah ditelusuri.</p><div className="about-quote">“Kami ingin setiap bantuan meninggalkan manfaat yang dapat dirasakan dan jejak yang dapat dipertanggungjawabkan.”<small>KUTIPAN CONTOH SEMENTARA</small></div></div></div></section>
      <section className="section-pad bg-[#f4f4f2]"><div className="shell"><div className="center-heading"><span>Nilai kerja</span><h2>Prinsip yang menjaga arah.</h2></div><div className="value-grid-v3">{values.map(([Icon,title,description])=><article key={title}><Icon size={24}/><span>{title}</span><p>{description}</p></article>)}</div></div></section>
    </>
  );
}
