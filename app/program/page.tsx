import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { programs } from '@/lib/content';

export const metadata: Metadata = { title: 'Program', description: 'Fokus program sosial Yayasan Ruang Sejahtera.' };

export default function ProgramsPage() {
  return (
    <>
      <PageHero eyebrow="Program" title="Dari kebutuhan nyata, menjadi aksi yang terarah." description="Dalam draft visual ini, seluruh foto dan ilustrasi program adalah contoh sementara. Struktur akhirnya disiapkan agar setiap program terhubung dengan kegiatan, dampak, dokumentasi, dan laporan." />
      <div className="sample-note"><strong>DATA DRAFT</strong><span>Foto dan narasi program pada halaman ini masih contoh untuk evaluasi desain.</span></div>
      <section className="section-pad section-white">
        <div className="shell">
          <div className="program-grid-large">
            {programs.map((program) => (
              <Link href={`/program/${program.slug}`} key={program.slug} className="program-story-card">
                <div className="program-story-image"><Image src={program.image} alt={`Foto contoh program ${program.name}`} fill sizes="(max-width: 768px) 100vw, 33vw" /><div className="program-story-overlay"/><span>{program.accent}</span></div>
                <div className="program-story-copy"><small>{program.focus}</small><h2>{program.name}</h2><p>{program.summary}</p><strong>Jelajahi program <ArrowRight size={16}/></strong></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
