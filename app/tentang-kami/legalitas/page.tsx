import type { Metadata } from 'next';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Legalitas', description: 'Dokumen legalitas resmi Yayasan Ruang Sejahtera.' };
export default function LegalityPage() { return <><PageHero eyebrow="Tentang Kami" title="Legalitas" description="Nomor akta, keputusan, registrasi, atau dokumen legal lain hanya ditampilkan dari dokumen resmi yang telah disetujui untuk akses publik." /><section className="py-18 md:py-24"><div className="shell"><EmptyState title="Data legalitas belum dipublikasikan" description="V2 tidak membuat nomor legalitas contoh. Dokumen resmi dapat ditampilkan dengan jenis dokumen, nomor, tanggal, penerbit, dan berkas publik bila memang diperbolehkan." /></div></section></>; }
