import type { Metadata } from 'next';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Kegiatan', description: 'Arsip kegiatan sosial Yayasan Ruang Sejahtera.' };
export default function ActivitiesPage() { return <><PageHero eyebrow="Kegiatan" title="Arsip kegiatan yang dapat ditelusuri." description="Setiap kegiatan akan memiliki tanggal, lokasi, program, latar belakang, bentuk bantuan, dokumentasi, dampak, dan informasi pendanaan jika relevan." /><section className="py-18 md:py-24"><div className="shell"><EmptyState title="Belum ada kegiatan yang dipublikasikan" description="CMS V2 akan memungkinkan penyaringan berdasarkan program, lokasi, dan tahun. Sampai data resmi dimigrasikan, sistem sengaja tidak membuat kartu kegiatan contoh." /></div></section></>; }
