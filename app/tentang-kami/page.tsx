import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileCheck2, HeartHandshake, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { SectionNavigation } from '@/components/SectionNavigation';
import { programs } from '@/lib/content';
import { aboutNavItems } from '@/lib/navigation';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Tentang Kami',
  description: 'Profil dan ruang akuntabilitas Yayasan Ruang Sejahtera.',
  path: '/tentang-kami',
});

const publicPrinciples = [
  [HeartHandshake, 'Martabat manusia', 'Informasi dan dokumentasi bantuan perlu menjaga martabat, privasi, dan konteks penerima manfaat.'],
  [ShieldCheck, 'Kejujuran informasi', 'Data contoh tidak boleh tampil seolah-olah fakta kegiatan, dampak, keuangan, atau legalitas.'],
  [Scale, 'Tanggung jawab', 'Program, keputusan, dan penggunaan sumber daya memerlukan pemilik tanggung jawab yang jelas.'],
  [Sparkles, 'Kolaborasi', 'Ruang publik membantu masyarakat, relawan, donatur, dan mitra memahami cara terlibat.'],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Ruang untuk kepedulian. Sistem untuk menjaga kepercayaan."
        description="Website ini menyatukan informasi program, kegiatan, akuntabilitas, kebijakan, dan kanal komunikasi Yayasan Ruang Sejahtera."
      />
      <SectionNavigation label="Jelajahi Tentang Kami" items={aboutNavItems} currentHref="/tentang-kami" />
      <PreviewNotice label="Profil draft">Narasi profil, kutipan, dan visual pendukung adalah contoh sementara yang mempertahankan komposisi halaman hingga materi resmi tersedia.</PreviewNotice>
      <section className="trust-page-section">
        <div className="shell trust-about-layout">
          <div className="trust-about-brand">
            <Image src={programs[1].image} alt={programs[1].imageAlt} fill priority sizes="(max-width: 900px) 100vw, 44vw" />
            <span className="preview-chip">{programs[1].imageLabel}</span>
          </div>
          <div className="trust-about-copy">
            <span>Profil publik</span>
            <h2>Kepedulian perlu dikelola dengan disiplin.</h2>
            <p>Ruang Sejahtera mengembangkan program bantuan sosial, usaha rakyat, hunian layak, air bersih, dan pendidikan. Setiap informasi pelaksanaan akan ditambahkan melalui sumber dan proses publikasi yang dapat dipertanggungjawabkan.</p>
            <p>Website dirancang sebagai pusat informasi yang menghubungkan program, kegiatan, cerita, dampak, dokumentasi, organisasi, dan transparansi publik dalam alur yang mudah ditelusuri.</p>
            <blockquote className="trust-about-quote">“Kami ingin setiap bantuan meninggalkan manfaat yang dapat dirasakan dan jejak yang dapat dipertanggungjawabkan.”<small>KUTIPAN CONTOH</small></blockquote>
            <div className="trust-actions">
              <Link href="/program" className="trust-button trust-button-ink">Kenali program <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/tentang-kami/legalitas" className="trust-button trust-button-outline">Ruang legalitas <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-section trust-about-principles">
        <div className="shell">
          <div className="trust-page-intro">
            <div><span>Standar informasi publik</span><h2>Empat batas yang menjaga kepercayaan.</h2></div>
            <p>Prinsip ini mengarahkan cara website menyajikan identitas, program, dokumentasi, data, dan hubungan dengan publik.</p>
          </div>
          <div className="trust-value-grid">
            {publicPrinciples.map(([Icon, title, description]) => (
              <article key={title}><Icon size={25} aria-hidden="true" /><h2>{title}</h2><p>{description}</p></article>
            ))}
          </div>
          <div className="trust-integrity-note">
            <FileCheck2 size={22} aria-hidden="true" />
            <p><strong>Profil akan terus dilengkapi.</strong> Visi, misi, nilai, sejarah, legalitas, dan organisasi memiliki ruang tersendiri agar setiap jenis informasi dapat diverifikasi secara tepat.</p>
          </div>
        </div>
      </section>
    </>
  );
}
