import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { programs } from '@/lib/content';

export function generateStaticParams() { return programs.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const program = programs.find((item) => item.slug === slug); return program ? { title: program.name, description: program.summary } : {}; }
export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const program = programs.find((item) => item.slug === slug); if (!program) notFound(); return <><PageHero eyebrow={program.focus} title={program.name} description={program.summary} /><section className="py-18 md:py-24"><div className="shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><h2 className="font-heading text-2xl font-extrabold">Informasi program</h2><p className="mt-4 leading-8 text-neutral-600">Halaman program V2 tidak menampilkan target dana, jumlah penerima, jumlah kegiatan, atau wilayah jangkauan sebelum datanya tersedia dari sumber resmi.</p><Link href="/transparansi" className="button-secondary mt-6">Lihat Transparansi</Link></div><EmptyState title="Belum ada kegiatan terhubung" description="Kegiatan yang berstatus published dan terhubung dengan program ini akan tampil otomatis setelah CMS dan migrasi data resmi tersedia." /></div></section></>; }
