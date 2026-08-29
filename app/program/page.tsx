import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { programs } from '@/lib/content';

export const metadata: Metadata = { title: 'Program', description: 'Fokus program sosial Yayasan Ruang Sejahtera.' };
export default function ProgramsPage() { return <><PageHero eyebrow="Program" title="Program dibangun dari kebutuhan, bukan sekadar daftar kegiatan." description="Setiap program dirancang memiliki halaman yang menghubungkan tujuan, kegiatan, dokumentasi, dampak, dan laporan. Jumlah kegiatan dan penerima manfaat hanya ditampilkan ketika datanya tersedia." /><section className="py-18 md:py-24"><div className="shell grid gap-5 md:grid-cols-2">{programs.map((program) => <Link href={`/program/${program.slug}`} key={program.slug} className="group border border-neutral-200 p-7 hover:border-red-200 hover:shadow-lg"><p className="eyebrow">{program.focus}</p><h2 className="font-heading text-2xl font-extrabold tracking-tight group-hover:text-brand-red">{program.name}</h2><p className="mt-4 leading-7 text-neutral-600">{program.summary}</p><span className="mt-6 inline-flex items-center gap-2 font-bold">Lihat detail <ArrowRight size={17} /></span></Link>)}</div></section></>; }
