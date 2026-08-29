import type { Metadata } from 'next';
import { Compass, Flag, HeartHandshake, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Visi & Misi', description: 'Visi dan misi Yayasan Ruang Sejahtera.' };

export default function VisionMissionPage() {
  const missions = [
    ['01','Hadir dekat dengan kebutuhan','Mengembangkan program sosial yang berangkat dari kebutuhan nyata masyarakat dan asesmen lapangan.'],
    ['02','Menjaga martabat penerima manfaat','Menyalurkan dukungan dengan pendekatan yang manusiawi, proporsional, dan menghormati privasi.'],
    ['03','Membangun kepercayaan publik','Membuka jejak program, kegiatan, dokumentasi, dampak, dan penggunaan dana secara mudah dipahami.'],
    ['04','Menguatkan kolaborasi','Menghubungkan masyarakat, relawan, donatur, dan mitra untuk menciptakan dampak yang lebih berkelanjutan.'],
  ] as const;
  return <>
    <PageHero eyebrow="Tentang Kami" title="Visi & Misi" description="Rumusan berikut adalah contoh sementara untuk menyempurnakan pengalaman visual halaman. Teks final akan diganti dengan visi dan misi yang telah disahkan yayasan." />
    <div className="sample-note"><strong>NARASI CONTOH</strong><span>Visi dan misi di halaman ini belum merupakan rumusan resmi yayasan.</span></div>
    <section className="section-pad section-white"><div className="shell vision-layout"><article className="vision-card"><Compass size={28}/><span>Visi · contoh sementara</span><h2>Menjadi ruang kepedulian yang menghadirkan kesejahteraan melalui aksi sosial yang nyata, inklusif, dan dapat dipercaya.</h2><p>Rumusan ini digunakan sementara untuk menilai hierarki konten dan desain halaman.</p></article><div className="mission-stack"><span className="eyebrow-v3">Misi</span>{missions.map(([n,title,description])=><article key={n}><span>{n}</span><div><h2>{title}</h2><p>{description}</p></div></article>)}</div></div></section>
    <section className="values-banner"><div className="shell values-banner-grid"><div><Flag size={23}/><strong>Arah yang jelas</strong><span>Program tumbuh dari fokus yang dipahami bersama.</span></div><div><HeartHandshake size={23}/><strong>Manusia sebagai pusat</strong><span>Martabat penerima manfaat dijaga dalam setiap proses.</span></div><div><ShieldCheck size={23}/><strong>Kepercayaan dijaga</strong><span>Informasi dan pertanggungjawaban menjadi bagian dari program.</span></div></div></section>
  </>;
}
