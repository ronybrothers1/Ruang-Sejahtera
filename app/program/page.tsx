import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, SearchCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { ProgramMark } from '@/components/ProgramMark';
import { programs } from '@/lib/content';

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
      <section className="trust-page-section">
        <div className="shell">
          <div className="trust-page-intro">
            <div><span>Ruang kerja</span><h2>Program yang mudah dipahami sejak awal.</h2></div>
            <p>Nama dan ringkasan berikut menjadi pintu masuk untuk mengenali tujuan setiap program tanpa menampilkan klaim angka atau hasil yang belum terverifikasi.</p>
          </div>
          <div className="trust-program-archive">
            {programs.map((program) => (
              <Link href={`/program/${program.slug}`} key={program.slug}>
                <ProgramMark slug={program.slug} accent={program.accent} />
                <div><span>{program.focus}</span><h2>{program.name}</h2><p>{program.summary}</p></div>
                <strong>Jelajahi program <ArrowRight size={16} aria-hidden="true" /></strong>
              </Link>
            ))}
          </div>
          <div className="trust-integrity-note">
            <SearchCheck size={22} aria-hidden="true" />
            <p><strong>Prinsip publikasi program</strong> Target, wilayah, penerima manfaat, mitra, dokumentasi, serta capaian hanya ditampilkan setelah sumber dan konteksnya tersedia.</p>
          </div>
        </div>
      </section>
    </>
  );
}
