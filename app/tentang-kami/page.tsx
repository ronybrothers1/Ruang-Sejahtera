import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, HeartHandshake, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Profil dan ruang akuntabilitas Yayasan Ruang Sejahtera.',
};

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
      <section className="trust-page-section">
        <div className="shell trust-about-layout">
          <div className="trust-about-brand">
            <BrandLogo />
            <p>Identitas yayasan ditempatkan bersama komitmen untuk menyajikan informasi yang dapat dipahami dan diperiksa publik.</p>
          </div>
          <div className="trust-about-copy">
            <span>Profil publik</span>
            <h2>Kepedulian perlu dikelola dengan disiplin.</h2>
            <p>Ruang Sejahtera mengembangkan program bantuan sosial, usaha rakyat, hunian layak, air bersih, dan pendidikan. Setiap informasi pelaksanaan akan ditambahkan melalui sumber dan proses publikasi yang dapat dipertanggungjawabkan.</p>
            <p>Karena dokumen profil kelembagaan lengkap belum tersedia sebagai sumber publik, halaman ini tidak mengarang sejarah, nama pendiri, jangkauan, angka, atau kutipan tokoh.</p>
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
