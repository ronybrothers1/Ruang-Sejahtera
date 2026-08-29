import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, SearchCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { ProgramMark } from '@/components/ProgramMark';
import { SectionNavigation } from '@/components/SectionNavigation';
import { programs } from '@/lib/content';
import { programNavItems } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'Program',
  description: 'Lima program utama Yayasan Ruang Sejahtera.',
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Program"
        title="Lima jalur bantuan untuk kebutuhan yang berbeda."
        description="Setiap program memiliki fokus yang jelas. Rincian pelaksanaan, jangkauan, dan hasil hanya ditambahkan dari data yang telah diperiksa."
      />
      <SectionNavigation label="Jelajahi Program" items={programNavItems} currentHref="/program" />
      <section className="trust-page-section">
        <div className="shell">
          <div className="trust-page-intro">
            <div><span>Ruang kerja</span><h2>Program yang mudah dipahami sejak awal.</h2></div>
            <p>Nama dan ringkasan berikut menjadi pintu masuk untuk mengenali tujuan setiap program tanpa menampilkan klaim angka atau hasil yang belum terverifikasi.</p>
          </div>
          <div className="trust-program-archive">
            {programs.map((program) => (
              <Link href={`/program/${program.slug}`} key={program.slug}>
                <div className="trust-card-image trust-program-archive-image">
                  <Image src={program.image} alt={`Foto contoh ${program.name}`} fill sizes="(max-width: 680px) 38vw, (max-width: 1024px) 50vw, 33vw" />
                  <ProgramMark slug={program.slug} accent={program.accent} compact />
                  <span className="preview-chip">CONTOH</span>
                </div>
                <div><span>{program.focus}</span><h2>{program.name}</h2><p>{program.summary}</p></div>
                <strong>Jelajahi program <ArrowRight size={16} aria-hidden="true" /></strong>
              </Link>
            ))}
          </div>
          <div className="trust-integrity-note">
            <SearchCheck size={22} aria-hidden="true" />
            <p><strong>Preview program lengkap</strong> Foto bertanda contoh mempertahankan struktur desain dan akan diganti dokumentasi resmi tanpa mengubah susunan halaman.</p>
          </div>
        </div>
      </section>
    </>
  );
}
