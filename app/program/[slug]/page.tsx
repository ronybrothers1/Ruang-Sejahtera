import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, SearchCheck, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { ProgramMark } from '@/components/ProgramMark';
import { programs } from '@/lib/content';

export function generateStaticParams() {
  return programs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  return program ? { title: program.name, description: program.summary } : {};
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  if (!program) notFound();

  return (
    <>
      <PageHero eyebrow={program.focus} title={program.name} description={program.summary} />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Program', href: '/program' }, { label: program.name }]} />
      <section className="trust-page-section">
        <div className="shell trust-program-detail">
          <div className="trust-program-detail-mark">
            <ProgramMark slug={program.slug} accent={program.accent} />
            <span>{program.focus}</span>
          </div>
          <div className="trust-program-detail-copy">
            <span>Ruang lingkup</span>
            <h2>Bantuan yang dijelaskan tanpa melebihkan bukti.</h2>
            <p>{program.summary}</p>
            <p>Informasi mengenai kriteria penerima, wilayah pelaksanaan, metode asesmen, sumber pendanaan, mitra, dan hasil program akan dilengkapi bertahap setelah dokumen pendukung tersedia.</p>
            <div className="trust-actions">
              <Link href="/kegiatan" className="trust-button trust-button-ink">Lihat kegiatan terbit <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/transparansi" className="trust-button trust-button-outline">Ruang transparansi <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
          <aside className="trust-status-panel">
            <h2>Status informasi</h2>
            <div><SearchCheck size={20} aria-hidden="true" /><p><strong>Deskripsi publik</strong><span>Ringkasan program tersedia.</span></p></div>
            <div><FileCheck2 size={20} aria-hidden="true" /><p><strong>Dokumen pelaksanaan</strong><span>Belum dipublikasikan.</span></p></div>
            <div><ShieldCheck size={20} aria-hidden="true" /><p><strong>Data dampak</strong><span>Menunggu data terverifikasi.</span></p></div>
          </aside>
        </div>
      </section>
    </>
  );
}
