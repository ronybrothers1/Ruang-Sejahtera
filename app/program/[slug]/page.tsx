import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { programs } from '@/lib/content';

export function generateStaticParams() { return programs.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const program = programs.find((item) => item.slug === slug); return program ? { title: program.name, description: program.summary } : {}; }

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const program = programs.find((item) => item.slug === slug); if (!program) notFound();
  return <><PageHero eyebrow={program.focus} title={program.name} description={program.summary} /><div className="sample-note"><strong>DETAIL PROGRAM · DRAFT</strong><span>Foto, target, jangkauan, dan statistik berikut adalah contoh presentasi.</span></div><Breadcrumbs items={[{ label:'Beranda',href:'/'},{label:'Program',href:'/program'},{label:program.name}]} /><section className="section-pad section-white"><div className="shell program-detail-v3"><div className="program-detail-photo"><Image src={program.image} alt={`Foto contoh program ${program.name}`} fill sizes="(max-width: 900px) 100vw, 55vw"/><span>FOTO CONTOH</span></div><div className="program-detail-copy"><span className="eyebrow-v3">Tentang program</span><h2 className="display-h2">Bantuan yang dirancang dari kebutuhan lapangan.</h2><p>{program.summary} Pada versi final, bagian ini akan menjelaskan kriteria penerima, wilayah kerja, metode asesmen, target, mitra, serta mekanisme pelaporan secara lebih rinci.</p><div className="program-mini-stats"><div><Users size={19}/><strong>320</strong><span>Penerima · contoh</span></div><div><MapPin size={19}/><strong>6</strong><span>Desa · contoh</span></div><div><CalendarDays size={19}/><strong>2026</strong><span>Periode · contoh</span></div></div><Link href="/transparansi" className="cta-red">Lihat Transparansi <ArrowRight size={16}/></Link></div></div></section></>;
}
