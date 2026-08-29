import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { programs } from '@/lib/content';

export const metadata: Metadata = { title: 'Program', description: 'Program resmi Yayasan Ruang Sejahtera.' };

export default function ProgramsPage() {
  return (
    <>
      <PageHero eyebrow="Program" title="Dari kebutuhan nyata, menjadi aksi yang terarah." description="Lima nama program mengikuti hasil keputusan rapat Yayasan Ruang Sejahtera tanggal 29 Agustus 2026. Foto program pada versi website ini masih contoh sementara sampai dokumentasi resmi dipublikasikan." />
      <div className="sample-note"><strong>PROGRAM RESMI</strong><span>Nama dan fokus program telah diperbarui; foto masih berupa contoh desain.</span></div>
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
