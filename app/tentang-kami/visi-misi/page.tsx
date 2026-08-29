import type { Metadata } from 'next';
import { Compass, Flag, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { SectionNavigation } from '@/components/SectionNavigation';
import { sampleMissions, sampleVision } from '@/lib/content';
import { aboutNavItems } from '@/lib/navigation';

export const metadata: Metadata = { title: 'Visi & Misi', description: 'Visi dan misi Yayasan Ruang Sejahtera.' };

export default function VisionMissionPage() {
  return (
    <>
      <PageHero eyebrow="Tentang Kami" title="Arah yang jelas membuat gerakan tetap selaras." description="Rumusan contoh dipertahankan untuk menilai struktur dan identitas visual halaman sebelum visi dan misi yang telah disahkan menggantikannya." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Tentang Kami', href: '/tentang-kami' }, { label: 'Visi & Misi' }]} />
      <SectionNavigation label="Jelajahi Tentang Kami" items={aboutNavItems} currentHref="/tentang-kami/visi-misi" />
      <PreviewNotice label="Narasi contoh">Visi dan misi berikut belum merupakan rumusan resmi yayasan.</PreviewNotice>
      <section className="trust-page-section trust-vision-section">
        <div className="shell trust-vision-layout">
          <article className="trust-vision-card"><Compass size={29} aria-hidden="true" /><span>VISI · CONTOH</span><h2>{sampleVision}</h2><p>Rumusan ini digunakan sementara untuk menilai hierarki konten dan desain halaman.</p></article>
          <div className="trust-mission-stack"><span>Misi</span>{sampleMissions.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{item.title}</h2><p>{item.description}</p></div></article>)}</div>
        </div>
      </section>
      <section className="trust-values-band">
        <div className="shell"><article><Flag size={23} /><strong>Arah yang jelas</strong><span>Program tumbuh dari fokus yang dipahami bersama.</span></article><article><HeartHandshake size={23} /><strong>Manusia sebagai pusat</strong><span>Martabat penerima manfaat dijaga dalam setiap proses.</span></article><article><ShieldCheck size={23} /><strong>Kepercayaan dijaga</strong><span>Informasi dan pertanggungjawaban menjadi bagian dari program.</span></article></div>
      </section>
    </>
  );
}
